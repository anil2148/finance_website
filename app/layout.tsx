import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { PageTransition } from '@/components/ui/PageTransition';
import { PreferenceProvider } from '@/components/providers/PreferenceProvider';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  metadataBase: new URL('https://finance-site.vercel.app'),
  title: {
    default: 'FinanceSphere | Interactive Personal Finance Platform',
    template: '%s | FinanceSphere'
  },
  description: 'Interactive personal finance calculators, comparison tools, and market insights with modern fintech UX.',
  openGraph: {
    title: 'FinanceSphere | Interactive Personal Finance Platform',
    description: 'Interactive calculators, dashboard analytics, and conversion-focused comparison content.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <PreferenceProvider>
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
