import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { InteractiveArticleContent } from '@/components/blog/InteractiveArticleContent';
import { createCountryMetadata } from '@/lib/country/seo';
import { getCountryContent, getCountryContentBySlug } from '@/lib/country/content';

export function generateStaticParams() {
  return getCountryContent('in', 'calculator').map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const calculator = getCountryContentBySlug('in', 'calculator', params.slug);
  if (!calculator) return {};

  return createCountryMetadata({
    country: 'in',
    pathname: `/calculators/${calculator.slug}`,
    title: calculator.seoTitle ?? calculator.title,
    description: calculator.metaDescription ?? calculator.description,
    equivalentPaths: {
      in: `/calculators/${calculator.slug}`
    }
  });
}

export default function IndiaCalculatorPage({ params }: { params: { slug: string } }) {
  const calculator = getCountryContentBySlug('in', 'calculator', params.slug);
  if (!calculator) notFound();

  return (
    <article className="mx-auto max-w-4xl space-y-6 rounded-xl bg-white p-6">
      <header>
        <h1 className="text-3xl font-bold">{calculator.title}</h1>
        <p className="mt-2 text-slate-600">{calculator.description}</p>
      </header>
      <InteractiveArticleContent content={calculator.content} />
      <div className="flex flex-wrap gap-2">
        <Link href="/in/blog/sip-vs-fd" className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:border-blue-300 hover:text-blue-700">Read SIP vs FD</Link>
        <Link href="/in/blog/ppf-vs-elss" className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:border-blue-300 hover:text-blue-700">Read PPF vs ELSS</Link>
      </div>
    </article>
  );
}
