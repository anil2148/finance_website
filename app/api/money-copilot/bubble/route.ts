import { NextRequest, NextResponse } from 'next/server';
import { FINANCE_SPHERE_COPILOT_PROMPT } from '@/lib/money-copilot/prompts';
import { getGroqClient } from '@/lib/groq/client';
import { sanitizeText } from '@/lib/api/sanitize';
import { hashKey, getCache, setCache } from '@/lib/cache/redis';
import type { BubbleRequest, BubbleResponse, PageContext } from '@/lib/money-copilot/types';

export const runtime = "nodejs";

/**
 * In-flight request deduplication map for the bubble endpoint.
 *
 * Prevents the same question from triggering multiple parallel AI calls.
 * Keys are SHA-256 hashes of (question + pageContext.path).
 */
const inFlightRequests = new Map<string, Promise<BubbleResponse | null>>();

const AI_MAX_TOKENS = 512;

/** Fast model always used for bubble mode (cost-efficient). */
const MODEL = 'llama-3.1-8b-instant';

/** Fallback Groq model if the primary model fails. */
const GROQ_FALLBACK_MODEL = 'llama-3.1-8b-instant';

/** Maximum retries for Groq API calls in bubble mode. */
const MAX_RETRIES = 2;

/** Map URL path prefixes to context-aware suggestions. */
function getSuggestionsForPage(ctx: PageContext): string[] {
  const p = ctx.path.toLowerCase();

  if (p.includes('mortgage') || p.includes('home') || p.includes('real-estate') || p.includes('housing')) {
    return ['Should I buy or rent?', 'Can I afford this home?', 'How much house can I afford?'];
  }
  if (p.includes('debt') || p.includes('loan') || p.includes('credit')) {
    return ['Should I pay off debt or invest?', 'Which debt should I tackle first?', 'Is this loan risky?'];
  }
  if (p.includes('savings') || p.includes('saving') || p.includes('hysa')) {
    return ['Am I saving enough?', 'HYSA vs investing — which is better?', 'How long to reach my savings goal?'];
  }
  if (p.includes('retirement') || p.includes('401k') || p.includes('roth') || p.includes('ira')) {
    return ['Roth vs Traditional 401(k) — which wins?', 'Am I on track to retire?', 'Should I max my 401(k) or IRA first?'];
  }
  if (p.includes('budget') || p.includes('cash-flow') || p.includes('expense')) {
    return ['What improves cash flow fastest?', 'Where should I cut spending?', 'Can I afford this expense?'];
  }
  if (p.includes('invest') || p.includes('stock') || p.includes('market')) {
    return ['Is now a good time to invest?', 'How do I build a starter portfolio?', 'Lump sum vs dollar-cost averaging?'];
  }
  if (p.includes('tax')) {
    return ['How do I reduce my tax bill?', 'Should I contribute pre-tax or post-tax?', 'What deductions apply to me?'];
  }
  if (p.includes('ai-money-copilot')) {
    return ['How do I use this tool?', 'What financial questions can you help with?', 'Compare two job offers for me'];
  }

  return [
    'Should I buy or rent?',
    'Am I saving enough?',
    'What improves cash flow fastest?',
    'Is this loan risky?',
    'Roth vs Traditional 401(k)?'
  ];
}

function buildBubbleSystemPrompt(): string {
  return `${FINANCE_SPHERE_COPILOT_PROMPT}

You are currently operating in QUICK BUBBLE MODE. Keep responses extremely concise and return ONLY valid JSON matching the BubbleResponse format. No markdown fences. No extra text.`;
}

function buildBubbleUserMessage(req: BubbleRequest, fallbackSuggestions: string[]): string {
  const ctx = req.pageContext;
  return `Page context:
- URL path: ${ctx.path}
- Page title: ${ctx.title ?? 'Unknown'}
- Keywords: ${ctx.keywords && ctx.keywords.length > 0 ? ctx.keywords.join(', ') : 'none'}

User question: ${req.question}

Respond ONLY with valid JSON (no markdown fences) matching this structure:
{
  "summary": "<1-2 sentence bottom line>",
  "quickTake": "<simple plain-language reasoning, 1-2 sentences>",
  "keyPoints": ["<key number or assumption>"],
  "riskFlags": ["<risk or unknown>"],
  "nextStep": "<one clear immediate action>",
  "confidence": "LOW",
  "disclaimer": "Educational decision support only, not financial advice."
}

If the question is vague or inputs are missing, set confidence to "LOW". Default suggestions: ${JSON.stringify(fallbackSuggestions)}`;
}

function parseBubbleResponse(raw: string): BubbleResponse | null {
  try {
    const cleaned = raw
      .replace(/^```(?:json)?/m, '')
      .replace(/```$/m, '')
      .trim();
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    if (
      typeof parsed.summary === 'string' &&
      typeof parsed.quickTake === 'string' &&
      typeof parsed.nextStep === 'string' &&
      typeof parsed.confidence === 'string' &&
      typeof parsed.disclaimer === 'string'
    ) {
      const confidenceRaw = (parsed.confidence as string).toUpperCase();
      const confidence: 'LOW' | 'MEDIUM' | 'HIGH' =
        confidenceRaw === 'HIGH' || confidenceRaw === 'MEDIUM' ? confidenceRaw : 'LOW';
      return {
        summary: parsed.summary,
        quickTake: parsed.quickTake,
        keyPoints: Array.isArray(parsed.keyPoints) ? (parsed.keyPoints as string[]) : [],
        riskFlags: Array.isArray(parsed.riskFlags) ? (parsed.riskFlags as string[]) : [],
        nextStep: parsed.nextStep,
        confidence,
        disclaimer: parsed.disclaimer
      };
    }
  } catch {
    // Parsing failed — will fall back to rule-based bubble response
  }
  return null;
}

