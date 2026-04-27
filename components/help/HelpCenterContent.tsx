'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useRegion } from '@/components/providers/RegionProvider';
import { getTerm } from '@/lib/finance-terminology';

type HelpItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  steps?: string[];
  links?: Array<{ href: string; label: string }>;
};

const helpTopics: HelpItem[] = [
  {
    id: 'start-fast',
    category: 'Getting Started',
    title: 'How should I start using FinanceSphere?',
    summary:
      'Begin with your immediate financial question, then choose the matching calculator or comparison page. FinanceSphere is built for scenario planning, so changing a few inputs can quickly reveal your best next move.',
    steps: [
      'Open the calculators hub and choose a tool tied to your goal (debt, mortgage, retirement, or savings).',
      'Use the comparison page to evaluate offers after you understand your budget and payoff timeline.',
      'Read blog explainers to understand trade-offs before committing to any product.'
    ],
    links: [
      { href: '/calculators', label: 'Browse all calculators' },
      { href: '/comparison', label: 'Compare financial products' },
      { href: '/blog', label: 'Read practical finance guides' }
    ]
  },
  {
    id: 'choose-calculator',
    category: 'Tool Guidance',
    title: 'Which calculator should I use for my goal?',
    summary:
      'Each calculator solves a different decision: monthly affordability, total borrowing cost, savings pace, or long-term growth. Choosing the right one helps you avoid misleading assumptions.',
    steps: [
      'Use mortgage/loan calculators for monthly payment and total interest estimates.',
      'Use debt payoff tools when you want a timeline and interest savings from extra payments.',
      'Use retirement/FIRE/investment calculators for long-term planning and contribution targets.'
    ],
    links: [
      { href: '/calculators/mortgage-calculator', label: 'Mortgage calculator' },
      { href: '/calculators/debt-payoff-calculator', label: 'Debt payoff calculator' },
      { href: '/calculators/investment-growth-calculator', label: 'Investment growth calculator' },
      { href: '/calculators/fire-calculator', label: 'FIRE calculator' }
    ]
  },
  {
    id: 'comparison-usage',
    category: 'Tool Guidance',
    title: 'How do product comparisons work?',
    summary:
      'Comparison pages provide evaluation frameworks (not live ranked offers). Use them to shortlist options by costs, constraints, and support quality before visiting provider sites.',
    steps: [
      'Choose a category and identify your non-negotiables (budget limit, timeline, support needs).',
      'Use the framework rows to compare best-fit use cases, limitations, and when-to-avoid conditions.',
      'Run a calculator scenario so your shortlist matches your own numbers.'
    ],
    links: [
      { href: '/comparison', label: 'Open the comparison engine' },
      { href: '/best-credit-cards-2026', label: 'Best credit cards page' },
      { href: '/best-savings-accounts-usa', label: 'Best savings accounts page' }
    ]
  },
  {
    id: 'common-results',
    category: 'Common Problems',
    title: 'Why do my calculator results look different than a lender quote?',
    summary:
      'Tools are planning estimates. Real lender quotes include underwriting, credit profile, taxes, insurance, and fee details. Use calculator outputs as a decision range rather than a guaranteed quote.',
    steps: [
      'Confirm your interest rate, term length, and monthly contribution assumptions.',
      'Update taxes/fees where applicable and rerun scenarios for best/worst case ranges.',
      'Compare estimates against live offers to validate affordability and cost.'
    ],
    links: [
      { href: '/financial-disclaimer', label: 'Read our financial disclaimer' },
      { href: '/compare/mortgage-rate-comparison', label: 'Check mortgage rate comparisons' }
    ]
  },
  {
    id: 'access-subscription',
    category: 'Account & Access',
    title: 'Do I need an account or subscription?',
    summary:
      'Most tools and guides are available without a paid subscription. If pages load unexpectedly or preferences reset, it is usually a browser or cookie issue, not a locked plan.',
    steps: [
      'Refresh your page and verify your browser allows essential cookies.',
      'Try a private window to isolate extensions that may block scripts.',
      'If problems continue, send page URL + device details to support for quick troubleshooting.'
    ],
    links: [
      { href: '/cookie-policy', label: 'Cookie policy' },
      { href: '/contact', label: 'Contact support' }
    ]
  },
  {
    id: 'content-navigation',
    category: 'Content Navigation',
    title: 'Where should I go for finance and investing education?',
    summary:
      'Use the blog for explainers and decision frameworks, then return to tools to model your exact numbers. This workflow keeps strategy and math aligned.',
    steps: [
      'Start with blog category pages for topic-focused reading paths.',
      'Use related calculators linked inside article pages to test your assumptions.',
      'Review legal and disclosure pages if you want methodology and partner details.'
    ],
    links: [
      { href: '/blog', label: 'FinanceSphere Blog' },
      { href: '/tools', label: 'Tools overview' },
      { href: '/affiliate-disclosure', label: 'Affiliate disclosure' },
      { href: '/about', label: 'About FinanceSphere' }
    ]
  }
];

