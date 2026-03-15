import { StarIcon } from '@heroicons/react/24/solid';

export function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.round(rating);

  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={`h-4 w-4 ${index < fullStars ? 'text-amber-400' : 'text-slate-300'}`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-600">{rating.toFixed(1)}</span>
    </span>
  );
}
