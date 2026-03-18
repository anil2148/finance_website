import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description: 'Learn how FinanceSphere researches, reviews, and updates content to maintain accuracy and editorial independence.',
  alternates: { canonical: 'https://www.financesphere.io/editorial-policy' }
};

export default function EditorialPolicyPage() {
  return (
    <LegalPageLayout title="Editorial Policy" description="How we create trustworthy finance content." lastUpdated="March 18, 2026">
      <h2>Our standards</h2>
      <ul>
        <li>Content is written by specialists with personal finance or product analysis experience.</li>
        <li>Pages are reviewed by a second editor for factual accuracy and disclosure compliance.</li>
        <li>Pages are refreshed whenever rates, fees, or issuer terms materially change.</li>
      </ul>
      <h2>Research and scoring</h2>
      <p>Product comparisons are scored using value, costs, features, and user-fit. We include trade-offs instead of one-size-fits-all recommendations.</p>
      <h2>Corrections policy</h2>
      <p>If we identify a material error, we update the content and revise the &quot;Last updated&quot; date. Readers can report issues via our contact page.</p>
    </LegalPageLayout>
  );
}
