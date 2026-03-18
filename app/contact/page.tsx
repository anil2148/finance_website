import type { Metadata } from 'next';
import { ContactPageContent } from '@/components/contact/ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact FinanceSphere | Support, Feedback, and Partnerships',
  description:
    'Contact the FinanceSphere team for calculator help, editorial feedback, partnership inquiries, and support requests. Typical response time: 1–2 business days.',
  alternates: { canonical: '/contact' }
};

export default function ContactPage() {
  return <ContactPageContent />;
}
