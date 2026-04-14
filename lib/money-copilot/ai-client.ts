import type { CopilotRequest, FinancialInputs } from './types';
import { buildSystemPrompt } from './prompts';
import { getGroqClient } from '@/lib/groq/client';
import { createHash } from 'crypto';
import type Groq from 'groq-sdk';

/** Standard work hours per year used for hourly-to-annual conversion. */
const WORK_HOURS_PER_YEAR = 2080;

/** Maximum tokens to request from the AI provider per response. */
const AI_MAX_TOKENS = 1024;

/**
 * Select the most cost-effective Groq model for the given context.
 *
 * Rules:
 * - `bubble` mode → always the fast/cheap model
 * - Short queries (< 150 chars) → fast/cheap model
 * - Everything else (page/scenario/complex) → high-quality model
 */
export const getModel = (mode: string, inputLength: number): string => {
  if (mode === "bubble") return "llama-3.1-8b-instant";
  if (inputLength < 150) return "llama-3.1-8b-instant";
  return "llama-3.3-70b-versatile";
};

/** Fallback Groq model if the primary model fails. */
const GROQ_FALLBACK_MODEL = 'llama-3.1-8b-instant';

/** Maximum number of retries for Groq API calls. */
const MAX_RETRIES = 2;

/** In-memory response cache bounded to this many entries. */
const CACHE_MAX_ENTRIES = 200;

/** Cache TTL in milliseconds (5 minutes). */
const CACHE_TTL_MS = 5 * 60 * 1_000;

/** In-memory response cache (keyed by SHA-256 hash of mode + user message). */
const responseCache = new Map<string, { narrative: AiNarrative; expiresAt: number }>();

/**
 * Build a safe cache key using a SHA-256 hash to prevent cache-key injection
 * from user-controlled content embedded in the message string.
 */
function buildCacheKey(mode: string, userMessage: string): string {
  return createHash('sha256').update(`${mode}\x00${userMessage}`).digest('hex');
}

/**
 * Insert an entry into the cache using FIFO eviction when the cache is at capacity.
 * Expired entries are pruned first; if the cache is still full, the oldest inserted
 * entry is removed (Map preserves insertion order in JavaScript).
 */
function setCacheEntry(key: string, narrative: AiNarrative): void {
  const now = Date.now();
  // Evict all expired entries before checking size
  for (const [k, v] of responseCache) {
    if (v.expiresAt <= now) responseCache.delete(k);
  }
  // If still at max, evict the oldest entry
  if (responseCache.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey !== undefined) responseCache.delete(oldestKey);
  }
  responseCache.set(key, { narrative, expiresAt: now + CACHE_TTL_MS });
}

export interface AiNarrative {
  summary: string;
  recommendation: string;
  sensitivities: string[];
  risks: string[];
  nextSteps: string[];
}

