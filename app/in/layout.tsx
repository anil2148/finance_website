import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/in'),
    languages: {
      'en-US': absoluteUrl('/us'),
      'en-IN': absoluteUrl('/in'),
      'x-default': absoluteUrl('/us')
    }
  }
};

export default function IndiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
