import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { PageTransition } from '@/components/ui/PageTransition';

export const metadata: Metadata = {
  metadataBase: new URL('https://finance-site.vercel.app'),
  title: 'Finance Site | Compare products and use free calculators',
  description: 'Compare financial products, read guides, and use free personal finance tools.',
  openGraph: {
    title: 'Finance Site',
    description: 'Compare cards, loans, savings accounts and calculate smarter.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
