type ArticleSchemaArgs = {
  title: string;
  description: string;
  slug: string;
  publishedTime?: string;
  modifiedTime?: string;
};

export function articleSchema({ title, description, slug, publishedTime, modifiedTime }: ArticleSchemaArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `https://financesphere.io/blog/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Anil Chowdhary',
      jobTitle: 'Founder, FinanceSphere',
      description: 'Full Stack Developer | Personal Finance Tools Builder'
    },
    reviewedBy: {
      '@type': 'Organization',
      name: 'FinanceSphere Editorial Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'FinanceSphere'
    },
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime
  };
}