function formatInputsForPrompt(inputs: FinancialInputs, region?: 'US' | 'India'): string {
  const lines: string[] = [];
  const currency = region === 'India' ? '₹' : '$';
  const fmt = (v: number) => `${currency}${v.toLocaleString(region === 'India' ? 'en-IN' : 'en-US')}`;

  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * WORK_HOURS_PER_YEAR : null);
  if (salary) lines.push(`Annual ${region === 'India' ? 'CTC' : 'salary'}: ${fmt(salary)}`);
  if (inputs.hourlyRate) lines.push(`Hourly rate: ${fmt(inputs.hourlyRate)}/hr`);
  if (inputs.bonus) lines.push(`${region === 'India' ? 'Annual bonus/variable' : 'Annual bonus'}: ${fmt(inputs.bonus)}`);
  if (inputs.employmentType) lines.push(`Employment type: ${inputs.employmentType}`);
  if (inputs.state) lines.push(`${region === 'India' ? 'State/City' : 'State'}: ${inputs.state}`);
  if (inputs.city) lines.push(`City: ${inputs.city}`);

  const housing = inputs.monthlyRent ?? inputs.mortgage;
  if (housing) lines.push(`Monthly ${region === 'India' ? 'rent/EMI' : 'housing cost'}: ${fmt(housing)}`);
  if (inputs.debtPayments) lines.push(`Monthly ${region === 'India' ? 'loan EMI payments' : 'debt payments'}: ${fmt(inputs.debtPayments)}`);
  if (inputs.childcare) lines.push(`Monthly childcare: ${fmt(inputs.childcare)}`);
  if (inputs.insurance) lines.push(`Monthly insurance: ${fmt(inputs.insurance)}`);
  if (inputs.transportation) lines.push(`Monthly transportation: ${fmt(inputs.transportation)}`);
  if (inputs.groceries) lines.push(`Monthly groceries: ${fmt(inputs.groceries)}`);
  if (inputs.utilities) lines.push(`Monthly utilities: ${fmt(inputs.utilities)}`);
  if (inputs.cashOnHand) lines.push(`Cash on hand / savings: ${fmt(inputs.cashOnHand)}`);
  if (inputs.savingsRate) lines.push(`Savings rate goal: ${inputs.savingsRate}%`);
  if (inputs.employerMatch) lines.push(`${region === 'India' ? 'Employer PF/NPS match' : 'Employer 401(k) match'}: ${inputs.employerMatch}%`);
  if (inputs.timeHorizon) lines.push(`Investment time horizon: ${inputs.timeHorizon} years`);
  if (inputs.riskTolerance) lines.push(`Risk tolerance: ${inputs.riskTolerance}`);
  if (inputs.targetEmergencyMonths) lines.push(`Target emergency fund: ${inputs.targetEmergencyMonths} months`);

  return lines.length > 0 ? lines.join('\n') : 'No specific financial inputs provided.';
}

function buildUserMessage(request: CopilotRequest, existingMetrics: Array<{ label: string; value: string; note?: string }>): string {
  const inputsSummary = formatInputsForPrompt(request.inputs, request.region);
  const metricsSummary = existingMetrics.length > 0
    ? existingMetrics.map(m => `  ${m.label}: ${m.value}${m.note ? ` (${m.note})` : ''}`).join('\n')
    : '  No computed metrics available.';

  const contextSection = request.context
    ? `\nUser financial context (freeform — extract figures automatically):\n${request.context}\n`
    : '';
  const pageContextSection = request.pageContext
    ? `\nTyped page context (source of truth; do not ask for values already present):\n${JSON.stringify(request.pageContext, null, 2)}\n`
    : '';

  const regionContext = request.region === 'India'
    ? `Region: India. Use ₹ (INR) currency. Use Indian financial terminology (CTC, in-hand salary, EMI, CIBIL, 80C, EPF, PPF, ELSS, home loan, lakh, crore). Apply Indian tax rules and interest rates.\n`
    : `Region: US. Use $ (USD) currency. Use US financial terminology (salary, take-home pay, APR, credit score, mortgage, 401k, Roth IRA).\n`;

  const calculatorSnapshot = (() => {
    const calculatorState = request.pageContext?.calculatorState;
    if (!calculatorState || typeof calculatorState !== 'object') return '';
    const outputs = (calculatorState as { outputs?: { headlineMetric?: unknown; headlineValue?: unknown; summary?: unknown } }).outputs;
    if (!outputs || typeof outputs !== 'object') return '';
    const headlineMetric = typeof outputs.headlineMetric === 'string' ? outputs.headlineMetric : 'headline result';
    const headlineValue = typeof outputs.headlineValue === 'string' ? outputs.headlineValue : undefined;
    const summaryRows = Array.isArray(outputs.summary)
      ? outputs.summary
          .slice(0, 3)
          .map((row) => {
            if (!row || typeof row !== 'object') return null;
            const label = typeof (row as { label?: unknown }).label === 'string' ? (row as { label: string }).label : null;
            const value = typeof (row as { value?: unknown }).value === 'number' ? (row as { value: number }).value : null;
            return label && value !== null ? `${label}: ${value}` : null;
          })
          .filter((item): item is string => Boolean(item))
      : [];

    const headlineLine = headlineValue ? `${headlineMetric}: ${headlineValue}` : headlineMetric;
    const summaryLine = summaryRows.length > 0 ? `\nCalculator summary rows:\n- ${summaryRows.join('\n- ')}` : '';
    return `\nCalculator snapshot (authoritative and already visible to user):\n${headlineLine}${summaryLine}\n`;
  })();

  return `Decision mode: ${request.mode}
${regionContext}User question: ${request.question}
${contextSection}
${pageContextSection}
${calculatorSnapshot}
Financial inputs provided:
${inputsSummary}

Pre-computed key metrics (use these exact numbers in your analysis):
${metricsSummary}

Critical grounding rules:
- Use pageContext.structuredValues and pageContext.calculatorState when available.
- Do NOT ask the user to repeat numbers already in page context, calculator inputs, or calculator outputs.
- If calculator snapshot is present, start by explaining what the visible result means and give a next action.
- If values are visible in page context, use them directly and move to recommendation/tradeoffs.
- On low-context pages, acknowledge limited context and avoid pretending page-specific calculations exist.

Respond ONLY with valid JSON (no markdown fences) matching this structure:
{
  "summary": "<1-2 sentence plain-language bottom-line answer with a clear recommendation>",
  "recommendation": "<single clear recommendation with concise reasoning>",
  "sensitivities": ["<what-if factor 1>", "<what-if factor 2>"],
  "risks": ["<financial risk 1>", "<financial risk 2>", "<financial risk 3>"],
  "nextSteps": ["<single most important concrete action — provide only one item>"]
}`;
}

