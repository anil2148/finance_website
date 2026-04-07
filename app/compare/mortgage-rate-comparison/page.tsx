import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Mortgage Lender Comparison Framework | FinanceSphere',
  description: 'Compare mortgage lender types using total borrowing cost, timeline reliability, support quality, and borrower fit.',
  pathname: '/compare/mortgage-rate-comparison'
});

export default function MortgageRateComparisonPage() {
  return (
    <SeoComparisonPage
      pageTitle="Mortgage Rate Comparison: total cost, timeline risk, and lender fit"
      intro="On a $400,000 mortgage, a lender quoting 6.25% with $9,500 in fees can cost more over 7 years than a 6.40% quote with $2,500 in fees — depending on how long you stay in the home. Most buyers compare the rate on day one. The smarter comparison is total borrowing cost, execution reliability, and whether the lender can close your file type within your actual timeline. A lower rate is only a win if the lender can actually deliver it on the day you need to close."
      category="mortgage_lender"
      slug="mortgage-rate-comparison"
      pathname="/compare/mortgage-rate-comparison"
      faq={[
        {
          question: 'What usually moves mortgage APR the most?',
          answer: 'Credit profile (score and depth), loan-to-value ratio, property type (primary vs investment), lock timing, and lender fee structure all affect APR. A borrower with 780 credit and 25% down at a well-capitalized lender will see meaningfully different pricing than the same loan with 680 credit and 10% down — even from the same lender. The rate sheet you see advertised typically assumes a strong credit profile at median LTV. Most borrowers see rates 0.25–0.75% higher than headline-advertised rates once their actual profile is priced in.'
        },
        {
          question: 'How should I choose between a 15-year and 30-year term?',
          answer: 'Test payment resilience first. If the 15-year payment is comfortable now but would be tight in a lower-income month or after an unexpected expense, the 30-year provides safer cash-flow flexibility. You can always pay extra on a 30-year to match the 15-year payoff schedule in good months — you cannot reduce the mandatory 15-year payment when things get tight. The interest savings from a 15-year are real, but only net positive if the payment is genuinely sustainable for the full tenure.'
        },
        {
          question: 'Is it worth paying points to lower the rate?',
          answer: 'Only if your break-even timeline is shorter than how long you plan to keep the loan. One point typically costs 1% of the loan amount and reduces the rate by 0.20%–0.25%. On a $400,000 loan, one point costs $4,000 and saves roughly $55–$65/month. Break-even is approximately 62–73 months (5–6 years). If you are likely to move or refinance before that, paying points costs more than it saves. If you are certain you will hold the loan past the break-even, points are efficient.'
        },
        {
          question: 'What is the biggest closing risk most buyers overlook?',
          answer: 'Execution reliability at the lender level. The best rate on paper means nothing if the underwriting process is slow, documentation requests are poorly communicated, or the rate lock expires during a processing delay. Lenders with strong operations can close complex files on tight timelines; weaker operations create delays that cost money — extension fees, contract renegotiation, or a lost purchase. Ask any lender: what is your average time from application to clear-to-close for a file like mine? Their answer tells you a lot.'
        }
      ]}
    />
  );
}
