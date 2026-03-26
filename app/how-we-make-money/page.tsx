import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'How We Make Money | FinanceSphere',
  description: 'Transparent explanation of FinanceSphere revenue sources and editorial safeguards.',
  alternates: { canonical: '/how-we-make-money' }
};

export default function HowWeMakeMoneyPage() {
  return (
    <LegalPageLayout title="How We Make Money" description="FinanceSphere monetization, in plain language." lastUpdated="March 26, 2026">
      <h2>Primary revenue sources</h2>
      <ul>
        <li><strong>Affiliate commissions:</strong> We may earn when readers use qualifying partner links.</li>
        <li><strong>Advertising:</strong> Display ads may appear across educational content and tools.</li>
        <li><strong>Sponsored placements:</strong> Used selectively and always labeled.</li>
      </ul>

      <h2>Editorial safeguards</h2>
      <ul>
        <li>Editorial standards and disclosure rules apply to monetized and non-monetized pages.</li>
        <li>Writers and reviewers are expected to prioritize user outcomes over conversion pressure.</li>
        <li>We include risk notes and fit constraints, not only upside features.</li>
      </ul>

      <h2>What this means for readers</h2>
      <p>Revenue keeps tools free, but your decision quality comes first. Before acting, run a calculator scenario, compare tradeoffs, and verify provider terms directly.</p>
    </LegalPageLayout>
  );
}
