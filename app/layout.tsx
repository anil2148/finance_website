import '@/styles/globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { PageTransition } from '@/components/ui/PageTransition';
import { PreferenceProvider } from '@/components/providers/PreferenceProvider';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ErrorMonitoring } from '@/components/monitoring/ErrorMonitoring';
import { CookieConsentBanner } from '@/components/cookies/CookieConsentBanner';

const siteUrl = 'https://financesphere.io';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.financesphere.io'),
  title: {
    default: 'FinanceSphere | Personal Finance Calculators, Tools & Comparisons',
    template: '%s | FinanceSphere'
  },
  description: 'FinanceSphere helps you compare financial products, run calculators, and read practical personal finance guides.',
  alternates: {
    canonical: '/'
  },
  verification: {
    // SEO: Google Search Console verification is configurable with an environment variable.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  },
  openGraph: {
    title: 'FinanceSphere | Personal Finance Calculators, Tools & Comparisons',
    description: 'Compare financial products, use interactive calculators, and grow your money knowledge with FinanceSphere.',
    type: 'website',
    url: siteUrl,
    siteName: 'FinanceSphere'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinanceSphere | Personal Finance Calculators, Tools & Comparisons',
    description: 'Compare products, run calculators, and read practical personal finance guides.'
  },
  other: {
    'google-adsense-account': 'ca-pub-9445870262181780'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9445870262181780"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <CookieConsentBanner gaMeasurementId={gaMeasurementId} gtmId={gtmId} />

        <PreferenceProvider>
          <ErrorMonitoring />
          <Navbar />
          <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
            <Breadcrumbs />
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </PreferenceProvider>
      </body>
    </html>
  );
}
