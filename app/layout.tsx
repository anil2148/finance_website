import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { PageTransition } from '@/components/ui/PageTransition';
import { PreferenceProvider } from '@/components/providers/PreferenceProvider';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ErrorMonitoring } from '@/components/monitoring/ErrorMonitoring';
import { CookieConsentBanner } from '@/components/cookies/CookieConsentBanner';
import { SITE_ORIGIN, absoluteUrl, organizationSchema, websiteSchema } from '@/lib/seo';

const siteTitle = 'FinanceSphere | Calculators, Comparisons, and Money Guides';
const siteDescription =
  'FinanceSphere helps you model major money decisions with calculators, compare financial products, and learn practical strategies for saving, borrowing, and investing.';
const ogDescription =
  'Use FinanceSphere to estimate costs, evaluate trade-offs, and choose financial products that fit your goals.';
const twitterTitle = 'FinanceSphere | Practical Finance Tools';
const twitterDescription = 'Calculator-first guidance for mortgages, debt payoff, savings, and investing.';
const gaMeasurementId = 'G-JR0S3QNR44';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'en-IN': '/in',
      'x-default': '/'
    }
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
    url: absoluteUrl('/'),
    siteName: 'FinanceSphere',
    locale: 'en_US',
    images: [
      {
        url: absoluteUrl('/og-image.png')
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: twitterTitle,
    description: twitterDescription,
    images: [absoluteUrl('/og-image.png')]
  },
  other: {
    'google-adsense-account': 'ca-pub-9445870262181780'
  }
};

export const viewport: Viewport = {
  themeColor: '#0b1f3a'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), websiteSchema()]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
        />
        <Analytics />
        <SpeedInsights />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `}
        </Script>
      </body>
    </html>
  );
}
