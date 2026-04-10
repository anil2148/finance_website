import { NextRequest, NextResponse } from 'next/server';
import { buildCopilotResponse } from '@/lib/money-copilot/output';
import { getAiNarrative } from '@/lib/money-copilot/ai-client';
import { getModeFromQuestion } from '@/lib/money-copilot/prompts';
import { sanitizeText } from '@/lib/api/sanitize';
import type { CopilotRequest } from '@/lib/money-copilot/types';

export async function POST(req: NextRequest) {
  try {
    // Parse and do a basic shape check before type-asserting
    const raw: unknown = await req.json();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    const body = raw as Partial<CopilotRequest> & { context?: string };

    const rawQuestion = sanitizeText(body.question);
    if (!rawQuestion) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    // Infer mode from question when not provided (supports simple { question, context, scenarios } callers)
    const mode = body.mode ?? getModeFromQuestion(rawQuestion);

    const request: CopilotRequest = {
      mode,
      question: rawQuestion,
      inputs: body.inputs ?? {},
      scenarios: body.scenarios ?? []
    };

    // Run rule-based engine for deterministic metrics, scenarios, assumptions, and confidence.
    const ruleBasedResponse = buildCopilotResponse(request);

    // Attempt to enrich the narrative sections (summary, recommendation, sensitivities, risks,
    // nextSteps) using an AI provider. Falls back to the rule-based text if AI is unavailable.
    const aiNarrative = await getAiNarrative(request, ruleBasedResponse.keyMetrics);

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

    return NextResponse.json(response);
  } catch (err) {
    console.error('[money-copilot] Error:', err);
    return NextResponse.json({ error: 'Failed to process request. Please try again.' }, { status: 500 });
  }
}
