import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Best Savings Accounts USA | Compare APY & Features',
  description: 'Find the best savings accounts in the USA with APY, fees, ratings, and side-by-side comparison tables.'
};

export default function BestSavingsAccountsUSAPage() {
  return (
    <SeoComparisonPage
      pageTitle="Best Savings Accounts USA"
      intro="Explore top U.S. savings accounts with competitive APYs, low fees, and flexible access so you can grow cash reserves while staying liquid."
      category="savings-accounts"
      slug="best-savings-accounts-usa"
      faq={[
        { question: 'Are online savings accounts safe?', answer: 'Yes, if the institution is FDIC-insured, deposits are protected up to applicable limits.' },
        { question: 'How often do APYs change?', answer: 'APYs can change at any time based on market rates and the bank’s pricing strategy.' }
      ]}
    />
  );
}
