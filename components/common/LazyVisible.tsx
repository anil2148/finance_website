'use client';

import { useEffect, useRef, useState } from 'react';

export function LazyVisible({ children, placeholderClassName = 'h-72 animate-pulse rounded-2xl bg-slate-100' }: { children: React.ReactNode; placeholderClassName?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '160px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  return <div ref={containerRef}>{isVisible ? children : <div className={placeholderClassName} />}</div>;
}
