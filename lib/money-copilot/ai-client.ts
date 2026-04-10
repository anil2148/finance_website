import type { CopilotRequest, FinancialInputs } from './types';
import { buildSystemPrompt } from './prompts';

/** Standard work hours per year used for hourly-to-annual conversion. */
const WORK_HOURS_PER_YEAR = 2080;

/** Maximum tokens to request from the AI provider per response. */
const AI_MAX_TOKENS = 1024;

export interface AiNarrative {
  summary: string;
  recommendation: string;
  sensitivities: string[];
  risks: string[];
  nextSteps: string[];
}

function formatInputsForPrompt(inputs: FinancialInputs): string {
  const lines: string[] = [];

  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * WORK_HOURS_PER_YEAR : null);
  if (salary) lines.push(`Annual salary: $${salary.toLocaleString()}`);
  if (inputs.hourlyRate) lines.push(`Hourly rate: $${inputs.hourlyRate}/hr`);
  if (inputs.bonus) lines.push(`Annual bonus: $${inputs.bonus.toLocaleString()}`);
  if (inputs.employmentType) lines.push(`Employment type: ${inputs.employmentType}`);
  if (inputs.state) lines.push(`State: ${inputs.state}`);
  if (inputs.city) lines.push(`City: ${inputs.city}`);

  const housing = inputs.monthlyRent ?? inputs.mortgage;
  if (housing) lines.push(`Monthly housing cost: $${housing.toLocaleString()}`);
  if (inputs.debtPayments) lines.push(`Monthly debt payments: $${inputs.debtPayments.toLocaleString()}`);
  if (inputs.childcare) lines.push(`Monthly childcare: $${inputs.childcare.toLocaleString()}`);
  if (inputs.insurance) lines.push(`Monthly insurance: $${inputs.insurance.toLocaleString()}`);
  if (inputs.transportation) lines.push(`Monthly transportation: $${inputs.transportation.toLocaleString()}`);
  if (inputs.groceries) lines.push(`Monthly groceries: $${inputs.groceries.toLocaleString()}`);
  if (inputs.utilities) lines.push(`Monthly utilities: $${inputs.utilities.toLocaleString()}`);
  if (inputs.cashOnHand) lines.push(`Cash on hand / savings: $${inputs.cashOnHand.toLocaleString()}`);
  if (inputs.savingsRate) lines.push(`Savings rate goal: ${inputs.savingsRate}%`);
  if (inputs.employerMatch) lines.push(`Employer 401(k) match: ${inputs.employerMatch}%`);
  if (inputs.timeHorizon) lines.push(`Investment time horizon: ${inputs.timeHorizon} years`);
  if (inputs.riskTolerance) lines.push(`Risk tolerance: ${inputs.riskTolerance}`);
  if (inputs.targetEmergencyMonths) lines.push(`Target emergency fund: ${inputs.targetEmergencyMonths} months`);

  return lines.length > 0 ? lines.join('\n') : 'No specific financial inputs provided.';
}

function buildUserMessage(request: CopilotRequest, existingMetrics: Array<{ label: string; value: string; note?: string }>): string {
  const inputsSummary = formatInputsForPrompt(request.inputs);
  const metricsSummary = existingMetrics.length > 0
    ? existingMetrics.map(m => `  ${m.label}: ${m.value}${m.note ? ` (${m.note})` : ''}`).join('\n')
    : '  No computed metrics available.';

  return `Decision mode: ${request.mode}
User question: ${request.question}

Financial inputs provided:
${inputsSummary}

Pre-computed key metrics (use these exact numbers in your analysis):
${metricsSummary}

Respond ONLY with valid JSON (no markdown fences) matching this structure:
{
  "summary": "<2-3 sentence plain-language summary of the financial situation>",
  "recommendation": "<clear recommendation with reasoning>",
  "sensitivities": ["<what-if factor 1>", "<what-if factor 2>", "<what-if factor 3>"],
  "risks": ["<risk or blind spot 1>", "<risk or blind spot 2>", "<risk or blind spot 3>"],
  "nextSteps": ["<concrete action 1>", "<concrete action 2>", "<concrete action 3>"]
}`;
}

function parseAiResponse(raw: string): AiNarrative | null {
  try {
    const cleaned = raw
      .replace(/^```(?:json)?/m, '')
      .replace(/```$/m, '')
      .trim();
    const parsed = JSON.parse(cleaned) as Partial<AiNarrative>;
    if (
      typeof parsed.summary === 'string' &&
      typeof parsed.recommendation === 'string' &&
      Array.isArray(parsed.sensitivities) &&
      Array.isArray(parsed.risks) &&
      Array.isArray(parsed.nextSteps)
    ) {
      return {
        summary: parsed.summary,
        recommendation: parsed.recommendation,
        sensitivities: parsed.sensitivities as string[],
        risks: parsed.risks as string[],
        nextSteps: parsed.nextSteps as string[]
      };
    }
  } catch {
    // Parsing failed — caller will fall back to rule-based
  }
  return null;
}

async function callOpenAi(
  userMessage: string,
  systemPrompt: string
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.HIDDEN_AI_OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.HIDDEN_AI_OPENAI_MODEL ?? 'gpt-3.5-turbo';

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
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

  if (!res.ok) {
    console.error(`[ai-client] OpenAI request failed: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? null;
}

async function callOllama(
  userMessage: string,
  systemPrompt: string
): Promise<string | null> {
  const host = process.env.HIDDEN_AI_OLLAMA_HOST;
  if (!host) return null;

  const model = process.env.HIDDEN_AI_OLLAMA_MODEL ?? 'llama3:8b';
  const baseUrl = host.replace(/\/$/, '');

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

  if (!res.ok) {
    console.error(`[ai-client] Ollama request failed: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json() as {
    message?: { content?: string };
  };
  return data.message?.content ?? null;
}

export async function getAiNarrative(
  request: CopilotRequest,
  existingMetrics: Array<{ label: string; value: string; note?: string }>
): Promise<AiNarrative | null> {
  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(request, existingMetrics);

  try {
    // Try OpenAI first (if API key is present)
    let rawResponse: string | null = null;

    if (process.env.OPENAI_API_KEY) {
      rawResponse = await callOpenAi(userMessage, systemPrompt);
    }

    // Fall back to Ollama if OpenAI is unavailable or not configured
    if (rawResponse === null && process.env.HIDDEN_AI_OLLAMA_HOST) {
      rawResponse = await callOllama(userMessage, systemPrompt);
    }

    if (rawResponse === null) return null;

    return parseAiResponse(rawResponse);
  } catch (err) {
    console.error('[ai-client] Unexpected error calling AI provider:', err);
    return null;
  }
}
