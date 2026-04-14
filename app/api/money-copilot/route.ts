import { NextRequest, NextResponse } from 'next/server';
import { buildCopilotResponse } from '@/lib/money-copilot/output';
import {
  getAiNarrative,
  getModel,
  streamGroqNarrative,
  buildAiUserMessage,
  buildAiSystemPrompt,
  type AiNarrative
} from '@/lib/money-copilot/ai-client';
import { getModeFromQuestion, FINANCE_SPHERE_COPILOT_PROMPT } from '@/lib/money-copilot/prompts';
import { sanitizeText } from '@/lib/api/sanitize';
import { getGroqClient } from '@/lib/groq/client';
import { hashKey, getCache, setCache } from '@/lib/cache/redis';
import type { AiPageContext, CopilotRequest, CopilotResponse, BubbleResponse } from '@/lib/money-copilot/types';
import { normalizeInputsForRegion, parseFinancialDataFromText, mergeNlpIntoInputs } from '@/lib/money-copilot/nlp-parser';
import type { SalaryRegion } from '@/lib/money-copilot/nlp-parser';
import { currencyFromRegion, regionFromPath } from '@/lib/money-copilot/ai-page-context';

export const runtime = "nodejs";

/**
 * In-flight request deduplication map.
 *
 * Maps a hashed request key → Promise<CopilotResponse | null> so that
 * concurrent identical requests share a single AI call rather than each
 * spawning an independent (expensive) round-trip.
 */
const inFlightRequests = new Map<string, Promise<CopilotResponse | null>>();

const QUICK_MAX_TOKENS = 512;
/** Fast model always used for quick/bubble mode. */
const QUICK_MODEL = 'llama-3.1-8b-instant';
/** Fallback Groq model if the primary model fails. */
const QUICK_GROQ_FALLBACK_MODEL = 'llama-3.1-8b-instant';

function sanitizePageContext(raw: unknown): AiPageContext | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const candidate = raw as Partial<AiPageContext>;
  if (typeof candidate.pageUrl !== 'string') return undefined;

  const pathRegion = regionFromPath(candidate.pageUrl);

  return {
    pageType: typeof candidate.pageType === 'string' ? candidate.pageType : 'decision-page',
    pageTitle: typeof candidate.pageTitle === 'string' ? candidate.pageTitle : 'FinanceSphere',
    pageUrl: candidate.pageUrl,
    region: pathRegion,
    currency: currencyFromRegion(pathRegion),
    intent: typeof candidate.intent === 'string' ? candidate.intent : 'general-financial-guidance',
    marketContext: typeof candidate.marketContext === 'string' ? candidate.marketContext : undefined,
    pageFamily: typeof candidate.pageFamily === 'string' ? candidate.pageFamily : undefined,
    structuredValues:
      candidate.structuredValues && typeof candidate.structuredValues === 'object' && !Array.isArray(candidate.structuredValues)
        ? candidate.structuredValues
        : undefined,
    calculatorState:
      candidate.calculatorState && typeof candidate.calculatorState === 'object' && !Array.isArray(candidate.calculatorState)
        ? candidate.calculatorState
        : undefined,
    suggestedPrompts:
      Array.isArray(candidate.suggestedPrompts) ? candidate.suggestedPrompts.filter((item): item is string => typeof item === 'string') : undefined,
    groundingMessage: typeof candidate.groundingMessage === 'string' ? candidate.groundingMessage : undefined,
    aiMode:
      candidate.aiMode === 'contextual' || candidate.aiMode === 'generic' || candidate.aiMode === 'hidden'
        ? candidate.aiMode
        : undefined,
  };
}

function buildQuickSystemPrompt(region: 'US' | 'India' = 'US'): string {
  const regionContext = region === 'India'
    ? '\n\nIMPORTANT: This user is in INDIA. Always respond using Indian financial context:\n- Use ₹ (INR) with Indian number format (lakh, crore)\n- Use terms: CTC, in-hand salary, EMI, CIBIL, home loan, 80C, EPF, PPF, ELSS, SIP, FD, RBI rate\n- Apply Indian interest rates and tax rules (new/old regime)\n- NEVER use US-specific terms like mortgage, 401k, Roth IRA, APR, FICO, W2'
    : '\n\nIMPORTANT: This user is in the US. Use USD ($) and US financial terminology (salary, mortgage, 401k, APR, credit score). NEVER use India-specific terms.';

  return `${FINANCE_SPHERE_COPILOT_PROMPT}${regionContext}

You are in QUICK MODE. Return ONLY valid JSON matching the BubbleResponse format. No markdown fences.`;
}

