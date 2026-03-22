import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Review FinanceSphere terms for site usage, intellectual property, affiliate disclaimers, and legal limitations.',
  alternates: { canonical: '/terms-and-conditions' }
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="By using FinanceSphere, you agree to these terms governing website access, content usage, and legal limitations."
      lastUpdated="March 15, 2026"
    >
      <h2>Content Usage Guidelines</h2>
      <ul>
        <li>You may use FinanceSphere for personal, non-commercial informational purposes.</li>
        <li>You may not scrape, republish, or redistribute site content without written permission.</li>
        <li>You agree not to misuse forms, calculators, or any feature in ways that disrupt service availability.</li>
      </ul>

      <h2>Intellectual Property Rights</h2>
      <p>
        All FinanceSphere content, branding, calculators, graphics, and editorial materials are owned by FinanceSphere or licensed to us and are protected by
        intellectual property laws.
      </p>

      <h2>Affiliate Link Disclaimer</h2>
      <p>
        Some links on FinanceSphere are affiliate links. If you click and complete qualifying actions, we may earn a commission. This does not increase your
        price and helps support free tools and educational content.
      </p>

      <h2>Limitation of Liability</h2>
      <ul>
        <li>FinanceSphere provides content on an “as-is” and “as-available” basis.</li>
        <li>We do not guarantee completeness, accuracy, or fitness for a specific purpose.</li>
        <li>To the maximum extent permitted by law, FinanceSphere is not liable for direct, indirect, incidental, or consequential damages.</li>
      </ul>

      <h2>Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any dispute arising from these Terms is
        subject to the exclusive jurisdiction of courts located in San Francisco County, California.
      </p>
    </LegalPageLayout>
  );
}
