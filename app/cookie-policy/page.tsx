import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Understand how FinanceSphere uses cookies for essential functionality, analytics, and affiliate attribution.',
  alternates: { canonical: '/cookie-policy' }
};

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="This Cookie Policy explains what cookies are and how FinanceSphere uses them for functionality, analytics, and affiliate attribution."
      lastUpdated="March 15, 2026"
    >
      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help websites remember preferences, maintain sessions, and measure
        performance.
      </p>

      <h2>Types of Cookies We Use</h2>
      <ul>
        <li><strong>Essential cookies:</strong> required for security, navigation, and baseline site functionality.</li>
        <li><strong>Analytics cookies:</strong> used to measure traffic and improve user experience.</li>
        <li><strong>Advertising cookies:</strong> used by Google AdSense and other advertising partners to serve relevant ads and measure ad performance. This includes the DoubleClick DART cookie, which enables Google to serve ads based on your visits to this and other websites.</li>
        <li><strong>Affiliate tracking cookies:</strong> used by affiliate networks to attribute referrals from FinanceSphere.</li>
      </ul>

      <h2>Advertising and Opt-Out</h2>
      <p>
        FinanceSphere works with Google AdSense to display advertising. You may opt out of personalized advertising by visiting{' '}
        <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">Google Ads Settings</a> or the{' '}
        <a href="https://optout.networkadvertising.org" rel="noopener noreferrer" target="_blank">Network Advertising Initiative opt-out page</a>.
        You can also control advertising cookies through your browser settings or our consent banner.
      </p>

      <h2>How to Disable Cookies</h2>
      <ul>
        <li>Use the FinanceSphere consent banner to reject non-essential cookies.</li>
        <li>Configure browser settings to block third-party or all cookies.</li>
        <li>Clear existing cookies in your browser privacy controls.</li>
      </ul>
      <p>If you disable all cookies, some features may not function correctly.</p>

      <h2>Sample Cookie Consent Language</h2>
      <p>
        “We use essential cookies to operate this site and optional analytics/affiliate cookies to understand usage and support our business. Click Accept to
        allow non-essential cookies or Reject to continue with essential cookies only.”
      </p>
    </LegalPageLayout>
  );
}
