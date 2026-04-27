import type { Metadata } from 'next';
import { BlogArticlePage, generateBlogMetadata, generateBlogStaticParams } from '@/app/blog/[slug]/BlogArticlePage';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return generateBlogStaticParams();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return generateBlogMetadata({ params, region: 'INDIA', basePath: '/india/blog' });
}

export default function IndiaBlogArticlePage({ params }: { params: { slug: string } }) {
  return <BlogArticlePage params={params} region="INDIA" basePath="/india/blog" />;
}
