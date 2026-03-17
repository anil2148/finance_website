import { RatingStars } from '@/components/comparison-table/RatingStars';
import type { FinancialProduct } from '@/lib/financialProducts';

export function OfferCard({ product }: { product: FinancialProduct }) {
  return (
    <article className="offer-card" aria-label={`${product.bank} ${product.name}`}>
      <div>
        <p className="text-sm font-medium text-brand">{product.bank}</p>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-slate-600">APR/APY: {product.apr_apy} · Annual Fee: {product.annual_fee}</p>
        <p className="mt-1 text-sm text-emerald-700">Bonus: {product.bonus_offer}</p>
        {product.recommended_flag && <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Recommended</span>}
        <div className="mt-2">
          <RatingStars rating={product.rating} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-semibold text-emerald-700">Pros</p>
            <ul className="comparison-list">{product.pros.map((pro) => <li key={pro}>{pro}</li>)}</ul>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-rose-700">Cons</p>
            <ul className="comparison-list">{product.cons.map((con) => <li key={con}>{con}</li>)}</ul>
          </div>
        </div>
      </div>
      <a className="comparison-cta" href={`/go/${product.id}`} target="_blank" rel="noreferrer sponsored noopener">
        View terms & offer
      </a>
    </article>
  );
}
