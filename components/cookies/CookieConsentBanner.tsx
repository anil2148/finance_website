'use client';

import { useEffect, useMemo, useState } from 'react';

const CONSENT_KEY = 'fs_cookie_consent';
type ConsentState = 'accepted' | 'rejected' | null;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    __fsTrackingEnabled?: boolean;
  }
}

function injectGoogleAnalytics(measurementId: string) {
  if (document.getElementById('ga-loader')) return;

  const script = document.createElement('script');
  script.id = 'ga-loader';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push({ gtagArgs: args });
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: true });
}

function injectGtm(gtmId: string) {
  if (document.getElementById('gtm-loader')) return;

  const script = document.createElement('script');
  script.id = 'gtm-loader';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.appendChild(script);
}

export function CookieConsentBanner({ gaMeasurementId, gtmId }: { gaMeasurementId?: string; gtmId?: string }) {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY) as ConsentState;
    setConsent(storedConsent);
  }, []);

  useEffect(() => {
    const trackingEnabled = consent === 'accepted';
    window.__fsTrackingEnabled = trackingEnabled;

    if (trackingEnabled) {
      if (gaMeasurementId) injectGoogleAnalytics(gaMeasurementId);
      if (gtmId) injectGtm(gtmId);
    }

    const onAffiliateClick = (event: MouseEvent) => {
      if (window.__fsTrackingEnabled) return;
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[rel*="sponsored"]') as HTMLAnchorElement | null;
      if (!link) return;

      event.preventDefault();
      setShowNotice(true);
    };

    document.addEventListener('click', onAffiliateClick, true);
    return () => document.removeEventListener('click', onAffiliateClick, true);
  }, [consent, gaMeasurementId, gtmId]);

  const isBannerVisible = useMemo(() => consent === null, [consent]);

  const saveChoice = (choice: Exclude<ConsentState, null>) => {
    localStorage.setItem(CONSENT_KEY, choice);
    setConsent(choice);
    setShowNotice(false);
  };

  return (
    <>
      {showNotice && (
        <div className="fixed bottom-28 right-4 z-50 max-w-xs rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-lg md:right-6">
          Affiliate tracking links are disabled until you accept non-essential cookies.
        </div>
      )}

      {isBannerVisible && (
        <div className="fixed inset-x-3 bottom-3 z-50 rounded-xl border border-slate-200 bg-white p-4 shadow-xl md:inset-x-6 md:bottom-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl text-sm text-slate-700 dark:text-slate-200">
              <p className="font-semibold text-slate-900 dark:text-white">Cookie consent</p>
              <p>
                FinanceSphere uses essential cookies for site functionality and optional analytics + affiliate tracking cookies to improve content and fund the site.
                You can accept or reject non-essential cookies now, and update your choice later from the Cookie Policy page.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => saveChoice('rejected')}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => saveChoice('accepted')}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
