import fs from 'node:fs/promises';
import path from 'node:path';

const INDIA_TOPICS = {
  investing: [
    { slug: 'sip-for-beginners', title: 'SIP for Beginners: ₹5,000/month to ₹50 lakh' },
    { slug: 'etf-vs-mutual-funds', title: 'ETF vs Mutual Funds in India: Fee & Tax Tradeoffs' },
    { slug: 'nps-vs-401k-equivalent', title: 'National Pension System (NPS): Tax Benefits & Lock-in Rules' }
  ],
  loans: [
    { slug: 'home-loan-rates-2026', title: 'Home Loan Interest Rates 2026: RBI & Bank Strategies' },
    { slug: 'personal-loan-vs-cc', title: 'Personal Loan vs Credit Card: Debt Stacking Strategy' },
    { slug: 'education-loan-india', title: 'Education Loans in India: NEFT Process & Repayment' }
  ],
  tax: [
    { slug: 'old-vs-new-tax-regime', title: 'Old vs New Tax Regime: 2026 Slabs & Section 80C' },
    { slug: 'capital-gains-tax-india', title: 'Capital Gains Tax: LTCG vs STCG on Stocks & Mutual Funds' },
    { slug: 'gst-impact-on-finance', title: 'GST Impact on EMI, Insurance & Mutual Fund Returns' }
  ],
  savings: [
    { slug: 'fixed-deposit-ladder', title: 'FD Laddering Strategy: Lock-in vs Liquidity Trade-offs' },
    { slug: 'high-yield-savings-india', title: 'High-Yield Savings Accounts in India: Banks & Rates' },
    { slug: 'emergency-fund-india', title: 'Emergency Fund for Indian Households: Months of Coverage' }
  ]
};

async function generateIndiaBlogContent() {
  const baseDir = './app/in/blog';

  for (const [category, topics] of Object.entries(INDIA_TOPICS)) {
    for (const topic of topics) {
      const slug = topic.slug;
      const dir = path.join(baseDir, slug);

      await fs.mkdir(dir, { recursive: true });

      const pageContent = `import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = '${topic.title}';
const description = 'Practical India guide with scenarios and decision frameworks.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/${slug}',
  type: 'article'
});

export default function IndiaGuide() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog/${slug}',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: title, item: '/in/blog/${slug}' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="${topic.title}"
        subtitle="${category.charAt(0).toUpperCase() + category.slice(1)} guide"
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
`;

      await fs.writeFile(path.join(dir, 'page.tsx'), pageContent);
      console.log(`✅ Created /in/blog/${slug}`);
    }
  }

  console.log(`\n✅ Generated ${Object.values(INDIA_TOPICS).flat().length} India blog guides`);
}

generateIndiaBlogContent().catch(console.error);
