import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'How We Make Money',
  description: 'FinanceSphere revenue model, including affiliate partnerships, advertising, and sponsored placements.',
  alternates: { canonical: '/how-we-make-money' }
};

export default function HowWeMakeMoneyPage() {
  return (
    <LegalPageLayout title="How We Make Money" description="Full transparency on FinanceSphere monetization." lastUpdated="March 18, 2026">
      <h2>Revenue channels</h2>
      <ul>
        <li>Affiliate commissions when readers click a tracked offer and complete qualifying actions.</li>
        <li>Advertising placements that help fund calculators, tools, and research operations.</li>
        <li>Occasional sponsored placements clearly labeled on-page.</li>
      </ul>
      <h2>What does not change</h2>
      <ul>
        <li>Compensation does not guarantee favorable rankings.</li>
        <li>Editorial and compliance reviewers can reject sponsored language that is misleading.</li>
        <li>We prioritize total user value over payout size.</li>
      </ul>
    </LegalPageLayout>
  );
}
