import type { Metadata } from 'next';
import { HelpCenterContent } from '@/components/help/HelpCenterContent';

export const metadata: Metadata = {
  title: 'Help Center | FinanceSphere Support for Calculators, Comparisons, and Guides',
  description:
    'Get support for FinanceSphere calculators, comparisons, and finance guides. Find FAQs, troubleshooting tips, and direct links to the right tools and pages.',
  alternates: { canonical: '/help' }
};

export default function HelpPage() {
  return (
    <section className="space-y-6">
      <HelpCenterContent />
    </section>
  );
}
