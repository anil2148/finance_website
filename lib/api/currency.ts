const EXCHANGE_API_BASE_URL = process.env.EXCHANGE_API_BASE_URL ?? 'https://open.er-api.com/v6/latest';

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export type ExchangeRateResponse = {
  base: SupportedCurrency;
  rates: Record<SupportedCurrency, number>;
  fetchedAt: string;
  source: 'live' | 'cache' | 'default';
};

const DEFAULT_RATES_BY_BASE: Record<SupportedCurrency, Record<SupportedCurrency, number>> = {
  USD: { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.1, AUD: 1.51, CAD: 1.36 },
  EUR: { USD: 1.09, EUR: 1, GBP: 0.86, INR: 90.4, AUD: 1.64, CAD: 1.47 },
  GBP: { USD: 1.27, EUR: 1.16, GBP: 1, INR: 105.2, AUD: 1.91, CAD: 1.72 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, INR: 1, AUD: 0.018, CAD: 0.016 },
  AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, INR: 54.9, AUD: 1, CAD: 0.9 },
  CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, INR: 61, AUD: 1.11, CAD: 1 }
};

type CacheEntry = {
  data: ExchangeRateResponse;
  expiresAt: number;
};

const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map<SupportedCurrency, CacheEntry>();

function normalizeBase(base?: string): SupportedCurrency {
  const upper = (base ?? 'USD').toUpperCase();
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(upper) ? (upper as SupportedCurrency) : 'USD';
}

function buildDefaultRates(base: SupportedCurrency): ExchangeRateResponse {
  return {
    base,
    rates: { ...DEFAULT_RATES_BY_BASE[base] },
    fetchedAt: new Date().toISOString(),
    source: 'default'
  };
}

export async function getExchangeRates(baseInput?: string): Promise<ExchangeRateResponse> {
  const base = normalizeBase(baseInput);
  const now = Date.now();
  const cached = cache.get(base);

  if (cached && cached.expiresAt > now) {
    return { ...cached.data, source: 'cache' };
  }

  try {
    const response = await fetch(`${EXCHANGE_API_BASE_URL}/${base}`, {
      next: { revalidate: 900, tags: [`exchange-rates-${base}`] }
    });

    if (!response.ok) {
      throw new Error(`Exchange API responded ${response.status}`);
    }

    const payload = (await response.json()) as { rates?: Record<string, number> };
    const rates = SUPPORTED_CURRENCIES.reduce(
      (acc, currency) => {
        const value = payload.rates?.[currency];
        acc[currency] = typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : DEFAULT_RATES_BY_BASE[base][currency];
        return acc;
      },
      {} as Record<SupportedCurrency, number>
    );

    const liveData: ExchangeRateResponse = {
      base,
      rates,
      fetchedAt: new Date().toISOString(),
      source: 'live'
    };

    cache.set(base, { data: liveData, expiresAt: now + CACHE_TTL_MS });
    return liveData;
  } catch {
    if (cached) {
      return { ...cached.data, source: 'cache' };
    }

    const fallback = buildDefaultRates(base);
    cache.set(base, { data: fallback, expiresAt: now + CACHE_TTL_MS });
    return fallback;
  }
}

export async function convertCurrency(amount: number, fromInput: string, toInput: string) {
  const from = normalizeBase(fromInput);
  const to = normalizeBase(toInput);

  if (!Number.isFinite(amount)) {
    return { amount: 0, from, to, convertedAmount: 0, rate: 0, source: 'default' as const };
  }

  const ratesData = await getExchangeRates(from);
  const rate = ratesData.rates[to] ?? DEFAULT_RATES_BY_BASE[from][to] ?? 1;

  return {
    amount,
    from,
    to,
    rate,
    convertedAmount: amount * rate,
    source: ratesData.source
  };
}

export function getCurrencyList() {
  return SUPPORTED_CURRENCIES.map((code) => ({ code }));
}
