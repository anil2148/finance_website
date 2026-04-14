'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import type { AiPageContext } from '@/lib/money-copilot/types';
import { buildBaseAiPageContext, mergeAiPageContext } from '@/lib/money-copilot/ai-page-context';

export function useAiPageContext(overrides?: Partial<AiPageContext>): AiPageContext {
  const pathname = usePathname();

  return useMemo(() => {
    const base = buildBaseAiPageContext(pathname || '/');
    return mergeAiPageContext(base, overrides);
  }, [pathname, overrides]);
}
