import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | FinanceSphere',
  description: 'Clear explanation of FinanceSphere affiliate relationships and how editorial decisions remain user-first.',
  alternates: { canonical: '/affiliate-disclosure' }
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageLayout
      title="Affiliate Disclosure"
      description="How affiliate partnerships work on FinanceSphere and what they do not change."
      lastUpdated="March 26, 2026"
    >
      <p><strong>Some links on FinanceSphere are affiliate links.</strong> If you click a partner link and complete a qualifying action, we may earn a commission. This does not increase the price you pay.</p>

      <h2>What affiliate compensation can and cannot do</h2>
      <ul>
        <li>It can help fund calculators, editorial operations, and ongoing site maintenance.</li>
        <li>It cannot buy favorable language, guaranteed placement, or hidden endorsements.</li>
        <li>It does not override our requirement to show limitations and fit-mismatch risks.</li>
      </ul>

      <h2>User-first commitment</h2>
      <ul>
        <li>We aim to help readers make better decisions, even when that means delaying an application.</li>
        <li>We include &ldquo;when not to choose&rdquo; guidance where relevant.</li>
        <li>We do not publish fake reviews, fake rates, or fictional product rankings.</li>
      </ul>

      <h2>Coverage limitations</h2>
      <p>FinanceSphere is not a complete market directory. Some providers are not included. Always compare multiple sources and verify final terms directly with the provider.</p>
    </LegalPageLayout>
  );
}
