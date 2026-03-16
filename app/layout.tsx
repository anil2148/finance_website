import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { PageTransition } from '@/components/ui/PageTransition';
import { PreferenceProvider } from '@/components/providers/PreferenceProvider';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ErrorMonitoring } from '@/components/monitoring/ErrorMonitoring';
import { CookieConsentBanner } from '@/components/cookies/CookieConsentBanner';

const siteUrl = 'https://financesphere.io';
const siteTitle = 'Financesphere.io | Smart Finance Insights, Tools & Strategies';
const siteDescription =
  'Financesphere.io provides finance insights, market analysis, and smart tools to help you grow wealth, track investments, and make better financial decisions.';
const ogDescription =
  'Financesphere.io provides finance insights, market analysis, and smart tools to help you grow wealth and make better financial decisions.';
const twitterTitle = 'Financesphere.io | Smart Finance Insights';
const twitterDescription = 'Finance insights and tools to grow wealth and track investments.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: siteUrl
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }]
  },
  robots: {
    index: true,
    follow: true
  },
  verification: {
    // SEO: Google Search Console verification is configurable with an environment variable.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  },
  openGraph: {
    title: siteTitle,
    description: ogDescription,
    type: 'website',
    url: siteUrl,
    siteName: 'Financesphere.io',
    images: [
      {
        url: `${siteUrl}/og-image.png`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: twitterTitle,
    description: twitterDescription,
    images: [`${siteUrl}/og-image.png`]
  },
  other: {
    'google-adsense-account': 'ca-pub-9445870262181780'
  }
};

export const viewport: Viewport = {
  themeColor: '#0b1f3a'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9445870262181780"
          strategy="afterInteractive"
        />
        <CookieConsentBanner gaMeasurementId={gaMeasurementId} gtmId={gtmId} />

        <PreferenceProvider>
          <ErrorMonitoring />
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
            <Breadcrumbs />
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </PreferenceProvider>
      </body>
    </html>
  );
}
