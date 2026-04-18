"use client";

import dynamic from 'next/dynamic';

const AssistantShell = dynamic(() => import('@/components/assistant/AssistantShell'), {
  ssr: false
});

export default function AssistantPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0f0f1a] flex items-center justify-center">
      <AssistantShell />
    </div>
  );
}
