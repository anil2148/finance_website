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
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">When a HYSA clears the bar—and when it does not</h2>
        <p className="mt-2 text-sm text-slate-700">
          A high-yield savings account is not automatically better than your current account. The upgrade makes sense under specific conditions. Check yours first.
        </p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="font-semibold text-blue-700">If your current APY is below 2.5%</span>
            <span className="mx-2 text-slate-400">→</span>
            <span className="text-slate-800">The yield gap on a $15,000 emergency fund can exceed $300/year. Switching is worth the migration friction in most cases.</span>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="font-semibold text-blue-700">If you need cash accessible within 24 hours</span>
            <span className="mx-2 text-slate-400">→</span>
            <span className="text-slate-800">Test the outbound transfer workflow before you park your emergency fund there. A 3-business-day delay during a real emergency costs more than the yield gain.</span>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="font-semibold text-blue-700">If the account has tiered rates or minimum balance requirements</span>
            <span className="mx-2 text-slate-400">→</span>
            <span className="text-slate-800">Calculate your actual rate based on your average balance—not the promotional top tier. Headline APY and your earned APY are often different numbers.</span>
          </div>
        </div>
      </section>
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
    </div>
  );
}
