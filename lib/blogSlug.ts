export function sanitizeBlogSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/^seo-+/i, '')
    .replace(/-\d{4}-guide-\d+$/i, '')
    .replace(/-guide-\d+$/i, '')
    .replace(/-guides-\d+$/i, '')
    .replace(/-guide$/i, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function canonicalBlogPath(slug: string) {
  return `/blog/${sanitizeBlogSlug(slug)}`;
}
