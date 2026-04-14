'use client';

import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import type { AiPageContext } from '@/lib/money-copilot/types';
import { useAiPageContext } from '@/components/money-copilot/useAiPageContext';

interface AskAIButtonProps {
  /** Optional question to pre-fill in the AI panel */
  prefillQuestion?: string;
  /** Button label text */
  label?: string;
  /** Tailwind class overrides for the button */
  className?: string;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Optional structured page context payload override */
  aiContext?: Partial<AiPageContext>;
}

/**
 * Contextual "Ask AI" entry point button.
 *
 * Renders a button that opens the AI Decision Assistant drawer,
 * optionally pre-filling the question from context (e.g. a calculator result).
 */
export function AskAIButton({
  prefillQuestion,
  label = 'Ask AI',
  className = '',
  variant = 'secondary',
  aiContext,
}: AskAIButtonProps) {
  const { dispatch } = useCopilot();
  const pageContext = useAiPageContext(aiContext);

  const baseClass = 'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

  const variantClass = {
    primary: 'border border-blue-500 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 focus-visible:ring-blue-400 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20',
    ghost: 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-transparent dark:text-slate-300',
  }[variant];

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'OPEN_DRAWER', payload: { prefillQuestion, pageContext } })}
      className={`${baseClass} ${variantClass} ${className}`}
      aria-label={prefillQuestion ? `Ask AI: ${prefillQuestion}` : 'Open AI Decision Assistant'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
