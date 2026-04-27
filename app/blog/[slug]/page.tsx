import type { Metadata } from 'next';
import { BlogArticlePage, generateBlogMetadata, generateBlogStaticParams } from './BlogArticlePage';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return generateBlogStaticParams();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return generateBlogMetadata({ params, basePath: '/blog' });
}

export default function DefaultBlogArticlePage({ params }: { params: { slug: string } }) {
  return <BlogArticlePage params={params} region="US" basePath="/blog" />;
}
