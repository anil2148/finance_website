import type { Metadata } from 'next';

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
      <p className="mt-8 text-xs text-slate-500">
        Updated for FY 2025–26 India. Written by Anil Chowdhary — Lead Software Engineer building data-driven finance tools. References: Reserve Bank of India (RBI) and Income Tax Department India.
      </p>
    </>
  );
}
