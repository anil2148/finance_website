import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Financial Disclaimer | FinanceSphere',
  description: 'FinanceSphere content is educational and informational only, not financial, legal, tax, or investment advice.',
  alternates: { canonical: '/financial-disclaimer' }
};

export default function FinancialDisclaimerPage() {
  return (
    <LegalPageLayout
      title="Financial Disclaimer"
      description="FinanceSphere provides educational content and scenario tools, not personalized professional advice."
      lastUpdated="March 26, 2026"
    >
      <h2>Educational use only</h2>
      <p>
        FinanceSphere content, calculators, and comparison frameworks are built for planning and education. Outputs are scenario estimates and may not match
        provider-specific underwriting, fees, or eligibility outcomes.
      </p>

      <h2>Not personalized professional advice</h2>
      <ul>
        <li>Nothing on this website is individualized financial advice.</li>
        <li>Nothing on this website is legal advice.</li>
        <li>Nothing on this website is tax advice.</li>
        <li>Nothing on this website is investment advice.</li>
      </ul>

      <h2>Illustrative examples</h2>
      <p>
        Many articles include illustrative ranges (for example, payment, savings, or contribution scenarios). They are used to explain decision logic, not to
        predict your exact result.
      </p>

      <h2>What to verify before acting</h2>
      <ol>
        <li>Current rates, fees, and account terms directly with the provider.</li>
        <li>Your eligibility and underwriting constraints.</li>
        <li>Tax consequences with a qualified professional when relevant.</li>
      </ol>

      <h2>Professional guidance</h2>
      <p>
        Before major financial decisions, consult qualified professionals such as a licensed advisor, CPA, attorney, or tax specialist. Use FinanceSphere as
        a decision support layer, not a substitute for individualized advice.
      </p>
    </LegalPageLayout>
  );
}
