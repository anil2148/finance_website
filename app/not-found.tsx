import type { Metadata } from 'next';
import { NotFoundClient } from '@/components/routing/NotFoundClient';

export const metadata: Metadata = {
  title: '404 | FinanceSphere',
  description: 'The requested FinanceSphere page was not found.',
  robots: {
    index: false,
    follow: false
  }
};

export default function NotFound() {
  return <NotFoundClient />;
}
