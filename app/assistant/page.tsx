import type { Metadata } from 'next';
import { AssistantPageClient } from './AssistantPageClient';

export const metadata: Metadata = {
  title: 'FinanceSphere Assistant',
  description: 'Private assistant workspace for FinanceSphere decision support.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/assistant' }
};

export default function AssistantPage() {
  return <AssistantPageClient />;
}
