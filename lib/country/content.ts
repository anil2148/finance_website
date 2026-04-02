import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { getPosts } from '@/lib/markdown';
import type { CountryCode } from '@/lib/country/config';

export type CountryContentType = 'blog' | 'calculator';

export type CountryContent = {
  title: string;
  description: string;
  seoTitle?: string;
  metaDescription?: string;
  slug: string;
  country: CountryCode;
  canonical?: string;
  date: string;
  updatedAt?: string;
  keywords: string[];
  category: string;
  content: string;
};

function countryContentDir(country: CountryCode, type: CountryContentType) {
  return path.join(process.cwd(), 'content', country, type === 'calculator' ? 'calculators' : 'blog');
}

function loadCountryMdx(country: CountryCode, type: CountryContentType): CountryContent[] {
  if (country === 'us' && type === 'blog') {
    return getPosts().map((post) => ({
      title: post.title,
      description: post.description,
      seoTitle: post.seoTitle,
      metaDescription: post.metaDescription,
      slug: post.slug,
      country: 'us',
      date: post.date,
      updatedAt: post.updatedAt,
      keywords: post.tags,
      category: post.category,
      content: post.content
    }));
  }

  const dir = countryContentDir(country, type);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      return {
        title: data.title,
        description: data.description,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        slug: data.slug,
        country,
        canonical: data.canonical,
        date: data.date,
        updatedAt: data.updatedAt,
        keywords: data.keywords ?? [],
        category: data.category ?? 'general',
        content
      } as CountryContent;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getCountryContent(country: CountryCode, type: CountryContentType): CountryContent[] {
  return loadCountryMdx(country, type);
}

export function getCountryContentBySlug(country: CountryCode, type: CountryContentType, slug: string): CountryContent | undefined {
  return getCountryContent(country, type).find((entry) => entry.slug === slug);
}

export function hasCountryEquivalent(type: CountryContentType, slug: string, country: CountryCode): boolean {
  return Boolean(getCountryContentBySlug(country, type, slug));
}
