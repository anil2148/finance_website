import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getHeadings, getPostBySlug, getPosts } from '@/lib/markdown';
import { InteractiveArticleContent } from '@/components/blog/InteractiveArticleContent';
import { articleSchema } from '@/lib/seo';
import { SocialShareButtons } from '@/components/ui/SocialShareButtons';

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const canonicalPath = `/blog/${post.slug}`;

  return {
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.description,
    alternates: { canonical: canonicalPath },
    openGraph: { title: post.title, description: post.description, type: 'article', url: `https://financesphere.io${canonicalPath}` },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description }
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const posts = getPosts();
  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug && (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3);

  const schema = articleSchema(post.title, post.description, post.slug);
  const toc = getHeadings(post.content);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `What is the best way to start with ${post.category}?`, acceptedAnswer: { '@type': 'Answer', text: 'Start by setting a goal, comparing options, and automating your strategy.' } },
      { '@type': 'Question', name: 'How often should I review my plan?', acceptedAnswer: { '@type': 'Answer', text: 'Review monthly for budgeting and quarterly for long-term investments.' } }
    ]
  };

  return (
    <article className="space-y-6 rounded-xl bg-white p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-slate-600">{post.description}</p>
        {/* Sharing: social share buttons improve distribution and backlink opportunities. */}
        <SocialShareButtons title={post.title} url={`https://financesphere.io/blog/${post.slug}`} />
      </header>

      <section className="rounded-lg border bg-slate-50 p-4">
        <h2 className="font-semibold">Table of contents</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          {toc.map((item) => (
            <li key={item}>
              <a className="hover:text-slate-900 hover:underline" href={`#${item.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')}`}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr><th className="px-3 py-2">Option</th><th className="px-3 py-2">Best for</th><th className="px-3 py-2">Rating</th></tr>
          </thead>
          <tbody>
            <tr className="border-t"><td className="px-3 py-2">Starter</td><td className="px-3 py-2">Beginners</td><td className="px-3 py-2">4.4/5</td></tr>
            <tr className="border-t"><td className="px-3 py-2">Growth</td><td className="px-3 py-2">Long-term planning</td><td className="px-3 py-2">4.7/5</td></tr>
          </tbody>
        </table>
      </section>

      <InteractiveArticleContent content={post.content} />

      <section className="rounded-xl bg-blue-600 p-5 text-white">
        <h3 className="text-xl font-semibold">Affiliate partner offers</h3>
        <p className="text-sm text-blue-100">Compare vetted financial products and unlock welcome bonuses.</p>
        <a href="/comparison" className="mt-3 inline-flex rounded-lg bg-white px-4 py-2 font-semibold text-blue-700">View Offers</a>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Related internal links</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="rounded-full border px-3 py-1" href="/calculators">Financial calculators</Link>
          <Link className="rounded-full border px-3 py-1" href="/tools">Finance tools</Link>
          <Link className="rounded-full border px-3 py-1" href="/comparison">Comparison pages</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Related articles</h2>
        <ul className="grid gap-2 text-sm">
          {relatedPosts.map((related) => (
            <li key={related.slug}>
              <Link href={`/blog/${related.slug}`} className="text-blue-700 hover:underline">
                {related.title}
              </Link>
            </li>
          ))}
          {relatedPosts.length === 0 && <li className="text-slate-500">More related guides coming soon.</li>}
        </ul>
      </section>
    </article>
  );
}
