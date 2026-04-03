import type { Metadata } from 'next';
import { IndiaDecisionEngineGlobal } from '@/components/india/IndiaDecisionEngineGlobal';
import { IndiaPageEssentials } from '@/components/india/IndiaPageEssentials';

export const metadata: Metadata = {
  alternates: {
    languages: {
      'en-US': '/us',
      'en-IN': '/in'
    }
  },
  other: {
    country: 'IN',
    currency: 'INR'
  }
};

export default function IndiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedRegion',
            name: 'India',
            addressCountry: 'IN',
            currency: 'INR'
          })
        }}
      />
      {children}
      <IndiaPageEssentials />
      <IndiaDecisionEngineGlobal />
    </>
  );
}
