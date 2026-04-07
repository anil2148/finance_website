import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'How We Make Money | FinanceSphere',
  description: 'Transparent explanation of FinanceSphere revenue sources, editorial safeguards, and commercial boundaries.',
  alternates: { canonical: '/how-we-make-money' }
};

export default function HowWeMakeMoneyPage() {
  return (
    <LegalPageLayout title="How We Make Money" description="FinanceSphere monetization, in plain language." lastUpdated="March 26, 2026">
      <p>
        FinanceSphere is a free educational site. Revenue helps cover engineering, content review, and ongoing maintenance. We publish this page so readers
        can evaluate our incentives before using any comparison or calculator page.
      </p>

      <h2>Primary revenue sources</h2>
      <ul>
        <li><strong>Affiliate commissions:</strong> We may earn when readers use qualifying partner links.</li>
        <li><strong>Display advertising (Google AdSense):</strong> We use Google AdSense to serve display ads on pages. AdSense may use cookies and browsing data to show relevant ads. You can manage ad personalisation preferences via <a href="https://adssettings.google.com" rel="noopener noreferrer">Google Ad Settings</a>.</li>
        <li><strong>Sponsored placements:</strong> Used selectively and clearly labeled when present.</li>
      </ul>

      <h2>What partners cannot buy</h2>
      <ul>
        <li>Guaranteed positive language.</li>
        <li>Removal of limitation or risk notes.</li>
        <li>Hidden placement without disclosure.</li>
        <li>Suppression of &ldquo;not ideal if...&rdquo; guidance.</li>
      </ul>

      <h2>Editorial safeguards</h2>
      <ul>
        <li>Editorial standards and disclosure rules apply to monetized and non-monetized pages.</li>
        <li>Writers and reviewers are expected to prioritize user outcomes over conversion pressure.</li>
        <li>Comparison frameworks emphasize fit, downside risk, and cost structure before upside claims.</li>
        <li>Where live in-repo market data is unavailable, we publish honest frameworks instead of fake rankings.</li>
      </ul>

      <h2>How to use monetized pages safely</h2>
      <ol>
        <li>Run your own scenario first with a calculator.</li>
        <li>Shortlist two options and compare terms line-by-line.</li>
        <li>Verify current pricing and eligibility directly with provider disclosures the same day you act.</li>
      </ol>

      <h2>Questions or conflict concerns</h2>
      <p>
        If you believe a page violates our user-first standards, email <a href="mailto:support@financesphere.io">support@financesphere.io</a> with the URL
        and a short explanation.
      </p>
    </LegalPageLayout>
  );
}
