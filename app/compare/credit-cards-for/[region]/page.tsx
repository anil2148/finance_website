import type { Metadata } from 'next';
import Link from 'next/link';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

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
  const data = regionCopy[params.region] ?? { title: `Best Credit Cards for ${params.region}`, intro: 'Location-aware credit card comparison.', bestFor: 'Local card shoppers' };
  return {
    title: `${data.title} (2026) | FinanceSphere`,
    description: `${data.intro} Best for: ${data.bestFor}.`,
    alternates: { canonical: `/compare/credit-cards-for/${params.region}` }
  };
}

export default function CreditCardsByRegionPage({ params }: { params: { region: string } }) {
  const data = regionCopy[params.region] ?? { title: `Best Credit Cards for ${params.region}`, intro: 'Use this location-aware comparison to evaluate APR, fees, and rewards structures.', bestFor: 'Regional spend patterns' };

  return (
    <div className="space-y-6">
      <SeoComparisonPage
        pageTitle={data.title}
        intro={`${data.intro} Best for: ${data.bestFor}.`}
        category="credit_card"
        slug={`credit-cards-for-${params.region}`}
        faq={[
          { question: `Are there state-specific credit card rules in ${params.region}?`, answer: 'Most card terms are national, but taxes and local merchant mix can impact rewards value.' },
          { question: 'How should I compare cards?', answer: 'Compare annual fee, reward rate in your top categories, intro APR, and redemption flexibility.' }
        ]}
      />

      <div className="rounded-xl border bg-white p-4 text-sm">
        <h2 className="font-semibold">Related city and state comparisons</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.keys(regionCopy).map((region) => (
            <Link key={region} href={`/compare/credit-cards-for/${region}`} className="rounded-full border px-3 py-1 hover:bg-slate-50">{region}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
