import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'High Yield Savings Accounts | Best APY Offers',
  description: 'Compare high yield savings accounts with top APY rates, ratings, fees, and pros/cons from leading banks.'
};

export default function HighYieldSavingsAccountsPage() {
  return (
    <SeoComparisonPage
      pageTitle="High Yield Savings Accounts"
      intro="Find high-yield savings options with competitive APYs, low fees, and digital features that make it easier to build your emergency fund."
      category="high-yield-savings"
      slug="high-yield-savings-accounts"
      faq={[
        { question: 'Is high-yield savings better than a traditional savings account?', answer: 'High-yield accounts usually provide significantly better APY than traditional branch savings accounts.' },
        { question: 'Can I withdraw from a high-yield savings account anytime?', answer: 'Yes, but some institutions may limit monthly transactions depending on account terms.' }
      ]}
    />
  );
}