function parseAiResponse(raw: string): AiNarrative | null {
  try {
    const cleaned = raw
      .replace(/^```(?:json)?/m, '')
      .replace(/```$/m, '')
      .trim();
    const parsed = JSON.parse(cleaned) as Partial<AiNarrative>;
    if (
      typeof parsed.summary === 'string' &&
      typeof parsed.recommendation === 'string' &&
      Array.isArray(parsed.sensitivities) &&
      Array.isArray(parsed.risks) &&
      Array.isArray(parsed.nextSteps)
    ) {
      return {
        summary: parsed.summary,
        recommendation: parsed.recommendation,
        sensitivities: parsed.sensitivities as string[],
        risks: parsed.risks as string[],
        nextSteps: parsed.nextSteps as string[]
      };
    }
  } catch {
    // Parsing failed — caller will fall back to rule-based
  }
  return null;
}

async function callOpenAi(
  userMessage: string,
  systemPrompt: string
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.HIDDEN_AI_OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.HIDDEN_AI_OPENAI_MODEL ?? 'gpt-3.5-turbo';

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: AI_MAX_TOKENS
    })
  });

  if (!res.ok) {
    console.error(`[ai-client] OpenAI request failed: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? null;
}

async function callOllama(
  userMessage: string,
  systemPrompt: string
): Promise<string | null> {
  const host = process.env.HIDDEN_AI_OLLAMA_HOST;
  if (!host) return null;

  const model = process.env.HIDDEN_AI_OLLAMA_MODEL ?? 'llama3:8b';
  const baseUrl = host.replace(/\/$/, '');

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      stream: false,
      options: { temperature: 0.3 }
    })
  });

  if (!res.ok) {
    console.error(`[ai-client] Ollama request failed: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json() as {
    message?: { content?: string };
  };
  return data.message?.content ?? null;
}

/**
 * Call Groq chat completion API with automatic retries.
 * Uses the singleton client from lib/groq/client.ts.
 */
async function callGroqWithModel(
  userMessage: string,
  systemPrompt: string,
  model: string
): Promise<string | null> {
  const client = getGroqClient();
  console.log('[AI] Using model:', model);
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log('[API] Sending request to Groq...');
      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2,
        max_tokens: AI_MAX_TOKENS
      });
      console.log('[API] Raw Groq response:', completion);
      const content = completion.choices[0]?.message?.content ?? null;
      if (content !== null) {
        console.log('[ai-client] completed_decision via Groq');
        return content;
      }
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
      }
    }
  }
  console.error(`[ai-client] Groq request failed after retries with model ${model}:`, lastError);
  return null;
}

