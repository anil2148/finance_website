import type { Metadata } from 'next';
import { HomepageLayout } from '@/components/home/HomepageLayout';

export const metadata: Metadata = {
  title: 'Home',
  description: 'FinanceSphere home for personal finance calculators, comparison tools, and blog resources.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'FinanceSphere Home | Smart Money Decisions',
    description: 'Start with calculators, product comparisons, and finance education resources on FinanceSphere.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinanceSphere Home | Smart Money Decisions',
    description: 'Explore calculators, tools, and comparison guides.'
  }
};

export default function HomePage() {
  return <HomepageLayout />;
}
