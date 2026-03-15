import '@/styles/globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { PageTransition } from '@/components/ui/PageTransition';
import { PreferenceProvider } from '@/components/providers/PreferenceProvider';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ErrorMonitoring } from '@/components/monitoring/ErrorMonitoring';

const siteUrl = 'https://financesphere.io';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {gaMeasurementId && (
          <>
            {/* Analytics: GA4 global script for page views + event tracking support. */}
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga4-script" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaMeasurementId}', { send_page_view: true });`}
            </Script>
          </>
        )}

        {gtmId && (
          // Analytics: optional GTM container for centralized marketing tags.
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}

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
