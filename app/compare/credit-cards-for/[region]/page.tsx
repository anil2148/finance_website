import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';
import { isCanonicalRouteSlug, normalizeRouteSlug } from '@/lib/routeSlug';

const regionCopy: Record<string, { title: string; intro: string; bestFor: string }> = {
  california: {
    title: 'Best Credit Cards for California',
    intro: 'We compared cards for Californians prioritizing gas, grocery, and travel rewards while balancing APR and annual fee trade-offs.',
    bestFor: 'Commuters and frequent travelers'
  },
  texas: {
    title: 'Best Credit Cards for Texas',
    intro: 'Our Texas-focused picks balance high-spend cashback categories, sign-up bonuses, and straightforward redemption options.',
    bestFor: 'Families and everyday spending'
  },
  florida: {
    title: 'Best Credit Cards for Florida',
    intro: 'These card picks emphasize travel perks, no foreign transaction fees, and annual-fee value for frequent flyers and retirees.',
    bestFor: 'Travel rewards and seasonal spenders'
  }
};

export function generateStaticParams() {
  return Object.keys(regionCopy).map((region) => ({ region }));
}

export function generateMetadata({ params }: { params: { region: string } }): Metadata {
  const region = normalizeRouteSlug(params.region);
  const data = regionCopy[region];

  if (!data) {
    return {
      title: 'Best Credit Cards by Region | FinanceSphere',
      description: 'Compare credit cards by APR, annual fee, and reward value.',
      alternates: { canonical: '/best-credit-cards-2026' },
      robots: { index: false, follow: true }
    };
  }

  return {
    title: `${data.title} (2026) | FinanceSphere`,
    description: `${data.intro} Best for: ${data.bestFor}.`,
    alternates: { canonical: `/compare/credit-cards-for/${region}` }
  };
}

export default function CreditCardsByRegionPage({ params }: { params: { region: string } }) {
  const region = normalizeRouteSlug(params.region);
  const data = regionCopy[region];

  if (!data) {
    notFound();
  }

  if (!isCanonicalRouteSlug(params.region, region)) {
    permanentRedirect(`/compare/credit-cards-for/${region}`);
  }

  return (
    <div className="space-y-6">
      <SeoComparisonPage
        pageTitle={data.title}
        intro={`${data.intro} Best for: ${data.bestFor}.`}
        category="credit_card"
        slug={`credit-cards-for-${region}`}
        faq={[
          { question: `Are there state-specific credit card rules in ${region}?`, answer: 'Most card terms are national, but taxes and local merchant mix can impact rewards value.' },
          { question: 'How should I compare cards?', answer: 'Compare annual fee, reward rate in your top categories, intro APR, and redemption flexibility.' }
        ]}
      />

      <div className="rounded-xl border bg-white p-4 text-sm">
        <h2 className="font-semibold">Related city and state comparisons</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.keys(regionCopy).map((regionKey) => (
            <Link key={regionKey} href={`/compare/credit-cards-for/${regionKey}`} className="rounded-full border px-3 py-1 hover:bg-slate-50">{regionKey}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
