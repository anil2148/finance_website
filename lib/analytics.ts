export type AnalyticsEvent = {
  event: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean>;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(payload: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: payload.event,
    event_category: payload.category,
    event_label: payload.label,
    value: payload.value,
    ...payload.metadata
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', payload.event, {
      event_category: payload.category,
      event_label: payload.label,
      value: payload.value,
      ...payload.metadata
    });
  }
}