const quickFaq = [
  {
    q: 'Are FinanceSphere calculators free to use?',
    a: 'Yes—core calculators and educational guides are accessible without a paid plan.'
  },
  {
    q: 'Can I rely on this site for personalized financial advice?',
    a: 'FinanceSphere provides educational estimates and comparisons. Use it for planning, then confirm decisions with professionals when needed.'
  },
  {
    q: 'How often are comparison frameworks and guides updated?',
    a: 'Major pages are refreshed when assumptions, product constraints, or user workflow guidance materially changes; last-updated context appears on key pages.'
  }
];

export function HelpCenterContent() {
  const [query, setQuery] = useState('');
  const { region } = useRegion();
  const mortgageTerm = getTerm('mortgage', region);
  const checkingAccountTerm = getTerm('checking_account', region);
  const taxBracketTerm = getTerm('tax_bracket', region);

  const localizedTopics = useMemo(
    () =>
      helpTopics.map((topic) => ({
        ...topic,
        summary: topic.summary
          .replaceAll('mortgage', mortgageTerm.toLowerCase())
          .replaceAll('tax brackets', taxBracketTerm.toLowerCase()),
        steps: topic.steps?.map((step) =>
          step
            .replaceAll('mortgage', mortgageTerm.toLowerCase())
            .replaceAll('checking account', checkingAccountTerm.toLowerCase())
        ),
        links: topic.links?.map((link) => ({
          ...link,
          label: link.label.replaceAll('Mortgage', mortgageTerm)
        }))
      })),
    [checkingAccountTerm, mortgageTerm, taxBracketTerm]
  );

  const filteredTopics = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return localizedTopics;

    return localizedTopics.filter((topic) => {
      const searchable = [
        topic.category,
        topic.title,
        topic.summary,
        ...(topic.steps ?? []),
        ...(topic.links?.map((item) => item.label) ?? [])
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(normalized);
    });
  }, [localizedTopics, query]);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="space-y-4">
            <p className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
              FinanceSphere Help Center
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Find fast answers for tools, comparisons, and finance guides</h1>
            <p className="max-w-2xl text-sm text-blue-100 sm:text-base">
              Search by topic, open step-by-step fixes, and jump directly to calculators, comparisons, or learning resources that solve your question.
            </p>
            <label htmlFor="help-topic-search" className="sr-only">
              Search help topics
            </label>
            <input
              id="help-topic-search"
              type="search"
              className="input border-white/20 bg-white/10 text-white placeholder:text-blue-200 focus:border-white"
              placeholder={`Search: ${mortgageTerm.toLowerCase()} calculator, comparison filters, debt payoff...`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="mx-auto w-full max-w-sm">
            <Image
              src="/images/help-center-illustration.svg"
              alt="Illustration of a support dashboard with financial charts and checklists"
              width={420}
              height={320}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </Card>

      <section className="space-y-4" aria-labelledby="help-topic-results-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="help-topic-results-heading" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Help topics
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{filteredTopics.length} topic{filteredTopics.length === 1 ? '' : 's'} shown</p>
        </div>

        {filteredTopics.length === 0 ? (
          <Card>
            <h3 className="text-lg font-semibold">No exact match yet</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Try searching broad terms like “calculators”, “comparison”, “rates”, or “support”.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTopics.map((topic) => (
              <Card key={topic.id} className="h-full space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{topic.category}</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{topic.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{topic.summary}</p>

                {topic.steps && (
                  <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700 marker:font-semibold marker:text-slate-500 dark:text-slate-200">
                    {topic.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}

                {topic.links && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {topic.links.map((link) => (
                      <Link
                        key={`${topic.id}-${link.href}`}
                        href={link.href}
                        className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-200"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="help-faq-heading">
        <h2 id="help-faq-heading" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="grid gap-3">
          {quickFaq.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <summary className="cursor-pointer list-none pr-8 text-sm font-semibold text-slate-900 marker:content-none dark:text-slate-100">
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Report a content issue quickly</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">If a guide feels outdated, unclear, or inconsistent with calculator behavior, include this in your message so we can investigate faster.</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Page URL and section heading.</li>
          <li>What you expected versus what you saw.</li>
          <li>Any calculator inputs used (if relevant).</li>
        </ul>
      </section>

      <Card className="border-slate-200/90 bg-white/90">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Still need help?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              If your question is specific to a calculator scenario, article, or comparison page, contact our team and include the page URL so we can troubleshoot faster.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Contact support
              </Link>
              <Link href="/media-kit" className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-200">
                Partnerships & media kit
              </Link>
            </div>
          </div>
          <Image
            src="/images/contact-support-illustration.svg"
            alt="Support team illustration with email and chat icons"
            width={360}
            height={250}
            className="mx-auto h-auto w-full max-w-xs"
          />
        </div>
      </Card>
    </div>
  );
}
