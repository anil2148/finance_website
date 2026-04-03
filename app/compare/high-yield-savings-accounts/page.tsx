import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'High-Yield Savings Account Evaluation Framework | FinanceSphere',
  description: 'Use a transparent framework to evaluate high-yield savings options by APY durability, liquidity reliability, and account rule risk.',
  alternates: {
    canonical: '/high-yield-savings-accounts'
  }
};

export default function HighYieldSavingsAccountsPage() {
  return (
    <SeoComparisonPage
      pageTitle="High Yield Savings Accounts"
      intro="A 4.60% APY vs 4.20% APY on a $25,000 emergency fund is roughly $100/year after rough tax adjustment. That difference matters—but it is less important than whether the account can transfer money out reliably when you actually need it."
      category="savings_account"
      slug="high-yield-savings-accounts"
      pathname="/high-yield-savings-accounts"
      faq={[
        { question: 'When is a HYSA clearly better than a standard savings account?', answer: 'A HYSA is usually better when you need liquid emergency reserves and can meet account conditions without triggering avoidable fees.' },
        { question: 'Can I access HYSA funds anytime?', answer: 'Access is generally available, but transfer timing, daily limits, and external-link setup can delay urgent withdrawals.' }
      ]}
    />
  );
}
