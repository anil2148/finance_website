import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content/blog');

export function getPosts() {
  return fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx')).map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const { data, content } = matter(raw);
    return { ...data, content } as { title: string; slug: string; description: string; date: string; content: string };
  });
}

export function getPostBySlug(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}
