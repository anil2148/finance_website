import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Best Savings Accounts USA | Compare APY & Features',
  description: 'Review U.S. savings accounts using APY durability, transfer speed, account rules, and service quality—not headline rate alone.'
};

export default function BestSavingsAccountsUSAPage() {
  return (
    <SeoComparisonPage
      pageTitle="Best Savings Accounts USA"
      intro="Evaluate savings accounts by APY quality, transfer reliability, liquidity constraints, and operational controls so emergency cash stays accessible."
      category="savings_account"
      slug="best-savings-accounts-usa"
      faq={[
        { question: 'Are online savings accounts safe?', answer: 'Yes, if the institution is FDIC-insured, deposits are protected up to applicable limits.' },
        { question: 'How often do APYs change?', answer: 'APYs can change at any time based on market rates and the bank’s pricing strategy.' }
      ]}
    />
  );
}