async function callGroq(
  userMessage: string,
  systemPrompt: string,
  model: string
): Promise<string | null> {
  if (!process.env.GROQ_API_KEY) {
    console.error('[ai-client] GROQ_API_KEY is not set — skipping Groq provider');
    return null;
  }

  // Try requested model first
  const primary = await callGroqWithModel(userMessage, systemPrompt, model);
  if (primary !== null) return primary;

  // Only retry with fallback if the chosen model is not already the fallback
  if (model !== GROQ_FALLBACK_MODEL) {
    console.warn(`[ai-client] Primary model (${model}) failed — retrying with fallback model (${GROQ_FALLBACK_MODEL})`);
    return callGroqWithModel(userMessage, systemPrompt, GROQ_FALLBACK_MODEL);
  }
  return null;
}

/**
 * Stream the Groq chat response as an async iterable of text chunks.
 * Yields each content delta as it arrives from the API.
 * Falls back to the GROQ_FALLBACK_MODEL if the primary model throws.
 */
export async function* streamGroqNarrative(
  userMessage: string,
  systemPrompt: string,
  model: string
): AsyncGenerator<string> {
  if (!process.env.GROQ_API_KEY) return;

  const client = getGroqClient();
  const modelsToTry = model !== GROQ_FALLBACK_MODEL
    ? [model, GROQ_FALLBACK_MODEL]
    : [model];

  for (const m of modelsToTry) {
    console.log('[AI] Selected model:', m);
    try {
      const result = await client.chat.completions.create({
        model: m,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2,
        max_tokens: AI_MAX_TOKENS,
        stream: true
      });

      // The Groq SDK overloads the return type based on the `stream` flag;
      // cast defensively and guard before iterating.
      const stream = result as unknown as AsyncIterable<Groq.Chat.ChatCompletionChunk>;
      if (!stream || typeof (stream as unknown as { [Symbol.asyncIterator]?: unknown })[Symbol.asyncIterator] !== 'function') {
        console.error(`[ai-client] Groq streaming response is not iterable for model ${m}`);
        continue;
      }

      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content ?? '';
        if (content) yield content;
      }
      return; // success — stop trying fallback
    } catch (err) {
      console.error(`[ai-client] Groq streaming failed with model ${m}:`, err);
    }
  }
}

export async function getAiNarrative(
  request: CopilotRequest,
  existingMetrics: Array<{ label: string; value: string; note?: string }>,
  model?: string
): Promise<AiNarrative | null> {
  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(request, existingMetrics);

  const selectedModel = model ?? getModel(request.mode, request.question.length);

  // Check in-memory cache first
  const cacheKey = buildCacheKey(request.mode, userMessage);
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    console.log('[CACHE] HIT');
    return cached.narrative;
  }

  console.log('[CACHE] MISS');
  console.log('[ai-client] started_decision');

  try {
    let rawResponse: string | null = null;

    // Groq is the primary AI provider
    if (process.env.GROQ_API_KEY) {
      rawResponse = await callGroq(userMessage, systemPrompt, selectedModel);
    }

    // Fall back to OpenAI if Groq is unavailable or not configured
    if (rawResponse === null && process.env.OPENAI_API_KEY) {
      rawResponse = await callOpenAi(userMessage, systemPrompt);
    }

    // Fall back to Ollama as last resort
    if (rawResponse === null && process.env.HIDDEN_AI_OLLAMA_HOST) {
      rawResponse = await callOllama(userMessage, systemPrompt);
    }

    if (rawResponse === null) {
      console.error('[ai-client] All AI providers returned null — using rule-based fallback');
      return null;
    }

    const narrative = parseAiResponse(rawResponse);
    if (narrative) {
      console.log('[API] Parsed AI output:', { summary: narrative.summary });
      setCacheEntry(cacheKey, narrative);
    } else {
      console.error('[API] JSON parse failed:', rawResponse);
    }
    return narrative;
  } catch (err) {
    console.error('[ai-client] Unexpected error calling AI provider:', err);
    return null;
  }
}

/**
 * Build the user message for external callers (e.g. the streaming API route)
 * that need access to the assembled prompt before streaming begins.
 */
export function buildAiUserMessage(
  request: CopilotRequest,
  existingMetrics: Array<{ label: string; value: string; note?: string }>
): string {
  return buildUserMessage(request, existingMetrics);
}

/** Expose the system prompt to callers that manage their own Groq streaming. */
export { buildSystemPrompt as buildAiSystemPrompt };
