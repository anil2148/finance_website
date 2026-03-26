import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Editorial Policy | FinanceSphere',
  description: 'How FinanceSphere researches, writes, reviews, and updates calculators, guides, and comparison frameworks.',
  alternates: { canonical: '/editorial-policy' }
};

export default function EditorialPolicyPage() {
  return (
    <LegalPageLayout title="Editorial Policy" description="How we produce decision-first, transparent finance content." lastUpdated="March 26, 2026">
      <h2>What we publish</h2>
      <p>FinanceSphere publishes educational calculators, decision-focused guides, and comparison frameworks. We do not publish personalized financial advice or guaranteed outcomes.</p>

      <h2>Editorial workflow</h2>
      <ol>
        <li><strong>Scope:</strong> We define who a page is for, what decision it helps with, and what mistake it should prevent.</li>
        <li><strong>Research:</strong> We review provider disclosures, public documentation, and category-level terms that readers need to verify.</li>
        <li><strong>Drafting:</strong> We prioritize tradeoffs, thresholds, and practical next steps over generic definitions.</li>
        <li><strong>Second review:</strong> A separate reviewer checks clarity, factual framing, disclosures, and user-first intent.</li>
        <li><strong>Refresh:</strong> We update pages when assumptions, product terms, or user workflow relevance materially changes.</li>
      </ol>

      <h2>How examples are used</h2>
      <p>Many examples are illustrative scenario models rather than live market quotes. We label these examples clearly so readers can adapt the logic to their own numbers.</p>

      <h2>How comparison frameworks are evaluated</h2>
      <ul>
        <li>We prioritize total cost, downside risk, constraints, and user-fit before upside claims.</li>
        <li>We avoid fake precision when live market data is not available in-repo.</li>
        <li>We state coverage limitations and encourage direct provider verification before action.</li>
      </ul>

      <h2>Corrections and feedback</h2>
      <p>If you spot an issue, contact us at <a href="mailto:support@financesphere.io">support@financesphere.io</a> with the page URL and concern. Material corrections update on-page copy and the last-updated date.</p>
    </LegalPageLayout>
  );
}
