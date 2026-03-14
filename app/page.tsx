import Link from 'next/link';
import { FinanceCard } from '@/components/ui/FinanceCard';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';

const categories = [
  { title: 'Credit Cards', href: '/credit-cards', desc: 'Compare cashback and travel cards.' },
  { title: 'Loans', href: '/loans', desc: 'Find personal loans with better rates.' },
  { title: 'Savings Accounts', href: '/savings', desc: 'Compare APYs and account perks.' },
  { title: 'Calculators', href: '/calculators', desc: 'Plan with mortgage, EMI, and retirement tools.' },
  { title: 'Blog', href: '/blog', desc: 'Learn with SEO-ready guides and comparisons.' }
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="card text-center">
        <h1 className="text-3xl font-bold">Your Personal Finance Platform</h1>
        <p className="mt-2 text-slate-600">Compare top products and use free calculators to make smarter decisions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link href={c.href} key={c.href}>
            <FinanceCard title={c.title} description={c.desc} />
          </Link>
        ))}
      </div>
      <NewsletterSignup />
    </section>
  );
}
