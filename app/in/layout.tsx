import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    languages: {
      'en-US': '/',
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
      <div className="india-content editorial-content">{children}</div>
    </>
  );
}
