import { NextResponse } from 'next/server';
import { buildLiveStockIntelligenceReport } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';

const OPENAI_MODEL = 'gpt-4o-mini';

type ChatRequest = {
  symbol?: string;
  question?: string;
};

function logAiError(context: Record<string, unknown>) {
  console.error('[stock-chat-ai-error]', JSON.stringify(context));
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    logAiError({ stage: 'config', error: 'OPENAI_API_KEY missing' });
    return NextResponse.json({ error: 'OPENAI_API_KEY is not configured in this environment.' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({})) as ChatRequest;
  const symbol = (body.symbol || '').trim().toUpperCase();
  const question = (body.question || '').trim();

  if (!symbol || !question) {
    logAiError({ stage: 'validation', symbol, hasQuestion: Boolean(question) });
    return NextResponse.json({ error: 'Symbol and question are required.' }, { status: 400 });
  }

  try {
    const report = await buildLiveStockIntelligenceReport(symbol);
    const payload = {
      model: OPENAI_MODEL,
      temperature: 0.25,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: 'You are FinanceSphere AI, a cautious educational stock research assistant. Do not provide personalized financial advice. Explain bullish and bearish factors, key risks, and what data to verify next. Keep answers practical and concise.',
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nStock report JSON:\n${JSON.stringify(report).slice(0, 8000)}`,
        },
      ],
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || data?.error || 'Unable to generate AI response.';
      logAiError({
        stage: 'openai_response',
        symbol,
        model: OPENAI_MODEL,
        status: response.status,
        statusText: response.statusText,
        errorType: data?.error?.type,
        errorCode: data?.error?.code,
        errorMessage: message,
      });
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const answer = data?.choices?.[0]?.message?.content || 'No AI answer was generated.';
    if (!data?.choices?.[0]?.message?.content) {
      logAiError({
        stage: 'empty_completion',
        symbol,
        model: OPENAI_MODEL,
        finishReason: data?.choices?.[0]?.finish_reason,
      });
    }
    return NextResponse.json({ symbol, answer });
  } catch (error) {
    logAiError({
      stage: 'exception',
      symbol,
      model: OPENAI_MODEL,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to answer this stock question right now.' }, { status: 500 });
  }
}
