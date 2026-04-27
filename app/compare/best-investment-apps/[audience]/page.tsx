import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';
import { isCanonicalRouteSlug, normalizeRouteSlug } from '@/lib/routeSlug';

const audienceCopy: Record<string, { label: string; intro: string; nextStep: string }> = {
  beginners: {
    label: 'Beginners',
    intro: 'These investment apps stand out for low account minimums, easy onboarding, and educational support.',
    nextStep: 'Start with an automated portfolio and a recurring transfer.'
  },
  students: {
    label: 'Students',
    intro: 'Student-friendly apps prioritize fractional shares, low fees, and accessible mobile UX.',
    nextStep: 'Focus on fee-free diversification and long-term consistency.'
  },
  professionals: {
    label: 'Professionals',
    intro: 'For busy professionals, we prioritized tax tools, automation, and deeper portfolio analytics.',
    nextStep: 'Set auto-invest rules and review allocation quarterly.'
  }
};

export function generateStaticParams() {
  return Object.keys(audienceCopy).map((audience) => ({ audience }));
}

export function generateMetadata({ params }: { params: { audience: string } }): Metadata {
  const audience = normalizeRouteSlug(params.audience);
  const data = audienceCopy[audience];

  if (!data) {
    return {
      title: 'Compare Investment Apps | FinanceSphere',
      description: 'Compare investment apps by fees, account types, and automation features.',
      alternates: { canonical: '/best-investment-apps' },
      robots: { index: false, follow: true }
    };
  }

  return {
    title: `Best Investment Apps for ${data.label} | FinanceSphere`,
    description: `${data.intro} ${data.nextStep}`,
    alternates: { canonical: `/compare/best-investment-apps/${audience}` }
  };
}

export default function AudienceInvestmentAppsPage({ params }: { params: { audience: string } }) {
  const audience = normalizeRouteSlug(params.audience);
  const data = audienceCopy[audience];

  if (!data) {
    notFound();
  }

  if (!isCanonicalRouteSlug(params.audience, audience)) {
    permanentRedirect(`/compare/best-investment-apps/${audience}`);
  }

  return (
    <div className="space-y-6">
      <SeoComparisonPage
        pageTitle={`Best Investment Apps for ${data.label}`}
        intro={`${data.intro} ${data.nextStep}`}
        category="investment_app"
        slug={`investment-apps-${audience}`}
        faq={[
          { question: 'What fee should I prioritize?', answer: 'Start with total annual cost, then compare advisory fees and fund expense ratios.' },
          { question: 'How often should I contribute?', answer: 'Automating weekly or monthly contributions can smooth volatility and build discipline.' }
        ]}
      />

      <div className="rounded-xl border bg-white p-4 text-sm">
        <h2 className="font-semibold">Audience segments</h2>
        <p className="mt-2 text-slate-600">Browse personalized app picks for common investor profiles.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.keys(audienceCopy).map((audienceKey) => (
            <Link key={audienceKey} href={`/compare/best-investment-apps/${audienceKey}`} className="rounded-full border px-3 py-1 hover:bg-slate-50">{audienceKey}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
