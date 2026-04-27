import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PreferenceProvider } from '@/components/providers/PreferenceProvider';
import { RegionProvider } from '@/components/providers/RegionProvider';
import { CookieConsentBanner } from '@/components/cookies/CookieConsentBanner';
import { SITE_ORIGIN, absoluteUrl, organizationSchema, websiteSchema } from '@/lib/seo';
import { cookies } from 'next/headers';
import { normalizeRegionCode } from '@/lib/region-config';
import { PREFERRED_REGION_COOKIE, parsePreferredRegion } from '@/lib/region-preference';
import { RegionAppFrame } from '@/components/providers/RegionAppFrame';

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
      canonical: '/us',
      languages: {
        'en-US': absoluteUrl('/us'),
        'en-IN': absoluteUrl('/india'),
        'x-default': absoluteUrl('/us')
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
  const cookieStore = cookies();
  const cookieRegion = parsePreferredRegion(cookieStore.get(PREFERRED_REGION_COOKIE)?.value);
  const initialRegion = cookieRegion ?? normalizeRegionCode(null);
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), websiteSchema()]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <CookieConsentBanner gaMeasurementId={gaMeasurementId} gtmId={gtmId} />

        <RegionProvider initialRegion={initialRegion}>
          <PreferenceProvider>
            <RegionAppFrame>{children}</RegionAppFrame>
          </PreferenceProvider>
        </RegionProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
