'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import { MoneyCopilotHero } from '@/components/money-copilot/MoneyCopilotHero';
import { IntakeForm } from '@/components/money-copilot/IntakeForm';
import { ResultCard } from '@/components/money-copilot/ResultCard';
import type { CopilotRequest, CopilotResponse } from '@/lib/money-copilot/types';

const SESSION_KEY = 'money-copilot-reports';

function loadSavedReports(): CopilotResponse[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as CopilotResponse[]) : [];
  } catch {
    return [];
  }
}

function saveReports(reports: CopilotResponse[]) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(reports));
  } catch {
    // sessionStorage unavailable — silently ignore
  }
}

function buildTextSummary(request: CopilotRequest, response: CopilotResponse): string {
  const lines: string[] = [
    'AI Money Copilot — Decision Report',
    '===================================',
    `Question: ${request.question}`,
    `Mode: ${request.mode}`,
    '',
    'SUMMARY',
    response.summary,
    '',
    'RECOMMENDATION',
    response.recommendation,
    '',
    'KEY METRICS',
    ...response.keyMetrics.map((m) => `  ${m.label}: ${m.value}${m.note ? ` (${m.note})` : ''}`),
    '',
    'RISKS',
    ...response.risks.map((r) => `  • ${r}`),
    '',
    'NEXT STEPS',
    ...response.nextSteps.map((s, i) => `  ${i + 1}. ${s}`),
    '',
    'ASSUMPTIONS',
    ...response.assumptions.map((a) => `  • ${a}`),
    '',
    response.disclaimer,
    '',
    `Generated: ${new Date().toLocaleString()}`
  ];
  return lines.join('\n');
}

export function CopilotWorkspace() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query') ?? '';

  const [currentRequest, setCurrentRequest] = useState<CopilotRequest | null>(null);
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedReports, setSavedReports] = useState<CopilotResponse[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState(queryParam);

  useEffect(() => {
    setSavedReports(loadSavedReports());
  }, []);

  const handleSelectPrompt = useCallback((prompt: string) => {
    setSelectedPrompt(prompt);
    trackEvent({ event: 'chip_selected', category: 'money_copilot', label: prompt });
    window.scrollTo({ top: document.getElementById('copilot-form')?.offsetTop ?? 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = useCallback(async (request: CopilotRequest) => {
    setCurrentRequest(request);
    setIsLoading(true);
    setError('');
    setResponse(null);

    trackEvent({
      event: 'started_decision',
      category: 'money_copilot',
      label: request.mode,
      metadata: { hasScenarios: request.scenarios.length > 0 }
    });

    try {
      console.log('[Copilot] Request:', { question: request.question, context: request.context });

      const res = await fetch('/api/money-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errMsg = (data as { error?: string }).error ?? `Request failed (${res.status})`;
        console.error('[Copilot] Error:', errMsg);
        throw new Error(errMsg);
      }

      const data: CopilotResponse = await res.json();
      console.log('[Copilot] Response:', data);

      const errData = data as unknown as { error?: unknown };
      if (!data || typeof errData.error === 'string' || errData.error === true) {
        console.error('[Copilot] API returned an error response:', data);
        setError(typeof errData.error === 'string' ? errData.error : 'Something went wrong. Please try again.');
        return;
      }

      setResponse(data);

      trackEvent({
        event: 'completed_decision',
        category: 'money_copilot',
        label: request.mode,
        metadata: { confidenceLevel: data.confidenceLevel, scenarioCount: data.scenarios.length }
      });

      if (request.scenarios.length >= 2) {
        trackEvent({ event: 'compared_scenarios', category: 'money_copilot', label: request.mode });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      console.error('[Copilot] Error:', err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveReport = useCallback(() => {
    if (!response) return;
    const updated = [response, ...savedReports].slice(0, 10);
    setSavedReports(updated);
    saveReports(updated);
    trackEvent({ event: 'saved_report', category: 'money_copilot' });
  }, [response, savedReports]);

  const handleExport = useCallback(() => {
    if (!response || !currentRequest) return;
    const text = buildTextSummary(currentRequest, response);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '');
    a.download = `money-copilot-${currentRequest.mode}-${dateStr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent({ event: 'exported_report', category: 'money_copilot', label: currentRequest.mode });
  }, [response, currentRequest]);

  const handleRestart = useCallback(() => {
    setResponse(null);
    setCurrentRequest(null);
    setError('');
    setSelectedPrompt('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="space-y-8">
      <MoneyCopilotHero onSelectChip={handleSelectPrompt} />

      <div id="copilot-form">
        <IntakeForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialQuestion={selectedPrompt}
        />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500 dark:text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm font-medium">Analyzing your decision…</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-700/40 dark:bg-red-950/20">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Analysis error</p>
          <p className="mt-0.5 text-sm text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={handleRestart}
            className="mt-2 text-xs font-semibold text-red-700 underline dark:text-red-400"
          >
            Start over
          </button>
        </div>
      )}

      {response && !isLoading && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your analysis</h2>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                onClick={handleSaveReport}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                Save report
              </button>
              <button
                onClick={handleExport}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                Export as text
              </button>
              <button
                onClick={handleRestart}
                className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-700/40 dark:bg-blue-950/30 dark:text-blue-400"
              >
                New analysis
              </button>
            </div>
          </div>

          <ResultCard response={response} />
        </div>
      )}

      {savedReports.length > 0 && !response && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Saved reports this session ({savedReports.length})
          </p>
          <div className="space-y-2">
            {savedReports.map((report, i) => (
              <button
                key={i}
                onClick={() => setResponse(report)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm transition-colors hover:border-blue-300 dark:border-slate-600 dark:bg-slate-800"
              >
                <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{report.summary.slice(0, 80)}…</p>
                <p className="mt-0.5 text-xs text-slate-400">Confidence: {report.confidenceLevel}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
