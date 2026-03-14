import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/markdown';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://finance-site.vercel.app';
  const staticRoutes = [
    '',
    '/credit-cards',
    '/loans',
    '/savings',
    '/calculators',
    '/blog',
    '/mortgage-calculator',
    '/loan-emi-calculator',
    '/compound-interest-calculator',
    '/retirement-calculator',
    '/net-worth-calculator'
  ];

  const posts = getPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date)
  }));

  return [...staticRoutes.map((r) => ({ url: `${base}${r}`, lastModified: new Date() })), ...posts];
}
