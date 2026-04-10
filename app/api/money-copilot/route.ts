import { NextRequest, NextResponse } from 'next/server';
import { buildCopilotResponse } from '@/lib/money-copilot/output';
import { getAiNarrative } from '@/lib/money-copilot/ai-client';
import { getModeFromQuestion, FINANCE_SPHERE_COPILOT_PROMPT } from '@/lib/money-copilot/prompts';
import { sanitizeText } from '@/lib/api/sanitize';
import { getGroqClient } from '@/lib/groq/client';
import type { CopilotRequest, BubbleResponse } from '@/lib/money-copilot/types';

const QUICK_MAX_TOKENS = 512;
const QUICK_GROQ_MODEL = 'llama3-8b-8192';

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

async function callAiForQuick(question: string): Promise<BubbleResponse | null> {
  const systemPrompt = buildQuickSystemPrompt();
  const userMessage = buildQuickUserMessage(question);

  if (process.env.GROQ_API_KEY) {
    try {
      const client = getGroqClient();
      const completion = await client.chat.completions.create({
        model: QUICK_GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2,
        max_tokens: QUICK_MAX_TOKENS
      });
      const content = completion.choices[0]?.message?.content ?? null;
      if (content) return parseQuickResponse(content);
    } catch {
      // fall through to OpenAI
    }
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

export async function POST(req: NextRequest) {
  try {
    // Parse and do a basic shape check before type-asserting
    const raw: unknown = await req.json();
    console.log('[API] Incoming request:', raw);

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

    // Deep mode (default): full structured CopilotResponse
    const mode = body.mode ?? getModeFromQuestion(rawQuestion);
    const intent = mode;
    console.log('[API] Detected intent:', intent);

    const request: CopilotRequest = {
      mode,
      question: rawQuestion,
      context: typeof body.context === 'string' ? sanitizeText(body.context) || undefined : undefined,
      inputs: body.inputs ?? {},
      scenarios: body.scenarios ?? []
    };

    // Run rule-based engine for deterministic metrics, scenarios, assumptions, and confidence.
    const ruleBasedResponse = buildCopilotResponse(request);

    // Attempt to enrich the narrative sections (summary, recommendation, sensitivities, risks,
    // nextSteps) using an AI provider. Falls back to the rule-based text if AI is unavailable.
    console.log('[API] Sending request to AI provider...');
    const aiNarrative = await getAiNarrative(request, ruleBasedResponse.keyMetrics);
    console.log('[API] AI narrative result:', aiNarrative ? 'received' : 'null (using rule-based fallback)');

    const response = aiNarrative
      ? {
          ...ruleBasedResponse,
          summary: aiNarrative.summary,
          recommendation: aiNarrative.recommendation,
          sensitivities: aiNarrative.sensitivities,
          risks: aiNarrative.risks,
          nextSteps: aiNarrative.nextSteps
        }
      : ruleBasedResponse;

    console.log('[API] Parsed AI output:', { summary: response.summary, confidence: response.confidenceLevel });
    return NextResponse.json(response);
  } catch (err) {
    console.error('[API] Error:', err);
    return NextResponse.json({
      error: true,
      message: 'Failed to generate AI response',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
