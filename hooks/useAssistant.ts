"use client";

import { useCallback, useRef } from 'react';
import { ask, clearCache as apiClearCache, createStreamSocket, transcribe as apiTranscribe } from '@/lib/api';

interface SendCallbacks {
  onStart: () => void;
  onToken: (token: string) => void;
  onDone: (full: string) => void;
  onError: (message: string) => void;
  onTokenEstimate: (amount: number) => void;
}

export function useAssistant(callbacks: SendCallbacks) {
  const wsRef = useRef<WebSocket | null>(null);

  const stopStreaming = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    callbacks.onDone('');
  }, [callbacks]);

  const fetchFollowups = useCallback(async (prompt: string, answer: string): Promise<string[]> => {
    try {
      const followupPrompt =
        'Given this Q&A, suggest exactly 3 short follow-up questions (one per line, no numbering, max 8 words each):\n\nQ: ' +
        prompt.slice(0, 200) +
        '\nA: ' +
        answer.slice(0, 400);

      const text = await ask(followupPrompt);
      return text
        .split('\n')
        .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
        .filter(Boolean)
        .slice(0, 3);
    } catch {
      return [];
    }
  }, []);

  const fallbackAsk = useCallback(
    async (prompt: string, persona: string, template: string) => {
      try {
        const answer = await ask(prompt, persona, template);
        callbacks.onToken(answer);
        callbacks.onTokenEstimate(Math.floor((prompt.length + answer.length) / 4));
        callbacks.onDone(answer);
      } catch (error) {
        callbacks.onError(error instanceof Error ? error.message : 'Request failed');
      }
    },
    [callbacks]
  );

  const sendMessage = useCallback(
    (prompt: string, persona: string, template: string) => {
      const payload = { prompt, persona, template };
      let gotToken = false;
      let retries = 0;

      callbacks.onStart();

      const connect = () => {
        try {
          const socket = createStreamSocket(
            (token) => {
              gotToken = true;
              callbacks.onToken(token);
            },
            (full) => {
              callbacks.onTokenEstimate(Math.floor((prompt.length + full.length) / 4));
              callbacks.onDone(full);
              wsRef.current = null;
            },
            (message) => {
              if (!gotToken && retries < 1) {
                retries += 1;
                setTimeout(connect, 1000);
                return;
              }

              if (!gotToken) {
                void fallbackAsk(prompt, persona, template);
              } else {
                callbacks.onError(message);
              }
              wsRef.current = null;
            }
          );

          wsRef.current = socket;
          socket.onopen = () => {
            socket.send(JSON.stringify(payload));
          };
        } catch (error) {
          callbacks.onError(error instanceof Error ? error.message : 'WebSocket failed');
        }
      };

      connect();
    },
    [callbacks, fallbackAsk]
  );

  const transcribeAudio = useCallback(async (blob: Blob): Promise<string> => {
    try {
      const data = await apiTranscribe(blob);
      return data.text ?? '';
    } catch {
      return '';
    }
  }, []);

  const clearCache = useCallback(async (): Promise<void> => {
    await apiClearCache();
  }, []);

  return {
    sendMessage,
    stopStreaming,
    transcribeAudio,
    fetchFollowups,
    clearCache
  };
}
