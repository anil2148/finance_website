import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/markdown';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://finance-site.vercel.app';
  const staticRoutes = [
    '',
    '/calculators',
    '/tools',
    '/dashboard',
    '/comparison',
    '/blog',
    '/mortgage-calculator',
    '/loan-emi-calculator',
    '/compound-interest-calculator',
    '/retirement-calculator',
    '/fire-retirement-calculator',
    '/net-worth-calculator',
    '/investment-growth-calculator',
    '/savings-goal-calculator',
    '/debt-payoff-calculator'
  ];

  const posts = getPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date)
  }));

  return [...staticRoutes.map((r) => ({ url: `${base}${r}`, lastModified: new Date() })), ...posts];
}
