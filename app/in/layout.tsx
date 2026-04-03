import type { Metadata } from 'next';
import { IndiaDecisionEngineGlobal } from '@/components/india/IndiaDecisionEngineGlobal';

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
      <section className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="font-semibold text-slate-900 dark:text-slate-100">This India page tells you what to do with your money for FY 2025–26.</p>
        <p className="mt-1 text-slate-700 dark:text-slate-300">It is for users choosing between tax, investing, debt, and home-loan decisions with clear scenario rules.</p>
      </section>
      {children}
      <IndiaDecisionEngineGlobal />
      <p className="mt-8 text-xs text-slate-500">
        Updated for FY 2025–26 India. Written by Anil Chowdhary — Lead Software Engineer building data-driven finance tools. References: Reserve Bank of India (RBI) and Income Tax Department India.
      </p>
    </>
  );
}