function buildQuickUserMessage(question: string, region: 'US' | 'India' = 'US'): string {
  const defaultAssumption = region === 'India' ? '₹8L India CTC' : '$65K US salary';
  return `User question: ${question}

IMPORTANT: Always give a concrete recommendation immediately. Use default assumptions if data is missing (e.g., ${defaultAssumption}). Never respond with "I need more information" without first answering.

Respond ONLY with valid JSON (no markdown fences):
{
  "summary": "<1-2 sentence bottom-line recommendation with numbers — use defaults if no data provided>",
  "quickTake": "<plain-language why, 1-2 sentences — key financial tradeoff>",
  "keyPoints": ["<key number, assumption used, or metric>"],
  "riskFlags": ["<specific risk to watch>"],
  "nextStep": "<one concrete action — be specific>",
  "confidence": "LOW",
  "disclaimer": "Educational only, not financial advice."
}

End with: "Want me to personalize this with your numbers?"`;
}

function parseQuickResponse(raw: string): BubbleResponse | null {
  try {
    const cleaned = raw.replace(/^```(?:json)?/m, '').replace(/```$/m, '').trim();
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    if (typeof parsed.summary === 'string' && typeof parsed.quickTake === 'string') {
      const confidenceRaw = typeof parsed.confidence === 'string' ? parsed.confidence.toUpperCase() : '';
      const confidence: 'LOW' | 'MEDIUM' | 'HIGH' =
        confidenceRaw === 'HIGH' || confidenceRaw === 'MEDIUM' ? confidenceRaw : 'LOW';
      return {
        summary: parsed.summary,
        quickTake: parsed.quickTake,
        keyPoints: Array.isArray(parsed.keyPoints) ? (parsed.keyPoints as string[]) : [],
        riskFlags: Array.isArray(parsed.riskFlags) ? (parsed.riskFlags as string[]) : [],
        nextStep: typeof parsed.nextStep === 'string' ? parsed.nextStep : '',
        confidence,
        disclaimer: typeof parsed.disclaimer === 'string' ? parsed.disclaimer : 'Educational only, not financial advice.'
      };
    }
  } catch {
    // fall through
  }
  return null;
}

async function callGroqForQuick(systemPrompt: string, userMessage: string, model: string): Promise<BubbleResponse | null> {
  console.log('[AI] Selected model:', model);
  try {
    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.2,
      max_tokens: QUICK_MAX_TOKENS
    });
    const content = completion.choices[0]?.message?.content ?? null;
    if (content) return parseQuickResponse(content);
  } catch (err) {
    console.error(`[money-copilot] Groq request failed with model ${model}:`, err);
  }
  return null;
}

async function callAiForQuick(question: string, region: 'US' | 'India' = 'US'): Promise<BubbleResponse | null> {
  const systemPrompt = buildQuickSystemPrompt(region);
  const userMessage = buildQuickUserMessage(question, region);

  if (process.env.GROQ_API_KEY) {
    // Quick mode always uses the fast cheap model
    const primary = await callGroqForQuick(systemPrompt, userMessage, QUICK_MODEL);
    if (primary !== null) return primary;

    console.warn(`[money-copilot] Primary model (${QUICK_MODEL}) failed — retrying with fallback model (${QUICK_GROQ_FALLBACK_MODEL})`);
    const fallback = await callGroqForQuick(systemPrompt, userMessage, QUICK_GROQ_FALLBACK_MODEL);
    if (fallback !== null) return fallback;
  }

  const apiKey = process.env.OPENAI_API_KEY;
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
          max_tokens: QUICK_MAX_TOKENS
        })
      });
      if (res.ok) {
        const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
        const content = data.choices?.[0]?.message?.content ?? null;
        if (content) return parseQuickResponse(content);
      }
    } catch {
      // fall through
    }
  }

  return null;
}

