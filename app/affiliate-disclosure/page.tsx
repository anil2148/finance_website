import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | FinanceSphere',
  description: 'How FinanceSphere affiliate relationships work, where they appear, and how editorial decisions remain user-first.',
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

      <h2>Where affiliate links may appear</h2>
      <ul>
        <li>Comparison framework pages where readers continue to provider websites.</li>
        <li>Tool or guide pages that reference external products.</li>
        <li>Selected internal modules that connect decision content to product categories.</li>
      </ul>

      <h2>What compensation cannot change</h2>
      <ul>
        <li>No paid guarantee of placement, ranking position, or positive language.</li>
        <li>No suppression of limitations, downside risks, or fit-mismatch warnings.</li>
        <li>No substitution of marketing claims for methodology-based analysis.</li>
      </ul>

      <h2>How we protect user-first decisions</h2>
      <ol>
        <li>We require clear fit notes (when to choose, when not to choose).</li>
        <li>We prioritize total cost, constraints, and downside resilience over promotional highlights.</li>
        <li>When live in-repo product data is limited, we publish an honest framework instead of fake precision.</li>
      </ol>

      <h2>Coverage limitations</h2>
      <p>FinanceSphere is not a complete market directory. Some providers are not included, and terms can change quickly. Always verify final rates, fees, and eligibility directly with providers before acting.</p>

      <h2>Questions about a specific page</h2>
      <p>If you are unsure whether a link is affiliate-based or believe a page lacks disclosure clarity, contact <a href="mailto:support@financesphere.io">support@financesphere.io</a> with the page URL.</p>
    </LegalPageLayout>
  );
}
