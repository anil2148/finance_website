'use client';

import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { BlogCard } from '@/components/ui/BlogCard';
import type { BlogPost } from '@/lib/markdown';
import { usePreferences } from '@/components/providers/PreferenceProvider';

export function BlogSearch({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('');
  const { country } = usePreferences();

  const results = useMemo(() => {
    const countryPosts = posts.filter((post) => post.country === 'global' || post.country === country);
    if (!query) return countryPosts.slice(0, 48);
    const fuse = new Fuse(countryPosts, { keys: ['title', 'description', 'tags', 'category'], threshold: 0.3 });
    return fuse.search(query).map((result) => result.item);
  }, [country, posts, query]);

  return (
    <div className="space-y-4">
      <input
        className="w-full rounded-xl border border-slate-200 px-4 py-3"
        placeholder="Search credit cards, mortgages, retirement, budgeting..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} category={p.category} />)}
      </div>
      {results.length === 0 && <p className="text-sm text-slate-500">No articles available for {country}. Showing global content when available.</p>}
    </div>
  );
}
