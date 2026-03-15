import Image from 'next/image';
import { RatingStars } from '@/components/comparison-table/RatingStars';

type FinancialProduct = {
  id: string;
  name: string;
  bank: string;
  rating: number;
  apr_apy: string;
  annual_fee: string;
  pros: string[];
  cons: string[];
  affiliate_url: string;
};

export function OfferCard({ product }: { product: FinancialProduct }) {
  return (
    <article className="offer-card" aria-label={`${product.bank} ${product.name}`}>
      <Image
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.bank)}&background=0f766e&color=fff`}
        alt={`${product.bank} logo`}
        loading="lazy"
        width={52}
        height={52}
        className="h-12 w-12 rounded-full"
        unoptimized
      />
      <div>
        <p className="text-sm font-medium text-brand">{product.bank}</p>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-slate-600">APR/APY: {product.apr_apy} · Annual Fee: {product.annual_fee}</p>
        <div className="mt-2">
          <RatingStars rating={product.rating} />
        </div>
      </div>
      <a className="comparison-cta" href={product.affiliate_url} target="_blank" rel="noreferrer sponsored noopener">
        View Offer
      </a>
    </article>
  );
}
