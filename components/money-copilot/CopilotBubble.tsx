'use client';

import { usePathname } from 'next/navigation';
import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import { useAiPageContext } from '@/components/money-copilot/useAiPageContext';

/**
 * CopilotBubble — floating "Ask AI" button in the bottom-right corner.
 *
 * Visible sitewide. Clicking it opens the AI Decision Assistant drawer
 * (ExecutionPanel) in input mode. Hidden while the panel is already open.
 */
export function CopilotBubble() {
  const pathname = usePathname();
  const { state, dispatch } = useCopilot();
  const pageContext = useAiPageContext();

  if (state.isExecutionPanelOpen || pageContext.aiMode === 'hidden') return null;

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'OPEN_DRAWER', payload: { pageContext } })}
      aria-label="Open AI Decision Assistant"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-blue-500 bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 dark:border-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>{pathname.includes('/learn/') || pathname.includes('/blog/') ? 'Ask AI (general)' : 'Ask AI'}</span>
    </button>
  );
}
