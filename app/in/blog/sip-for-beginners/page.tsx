import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'SIP for Beginners: ₹5,000/month to ₹50 lakh';
const description = 'Practical India guide with scenarios and decision frameworks.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/sip-for-beginners',
  type: 'article'
});

export default function IndiaGuide() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog/sip-for-beginners',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: title, item: '/in/blog/sip-for-beginners' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="SIP for Beginners: ₹5,000/month to ₹50 lakh"
        subtitle="Investing guide"
        description="Practical guide with India-specific scenarios and decision frameworks."
        sections={[
          {
            type: 'text',
            title: 'Quick takeaway',
            content: 'This guide provides actionable insights for Indian financial decisions with real ₹ examples.'
          }
        ]}
        references={[
          { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true }
        ]}
      />
    </>
  );
}
