import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

const pageUrl = 'https://financesphere.io/affiliate-disclosure';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'Read FinanceSphere affiliate disclosure and FTC-compliant commission transparency statement.',
  alternates: {
    canonical: pageUrl
  }
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageLayout
      title="Affiliate Disclosure"
      description="Transparency matters. This page explains how affiliate relationships support FinanceSphere."
      lastUpdated="March 15, 2026"
    >
      <p>
        <strong>
          FinanceSphere participates in affiliate marketing programs and may earn commissions when you click certain links and complete qualifying actions.
          This compensation does not increase the price you pay.
        </strong>
      </p>

      <h2>How Affiliate Links Work</h2>
      <ul>
        <li>Some recommendations include links to financial products offered by partner companies.</li>
        <li>When you click an affiliate link, a tracking mechanism may attribute the referral to FinanceSphere.</li>
        <li>Compensation helps us keep calculators, comparisons, and educational resources free for readers.</li>
      </ul>

      <h2>Editorial Integrity</h2>
      <ul>
        <li>Our editorial process aims to prioritize relevance, value, and user outcomes.</li>
        <li>Partnerships do not guarantee favorable coverage.</li>
        <li>Not every provider or offer is included on FinanceSphere.</li>
      </ul>

      <h2>Sample FTC Compliance Language</h2>
      <p>
        “FinanceSphere may receive compensation from partners listed on this page. Compensation may influence how and where offers appear, but does not affect
        our editorial evaluations. We recommend products based on usefulness and audience fit.”
      </p>
    </LegalPageLayout>
  );
}
