'use client';

import { AppNavbar } from '@/components/navbar/AppNavbar';
import { Footer } from '@/components/footer/Footer';
import { PageTransition } from '@/components/ui/PageTransition';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ErrorMonitoring } from '@/components/monitoring/ErrorMonitoring';
import { CopilotProvider } from '@/components/money-copilot/CopilotProvider';
import { ExecutionPanel } from '@/components/money-copilot/ExecutionPanel';
import { CopilotBubble } from '@/components/money-copilot/CopilotBubble';
import { useRegion } from '@/components/providers/RegionProvider';
import { GeoDisclaimer } from '@/components/legal/GeoDisclaimer';

export function RegionAppFrame({ children }: { children: React.ReactNode }) {
  const { region } = useRegion();

  return (
    <div key={region}>
      <ErrorMonitoring />
      <CopilotProvider>
        <AppNavbar />
        <main className="editorial-content mx-auto min-h-screen max-w-7xl px-4 py-8">
          <Breadcrumbs />
          <PageTransition>{children}</PageTransition>
        </main>
        <GeoDisclaimer />
        <Footer />
        <ExecutionPanel />
        <CopilotBubble />
      </CopilotProvider>
    </div>
  );
}
