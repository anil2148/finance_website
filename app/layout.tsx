import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { PageTransition } from '@/components/ui/PageTransition';

export const metadata: Metadata = {
  metadataBase: new URL('https://finance-site.vercel.app'),
  title: 'FinanceSite | Modern Personal Finance SaaS Platform',
  description: 'SEO finance content, calculators, dashboard analytics, comparison tools, and newsletter growth in one platform.',
  openGraph: {
    title: 'FinanceSite | Modern Personal Finance SaaS Platform',
    description: 'Interactive calculators, financial dashboard, and high-converting comparison content.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
