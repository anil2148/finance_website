import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getPosts } from '@/lib/markdown';
import { articleSchema } from '@/lib/seo';

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: 'article' }
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  const schema = articleSchema(post.title, post.description, post.slug);

  return (
    <article className="prose max-w-none rounded-xl bg-white p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <pre className="whitespace-pre-wrap">{post.content}</pre>
    </article>
  );
}
