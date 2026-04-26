import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      'en-US': absoluteUrl('/?region=us'),
      'en-IN': absoluteUrl('/?region=in'),
      'x-default': absoluteUrl('/')
    }
  }
};

export default function IndiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
