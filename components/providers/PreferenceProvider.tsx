'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetcher } from '@/lib/api/fetcher';
import type { ExchangeRateResponse, SupportedCurrency } from '@/lib/api/currency';
import { getLocaleForCurrency } from '@/lib/utils';
import { AppCountry, AppCurrency, getDefaultCurrencyForCountry } from '@/lib/preferences';
import { useRegion } from '@/components/providers/RegionProvider';

type PreferenceContextValue = {
  currency: AppCurrency;
  country: AppCountry;
  darkMode: boolean;
  isRatesLoading: boolean;
  setCountry: (country: AppCountry) => void;
  toggleDarkMode: () => void;
  formatCurrency: (value: number, maximumFractionDigits?: number) => string;
};

const PreferenceContext = createContext<PreferenceContextValue | null>(null);

const STORAGE_KEY = 'finance-site-preferences';
const DEFAULT_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.1,
  CAD: 1.36,
  AUD: 1.51
};

export function PreferenceProvider({ children }: { children: React.ReactNode }) {
  const { region, setRegion } = useRegion();
  const country: AppCountry = region === 'IN' ? 'India' : 'US';
  const currency = getDefaultCurrencyForCountry(country);
  const [darkMode, setDarkMode] = useState(false);
  const [rates, setRates] = useState<Record<SupportedCurrency, number>>(DEFAULT_RATES);
  const [isRatesLoading, setIsRatesLoading] = useState(true);

  const setCountry = useCallback(
    (nextCountry: AppCountry) => {
      if (nextCountry === 'India') {
        setRegion('IN');
        return;
      }
      setRegion('US');
    },
    [setRegion]
  );

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { darkMode?: boolean };
      if (typeof parsed.darkMode === 'boolean') setDarkMode(parsed.darkMode);
    } catch {
      // Ignore malformed storage values.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ country, darkMode }));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [country, darkMode]);

  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      setIsRatesLoading(true);

      try {
        const data = await fetcher<ExchangeRateResponse>(`/api/exchange-rates?base=USD`);
        if (!cancelled) {
          setRates(data.rates);
        }
      } catch {
        if (!cancelled) {
          setRates(DEFAULT_RATES);
        }
      } finally {
        if (!cancelled) {
          setIsRatesLoading(false);
        }
      }
    }

    loadRates();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<PreferenceContextValue>(
    () => ({
      currency,
      country,
      darkMode,
      isRatesLoading,
      setCountry,
      toggleDarkMode: () => setDarkMode((prev) => !prev),
      formatCurrency: (rawValue: number, maximumFractionDigits = 0) => {
        const source = Number.isFinite(rawValue) ? rawValue : 0;

        return new Intl.NumberFormat(getLocaleForCurrency(currency), {
          style: 'currency',
          currency,
          maximumFractionDigits
        }).format(source);
      }
    }),
    [country, currency, darkMode, isRatesLoading, setCountry]
  );

  return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferenceContext);
  if (!context) throw new Error('usePreferences must be used within PreferenceProvider');
  return context;
}
