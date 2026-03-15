'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Sentry?: { captureException?: (error: unknown) => void };
  }
}

export function ErrorMonitoring() {
  useEffect(() => {
    // Monitoring: collect runtime JS errors and send to Sentry if available, otherwise console-report.
    const onError = (event: ErrorEvent) => {
      if (window.Sentry?.captureException) {
        window.Sentry.captureException(event.error ?? event.message);
        return;
      }
      console.error('[FinanceSphere][RuntimeError]', event.error ?? event.message);
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (window.Sentry?.captureException) {
        window.Sentry.captureException(event.reason);
        return;
      }
      console.error('[FinanceSphere][UnhandledRejection]', event.reason);
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
