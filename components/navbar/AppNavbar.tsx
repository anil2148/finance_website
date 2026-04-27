'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRegion } from '@/components/providers/RegionProvider';
import { MobileMenu } from '@/components/navbar/MobileMenu';
import { NavItem, type NavLink } from '@/components/navbar/NavItem';
import { RegionSelector } from '@/components/navbar/RegionSelector';
import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import { useAiPageContext } from '@/components/money-copilot/useAiPageContext';
import { withRegionPrefix, type RegionCode } from '@/lib/region-config';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { region, setRegion } = useRegion();

  const { dispatch } = useCopilot();
  const pageContext = useAiPageContext();

  const links = useMemo<NavLink[]>(() => {
    const toRegion = (href: string) => withRegionPrefix(href, region);

    return [
      {
        label: 'Decisions',
        href: toRegion('/comparison'),
        children: [
          { label: 'Start a decision', href: toRegion('/comparison') },
          { label: 'Calculators', href: toRegion('/calculators') },
          { label: 'Comparisons', href: toRegion('/comparison') }
        ]
      },
      { label: 'Calculators', href: toRegion('/calculators') },
      {
        label: 'Learn',
        href: toRegion('/learn'),
        children: [
          { label: 'Financial Guides', href: toRegion('/learn') },
          { label: 'Strategy Playbooks', href: toRegion('/learn') }
        ]
      },
      { label: 'AI Copilot', href: '/ai-money-copilot' }
    ];
  }, [region]);

  const switchRegion = useCallback(
    (nextRegion: RegionCode) => {
      setRegion(nextRegion);
    },
    [setRegion]
  );

  const activeCheck = useCallback((href: string) => isActive(pathname, href), [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95">
        <nav className="mx-auto max-w-7xl px-4 py-2" role="navigation" aria-label="Primary">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Link href={withRegionPrefix('/', region)} className="inline-flex items-center" aria-label="FinanceSphere home">
                <Image src="/images/financesphere-logo.svg" alt="FinanceSphere logo" width={190} height={48} priority className="h-12 w-auto" />
              </Link>

              <ul className="hidden items-center gap-0.5 md:flex" role="menubar">
                {links.map((item, i) => (
                  <NavItem key={item.label} item={item} isActive={activeCheck} index={i} />
                ))}
              </ul>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <RegionSelector region={region} onRegionChange={switchRegion} />
              <motion.button
                onClick={() => dispatch({ type: 'OPEN_DRAWER', payload: { pageContext } })}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-600 bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Start a decision
              </motion.button>
            </div>

            <button
              className="rounded-xl border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                <line x1="2" y1="5" x2="18" y2="5" />
                <line x1="2" y1="10" x2="18" y2="10" />
                <line x1="2" y1="15" x2="18" y2="15" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={links}
        isActive={activeCheck}
        expandedGroup={expandedGroup}
        setExpandedGroup={setExpandedGroup}
        region={region}
        onRegionChange={switchRegion}
        onStartDecision={() => dispatch({ type: 'OPEN_DRAWER', payload: { pageContext } })}
      />
    </>
  );
}
