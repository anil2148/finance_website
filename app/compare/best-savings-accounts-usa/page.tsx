import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Savings Account Comparison Framework (US) | FinanceSphere',
  description: 'Use a practical framework to evaluate U.S. savings account options by APY durability, transfer reliability, and account rules.'
};

export default function BestSavingsAccountsUSAPage() {
  return (
    <SeoComparisonPage
      pageTitle="Best Savings Accounts USA"
      intro="Use this framework to evaluate savings account options by APY stability, transfer reliability, and day-to-day liquidity tradeoffs."
      category="savings_account"
      slug="best-savings-accounts-usa"
      faq={[
        { question: 'Are online savings accounts safe?', answer: 'Yes, if the institution is FDIC-insured, deposits are protected up to applicable limits.' },
        { question: 'How often do APYs change?', answer: 'APYs can change at any time based on market rates and the bank’s pricing strategy.' }
      ]}
    />
  );
}
