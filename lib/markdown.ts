import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { AUTHOR_PROFILES, EDITORIAL_REVIEWER_ID, getAuthorIdForCategory } from '@/lib/authors';
import { canonicalTopicKey, enhancePost, qualityScore, shouldExcludePost } from '@/lib/blogEnhancer';
import { shouldDisplayPost } from '@/lib/blogCleanup';
import { sanitizeBlogSlug } from '@/lib/blogSlug';

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
let postsCacheKey: string | null = null;

function getContentCacheKey() {
  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'))
    .sort();

  return files
    .map((file) => {
      const stats = fs.statSync(path.join(contentDir, file));
      return `${file}:${stats.mtimeMs}`;
    })
    .join('|');
}

function loadPosts() {
  const loadedPosts = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
      const { data, content } = matter(raw);
      const basePost = {
        title: data.title,
        slug: sanitizeBlogSlug(data.slug),
        description: data.description,
        date: data.date,
        category: data.category ?? 'general',
        tags: data.tags ?? data.keywords ?? [],
        country: data.country ?? 'global',
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        content,
        authorId:
          typeof data.authorId === 'string' && AUTHOR_PROFILES[data.authorId]
            ? data.authorId
            : getAuthorIdForCategory(data.category ?? 'general'),
        reviewedById:
          typeof data.reviewedById === 'string' && AUTHOR_PROFILES[data.reviewedById]
            ? data.reviewedById
            : EDITORIAL_REVIEWER_ID,
        updatedAt: data.updatedAt ?? data.date
      } as BlogPost;

      return enhancePost(basePost);
    })
    .filter((post) => !shouldExcludePost(post))
    .filter((post) => shouldDisplayPost(post.slug));

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
  const cacheKey = getContentCacheKey();

  if (!postsCache || postsCacheKey !== cacheKey) {
    postsCache = loadPosts();
    postsCacheKey = cacheKey;
  }

  return postsCache;
}

export function getPostBySlug(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

function decodeUriComponentSafe(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function fullyDecodeUriComponent(value: string): string {
  let decoded = value;
  let prev = '';
  while (decoded !== prev) {
    prev = decoded;
    decoded = decodeUriComponentSafe(decoded);
  }
  return decoded;
}

export function normalizeTag(tag: string) {
  return fullyDecodeUriComponent(tag).trim().toLowerCase();
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
