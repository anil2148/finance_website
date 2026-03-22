import { HomepageLayout } from '@/components/home/HomepageLayout';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/')
  },
  openGraph: {
    url: absoluteUrl('/')
  }
};

export default function HomePage() {
  return <HomepageLayout />;
}
