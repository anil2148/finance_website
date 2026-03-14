export function articleSchema(title: string, description: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `https://finance-site.vercel.app/blog/${slug}`
  };
}
