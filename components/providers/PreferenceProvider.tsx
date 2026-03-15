'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

type PreferenceContextValue = {
  currency: SupportedCurrency;
  country: string;
  darkMode: boolean;
  setCurrency: (currency: SupportedCurrency) => void;
  setCountry: (country: string) => void;
  toggleDarkMode: () => void;
  formatCurrency: (value: number, maximumFractionDigits?: number) => string;
};

const PreferenceContext = createContext<PreferenceContextValue | null>(null);

const STORAGE_KEY = 'finance-site-preferences';

export function PreferenceProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [country, setCountry] = useState('United States');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { currency?: SupportedCurrency; country?: string; darkMode?: boolean };
      if (parsed.currency) setCurrency(parsed.currency);
      if (parsed.country) setCountry(parsed.country);
      if (typeof parsed.darkMode === 'boolean') setDarkMode(parsed.darkMode);
    } catch {
      // Ignore malformed storage values.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currency, country, darkMode }));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [country, currency, darkMode]);

  const value = useMemo<PreferenceContextValue>(
    () => ({
      currency,
      country,
      darkMode,
      setCurrency,
      setCountry,
      toggleDarkMode: () => setDarkMode((prev) => !prev),
      formatCurrency: (value: number, maximumFractionDigits = 0) =>
        new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency,
          maximumFractionDigits
        }).format(Number.isFinite(value) ? value : 0)
    }),
    [country, currency, darkMode]
  );

  return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferenceContext);
  if (!context) throw new Error('usePreferences must be used within PreferenceProvider');
  return context;
}
