'use client';

import { useState, useRef, useCallback } from 'react';

export interface CopilotResult {
  summary: string;
  recommendation: string;
  assumptions: string[];
  keyMetrics: Record<string, unknown>;
  scenarios: unknown[];
  risks: string[];
  nextSteps: string[];
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  disclaimer: string;
}

interface UseCopilotReturn {
  run: (params: { question: string; context?: string; scenarios?: unknown[] }) => Promise<void>;
  loading: boolean;
  error: string | null;
  result: CopilotResult | null;
}

/**
 * React hook that calls /api/money-copilot and manages loading, error, and result state.
 */
export function useCopilot(): UseCopilotReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CopilotResult | null>(null);

  // Guard against concurrent calls
  const inFlightRef = useRef(false);

  const run = useCallback(
    async (params: { question: string; context?: string; scenarios?: unknown[] }) => {
      if (inFlightRef.current) return;

      inFlightRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const payload = {
          question: params.question,
          context: params.context ?? '',
          scenarios: params.scenarios ?? []
        };
        console.log('[Copilot] Request:', { question: params.question, context: params.context });

        const res = await fetch('/api/money-copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(30_000)
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({})) as { error?: string };
          const errMsg = data.error ?? `Request failed with status ${res.status}`;
          console.error('[Copilot] Error:', errMsg);
          throw new Error(errMsg);
        }

        const data = await res.json() as CopilotResult;
        console.log('[Copilot] Response:', data);

        if (!data || typeof (data as unknown as { error?: unknown }).error === 'string' || (data as unknown as { error?: unknown }).error === true) {
          const errData = data as unknown as { error?: unknown };
          console.error('[Copilot] API returned an error response:', data);
          setError(typeof errData.error === 'string' ? errData.error : 'Something went wrong. Please try again.');
          return;
        }

        setResult(data);
      } catch (err: unknown) {
        console.error('[Copilot] Error:', err);
        if (err instanceof Error && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    []
  );

  return { run, loading, error, result };
}
