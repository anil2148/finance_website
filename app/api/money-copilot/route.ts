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
import { getCacheKey, getCached, setCache } from '@/lib/cache';
import type { CopilotRequest, CopilotResponse, BubbleResponse } from '@/lib/money-copilot/types';

export const runtime = "nodejs";

const QUICK_MAX_TOKENS = 512;
/** Fast model always used for quick/bubble mode. */
const QUICK_MODEL = 'llama-3.1-8b-instant';
/** Fallback Groq model if the primary model fails. */
const QUICK_GROQ_FALLBACK_MODEL = 'llama-3.1-8b-instant';

function buildQuickSystemPrompt(): string {
  return `${FINANCE_SPHERE_COPILOT_PROMPT}

You are in QUICK MODE. Return ONLY valid JSON matching the BubbleResponse format. No markdown fences.`;
}

function buildQuickUserMessage(question: string): string {
  return `User question: ${question}

Respond ONLY with valid JSON (no markdown fences):
{
  "summary": "<1-2 sentence bottom line>",
  "quickTake": "<plain-language reasoning, 1-2 sentences>",
  "keyPoints": ["<key number or assumption>"],
  "riskFlags": ["<risk or unknown>"],
  "nextStep": "<one clear immediate action>",
  "confidence": "LOW",
  "disclaimer": "Educational only, not financial advice."
}`;
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

async function callAiForQuick(question: string): Promise<BubbleResponse | null> {
  const systemPrompt = buildQuickSystemPrompt();
  const userMessage = buildQuickUserMessage(question);

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

function buildFallbackQuickResponse(question: string): BubbleResponse {
  return {
    summary: 'Here is a quick take on your financial question.',
    quickTake: `For "${question}" — provide more details for a tailored analysis.`,
    keyPoints: ['No specific inputs provided — estimates are based on general assumptions'],
    riskFlags: ['Missing data reduces confidence significantly'],
    nextStep: 'Use the full AI Money Copilot at /ai-money-copilot for a deep-dive analysis.',
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

    // Quick mode: return a compact BubbleResponse for the floating bubble
    if (body.responseMode === 'quick') {
      const result = await callAiForQuick(rawQuestion);
      return NextResponse.json(result ?? buildFallbackQuickResponse(rawQuestion));
    }

    // Deep mode (default): full structured CopilotResponse streamed via SSE
    const mode = body.mode ?? getModeFromQuestion(rawQuestion);
    console.log('[API] Detected intent:', mode);

    const request: CopilotRequest = {
      mode,
      question: rawQuestion,
      context: typeof body.context === 'string' ? sanitizeText(body.context) || undefined : undefined,
      inputs: body.inputs ?? {},
      scenarios: body.scenarios ?? []
    };

    // Check API-level response cache first
    const cacheKey = getCacheKey(rawQuestion, request.context ?? '');
    const cached = getCached(cacheKey) as CopilotResponse | undefined;
    if (cached) {
      console.log('[CACHE] HIT');
      return NextResponse.json(cached);
    }
    console.log('[CACHE] MISS');

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
        try {
          // Phase 1: send rule-based response immediately so the client can render structure
          controller.enqueue(sseEvent({ type: 'base', payload: ruleBasedResponse }));

          // Phase 2: stream AI narrative text chunks from Groq
          let accumulated = '';
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

          // Fall back to non-streaming AI call if streaming yielded nothing
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

          // Cache the final merged response
          setCache(cacheKey, finalResponse);

          controller.enqueue(sseEvent('[DONE]'));
          controller.close();
        } catch (err) {
          console.error('[API] Streaming error:', err);
          controller.enqueue(sseEvent({ type: 'error', message: err instanceof Error ? err.message : String(err) }));
          controller.close();
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
