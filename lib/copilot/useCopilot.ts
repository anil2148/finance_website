'use client';

import { useState, useRef, useCallback } from 'react';
import type { CopilotResponse } from '@/lib/money-copilot/types';

// Re-export for callers that previously imported CopilotResult from this module
export type { CopilotResponse as CopilotResult };

interface UseCopilotReturn {
  run: (params: { question: string; context?: string; scenarios?: unknown[] }) => Promise<void>;
  loading: boolean;
  error: string | null;
  result: CopilotResponse | null;
  /** Progressive AI narrative text shown during streaming (typing effect). */
  streamingText: string;
}

/**
 * React hook that calls /api/money-copilot via Server-Sent Events (SSE) and
 * manages loading, error, result, and streaming-text state.
 *
 * SSE event types emitted by the server:
 *   "base"      – initial rule-based CopilotResponse (rendered immediately)
 *   "chunk"     – AI narrative text delta  (appended to streamingText)
 *   "narrative" – final merged CopilotResponse (replaces base response)
 *   "[DONE]"    – stream complete
 */
export function useCopilot(): UseCopilotReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CopilotResponse | null>(null);
  const [streamingText, setStreamingText] = useState('');

  // Guard against concurrent calls
  const inFlightRef = useRef(false);

  const run = useCallback(
    async (params: { question: string; context?: string; scenarios?: unknown[] }) => {
      if (inFlightRef.current) return;

      inFlightRef.current = true;
      setLoading(true);
      setError(null);
      setStreamingText('');

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
          signal: AbortSignal.timeout(60_000)
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({})) as { error?: string };
          const errMsg = data.error ?? `Request failed with status ${res.status}`;
          console.error('[Copilot] Error:', errMsg);
          throw new Error(errMsg);
        }

        // Handle both SSE streaming responses (text/event-stream) and plain JSON fallbacks
        const contentType = res.headers.get('content-type') ?? '';
        if (!contentType.includes('text/event-stream')) {
          // Fallback: plain JSON (e.g. cache hit returned by an older route or quick mode)
          const data = await res.json() as CopilotResponse;
          if (data && typeof (data as unknown as { error?: unknown }).error === 'string') {
            setError((data as unknown as { error: string }).error);
            return;
          }
          setResult(data);
          return;
        }

        // SSE streaming path
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE events are delimited by double newlines
          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';

          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith('data: ')) continue;

            const raw = line.slice(6).trim();
            if (raw === '[DONE]') break;

            try {
              const event = JSON.parse(raw) as {
                type: 'base' | 'chunk' | 'narrative' | 'error';
                payload?: CopilotResponse;
                content?: string;
                message?: string;
              };

              if (event.type === 'base' && event.payload) {
                console.log('[Copilot] Base response received');
                setResult(event.payload);
              } else if (event.type === 'chunk' && event.content) {
                setStreamingText(prev => prev + event.content);
              } else if (event.type === 'narrative' && event.payload) {
                console.log('[Copilot] Final narrative received');
                setResult(event.payload);
                setStreamingText('');
              } else if (event.type === 'error') {
                throw new Error(event.message ?? 'Streaming error');
              }
            } catch (parseErr) {
              // Ignore malformed SSE lines
              console.warn('[Copilot] Failed to parse SSE event:', parseErr);
            }
          }
        }
      } catch (err: unknown) {
        console.error('[Copilot] Error:', err);
        if (err instanceof Error && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
        setStreamingText('');
        inFlightRef.current = false;
      }
    },
    []
  );

  return { run, loading, error, result, streamingText };
}
