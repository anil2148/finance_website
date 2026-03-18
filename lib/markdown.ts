import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { getAuthorIdForCategory } from '@/lib/authors';
import { canonicalTopicKey, enhancePost, qualityScore, shouldExcludePost } from '@/lib/blogEnhancer';

const contentDir = path.join(process.cwd(), 'content/blog');

export type BlogPost = {
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  country: 'US' | 'India' | 'UK' | 'Canada' | 'global';
  seoTitle?: string;
  metaDescription?: string;
  content: string;
  authorId: string;
  reviewedById: string;
  updatedAt: string;
};

let postsCache: BlogPost[] | null = null;

function loadPosts() {
  const loadedPosts = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
      const { data, content } = matter(raw);
      const basePost = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        date: data.date,
        category: data.category ?? 'general',
        tags: data.tags ?? data.keywords ?? [],
        country: data.country ?? 'global',
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        content,
        authorId: data.authorId ?? getAuthorIdForCategory(data.category ?? 'general'),
        reviewedById: data.reviewedById ?? 'rachel_nguyen',
        updatedAt: data.updatedAt ?? data.date
      } as BlogPost;

      return enhancePost(basePost);
    })
    .filter((post) => !shouldExcludePost(post));

  const bestByTopic = new Map<string, BlogPost>();

  for (const post of loadedPosts) {
    const topic = canonicalTopicKey(post);
    const current = bestByTopic.get(topic);

    if (!current || qualityScore(post) > qualityScore(current) || post.date > current.date) {
      bestByTopic.set(topic, post);
    }
  }

  return [...bestByTopic.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPosts(): BlogPost[] {
  if (!postsCache) {
    postsCache = loadPosts();
  }

  return postsCache;
}

export function getPostBySlug(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

export function normalizeTag(tag: string) {
  return decodeURIComponent(tag).trim().toLowerCase();
}

export function getCategories() {
  return [...new Set(getPosts().map((post) => post.category))];
}

export function getTags() {
  const unique = new Map<string, string>();

  for (const tag of getPosts().flatMap((post) => post.tags)) {
    const normalized = normalizeTag(tag);
    if (normalized && !unique.has(normalized)) unique.set(normalized, tag.trim());
  }

  return [...unique.values()];
}

export function getHeadings(content: string) {
  return content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace('## ', '').trim());
}
