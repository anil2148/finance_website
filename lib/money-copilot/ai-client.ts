import type { CopilotRequest, FinancialInputs } from './types';
import { buildSystemPrompt } from './prompts';
import { getGroqClient } from '@/lib/groq/client';
import { createHash } from 'crypto';

/** Standard work hours per year used for hourly-to-annual conversion. */
const WORK_HOURS_PER_YEAR = 2080;

/** Maximum tokens to request from the AI provider per response. */
const AI_MAX_TOKENS = 1024;

/** Groq model to use for full copilot mode. */
const GROQ_MODEL = 'llama3-8b-8192';

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

function formatInputsForPrompt(inputs: FinancialInputs): string {
  const lines: string[] = [];

  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * WORK_HOURS_PER_YEAR : null);
  if (salary) lines.push(`Annual salary: $${salary.toLocaleString()}`);
  if (inputs.hourlyRate) lines.push(`Hourly rate: $${inputs.hourlyRate}/hr`);
  if (inputs.bonus) lines.push(`Annual bonus: $${inputs.bonus.toLocaleString()}`);
  if (inputs.employmentType) lines.push(`Employment type: ${inputs.employmentType}`);
  if (inputs.state) lines.push(`State: ${inputs.state}`);
  if (inputs.city) lines.push(`City: ${inputs.city}`);

  const housing = inputs.monthlyRent ?? inputs.mortgage;
  if (housing) lines.push(`Monthly housing cost: $${housing.toLocaleString()}`);
  if (inputs.debtPayments) lines.push(`Monthly debt payments: $${inputs.debtPayments.toLocaleString()}`);
  if (inputs.childcare) lines.push(`Monthly childcare: $${inputs.childcare.toLocaleString()}`);
  if (inputs.insurance) lines.push(`Monthly insurance: $${inputs.insurance.toLocaleString()}`);
  if (inputs.transportation) lines.push(`Monthly transportation: $${inputs.transportation.toLocaleString()}`);
  if (inputs.groceries) lines.push(`Monthly groceries: $${inputs.groceries.toLocaleString()}`);
  if (inputs.utilities) lines.push(`Monthly utilities: $${inputs.utilities.toLocaleString()}`);
  if (inputs.cashOnHand) lines.push(`Cash on hand / savings: $${inputs.cashOnHand.toLocaleString()}`);
  if (inputs.savingsRate) lines.push(`Savings rate goal: ${inputs.savingsRate}%`);
  if (inputs.employerMatch) lines.push(`Employer 401(k) match: ${inputs.employerMatch}%`);
  if (inputs.timeHorizon) lines.push(`Investment time horizon: ${inputs.timeHorizon} years`);
  if (inputs.riskTolerance) lines.push(`Risk tolerance: ${inputs.riskTolerance}`);
  if (inputs.targetEmergencyMonths) lines.push(`Target emergency fund: ${inputs.targetEmergencyMonths} months`);

  return lines.length > 0 ? lines.join('\n') : 'No specific financial inputs provided.';
}

function buildUserMessage(request: CopilotRequest, existingMetrics: Array<{ label: string; value: string; note?: string }>): string {
  const inputsSummary = formatInputsForPrompt(request.inputs);
  const metricsSummary = existingMetrics.length > 0
    ? existingMetrics.map(m => `  ${m.label}: ${m.value}${m.note ? ` (${m.note})` : ''}`).join('\n')
    : '  No computed metrics available.';

  return `Decision mode: ${request.mode}
User question: ${request.question}

Financial inputs provided:
${inputsSummary}

Pre-computed key metrics (use these exact numbers in your analysis):
${metricsSummary}

Respond ONLY with valid JSON (no markdown fences) matching this structure:
{
  "summary": "<2-3 sentence plain-language summary of the financial situation>",
  "recommendation": "<clear recommendation with reasoning>",
  "sensitivities": ["<what-if factor 1>", "<what-if factor 2>", "<what-if factor 3>"],
  "risks": ["<risk or blind spot 1>", "<risk or blind spot 2>", "<risk or blind spot 3>"],
  "nextSteps": ["<concrete action 1>", "<concrete action 2>", "<concrete action 3>"]
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
async function callGroq(
  userMessage: string,
  systemPrompt: string
): Promise<string | null> {
  if (!process.env.GROQ_API_KEY) return null;

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const client = getGroqClient();
      const completion = await client.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2,
        max_tokens: AI_MAX_TOKENS
      });
      const content = completion.choices[0]?.message?.content ?? null;
      if (content !== null) {
        console.log('[ai-client] completed_decision via Groq');
        return content;
      }
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        // Brief back-off before retry
        await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
      }
    }
  }
  console.error('[ai-client] Groq request failed after retries:', lastError);
  return null;
}

export async function getAiNarrative(
  request: CopilotRequest,
  existingMetrics: Array<{ label: string; value: string; note?: string }>
): Promise<AiNarrative | null> {
  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(request, existingMetrics);

  // Check in-memory cache first
  const cacheKey = buildCacheKey(request.mode, userMessage);
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.narrative;
  }

  console.log('[ai-client] started_decision');

  try {
    let rawResponse: string | null = null;

    // Groq is the primary AI provider
    if (process.env.GROQ_API_KEY) {
      rawResponse = await callGroq(userMessage, systemPrompt);
    }

    // Fall back to OpenAI if Groq is unavailable or not configured
    if (rawResponse === null && process.env.OPENAI_API_KEY) {
      rawResponse = await callOpenAi(userMessage, systemPrompt);
    }

    // Fall back to Ollama as last resort
    if (rawResponse === null && process.env.HIDDEN_AI_OLLAMA_HOST) {
      rawResponse = await callOllama(userMessage, systemPrompt);
    }

    if (rawResponse === null) return null;

    const narrative = parseAiResponse(rawResponse);
    if (narrative) {
      setCacheEntry(cacheKey, narrative);
    }
    return narrative;
  } catch (err) {
    console.error('[ai-client] Unexpected error calling AI provider:', err);
    return null;
  }
}
