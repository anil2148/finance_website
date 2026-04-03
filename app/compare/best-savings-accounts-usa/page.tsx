import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Savings Account Comparison Framework (US) | FinanceSphere',
  description: 'Use a practical framework to evaluate U.S. savings account options by APY durability, transfer reliability, and account rules.'
};

export default function BestSavingsAccountsUSAPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Where you are in the savings process changes the right account</h2>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <p className="font-semibold text-slate-800">Building your first emergency fund</p>
            <p className="mt-1 text-slate-600">Speed and simplicity beat yield. Choose an account that opens in under 10 minutes and transfers out within 1–2 business days. APY differences of 0.5% on $3,000 are about $15/year.</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <p className="font-semibold text-slate-800">Moving an existing fund to earn more</p>
            <p className="mt-1 text-slate-600">On $20,000 at the difference between 0.5% and 4.8% APY, you are leaving roughly $860/year behind. That math supports switching—if the transfer process is reliable.</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <p className="font-semibold text-slate-800">Short-term goal savings (1–3 years)</p>
            <p className="mt-1 text-slate-600">If you do not need same-week liquidity, a CD ladder alongside your HYSA can improve yield by 0.3–0.6% without meaningful risk. Only works if you are confident in the timeline.</p>
          </div>
        </div>
      </section>
      <SeoComparisonPage
        pageTitle="Best Savings Accounts USA"
        intro="If your emergency fund is sitting in a standard savings account at 0.5% APY, you are leaving roughly $100–$150/year on the table per $25K saved. But APY is not the only factor—a savings account that earns 0.3% more but takes 4 days to transfer can fail you at the worst moment."
        category="savings_account"
        slug="best-savings-accounts-usa"
        pathname="/best-savings-accounts-usa"
        faq={[
          { question: 'Are online savings accounts safe?', answer: 'They can be, when deposit insurance and account ownership details are clear. Always verify FDIC status and ownership category limits directly.' },
          { question: 'How often do APYs change?', answer: 'APYs can change at any time. Focus on ongoing yield behavior and transfer reliability, not a one-week promotional spike.' }
        ]}
      />
    </div>
  );
}
