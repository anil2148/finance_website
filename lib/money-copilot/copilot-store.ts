/**
 * Copilot global state store.
 *
 * Uses React Context + useReducer so state persists across client-side
 * route transitions. A localStorage snapshot is written on every update
 * so the session survives hard reloads (within the same browser tab).
 */

import type { CopilotGlobalState, PipelineResult, ReasoningHistoryEntry } from './types';

const STORAGE_KEY = 'financesphere:copilot-state';
const HISTORY_LIMIT = 20;

// ─── Default state ─────────────────────────────────────────────────────────────

function generateSessionId(): string {
  // Use crypto.randomUUID when available (Node 14.17+ / all modern browsers);
  // fall back to a timestamp suffix only when crypto is unavailable (SSR edge cases).
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `sess_${crypto.randomUUID()}`;
  }
  return `sess_${Date.now()}_${Date.now().toString(36)}`;
}

export function buildDefaultState(): CopilotGlobalState {
  return {
    sessionId: generateSessionId(),
    region: 'US',
    riskProfile: 'moderate',
    history: [],
    isExecutionPanelOpen: false,
    activeResult: null,
    activeQuestion: '',
  };
}

// ─── Persistence ───────────────────────────────────────────────────────────────

export function loadPersistedState(): CopilotGlobalState {
  if (typeof window === 'undefined') return buildDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaultState();
    const parsed = JSON.parse(raw) as Partial<CopilotGlobalState>;
    return {
      ...buildDefaultState(),
      ...parsed,
      // Always start with panel closed on load
      isExecutionPanelOpen: false,
      activeResult: null,
      activeQuestion: '',
    };
  } catch {
    return buildDefaultState();
  }
}

function persistState(state: CopilotGlobalState): void {
  if (typeof window === 'undefined') return;
  try {
    // Persist only the parts we want to survive reloads
    const toStore: Partial<CopilotGlobalState> = {
      sessionId: state.sessionId,
      region: state.region,
      riskProfile: state.riskProfile,
      history: state.history,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

// ─── Actions ───────────────────────────────────────────────────────────────────

export type CopilotAction =
  | { type: 'SET_REGION'; payload: 'US' | 'India' }
  | { type: 'SET_RISK_PROFILE'; payload: 'conservative' | 'moderate' | 'aggressive' }
  | { type: 'OPEN_PANEL'; payload: { question: string; result: PipelineResult } }
  | { type: 'OPEN_DRAWER'; payload?: { prefillQuestion?: string } }
  | { type: 'CLOSE_PANEL' }
  | { type: 'ADD_HISTORY_ENTRY'; payload: ReasoningHistoryEntry }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_ACTIVE_RESULT'; payload: PipelineResult | null };

// ─── Reducer ───────────────────────────────────────────────────────────────────

export function copilotReducer(state: CopilotGlobalState, action: CopilotAction): CopilotGlobalState {
  let next: CopilotGlobalState;

  switch (action.type) {
    case 'SET_REGION':
      next = { ...state, region: action.payload };
      break;

    case 'SET_RISK_PROFILE':
      next = { ...state, riskProfile: action.payload };
      break;

    case 'OPEN_PANEL':
      next = {
        ...state,
        isExecutionPanelOpen: true,
        activeQuestion: action.payload.question,
        activeResult: action.payload.result,
      };
      break;

    case 'OPEN_DRAWER':
      next = {
        ...state,
        isExecutionPanelOpen: true,
        activeResult: null,
        activeQuestion: action.payload?.prefillQuestion ?? '',
      };
      break;

    case 'CLOSE_PANEL':
      next = { ...state, isExecutionPanelOpen: false };
      break;

    case 'ADD_HISTORY_ENTRY': {
      const history = [action.payload, ...state.history].slice(0, HISTORY_LIMIT);
      next = { ...state, history };
      break;
    }

    case 'CLEAR_HISTORY':
      next = { ...state, history: [] };
      break;

    case 'SET_ACTIVE_RESULT':
      next = { ...state, activeResult: action.payload };
      break;

    default:
      return state;
  }

  persistState(next);
  return next;
}
