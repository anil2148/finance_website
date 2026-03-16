import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Legal Notice | Financesphere.io™',
  description: 'Trademark and intellectual property notice for Financesphere.io™.'
};

export default function LegalPage() {
  return (
    <LegalPageLayout
      title="Trademark Notice"
      description="Brand and intellectual property notice for Financesphere.io™."
      lastUpdated="January 1, 2026"
    >
      <p>
        Financesphere.io™, its logo, favicon, branding elements, and site content are the intellectual property of
        Financesphere.io and may not be copied, reproduced, distributed, or used without permission.
      </p>
    </LegalPageLayout>
  );
}
