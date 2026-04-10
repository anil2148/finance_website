import type { DecisionMode } from './types';

export function buildSystemPrompt(): string {
  return `You are an AI Money Copilot for FinanceSphere — a structured financial decision-support tool.

Your role is to analyze real-life financial decisions using the user's actual inputs:
- You never fabricate numbers. All estimates must be labeled as estimates.
- You surface tradeoffs, not just a single answer.
- You distinguish between what the math says and what personal priorities might shift.
- You clearly state assumptions when data is missing.
- You provide a confidence level (low/medium/high) based on the completeness of input data.

Decision modes you support:
- job-offer: Compare total compensation packages including taxes, cost of living, benefits value.
- relocation: Analyze net financial impact of moving to a new city/state, including tax differentials.
- debt-payoff: Evaluate whether to accelerate debt repayment vs. invest surplus cash.
- roth-vs-traditional: Model Roth vs. pre-tax retirement contribution tradeoffs.
- emergency-fund: Determine how long current savings last and what the target should be.
- home-affordability: Apply 28/36 rule and stress-test mortgage scenarios.
- budget-stress-test: Identify which expenses are most at risk and simulate income drops.
- custom: Answer any financial decision question using available data.

Always include:
1. A plain-language summary of the financial situation
2. A clear recommendation with reasoning
3. Key metrics with labeled assumptions
4. What would change the answer (sensitivities)
5. Risks and blind spots
6. Concrete next steps
7. The standard disclaimer

This tool is educational only. It does not provide licensed financial, tax, or legal advice.`;
}

export function getStarterPrompts(): string[] {
  return [
    'Should I move from New Jersey to North Carolina for a lower-paying job?',
    'Is W2 at $140k better than $75/hr C2C?',
    'Should I max my Roth 401(k) or keep more monthly cash flow?',
    'Can I afford a $500k home with my current income and debt?',
    'Should I pay off my personal loan early or build a bigger emergency fund first?',
    'What changes most improve my monthly cash flow?',
    'Should I accept a lower salary in a no-income-tax state?'
  ];
}

export function getModeFromQuestion(question: string): DecisionMode {
  const q = question.toLowerCase();

  if (
    q.includes('move') || q.includes('relocat') || q.includes('moving to') ||
    q.includes('new state') || q.includes('new city') || q.includes('no-income-tax state') ||
    q.includes('no income tax state')
  ) return 'relocation';

  if (
    q.includes('job offer') || q.includes('w2') || q.includes('c2c') ||
    q.includes('contractor') || q.includes('new job') || q.includes('job vs') ||
    q.includes('salary vs') || q.includes('compensation')
  ) return 'job-offer';

  if (
    q.includes('pay off') || q.includes('payoff') || q.includes('debt') ||
    q.includes('loan') || q.includes('credit card balance')
  ) return 'debt-payoff';

  if (
    q.includes('roth') || q.includes('traditional') || q.includes('401k') ||
    q.includes('401(k)') || q.includes('ira') || q.includes('pre-tax') || q.includes('pretax')
  ) return 'roth-vs-traditional';

  if (
    q.includes('emergency fund') || q.includes('emergency savings') ||
    q.includes('rainy day') || q.includes('runway')
  ) return 'emergency-fund';

  if (
    q.includes('afford') && (q.includes('home') || q.includes('house') || q.includes('mortgage'))
  ) return 'home-affordability';

  if (
    q.includes('budget') || q.includes('cash flow') || q.includes('spending') ||
    q.includes('stress test') || q.includes('monthly expenses')
  ) return 'budget-stress-test';

  return 'custom';
}
