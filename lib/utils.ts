import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function getLocaleForCurrency(currency: string) {
  if (currency === 'INR') return 'en-IN';
  if (currency === 'USD') return 'en-US';
  return undefined;
}

export function getCurrencySymbol(currency: string, locale?: string) {
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).formatToParts(0);

  return parts.find((part) => part.type === 'currency')?.value ?? currency;
}

export function resolveCurrencyPrefix(prefix: string | undefined, currencySymbol: string) {
  return prefix === '$' ? currencySymbol : prefix;
}
