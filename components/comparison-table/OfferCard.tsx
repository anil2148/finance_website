import { RatingStars } from '@/components/comparison-table/RatingStars';
import type { FinancialProduct } from '@/lib/financialProducts';

const bestForByCategory: Record<FinancialProduct['category'], string> = {
  credit_card: 'Best for everyday rewards and fee-conscious spenders',
  savings_account: 'Best for emergency funds and short-term cash goals',
  investment_app: 'Best for automated long-term investing',
  mortgage_lender: 'Best for rate shoppers comparing total borrowing cost',
  personal_loan: 'Best for consolidating debt with fixed repayment terms'
};

export function OfferCard({ product }: { product: FinancialProduct }) {
  return (
    <article className="offer-card" aria-label={`${product.bank} ${product.name}`}>
      <div>
        <p className="text-sm font-medium text-brand">{product.bank}</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{product.name}</h3>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{bestForByCategory[product.category]}</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">APR/APY: {product.apr_apy} · Annual Fee: {product.annual_fee}</p>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">Bonus: {product.bonus_offer}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.recommended_flag && <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">Best for most readers</span>}
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">Reviewed March 2026</span>
        </div>
        <div className="mt-2">
          <RatingStars rating={product.rating} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">Pros</p>
            <ul className="comparison-list">{product.pros.map((pro) => <li key={pro}>{pro}</li>)}</ul>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-rose-700 dark:text-rose-300">Cons</p>
            <ul className="comparison-list">{product.cons.map((con) => <li key={con}>{con}</li>)}</ul>
          </div>
        </div>
      </div>
      <a className="comparison-cta" href={`/go/${product.id}`} target="_blank" rel="noreferrer sponsored noopener">
        Check rates & terms
      </a>
    </article>
  );
}
