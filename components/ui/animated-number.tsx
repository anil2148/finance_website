'use client';

import { animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function AnimatedNumber({ value, currency = true }: { value: number; currency?: boolean }) {
  const [displayValue, setDisplayValue] = useState(value);
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

  return (
    <span>
      {displayValue.toLocaleString('en-US', {
        style: currency ? 'currency' : 'decimal',
        currency: 'USD',
        maximumFractionDigits: currency ? 0 : 2
      })}
    </span>
  );
}
