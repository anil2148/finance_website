'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import {
  copilotReducer,
  buildDefaultState,
  loadPersistedState,
  type CopilotAction,
} from '@/lib/money-copilot/copilot-store';
import type { CopilotGlobalState } from '@/lib/money-copilot/types';

interface CopilotContextValue {
  state: CopilotGlobalState;
  dispatch: React.Dispatch<CopilotAction>;
}

const CopilotContext = createContext<CopilotContextValue | null>(null);

export function CopilotProvider({ children }: { children: ReactNode }) {
  // Start with the default state (SSR-safe) and hydrate from localStorage on mount
  const [state, dispatch] = useReducer(copilotReducer, buildDefaultState());

  useEffect(() => {
    const persisted = loadPersistedState();
    // Replay persisted fields without re-rendering twice
    if (persisted.history.length > 0) {
      for (const entry of persisted.history) {
        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: entry });
      }
    }
    if (persisted.region !== 'US') dispatch({ type: 'SET_REGION', payload: persisted.region });
    if (persisted.riskProfile !== 'moderate') dispatch({ type: 'SET_RISK_PROFILE', payload: persisted.riskProfile });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CopilotContext.Provider value={{ state, dispatch }}>
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot(): CopilotContextValue {
  const ctx = useContext(CopilotContext);
  if (!ctx) throw new Error('useCopilot must be used inside <CopilotProvider>');
  return ctx;
}
