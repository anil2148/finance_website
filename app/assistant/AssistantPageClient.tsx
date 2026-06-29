'use client';

import dynamic from 'next/dynamic';

const AssistantShell = dynamic(() => import('@/components/assistant/AssistantShell'), {
  ssr: false
});

export function AssistantPageClient() {
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-[#0f0f1a]">
      <AssistantShell />
    </div>
  );
}
