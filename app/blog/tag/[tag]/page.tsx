import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts, slugifyTag } from '@/lib/markdown';

const defaultTagJourney = [
  { href: '/calculators', label: 'Run a calculator' },
  { href: '/comparison', label: 'Open comparisons' },
  { href: '/help', label: 'Get help choosing next step' }
];

export function generateMetadata({ params }: { params: { tag: string } }): Metadata {
  const tag = slugifyTag(params.tag);
  return {
    title: `#${tag} Guides and Decision Support | FinanceSphere Blog`,
    description: `Browse FinanceSphere guides tagged ${tag} with direct next steps into calculators and comparison frameworks.`,
    alternates: { canonical: `/blog/tag/${tag}` },
    robots: { index: false, follow: true }
  };
}

export default function BlogTagPage({ params }: { params: { tag: string } }) {
  const slug = slugifyTag(params.tag);

  if (params.tag !== slug) {
    redirect(`/blog/tag/${slug}`);
  }

  const currentSlug = slug;
  const posts = getPosts().filter((post) => post.tags.some((tag) => slugifyTag(tag) === currentSlug));
  const lifeStageLine =
    currentSlug === 'retirement' || currentSlug === 'retirement-planning'
      ? 'If you are within 10 years of retirement, downside protection often matters more than max upside.'
      : 'If you are in your first 5 working years, consistency usually beats complexity.';

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">Tag: #{currentSlug}</h1>
        <p className="mt-2 text-slate-600">This page groups articles around one decision theme. Use it to compare conflicting approaches, not just collect tips.</p>
        <p className="mt-2 text-sm italic text-slate-500">{lifeStageLine}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {defaultTagJourney.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">{item.label}</Link>
          ))}
          <Link href="/blog" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">All blog topics</Link>
        </div>
      </header>

      {posts.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} category={p.category} />
            ))}
          </div>
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">After reading this tag cluster</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
              <li>Choose one recommendation you can execute this week.</li>
              <li>Run the matching calculator with your own numbers.</li>
              <li>Use a comparison framework before opening, switching, or applying.</li>
            </ol>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Best for / Not ideal for</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <p className="font-semibold text-blue-700">Best for</p>
                <ul className="mt-1 list-disc pl-5 text-slate-700">
                  <li>Readers comparing two options in the same week</li>
                  <li>People willing to run numbers before making a switch</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-500">Not ideal for</p>
                <ul className="mt-1 list-disc pl-5 text-slate-700">
                  <li>Anyone looking for one-click universal advice</li>
                  <li>High-stakes decisions without confirming live product terms</li>
                </ul>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
            <h2 className="text-lg font-semibold text-slate-900">What people get wrong</h2>
            <p className="mt-2 text-sm text-slate-700">Scenario: You read three posts under #{currentSlug}, combine all recommendations, and apply them at once.</p>
            <p className="mt-1 text-sm text-slate-700">Failure: The stack is too aggressive for your monthly cash flow.</p>
            <p className="mt-1 text-sm text-slate-700">Consequence: You abandon everything after one difficult month.</p>
            <p className="mt-3 text-sm text-slate-700"><span className="font-semibold text-blue-700">If this tag decision affects debt payments</span> → test downside first. <span className="font-semibold text-blue-700">If it affects long-term investing only</span> → test consistency over 12 months.</p>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">No published articles under this tag yet</h2>
          <p className="mt-1 text-sm text-slate-600">Try a nearby category or start with one of our high-impact decision pages below.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href="/blog/category/investing" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700">Investing category</Link>
            <Link href="/blog/category/loans" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700">Loans category</Link>
            <Link href="/blog/category/savings-accounts" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700">Savings category</Link>
          </div>
        </section>
      )}
    </section>
  );
}
