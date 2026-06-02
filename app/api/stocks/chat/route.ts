import { NextResponse } from 'next/server';
import { buildLiveStockIntelligenceReport } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';

type ChatRequest = {
  symbol?: string;
  question?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not configured.' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({})) as ChatRequest;
  const symbol = (body.symbol || '').trim().toUpperCase();
  const question = (body.question || '').trim();

  if (!symbol || !question) {
    return NextResponse.json({ error: 'Symbol and question are required.' }, { status: 400 });
  }

  try {
    const report = await buildLiveStockIntelligenceReport(symbol);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.25,
        messages: [
          {
            role: 'system',
            content: 'You are FinanceSphere AI, a cautious educational stock research assistant. Do not provide personalized financial advice. Explain bullish and bearish factors, key risks, and what data to verify next. Keep answers practical and concise.',
          },
          {
            role: 'user',
            content: `Question: ${question}\n\nStock report JSON:\n${JSON.stringify(report).slice(0, 12000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Unable to generate AI response.' }, { status: response.status });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || 'No AI answer was generated.';
    return NextResponse.json({ symbol, answer });
  } catch (error) {
    console.error('Stock chat failed', error);
    return NextResponse.json({ error: 'Unable to answer this stock question right now.' }, { status: 500 });
  }
}
