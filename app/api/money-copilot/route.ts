import { NextRequest, NextResponse } from 'next/server';
import { buildCopilotResponse } from '@/lib/money-copilot/output';
import { getAiNarrative } from '@/lib/money-copilot/ai-client';
import type { CopilotRequest } from '@/lib/money-copilot/types';

export async function POST(req: NextRequest) {
  try {
    const body: CopilotRequest = await req.json();

    if (!body.question || body.question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    if (!body.mode) {
      return NextResponse.json({ error: 'Decision mode is required.' }, { status: 400 });
    }

    const request: CopilotRequest = {
      mode: body.mode,
      question: body.question.trim(),
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
