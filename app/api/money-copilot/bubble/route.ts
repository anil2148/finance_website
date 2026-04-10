import { NextRequest, NextResponse } from 'next/server';
import { FINANCE_SPHERE_COPILOT_PROMPT } from '@/lib/money-copilot/prompts';
import type { BubbleRequest, BubbleResponse, PageContext } from '@/lib/money-copilot/types';

const AI_MAX_TOKENS = 512;

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
    return ['Am I saving enough?', 'HYSA vs investing — which is better now?', 'How long to reach my savings goal?'];
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
  "suggestions": ["<contextual follow-up suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "keyNumbers": ["<key number or assumption>"],
  "whatMattersMost": ["<top decision driver>"],
  "riskFlags": ["<risk or unknown>"],
  "nextStep": "<one clear immediate action>",
  "confidence": "LOW",
  "disclaimer": "Educational decision support only, not financial advice."
}

If the question is vague or inputs are missing, set confidence to "LOW" and list assumptions explicitly in keyNumbers. Use these default suggestions if context does not suggest better ones: ${JSON.stringify(fallbackSuggestions)}`;
}

function parseBubbleResponse(raw: string): BubbleResponse | null {
  try {
    const cleaned = raw
      .replace(/^```(?:json)?/m, '')
      .replace(/```$/m, '')
      .trim();
    const parsed = JSON.parse(cleaned) as Partial<BubbleResponse>;
    if (
      typeof parsed.summary === 'string' &&
      typeof parsed.quickTake === 'string' &&
      Array.isArray(parsed.suggestions) &&
      Array.isArray(parsed.keyNumbers) &&
      Array.isArray(parsed.whatMattersMost) &&
      Array.isArray(parsed.riskFlags) &&
      typeof parsed.nextStep === 'string' &&
      typeof parsed.confidence === 'string' &&
      typeof parsed.disclaimer === 'string'
    ) {
      return {
        summary: parsed.summary,
        quickTake: parsed.quickTake,
        suggestions: parsed.suggestions as string[],
        keyNumbers: parsed.keyNumbers as string[],
        whatMattersMost: parsed.whatMattersMost as string[],
        riskFlags: parsed.riskFlags as string[],
        nextStep: parsed.nextStep,
        confidence: (parsed.confidence as string).toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
        disclaimer: parsed.disclaimer
      };
    }
  } catch {
    // Parsing failed — will fall back to rule-based bubble response
  }
  return null;
}

async function callAiForBubble(userMessage: string, systemPrompt: string): Promise<string | null> {
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

function buildFallbackBubbleResponse(req: BubbleRequest, suggestions: string[]): BubbleResponse {
  return {
    summary: 'I can help you think through this financial decision.',
    quickTake: 'Provide more details about your income, expenses, and goals for a tailored analysis.',
    suggestions,
    keyNumbers: ['No specific inputs provided — all estimates are assumptions'],
    whatMattersMost: ['Your income and existing obligations', 'Your risk tolerance', 'Your time horizon'],
    riskFlags: ['Missing data reduces confidence significantly'],
    nextStep: 'Visit the full AI Money Copilot at /ai-money-copilot for a deep-dive analysis.',
    confidence: 'LOW',
    disclaimer: 'Educational decision support only, not financial advice.'
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<BubbleRequest>;

    if (!body.question || body.question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const pageContext: PageContext = {
      path: body.pageContext?.path ?? '/',
      title: body.pageContext?.title,
      keywords: body.pageContext?.keywords ?? []
    };

    const bubbleReq: BubbleRequest = {
      question: body.question.trim(),
      pageContext
    };

    const fallbackSuggestions = getSuggestionsForPage(pageContext);
    const systemPrompt = buildBubbleSystemPrompt();
    const userMessage = buildBubbleUserMessage(bubbleReq, fallbackSuggestions);

    const rawResponse = await callAiForBubble(userMessage, systemPrompt);

    const parsed = rawResponse ? parseBubbleResponse(rawResponse) : null;
    const response = parsed ?? buildFallbackBubbleResponse(bubbleReq, fallbackSuggestions);

    return NextResponse.json(response);
  } catch (err) {
    console.error('[money-copilot/bubble] Error:', err);
    return NextResponse.json({ error: 'Failed to process request. Please try again.' }, { status: 500 });
  }
}
