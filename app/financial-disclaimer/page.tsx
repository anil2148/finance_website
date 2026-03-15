import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

const pageUrl = 'https://www.financesphere.io/financial-disclaimer';

export const metadata: Metadata = {
  title: 'Financial Disclaimer',
  description: 'FinanceSphere content is educational and informational only, not financial, legal, tax, or investment advice.',
  alternates: {
    canonical: pageUrl
  }
};

export default function FinancialDisclaimerPage() {
  return (
    <LegalPageLayout
      title="Financial Disclaimer"
      description="FinanceSphere provides informational content only and does not offer personalized professional advice."
      lastUpdated="March 15, 2026"
    >
      <h2>Informational Use Only</h2>
      <p>
        FinanceSphere content, calculators, and product comparisons are provided for general educational purposes and are not guaranteed to apply to your
        individual circumstances.
      </p>

      <h2>Not Professional Advice</h2>
      <ul>
        <li>Nothing on this website constitutes financial advice.</li>
        <li>Nothing on this website constitutes legal advice.</li>
        <li>Nothing on this website constitutes tax advice.</li>
        <li>Nothing on this website constitutes investment advice.</li>
      </ul>

      <h2>Consult Licensed Professionals</h2>
      <p>
        Before making any financial decision, consult qualified professionals such as a licensed financial advisor, CPA, attorney, or tax specialist. Product
        rates, eligibility criteria, and terms can change at any time and should be verified directly with providers.
      </p>
    </LegalPageLayout>
  );
}