function buildFallbackQuickResponse(question: string, region: 'US' | 'India' = 'US'): BubbleResponse {
  const isIndia = region === 'India';
  return {
    summary: isIndia
      ? 'Based on typical Indian financial assumptions: focus on the option that improves your monthly in-hand while keeping 3 months of expenses in a liquid FD. Want me to personalize this with your numbers?'
      : 'Based on typical financial assumptions: focus on the option that improves your monthly cash flow while keeping 3 months of expenses in savings. Want me to personalize this with your numbers?',
    quickTake: isIndia
      ? `For "${question}" — the best move depends on your CTC and EMI obligations, but most people benefit from reducing high-rate debt (>10% p.a.) first, then investing in ELSS/SIP.`
      : `For "${question}" — the best move depends on your income and obligations, but most people benefit from reducing high-rate debt first, then investing.`,
    keyPoints: isIndia
      ? ['Assumed ₹8L CTC — share yours for exact numbers', '3-month emergency fund in liquid FD is the baseline safety net']
      : ['Assumed median income ($65K US) — share yours for exact numbers', '3-month emergency fund is the baseline safety net'],
    riskFlags: ['Without your specific numbers, this is a general framework — not a personalized plan'],
    nextStep: 'Use the full AI Money Copilot at /ai-money-copilot to enter your numbers and get a personalized analysis.',
    confidence: 'LOW',
    disclaimer: 'Educational only, not financial advice.'
  };
}

/**
 * Encode a Server-Sent Event line.
 * Payload is JSON-stringified; callers pass a plain object or the string "[DONE]".
 */
function sseEvent(payload: unknown): Uint8Array {
  const data = payload === '[DONE]' ? '[DONE]' : JSON.stringify(payload);
  return new TextEncoder().encode(`data: ${data}\n\n`);
}