async function callGroqModel(userMessage: string, systemPrompt: string, model: string): Promise<string | null> {
  const client = getGroqClient();
  console.log('[AI] Selected model:', model);
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2,
        max_tokens: AI_MAX_TOKENS
      });
      const content = completion.choices[0]?.message?.content ?? null;
      if (content) return content;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
      }
    }
  }
  console.error(`[money-copilot/bubble] Groq request failed after retries with model ${model}:`, lastError);
  return null;
}

async function callAiForBubble(userMessage: string, systemPrompt: string): Promise<string | null> {
  // Groq is the primary provider
  if (process.env.GROQ_API_KEY) {
    const primary = await callGroqModel(userMessage, systemPrompt, MODEL);
    if (primary !== null) return primary;

    console.warn(`[money-copilot/bubble] Primary model (${MODEL}) failed — retrying with fallback model (${GROQ_FALLBACK_MODEL})`);
    const fallback = await callGroqModel(userMessage, systemPrompt, GROQ_FALLBACK_MODEL);
    if (fallback !== null) return fallback;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const ollamaHost = process.env.HIDDEN_AI_OLLAMA_HOST;

  if (apiKey) {
    const baseUrl = (process.env.HIDDEN_AI_OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = process.env.HIDDEN_AI_OPENAI_MODEL ?? 'gpt-3.5-turbo';

    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
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
      if (res.ok) {
        const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
        const content = data.choices?.[0]?.message?.content ?? null;
        if (content) return content;
      }
    } catch {
      // Fall through to Ollama
    }
  }

  if (ollamaHost) {
    const model = process.env.HIDDEN_AI_OLLAMA_MODEL ?? 'llama3:8b';
    const baseUrl = ollamaHost.replace(/\/$/, '');

    try {
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
      if (res.ok) {
        const data = await res.json() as { message?: { content?: string } };
        return data.message?.content ?? null;
      }
    } catch {
      // Both providers failed
    }
  }

  return null;
}

function buildFallbackBubbleResponse(req: BubbleRequest): BubbleResponse {
  return {
    summary: 'I can help you think through this financial decision.',
    quickTake: `For "${req.question}" — provide more details for a tailored analysis.`,
    keyPoints: ['No specific inputs provided — estimates are based on general assumptions'],
    riskFlags: ['Missing data reduces confidence significantly'],
    nextStep: 'Visit the full AI Money Copilot at /ai-money-copilot for a deep-dive analysis.',
    confidence: 'LOW',
    disclaimer: 'Educational decision support only, not financial advice.'
  };
}

export async function POST(req: NextRequest) {
  try {
    const raw: unknown = await req.json();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    const body = raw as Partial<BubbleRequest>;

    console.log("[ENV CHECK] GROQ_API_KEY:", process.env.GROQ_API_KEY ? "FOUND" : "MISSING");
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY in environment");
    }

    const rawQuestion = sanitizeText(body.question);
    if (!rawQuestion) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const pageContext: PageContext = {
      path: typeof body.pageContext?.path === 'string' ? body.pageContext.path : '/',
      title: typeof body.pageContext?.title === 'string' ? body.pageContext.title : undefined,
      keywords: Array.isArray(body.pageContext?.keywords) ? body.pageContext.keywords : []
    };

    const bubbleReq: BubbleRequest = {
      question: rawQuestion,
      pageContext
    };

    // Build a stable cache key from question + page path
    const cacheKey = hashKey(`bubble\x00${rawQuestion}\x00${pageContext.path}`);

    // Check Redis/memory cache first
    const cached = await getCache(cacheKey) as BubbleResponse | null;
    if (cached) {
      console.log('[CACHE] HIT (bubble)');
      return NextResponse.json(cached);
    }
    console.log('[CACHE] MISS (bubble)');

    // ------------------------------------------------------------------
    // Request deduplication: if an identical bubble request is already
    // in-flight, await its result instead of spawning a duplicate call.
    // ------------------------------------------------------------------
    if (inFlightRequests.has(cacheKey)) {
      console.log('[DEDUP] Awaiting in-flight bubble request for key:', cacheKey);
      // Non-null assertion is safe: has() guarantees the key exists
      const deduped = await inFlightRequests.get(cacheKey)!;
      return NextResponse.json(deduped ?? buildFallbackBubbleResponse(bubbleReq));
    }

    const fallbackSuggestions = getSuggestionsForPage(pageContext);
    const systemPrompt = buildBubbleSystemPrompt();
    const userMessage = buildBubbleUserMessage(bubbleReq, fallbackSuggestions);

    // Register in-flight promise before awaiting so concurrent requests can share it.
    // Initialized with a no-op to satisfy definite-assignment; the Promise executor
    // always runs synchronously and overwrites this before first use.
    let resolveInFlight: (value: BubbleResponse | null) => void = () => {};
    const inFlightPromise = new Promise<BubbleResponse | null>(resolve => {
      resolveInFlight = resolve;
    });
    inFlightRequests.set(cacheKey, inFlightPromise);

    try {
      const rawResponse = await callAiForBubble(userMessage, systemPrompt);
      const parsed = rawResponse ? parseBubbleResponse(rawResponse) : null;
      const response = parsed ?? buildFallbackBubbleResponse(bubbleReq);

      // Cache successful (non-fallback) responses
      if (parsed) {
        await setCache(cacheKey, response);
      }

      // Resolve with the final response (not just `parsed`) so deduplicated
      // requests receive the same result as the original request.
      resolveInFlight(response);
      return NextResponse.json(response);
    } catch (err) {
      resolveInFlight(null);
      throw err;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  } catch (err) {
    console.error('[money-copilot/bubble] Error:', err);
    const details = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to process request: ${details}` }, { status: 500 });
  }
}
