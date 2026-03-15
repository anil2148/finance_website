'use client';

import { animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePreferences } from '@/components/providers/PreferenceProvider';

export function AnimatedNumber({ value, currency = true }: { value: number; currency?: boolean }) {
  const [displayValue, setDisplayValue] = useState(value);
  const { formatCurrency } = usePreferences();
  const previous = useRef(value);

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration: 0.7,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(latest)
    });

    previous.current = value;
    return () => controls.stop();
  }, [value]);

  return <span>{currency ? formatCurrency(displayValue) : displayValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>;
}
