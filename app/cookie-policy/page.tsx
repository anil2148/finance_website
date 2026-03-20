import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

const pageUrl = 'https://financesphere.io/cookie-policy';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Understand how FinanceSphere uses cookies for essential functionality, analytics, and affiliate attribution.',
  alternates: {
    canonical: pageUrl
  }
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
        <li><strong>Affiliate tracking cookies:</strong> used by affiliate networks to attribute referrals from FinanceSphere.</li>
      </ul>

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
