import type { AiPageContext } from '@/lib/money-copilot/types';

type RuntimeContextMap = Map<string, Partial<AiPageContext>>;

const runtimeContextByPath: RuntimeContextMap = new Map();

const EVENT_NAME = 'financesphere:ai-page-context-updated';

function emitContextEvent(pathname: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { pathname } }));
}

export function getRuntimeAiPageContext(pathname: string): Partial<AiPageContext> | undefined {
  return runtimeContextByPath.get(pathname);
}

export function setRuntimeAiPageContext(pathname: string, context: Partial<AiPageContext>): void {
  runtimeContextByPath.set(pathname, context);
  emitContextEvent(pathname);
}

export function clearRuntimeAiPageContext(pathname: string): void {
  if (!runtimeContextByPath.has(pathname)) return;
  runtimeContextByPath.delete(pathname);
  emitContextEvent(pathname);
}

export function subscribeRuntimeAiPageContext(listener: (pathname: string) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ pathname?: string }>;
    listener(customEvent.detail?.pathname ?? '/');
  };

  window.addEventListener(EVENT_NAME, handler as EventListener);
  return () => {
    window.removeEventListener(EVENT_NAME, handler as EventListener);
  };
}

