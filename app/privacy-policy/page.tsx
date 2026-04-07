import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how FinanceSphere collects, uses, and protects data including cookies, analytics, and affiliate tracking information.',
  alternates: { canonical: '/privacy-policy' }
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="This Privacy Policy explains what information FinanceSphere collects, how we use it, and your rights under applicable privacy laws including GDPR and CCPA."
      lastUpdated="March 15, 2026"
    >
      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Usage data:</strong> pages viewed, session duration, referring URLs, and on-site interactions.</li>
        <li><strong>Device and network data:</strong> IP address, browser type, approximate location, device identifiers, and operating system.</li>
        <li><strong>Cookie data:</strong> essential cookies, analytics cookies, and affiliate attribution cookies (when consented).</li>
        <li><strong>Voluntary submissions:</strong> name and email when you subscribe to newsletters or contact us.</li>
      </ul>
      <h2>How We Use Data</h2>
      <ul>
        <li>Operate, secure, and improve the FinanceSphere website.</li>
        <li>Measure content performance and improve user experience through analytics.</li>
        <li>Attribute affiliate referrals and assess partner performance when non-essential cookies are accepted.</li>
        <li>Respond to support requests and send optional newsletters you sign up for.</li>
        <li>Comply with legal obligations and enforce site policies.</li>
      </ul>
      <h2>Cookie Notice</h2>
      <p>FinanceSphere uses the following cookie categories:</p>
      <ul>
        <li><strong>Essential cookies:</strong> required for basic site functionality and security.</li>
        <li><strong>Analytics cookies:</strong> used to understand site traffic and user behavior patterns.</li>
        <li><strong>Affiliate tracking cookies:</strong> used to credit FinanceSphere when users engage with partner links.</li>
      </ul>
      <p>You can disable cookies through browser settings and reject non-essential cookies in our consent banner. Blocking some cookies may impact specific features.</p>
      <h2>Third-Party Advertising (Google AdSense)</h2>
      <p>
        FinanceSphere uses Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of
        advertising cookies enables it and its partners to serve ads based on your visits to this site and/or other sites on the internet.
      </p>
      <p>
        Google may use the DoubleClick DART cookie to serve relevant ads to users based on their visit to FinanceSphere and other sites on the internet. Users
        may opt out of the use of the DART cookie by visiting the{' '}
        <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">Google Ads Settings page</a>.
        Alternatively, you can opt out of third-party vendor use of cookies by visiting the{' '}
        <a href="https://optout.networkadvertising.org" rel="noopener noreferrer" target="_blank">Network Advertising Initiative opt-out page</a>.
      </p>
      <p>
        For more information on how Google collects and uses data, please review{' '}
        <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Google's Privacy Policy</a> and{' '}
        <a href="https://policies.google.com/technologies/ads" rel="noopener noreferrer" target="_blank">Google's Advertising Policies</a>.
      </p>

      <h2>Third-Party Sharing</h2>
      <ul>
        <li>Analytics providers to report anonymized usage trends.</li>
        <li>Advertising partners (including Google AdSense) to serve relevant display advertisements.</li>
        <li>Affiliate networks and partner platforms for referral attribution.</li>
        <li>Email service providers for newsletter delivery and confirmation flows.</li>
        <li>Legal authorities when required by law, subpoena, or valid legal process.</li>
      </ul>
      <h2>Your Privacy Rights (GDPR &amp; CCPA)</h2>
      <ul>
        <li><strong>Access:</strong> request a copy of personal data we hold about you.</li>
        <li><strong>Correction:</strong> request updates to inaccurate information.</li>
        <li><strong>Deletion:</strong> request deletion of personal information where legally permitted.</li>
        <li><strong>Restriction/Objection:</strong> object to or limit certain processing activities.</li>
        <li><strong>Data portability:</strong> request a machine-readable export when applicable.</li>
        <li><strong>CCPA rights:</strong> request disclosure, deletion, and opt-out of qualifying data sale/sharing activities.</li>
      </ul>
      <h2>Opt-Out Instructions</h2>
      <ul>
        <li>Use the cookie banner to reject non-essential cookies.</li>
        <li>Clear or block cookies from your browser privacy settings.</li>
        <li>Unsubscribe from marketing emails using the unsubscribe link in each message.</li>
        <li>Email <a href="mailto:privacy@financesphere.io">privacy@financesphere.io</a> with the subject line “Privacy Request”.</li>
      </ul>
      <h2>Contact Information</h2>
      <p>For privacy questions, contact us at <a href="mailto:privacy@financesphere.io">privacy@financesphere.io</a>.</p>
    </LegalPageLayout>
  );
}
