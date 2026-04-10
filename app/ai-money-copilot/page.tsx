import type { Metadata } from 'next';
import { createPageMetadata, absoluteUrl } from '@/lib/seo';
import { CopilotWorkspace } from '@/components/money-copilot/CopilotWorkspace';

export const metadata: Metadata = createPageMetadata({
  title: 'AI Money Copilot — Structured Financial Decision Analysis | FinanceSphere',
  description:
    'Get structured financial analysis for real decisions: job offers, relocation, debt payoff, home affordability, Roth vs. traditional, and more. Rule-based estimates using your actual numbers.',
  pathname: '/ai-money-copilot'
});

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Money Copilot',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description:
    'Structured financial decision-support tool for job offers, relocation, debt payoff, home affordability, emergency fund sizing, and retirement contribution strategy.',
  url: absoluteUrl('/ai-money-copilot'),
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  featureList: [
    'Job offer comparison',
    'Relocation cost analysis',
    'Debt payoff vs. invest analysis',
    'Roth vs. traditional 401(k) modeling',
    'Emergency fund assessment',
    'Home affordability using 28/36 rule',
    'Budget stress testing',
    'Scenario side-by-side comparison'
  ]
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does this tool use AI or machine learning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. AI Money Copilot combines rule-based financial calculations with an AI language model to generate the analysis narrative — the summary, recommendation, risks, and next steps. The underlying numbers (income estimates, obligation totals, affordability ratios) are computed deterministically from your inputs so you can see exactly how the math works.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is this financial advice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This tool provides educational decision-support estimates only. It is not financial, legal, or tax advice. All calculations use approximations and stated assumptions. Consult a qualified financial professional before making major financial decisions.'
      }
    },
    {
      '@type': 'Question',
      name: 'How accurate are the tax estimates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The tool uses a simplified marginal tax rate model with approximate federal brackets and state tax rates. It does not account for deductions, credits, capital gains, or filing status nuances. The estimates are labeled as approximations and are intended for comparison purposes, not precise tax planning.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does the W2 vs. C2C comparison work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For C2C and 1099 contractor roles, the tool adds approximately 15.3% in self-employment taxes (employer + employee FICA) to the tax estimate. It also flags that benefits costs — health insurance, dental, vision, paid time off, and 401(k) match — must be factored into total compensation.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the 28/36 rule for home affordability?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The 28/36 rule is a traditional mortgage underwriting guideline: spend no more than 28% of gross monthly income on housing costs, and no more than 36% on total debt (housing + all other monthly debt payments). The tool uses this rule to estimate a maximum supportable home price based on your income and existing debt.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my data stored or shared?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your financial inputs are processed in real time on the server for calculation purposes and are not stored, logged, or shared. Saved reports exist only in your browser session storage and are deleted when you close the tab.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I compare two job offers or two relocation scenarios?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Use the scenario builder in the form to add up to 2 scenarios (e.g., "Job A" and "Job B"). Each scenario gets its own income, location, and expense inputs. The results show side-by-side metrics including monthly take-home, obligations, surplus, housing burden, and risk level.'
      }
    },
    {
      '@type': 'Question',
      name: 'What does confidence level mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Confidence level (low / medium / high) reflects how complete your inputs are. High confidence means you have provided salary, state, housing costs, and key expenses. Low confidence means critical fields are missing and the tool is relying heavily on average assumptions. The more data you provide, the more useful the analysis.'
      }
    }
  ]
};

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Enter your real numbers',
    description:
      'Provide your salary or hourly rate, key monthly expenses, state, and employment type. Add a second scenario to compare two options side-by-side.'
  },
  {
    step: '2',
    title: 'Choose a decision mode',
    description:
      'Select the type of decision you are facing: job offer, relocation, debt payoff, home affordability, emergency fund, retirement contributions, or budget stress test.'
  },
  {
    step: '3',
    title: 'Get an AI-powered analysis',
    description:
      'Receive an AI-generated bottom-line recommendation, key financial metrics, what could change the answer, risks to watch for, and concrete next steps — all grounded in your real numbers.'
  }
];

const SUPPORTED_DECISIONS = [
  { title: 'Job offer comparison', body: 'W2 vs. C2C, total comp analysis, state tax differential, benefits value.' },
  { title: 'Relocation analysis', body: 'Net financial impact of moving states: tax savings vs. housing and cost-of-living changes.' },
  { title: 'Debt payoff strategy', body: 'Emergency fund first or debt payoff? Avalanche vs. opportunity cost.' },
  { title: 'Roth vs. traditional 401(k)', body: 'Tax-now vs. tax-later analysis based on your current rate and time horizon.' },
  { title: 'Emergency fund sizing', body: 'How many months are you covered? What is your target and how long to reach it?' },
  { title: 'Home affordability', body: '28/36 rule analysis: maximum home price, monthly payment estimate, down payment impact.' },
  { title: 'Budget stress test', body: 'What happens to your finances if income drops 10%, 20%, or 30%?' },
  { title: 'Custom financial question', body: 'Any income/expense decision you are facing with specific numbers.' }
];

const FAQS = faqSchema.mainEntity;

export default function AiMoneyCopilotPage() {
  return (
    <section className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CopilotWorkspace />

      {/* How it works */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/90 md:p-8">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">How it works</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="flex flex-col gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported decisions */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/90 md:p-8">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">What decisions it supports</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORTED_DECISIONS.map((d) => (
            <div key={d.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{d.title}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/90 md:p-8">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-5">
          {FAQS.map((faq, i) => (
            <details key={i} className="group rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{faq.name}</span>
                <span className="shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
                {faq.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Trust / disclaimer */}
      <section className="rounded-3xl border border-amber-100 bg-amber-50/60 p-6 dark:border-amber-800/30 dark:bg-amber-950/20 md:p-8">
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">Important notice</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          This tool provides educational decision-support estimates only. It is not financial, legal, or tax advice.
          All calculations use approximations and stated assumptions. Consult a qualified financial professional before
          making major financial decisions.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <TrustPoint
            icon="📊"
            title="Hybrid AI + rule-based"
            body="Key metrics are computed from deterministic formulas. The analysis narrative is generated by an AI model grounded in your numbers."
          />
          <TrustPoint
            icon="🔒"
            title="No data stored"
            body="Your numbers are used for calculation only. Nothing is stored on our servers."
          />
          <TrustPoint
            icon="✅"
            title="Transparent assumptions"
            body="Every estimate shows its assumptions. You can see exactly what the tool assumed."
          />
        </div>
      </section>
    </section>
  );
}

function TrustPoint({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{body}</p>
      </div>
    </div>
  );
}
