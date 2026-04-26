'use client';

import { FormEvent, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

type Insight = {
  id: string;
  title: string;
  summary: string;
  details: string;
};

const monthlyBreakdown = [
  { label: 'Mortgage + interest', value: '$2,430/mo' },
  { label: 'Tax + insurance', value: '$640/mo' },
  { label: 'Maintenance reserve', value: '$350/mo' },
  { label: 'Net monthly impact', value: '$3,420/mo' }
];

const insights: Insight[] = [
  {
    id: 'cash-buffer',
    title: 'Cash buffer pressure',
    summary: 'At this payment level, your reserve runway drops below 90 days.',
    details: 'A 12% income decline and one unexpected repair could reduce runway to 6 weeks. Increase liquid reserve before committing.'
  },
  {
    id: 'rate-reset',
    title: 'Rate reset exposure',
    summary: 'A 1% refinance miss can push housing cost above your safe range.',
    details: 'Your modeled payment-to-income ratio rises near 49% in the downside case. Target 33% to preserve optionality.'
  }
];

export function AICopilotPreview() {
  const [question, setQuestion] = useState('');
  const [hasResponse, setHasResponse] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [downPayment, setDownPayment] = useState(20);

  const riskScore = 72;

  const riskTone = useMemo(() => {
    if (riskScore >= 70) return 'High risk';
    if (riskScore >= 40) return 'Moderate risk';
    return 'Low risk';
  }, [riskScore]);

  const adjustedMonthlyImpact = useMemo(() => {
    const baseline = 3420;
    const downPaymentDelta = (downPayment - 20) * 36;
    return baseline - downPaymentDelta;
  }, [downPayment]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTyping(true);
    setHasResponse(false);

    trackEvent({
      event: 'ai_usage_rate',
      category: 'ai_copilot',
      label: question || 'should_i_buy_a_house_now'
    });

    window.setTimeout(() => {
      setIsTyping(false);
      setHasResponse(true);
    }, 900);
  };

  const onCta = (label: string) => {
    trackEvent({ event: 'cta_click', category: 'homepage_hero', label });
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2" aria-label="AI Copilot and hero section">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">AI Copilot</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-100">Test Your Financial Decisions Before You Risk Money</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">AI-powered engine that simulates real-life scenarios and worst-case outcomes.</p>

        <form onSubmit={onSubmit} className="mt-4" aria-label="AI copilot question input">
          <label htmlFor="ai-question" className="sr-only">Ask your financial question</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="ai-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
              placeholder="Ask your financial question (e.g., Should I buy a house now?)"
              aria-describedby="ai-output"
            />
            <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Run decision</button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/ai-money-copilot" onClick={() => onCta('start_first_decision')} className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
            Start Your First Decision
          </a>
          <a href="#instant-demo" onClick={() => onCta('try_demo_scenario')} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            Try Demo Scenario
          </a>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" id="ai-output" aria-live="polite">
        <h2 className="text-lg font-semibold">Copilot response</h2>
        <div className="mt-4 space-y-3" role="log" aria-label="Example AI conversation">
          <div className="ml-auto max-w-[90%] rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white">
            {question || 'Should I buy a house now?'}
          </div>

          {isTyping ? <div className="w-fit rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">Analyzing<span className="animate-pulse">...</span></div> : null}

          {hasResponse ? (
            <div className="max-w-[95%] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
              <dl className="grid gap-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600 dark:text-slate-300">Monthly impact</dt>
                  <dd className="font-semibold">+$1,180 vs renting</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600 dark:text-slate-300">Worst-case scenario</dt>
                  <dd className="font-semibold">49% income to housing</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600 dark:text-slate-300">Risk score</dt>
                  <dd className="font-semibold text-rose-600">{riskScore}/100 ({riskTone})</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600 dark:text-slate-300">Recommendation</dt>
                  <dd className="font-semibold text-emerald-700 dark:text-emerald-300">Wait 6 months, then re-test</dd>
                </div>
              </dl>

              <ul className="mt-3 space-y-1">
                {monthlyBreakdown.map((item) => (
                  <li key={item.label} className="flex justify-between gap-3 text-xs">
                    <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <label htmlFor="down-payment-slider" className="flex items-center justify-between gap-3 text-xs font-semibold">
                  <span>Stress-test down payment</span>
                  <span>{downPayment}%</span>
                </label>
                <input
                  id="down-payment-slider"
                  type="range"
                  min={5}
                  max={35}
                  step={1}
                  value={downPayment}
                  onChange={(event) => setDownPayment(Number(event.target.value))}
                  className="mt-2 w-full accent-blue-600"
                  aria-label="Adjust down payment"
                />
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Estimated monthly housing cost at this down payment: <span className="font-semibold">${adjustedMonthlyImpact.toLocaleString()}/mo</span>
                </p>
              </div>

              <div className="mt-3 space-y-2">
                {insights.map((insight) => {
                  const isExpanded = expandedInsight === insight.id;
                  return (
                    <section key={insight.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                        className="flex w-full items-center justify-between gap-3 text-left"
                        aria-expanded={isExpanded}
                      >
                        <span className="text-xs font-semibold">{insight.title}</span>
                        <span className="text-xs text-blue-700 dark:text-blue-300">{isExpanded ? 'Hide' : 'Expand'} insights</span>
                      </button>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{insight.summary}</p>
                      {isExpanded ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{insight.details}</p> : null}
                    </section>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </article>

      <article id="instant-demo" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 lg:col-span-2" aria-label="Instant demo block">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Instant demo</p>
            <h2 className="mt-2 text-xl font-semibold">Try a scenario in 10 seconds</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Income: <span className="font-semibold">$6,000/month</span><br />Decision: <span className="font-semibold">Buy house</span></p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Monthly cost breakdown</h3>
            <p className="mt-2 text-sm">Mortgage: $2,430</p>
            <p className="text-sm">Taxes/insurance: $640</p>
            <p className="text-sm">Maintenance: $350</p>
            <div className="mt-3 space-y-2" aria-label="Cost composition graph">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Mortgage</span>
                  <span>71%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: '71%' }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Tax + insurance</span>
                  <span>19%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-2 rounded-full bg-cyan-500" style={{ width: '19%' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
            <h3 className="text-sm font-semibold">Risk alert</h3>
            <p className="mt-1 text-sm">Housing spend crosses safe threshold in downside scenario.</p>
            <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">Recommendation: Wait + build reserves first.</p>
          </div>
        </div>
      </article>
    </section>
  );
}