export async function POST(req: NextRequest) {
  try {
    // Parse and do a basic shape check before type-asserting
    const raw: unknown = await req.json();
    console.log('[API] Incoming request:', raw);

    console.log("[ENV CHECK] GROQ_API_KEY:", process.env.GROQ_API_KEY ? "FOUND" : "MISSING");
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY in environment");
    }

    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    const body = raw as Partial<CopilotRequest> & { context?: string };

    const rawQuestion = sanitizeText(body.question);
    console.log('[API] Parsed question:', rawQuestion);
    console.log('[API] Parsed context:', body.context ?? '');

    if (!rawQuestion) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY && !process.env.HIDDEN_AI_OLLAMA_HOST) {
      console.error('[API] Error: No AI provider API key configured (GROQ_API_KEY, OPENAI_API_KEY, or HIDDEN_AI_OLLAMA_HOST)');
    }

    // Determine region: accept 'India' or 'US'; default to 'US'
    const region: SalaryRegion = body.region === 'India' ? 'India' : 'US';
    console.log('[API] Region context:', region);

    // Quick mode: return a compact BubbleResponse for the floating bubble
    if (body.responseMode === 'quick') {
      const result = await callAiForQuick(rawQuestion, region);
      return NextResponse.json(result ?? buildFallbackQuickResponse(rawQuestion, region));
    }

    // Deep mode (default): full structured CopilotResponse streamed via SSE
    const mode = body.mode ?? getModeFromQuestion(rawQuestion);
    console.log('[API] Detected intent:', mode);

    const sanitizedContext = typeof body.context === 'string' ? sanitizeText(body.context) || undefined : undefined;

    // Normalize inputs: apply region-aware monthly → annual conversion, then NLP merge
    const rawInputs = body.inputs ?? {};
    const regionNormalized = normalizeInputsForRegion(rawInputs, region);
    const nlpParsed = parseFinancialDataFromText(rawQuestion, sanitizedContext, region);
    const mergedInputs = mergeNlpIntoInputs(regionNormalized, nlpParsed);

    const request: CopilotRequest = {
      mode,
      question: rawQuestion,
      context: sanitizedContext,
      inputs: mergedInputs,
      scenarios: body.scenarios ?? [],
      region,
      pageContext: sanitizePageContext(body.pageContext),
    };

    // Build a deterministic cache key from question + context + mode + region.
    const cacheKey = hashKey(`${rawQuestion}\x00${sanitizedContext ?? ''}\x00${mode}\x00${region}`);

    // Check Redis/memory cache before doing any AI work
    const cached = await getCache(cacheKey) as CopilotResponse | null;
    if (cached) {
      console.log('[CACHE] HIT');
      return NextResponse.json(cached);
    }
    console.log('[CACHE] MISS');

    // ------------------------------------------------------------------
    // Request deduplication: if an identical request is already in-flight,
    // await its result rather than spawning a duplicate AI call.
    // ------------------------------------------------------------------
    if (inFlightRequests.has(cacheKey)) {
      console.log('[DEDUP] Awaiting in-flight request for key:', cacheKey);
      // Non-null assertion is safe: has() guarantees the key exists
      const deduped = await inFlightRequests.get(cacheKey)!;
      if (deduped) return NextResponse.json(deduped);
    }

    // Smart model selection based on mode and question length
    const model = getModel(mode, rawQuestion.length);
    console.log('[AI] Selected model:', model);

    // Run rule-based engine for deterministic metrics, scenarios, assumptions, and confidence.
    const ruleBasedResponse = buildCopilotResponse(request);

    // Build the AI prompt once so we can stream it
    const systemPrompt = buildAiSystemPrompt();
    const userMessage = buildAiUserMessage(request, ruleBasedResponse.keyMetrics);

    // Stream the response to the client using Server-Sent Events (SSE).
    // Event sequence:
    //   1. "base"      – full rule-based response (instant, deterministic)
    //   2. "chunk"     – AI narrative text delta (typing effect)
    //   3. "narrative" – complete AI narrative JSON (merged into final result by the client)
    //   4. [DONE]      – signals end of stream
    const stream = new ReadableStream({
      async start(controller) {
        // Accumulated AI text is declared outside the try block so that partial
        // content is preserved for fallback even if streaming throws mid-way.
        let accumulated = '';

        // Expose a Promise that resolves to the final response so duplicate
        // requests can await it instead of re-running the AI pipeline.
        // Initialized with a no-op to satisfy definite-assignment; the Promise
        // executor always runs synchronously and overwrites this before first use.
        let resolveInFlight: (value: CopilotResponse | null) => void = () => {};
        const inFlightPromise = new Promise<CopilotResponse | null>(resolve => {
          resolveInFlight = resolve;
        });
        inFlightRequests.set(cacheKey, inFlightPromise);

        try {
          // Phase 1: send rule-based response immediately so the client can render structure
          controller.enqueue(sseEvent({ type: 'base', payload: ruleBasedResponse }));

          // Phase 2: stream AI narrative text chunks from Groq
          for await (const chunk of streamGroqNarrative(userMessage, systemPrompt, model)) {
            accumulated += chunk;
            controller.enqueue(sseEvent({ type: 'chunk', content: chunk }));
          }

          // Phase 3: parse the complete narrative and send it as a structured update
          let aiNarrative: AiNarrative | null = null;
          if (accumulated) {
            try {
              const cleaned = accumulated.replace(/^```(?:json)?/m, '').replace(/```$/m, '').trim();
              const parsed = JSON.parse(cleaned) as Partial<AiNarrative>;
              if (
                typeof parsed.summary === 'string' &&
                typeof parsed.recommendation === 'string' &&
                Array.isArray(parsed.sensitivities) &&
                Array.isArray(parsed.risks) &&
                Array.isArray(parsed.nextSteps)
              ) {
                aiNarrative = parsed as AiNarrative;
              }
            } catch {
              console.error('[API] Failed to parse streamed AI narrative');
            }
          }

          // Fall back to non-streaming AI call if streaming yielded nothing parseable
          if (!aiNarrative) {
            aiNarrative = await getAiNarrative(request, ruleBasedResponse.keyMetrics, model);
          }

          const finalResponse: CopilotResponse = aiNarrative
            ? {
                ...ruleBasedResponse,
                summary: aiNarrative.summary,
                recommendation: aiNarrative.recommendation,
                sensitivities: aiNarrative.sensitivities,
                risks: aiNarrative.risks,
                nextSteps: aiNarrative.nextSteps
              }
            : ruleBasedResponse;

          controller.enqueue(sseEvent({ type: 'narrative', payload: finalResponse }));

          // Cache the final merged response (Redis with in-memory fallback)
          await setCache(cacheKey, finalResponse);

          // Resolve in-flight promise so waiting duplicate requests can proceed
          resolveInFlight(finalResponse);

          controller.enqueue(sseEvent('[DONE]'));
          controller.close();
        } catch (err) {
          console.error('[API] Streaming error (accumulated so far):', accumulated ? accumulated.slice(0, 200) : '(none)');
          console.error('[API] Streaming error:', err);
          resolveInFlight(null);
          controller.enqueue(sseEvent({ type: 'error', message: err instanceof Error ? err.message : String(err) }));
          controller.close();
        } finally {
          inFlightRequests.delete(cacheKey);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (err) {
    console.error('[API] Error:', err);
    const details = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      error: `Failed to generate AI response: ${details}`
    }, { status: 500 });
  }
}
