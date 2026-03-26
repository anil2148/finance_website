import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Editorial Policy | FinanceSphere',
  description: 'How FinanceSphere researches, writes, reviews, updates, and corrects calculators, guides, and comparison frameworks.',
  alternates: { canonical: '/editorial-policy' }
};

export default function EditorialPolicyPage() {
  return (
    <LegalPageLayout title="Editorial Policy" description="How we produce decision-first, transparent finance content." lastUpdated="March 26, 2026">
      <h2>What we publish</h2>
      <p>FinanceSphere publishes educational calculators, scenario-based guides, and methodology-first comparison frameworks. We do not publish personalized financial advice, guaranteed outcomes, or fake provider rankings.</p>

      <h2>Editorial standard for every page</h2>
      <ul>
        <li>Clearly define who the page is for and what decision it helps with.</li>
        <li>Show tradeoffs and failure modes, not only upside cases.</li>
        <li>Use realistic, clearly labeled illustrative examples when live data is unavailable.</li>
        <li>Provide practical next steps (calculator, framework, or checklist), not generic wrap-up copy.</li>
      </ul>

      <h2>Research and source hierarchy</h2>
      <ol>
        <li><strong>Primary references:</strong> provider disclosures, account terms, and official product documentation.</li>
        <li><strong>Regulatory references:</strong> official agency resources where relevant (for rules, consumer protections, or definitions).</li>
        <li><strong>Internal modeling:</strong> calculator logic and scenario assumptions used to test decision paths.</li>
      </ol>
      <p>When current market-level values are not available in-repo, we explicitly frame content as a comparison process rather than a live ranking.</p>

      <h2>Review workflow</h2>
      <ol>
        <li><strong>Scope pass:</strong> identify decision context, common mistakes, and intended reader constraints.</li>
        <li><strong>Draft pass:</strong> produce guidance with specific thresholds, tradeoffs, and implementation steps.</li>
        <li><strong>Second review:</strong> check factual framing, disclosure clarity, internal links, and readability.</li>
        <li><strong>Publication check:</strong> verify route integrity and consistency with trust/disclosure requirements.</li>
      </ol>

      <h2>Examples, assumptions, and limitations</h2>
      <ul>
        <li>Illustrative examples are educational models, not quotes or promises.</li>
        <li>Outputs depend on user inputs and assumptions.</li>
        <li>Where coverage is partial, we label the limitation clearly.</li>
      </ul>

      <h2>Update cadence and corrections</h2>
      <p>We refresh pages when assumptions, product constraints, or decision workflows materially change. Material corrections update page copy and the visible last-updated date.</p>
      <p>If you spot a potential issue, email <a href="mailto:support@financesphere.io">support@financesphere.io</a> with the page URL and concern. We prioritize issues that could change user decisions.</p>
    </LegalPageLayout>
  );
}
