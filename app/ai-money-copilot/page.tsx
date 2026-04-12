import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createPageMetadata, absoluteUrl } from '@/lib/seo';
import { CopilotWorkspace } from '@/components/money-copilot/CopilotWorkspace';

export const metadata: Metadata = createPageMetadata({
  title: 'AI Decision Assistant — Get a Financial Recommendation in Seconds | FinanceSphere',
  description:
    'Get a clear recommendation on your next financial decision: job offers, buying a home, credit cards, debt payoff, and investing. Instant answer, no account required.',
  pathname: '/ai-money-copilot'
});

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Decision Assistant',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description:
    'Instant financial decision support: job offers, home affordability, credit cards, debt payoff, and investing. Get a clear recommendation in one click.',
  url: absoluteUrl('/ai-money-copilot'),
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  featureList: [
    'Job offer recommendation',
    'Home affordability estimate',
    'Credit card selection',
    'Debt payoff strategy',
    'Investment guidance',
    'India (₹) and US ($) support',
    'Instant answer — no form required',
    'No data stored'
  ]
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I need to fill out a form to get an answer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The assistant gives you an immediate recommendation based on smart defaults. You can optionally add your real numbers afterwards to get a more precise result, but you will never be blocked from getting an answer.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is this financial advice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This tool provides educational decision-support only. It is not financial, legal, or tax advice. All calculations use approximations and stated assumptions. Consult a qualified financial professional before making major financial decisions.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does it work for India (₹) as well as the US ($)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The assistant detects whether you are on the India section of the site and applies India-specific defaults — CTC in lakhs, home loan rates, and rupee-based calculations. All five decision categories work for both regions.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does the home affordability estimate work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For US users, the tool applies the 28/36 rule — spend no more than 28% of gross income on housing and no more than 36% on total debt — to estimate a maximum home price. You can enter your income, down payment, and existing debts for a personalized number.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my data stored or shared?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your financial inputs are processed in real time and are not stored, logged, or shared. Results exist only in your browser session and are cleared when you close the tab.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I compare two job offers side by side?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Describe both offers in your question — for example "I have two offers: $90k at Company A and $100k at Company B with better benefits" — and the assistant will compare them and recommend which one makes more financial sense.'
      }
    }
  ]
};

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Pick a decision type',
    description:
      'Choose from Job offer, Buying a home, Credit card, Debt payoff, or Investing — or type your own situation in your own words.'
  },
  {
    step: '2',
    title: 'Get an instant recommendation',
    description:
      'The assistant answers immediately using smart defaults. No waiting, no forms to fill out first — a useful answer in seconds.'
  },
  {
    step: '3',
    title: 'Refine if you want more precision',
    description:
      'Add your specific numbers to get a more personalized calculation. The first answer is always free; real numbers sharpen it.'
  }
];

const SUPPORTED_DECISIONS = [
  { title: 'Job offer', body: 'Should I take it? Compare salary, benefits, and total compensation at a glance.' },
  { title: 'Buying a home', body: 'What can I actually afford? Monthly payment, risks, and whether now is the right time.' },
  { title: 'Credit card', body: 'Which card fits my spending? Points, cash back, APR, and balance transfer options.' },
  { title: 'Debt payoff', body: 'Fastest way out of debt? Avalanche vs. snowball with a clear starting point.' },
  { title: 'Investing', body: 'Where should I put my money? SIP, FD, stocks, or emergency fund first?' },
  { title: 'Relocation', body: 'Does moving states make financial sense? Net income change, cost-of-living impact.' },
  { title: 'Retirement contributions', body: 'How much should I contribute? Traditional vs. Roth based on your tax situation.' },
  { title: 'Any financial decision', body: 'Describe your situation in plain words and get a structured recommendation.' }
];

const FAQS = faqSchema.mainEntity;

export default function AiMoneyCopilotPage() {
  return (
    <section className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Suspense>
        <CopilotWorkspace />
      </Suspense>

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
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">What you can decide</h2>
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
            icon="⚡"
            title="Instant recommendation"
            body="You get a useful answer in one click — no forms, no waiting. Add your numbers any time to refine it."
          />
          <TrustPoint
            icon="🔒"
            title="No data stored"
            body="Your numbers are used for calculation only. Nothing is stored on our servers or shared with anyone."
          />
          <TrustPoint
            icon="🌏"
            title="Works for US and India"
            body="Detects your region automatically. Answers use the right defaults — dollars or rupees."
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
