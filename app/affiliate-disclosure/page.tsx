import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Affiliate & Advertising Disclosure | FinanceSphere',
  description: 'FinanceSphere uses affiliate links to monetize content. Learn how affiliate partnerships work, where they appear, and how editorial decisions remain user-first.',
  alternates: { canonical: '/affiliate-disclosure' }
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageLayout
      title="Affiliate & Advertising Disclosure"
      description="FinanceSphere uses affiliate links to monetize content. This page explains how partnerships work and what they do not change."
      lastUpdated="April 8, 2026"
    >
      <p>
        <strong>FinanceSphere uses affiliate links to monetize content.</strong> When you click on certain links and complete a purchase or sign-up,
        we may receive a commission from the partner company. This commission does not increase the price you pay.
      </p>

      <p>
        These partnerships do not affect our editorial independence. All opinions expressed on FinanceSphere are based on research, experience, and
        analysis. We aim to provide accurate, up-to-date, and helpful information; however, we recommend that users verify details independently
        before making financial decisions.
      </p>

      <p>
        Affiliate relationships help support the operation and maintenance of this website, allowing us to continue providing free educational tools
        and content.
      </p>

      <h2>Where affiliate links may appear</h2>
      <ul>
        <li>Comparison framework pages where readers continue to provider websites.</li>
        <li>Tool or guide pages that reference external financial products.</li>
        <li>Selected modules that connect decision content to relevant product categories.</li>
        <li>Blog and guide articles that mention or review financial products and services.</li>
      </ul>

      <h2>What compensation cannot change</h2>
      <ul>
        <li>No paid guarantee of placement, ranking position, or positive language about any product.</li>
        <li>No suppression of limitations, downside risks, or fit-mismatch warnings for partner products.</li>
        <li>No substitution of marketing claims for methodology-based analysis.</li>
        <li>No removal of &ldquo;not ideal if&hellip;&rdquo; guidance or risk disclosures from any page.</li>
      </ul>

      <h2>How we protect editorial independence</h2>
      <ol>
        <li>Every comparison page includes explicit fit notes — when to choose an option and when not to.</li>
        <li>We prioritize total cost, constraints, and downside resilience over promotional highlights.</li>
        <li>Product rankings are based on evaluation criteria, not affiliate commission rates or volumes.</li>
        <li>When live market data is limited, we publish an honest framework instead of unverified rankings.</li>
      </ol>

      <h2>Advertising disclosure (Google AdSense)</h2>
      <p>
        FinanceSphere also uses Google AdSense to display third-party advertisements. These ads are served automatically based on page content and
        user interest signals. Advertising revenue does not influence editorial decisions, product rankings, or the content of any article.
      </p>
      <p>
        You can manage ad personalisation preferences via{' '}
        <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">Google Ad Settings</a>.
      </p>

      <h2>Coverage limitations</h2>
      <p>
        FinanceSphere is not a complete market directory. Some providers are not included, and product terms change frequently. Always verify final
        rates, fees, and eligibility directly with providers before making any financial decision.
      </p>

      <h2>Questions about a specific page</h2>
      <p>
        If you are unsure whether a link is affiliate-based, or if you believe a page lacks disclosure clarity, contact{' '}
        <a href="mailto:support@financesphere.io">support@financesphere.io</a> with the page URL. We review all feedback as part of our ongoing
        content quality process.
      </p>
    </LegalPageLayout>
  );
}
