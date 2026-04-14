'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { AiPageContext } from '@/lib/money-copilot/types';
import { buildBaseAiPageContext, mergeAiPageContext } from '@/lib/money-copilot/ai-page-context';
import {
  clearRuntimeAiPageContext,
  getRuntimeAiPageContext,
  setRuntimeAiPageContext,
  subscribeRuntimeAiPageContext,
} from '@/lib/money-copilot/runtime-page-context';

export function useAiPageContext(overrides?: Partial<AiPageContext>): AiPageContext {
  const pathname = usePathname();
  const [runtimeVersion, setRuntimeVersion] = useState(0);

  useEffect(() => {
    return subscribeRuntimeAiPageContext((updatedPathname) => {
      if (updatedPathname !== (pathname || '/')) return;
      setRuntimeVersion((value) => value + 1);
    });
  }, [pathname]);

  const currentPath = pathname || '/';
  const base = buildBaseAiPageContext(currentPath);
  const runtimeContext = getRuntimeAiPageContext(currentPath);
  const withRuntime = mergeAiPageContext(base, runtimeContext);

  // Read runtimeVersion to force recompute when runtime page context updates.
  void runtimeVersion;

  return mergeAiPageContext(withRuntime, overrides);
}

export function useSyncAiPageContext(overrides?: Partial<AiPageContext>): void {
  const pathname = usePathname();

  useEffect(() => {
    const currentPath = pathname || '/';
    if (!overrides || Object.keys(overrides).length === 0) {
      clearRuntimeAiPageContext(currentPath);
      return;
    }

    setRuntimeAiPageContext(currentPath, overrides);
    return () => {
      clearRuntimeAiPageContext(currentPath);
    };
  }, [pathname, overrides]);
}
