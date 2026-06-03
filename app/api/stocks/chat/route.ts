import { NextResponse } from 'next/server';
import { buildLiveStockIntelligenceReport, type IntelligenceReport } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';

const OPENAI_MODEL = 'gpt-4o-mini';

type ChatRequest = {
  symbol?: string;
  question?: string;
};

function logAiError(context: Record<string, unknown>) {
  console.error('[stock-chat-ai-error]', JSON.stringify(context));
}

function buildFallbackAnswer(report: IntelligenceReport, question: string, reason?: string) {
  const stock = report.stock;
  const score = report.score;
  const upside = stock.price > 0 ? ((stock.analystTarget - stock.price) / stock.price) * 100 : 0;
  const bullFactors = [
    stock.revenueGrowth > 10 ? `Revenue growth is supportive at ${stock.revenueGrowth.toFixed(1)}%.` : `Revenue growth is modest at ${stock.revenueGrowth.toFixed(1)}%.`,
    stock.epsGrowth > 10 ? `EPS growth is supportive at ${stock.epsGrowth.toFixed(1)}%.` : `EPS growth needs monitoring at ${stock.epsGrowth.toFixed(1)}%.`,
    stock.profitMargin > 15 ? `Profit margin looks healthy at ${stock.profitMargin.toFixed(1)}%.` : `Profit margin is not especially strong at ${stock.profitMargin.toFixed(1)}%.`,
    stock.debtToEquity < 1 ? `Debt/equity of ${stock.debtToEquity.toFixed(2)} looks manageable.` : `Debt/equity of ${stock.debtToEquity.toFixed(2)} adds balance-sheet risk.`,
  ];
  const bearFactors = [
    stock.forwardPe > 35 ? `Forward P/E of ${stock.forwardPe.toFixed(1)} suggests valuation risk.` : `Forward P/E of ${stock.forwardPe.toFixed(1)} is not extremely stretched.`,
    stock.rsi > 70 ? `RSI of ${stock.rsi.toFixed(1)} may indicate overbought short-term momentum.` : stock.rsi < 35 ? `RSI of ${stock.rsi.toFixed(1)} shows weak/oversold momentum.` : `RSI of ${stock.rsi.toFixed(1)} is not at an extreme.`,
    upside < 0 ? `Estimated target is below current price, which is bearish.` : `Estimated target implies about ${upside.toFixed(1)}% upside, but this is only a rough guide.`,
  ];

  return [
    reason ? `AI provider fallback: ${reason}` : 'AI provider fallback: generated from FinanceSphere metrics because OpenAI is unavailable.',
    '',
    `Question: ${question}`,
    '',
    `${stock.symbol} quick view: ${score.total}/100 (${score.rating}). Current price is $${stock.price.toFixed(2)} and estimated upside is ${upside.toFixed(1)}%.`,
    '',
    'Bullish factors:',
    ...bullFactors.map((item) => `• ${item}`),
    '',
    'Bearish / risk factors:',
    ...bearFactors.map((item) => `• ${item}`),
    '',
    'What to verify next:',
    '• Latest earnings report and management guidance.',
    '• Whether revenue growth and EPS growth are improving or slowing.',
    '• Whether valuation is reasonable compared with peers.',
    '• Insider activity, analyst revisions, and SEC filing risk factors.',
    '',
    'Educational information only — not financial advice.',
  ].join('\n');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as ChatRequest;
  const symbol = (body.symbol || '').trim().toUpperCase();
  const question = (body.question || '').trim();

  if (!symbol || !question) {
    logAiError({ stage: 'validation', symbol, hasQuestion: Boolean(question) });
    return NextResponse.json({ error: 'Symbol and question are required.' }, { status: 400 });
  }

  try {
    const report = await buildLiveStockIntelligenceReport(symbol);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      logAiError({ stage: 'config', symbol, error: 'OPENAI_API_KEY missing', fallback: true });
      return NextResponse.json({ symbol, mode: 'fallback', answer: buildFallbackAnswer(report, question, 'OPENAI_API_KEY is not configured.') });
    }

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
        fallback: true,
      });
      return NextResponse.json({ symbol, mode: 'fallback', providerError: message, answer: buildFallbackAnswer(report, question, message) });
    }

    const answer = data?.choices?.[0]?.message?.content || 'No AI answer was generated.';
    if (!data?.choices?.[0]?.message?.content) {
      logAiError({ stage: 'empty_completion', symbol, model: OPENAI_MODEL, finishReason: data?.choices?.[0]?.finish_reason });
    }
    return NextResponse.json({ symbol, mode: 'openai', answer });
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
