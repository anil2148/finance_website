/**
 * POST /api/money-copilot/execute
 *
 * Institutional AI Execution Engine endpoint.
 *
 * Accepts a question + context, runs the 4-layer pipeline (Intent → Context →
 * Reasoning → Execution), and returns a PipelineResult with all 5 steps.
 *
 * The heavy AI work re-uses the existing /api/money-copilot infrastructure
 * (rule-based engine + Groq narrative). The pipeline layers above that are
 * deterministic and run on the server so results are cacheable.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sanitizeText } from '@/lib/api/sanitize';
import { hashKey, getCache, setCache } from '@/lib/cache/redis';
import { buildCopilotResponse } from '@/lib/money-copilot/output';
import { getModeFromQuestion } from '@/lib/money-copilot/prompts';
import { normalizeInputsForRegion, parseFinancialDataFromText, mergeNlpIntoInputs } from '@/lib/money-copilot/nlp-parser';
import { getAiNarrative, getModel, buildAiUserMessage, buildAiSystemPrompt } from '@/lib/money-copilot/ai-client';
import { runPipeline } from '@/lib/money-copilot/pipeline';
import type { SalaryRegion } from '@/lib/money-copilot/nlp-parser';
import type { CopilotRequest, PipelineResult, ReasoningHistoryEntry } from '@/lib/money-copilot/types';

export const runtime = 'nodejs';

interface ExecuteRequest {
  question: string;
  region?: 'US' | 'India';
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';
  sessionId?: string;
  history?: ReasoningHistoryEntry[];
}

export async function POST(req: NextRequest) {
  try {
    const raw: unknown = await req.json();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const body = raw as Partial<ExecuteRequest>;
    const rawQuestion = sanitizeText(body.question);
    if (!rawQuestion) {
      return NextResponse.json({ error: 'question is required.' }, { status: 400 });
    }

    const region: SalaryRegion = body.region === 'India' ? 'India' : 'US';
    const riskProfile = body.riskProfile ?? 'moderate';
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : `srv_${Date.now()}`;
    const history: ReasoningHistoryEntry[] = Array.isArray(body.history) ? body.history : [];

    // Build a cache key from question + region + riskProfile
    const cacheKey = hashKey(`execute\x00${rawQuestion}\x00${region}\x00${riskProfile}`);
    const cached = await getCache(cacheKey) as PipelineResult | null;
    if (cached) {
      return NextResponse.json(cached);
    }

    // Resolve decision mode and build the copilot request
    const mode = getModeFromQuestion(rawQuestion);
    const rawInputs = {};
    const regionNormalized = normalizeInputsForRegion(rawInputs, region);
    const nlpParsed = parseFinancialDataFromText(rawQuestion, undefined, region);
    const mergedInputs = mergeNlpIntoInputs(regionNormalized, nlpParsed);

    const copilotRequest: CopilotRequest = {
      mode,
      question: rawQuestion,
      inputs: mergedInputs,
      scenarios: [],
      region,
    };

    // Run the rule-based engine for deterministic metrics
    const ruleBasedResponse = buildCopilotResponse(copilotRequest);

    // Attempt to enrich with AI narrative (best-effort — fall back to rule-based)
    const model = getModel(mode, rawQuestion.length);
    const systemPrompt = buildAiSystemPrompt();
    const userMessage = buildAiUserMessage(copilotRequest, ruleBasedResponse.keyMetrics);
    const aiNarrative = await getAiNarrative(copilotRequest, ruleBasedResponse.keyMetrics, model);

    const copilotResponse = aiNarrative
      ? {
          ...ruleBasedResponse,
          summary: aiNarrative.summary,
          recommendation: aiNarrative.recommendation,
          sensitivities: aiNarrative.sensitivities,
          risks: aiNarrative.risks,
          nextSteps: aiNarrative.nextSteps,
        }
      : ruleBasedResponse;

    // Suppress unused variable warning
    void systemPrompt;
    void userMessage;

    // Run the 4-layer pipeline
    const pipelineResult = runPipeline(
      rawQuestion,
      copilotResponse,
      region,
      riskProfile,
      sessionId,
      history,
      mergedInputs,
    );

    // Cache for 5 minutes
    await setCache(cacheKey, pipelineResult);

    return NextResponse.json(pipelineResult);
  } catch (err) {
    console.error('[execute] Pipeline error:', err);
    const details = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Pipeline failed: ${details}` }, { status: 500 });
  }
}
