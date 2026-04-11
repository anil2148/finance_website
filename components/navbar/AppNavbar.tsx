'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { getCountryForPath, getCountrySwitchPath } from '@/lib/preferences';
import { setPreferredRegionCookie } from '@/lib/region-preference';
import { MobileMenu } from '@/components/navbar/MobileMenu';
import { NavItem } from '@/components/navbar/NavItem';
import { CopilotInput } from '@/components/navbar/CopilotInput';
import { RegionSelector } from '@/components/navbar/RegionSelector';
import { StartDecisionModal } from '@/components/money-copilot/StartDecisionModal';

type NavLink = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

const globalLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Scenarios',
    children: [
      { label: 'Job Offer Analyzer', href: '/ai-money-copilot' },
      { label: 'Mortgage vs Rent', href: '/calculators/mortgage-calculator' },
      { label: 'Early Retirement Path', href: '/calculators/retirement-calculator' },
      { label: 'Debt Payoff Planner', href: '/calculators/debt-payoff-calculator' },
    ],
  },
  {
    label: 'Tools',
    children: [
      { label: 'Debt Payoff Calculator', href: '/calculators/debt-payoff-calculator' },
      { label: 'Mortgage Planner', href: '/calculators/mortgage-calculator' },
      { label: 'Investment Growth', href: '/calculators/investment-growth-calculator' },
      { label: 'Tax Calculator', href: '/calculators/salary-after-tax-calculator' },
    ],
  },
  {
    label: 'Learn',
    children: [
      { label: 'Financial Guides', href: '/learn' },
      { label: 'Strategy Playbooks', href: '/blog' },
    ],
  },
  {
    label: 'Reports',
    children: [
      { label: 'Decision History', href: '/ai-money-copilot' },
      { label: 'Saved Scenarios', href: '/ai-money-copilot' },
    ],
  },
];

const indiaLinks: NavLink[] = [
  { label: 'Home', href: '/in' },
  {
    label: 'Scenarios',
    children: [
      { label: 'Salary Planner (CTC)', href: '/ai-money-copilot' },
      { label: 'Loan vs Investment', href: '/in/calculators/emi-calculator' },
      { label: 'SIP Growth Simulator', href: '/in/calculators/sip-calculator' },
      { label: 'Tax Optimization', href: '/in/tax' },
    ],
  },
  {
    label: 'Tools',
    children: [
      { label: 'EMI Calculator', href: '/in/calculators/emi-calculator' },
      { label: 'SIP Calculator', href: '/in/calculators/sip-calculator' },
      { label: 'Tax Calculator (India)', href: '/in/tax' },
      { label: 'All Calculators', href: '/in/calculators' },
    ],
  },
  {
    label: 'Learn',
    children: [
      { label: 'Financial Guides', href: '/in/banking' },
      { label: 'Strategy Playbooks', href: '/in/blog' },
    ],
  },
  {
    label: 'Reports',
    children: [
      { label: 'Decision History', href: '/ai-money-copilot' },
      { label: 'Saved Scenarios', href: '/ai-money-copilot' },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Hamburger animation variants
const hamTop = { closed: { rotate: 0, translateY: 0 }, open: { rotate: 45, translateY: 6 } };
const hamMid = { closed: { opacity: 1 }, open: { opacity: 0 } };
const hamBot = { closed: { rotate: 0, translateY: 0 }, open: { rotate: -45, translateY: -6 } };

const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * AppNavbar — enterprise-grade 3-section navigation for FinanceSphere.
 *
 * Layout:
 *   LEFT   — Logo + primary nav items (Home, Scenarios, Tools, Learn, Reports)
 *   CENTER — AI Copilot command bar (visually dominant, flex-1)
 *   RIGHT  — Start a Decision CTA · Region selector · Currency badge · Theme toggle
 *
 * Mobile: hamburger collapses LEFT+RIGHT; Copilot input expands full-width below the header bar.
 */
export function AppNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileCopilotVisible, setMobileCopilotVisible] = useState(false);
  const { country, darkMode, setCountry, toggleDarkMode } = usePreferences();
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);

  // Sync region with path
  useEffect(() => {
    const pathCountry = getCountryForPath(pathname);
    if (pathCountry !== country) setCountry(pathCountry);
  }, [country, pathname, setCountry]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isIndiaContext = pathname === '/in' || pathname.startsWith('/in/');
  const links = isIndiaContext ? indiaLinks : globalLinks;
  const currentRegionLabel = isIndiaContext ? 'India' : 'United States';
  const currentCurrencyLabel = isIndiaContext ? 'INR' : 'USD';

  const switchRegion = (nextRegion: 'India' | 'US') => {
    const nextPath = getCountrySwitchPath(pathname, nextRegion);
    const regionCookieValue = nextRegion === 'India' ? 'in' : 'us';
    setPreferredRegionCookie(regionCookieValue);
    setCountry(nextRegion);
    if (nextPath !== pathname) {
      const redirectUrl = `/api/region?region=${regionCookieValue}&next=${encodeURIComponent(nextPath)}`;
      window.location.assign(redirectUrl);
    }
  };

  const activeCheck = (href: string) => isActive(pathname, href);

  return (
    <>
      <motion.header
        className="sticky top-0 z-30 border-b"
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)',
          borderColor: scrolled ? 'rgba(148,163,184,0.6)' : 'rgba(148,163,184,0.4)',
          boxShadow: scrolled
            ? '0 4px 24px -4px rgba(15,23,42,0.12), 0 1px 4px -1px rgba(15,23,42,0.06)'
            : '0 1px 2px 0 rgba(15,23,42,0.04)',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)' }}
      >
        <nav
          className={`mx-auto max-w-7xl px-4 transition-[padding] duration-200 ${scrolled ? 'py-1' : 'py-1.5'}`}
          role="navigation"
          aria-label="Primary"
        >
          {/* ── Main row: LEFT | CENTER | RIGHT ── */}
          <div className="flex items-center gap-3">

            {/* ── LEFT: Logo + Nav items ── */}
            <div className="flex shrink-0 items-center gap-2">
              <motion.div variants={logoVariants} initial="hidden" animate="visible">
                <Link
                  href={isIndiaContext ? '/in' : '/'}
                  className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
                  aria-label="FinanceSphere home"
                >
                  <Image
                    src="/images/financesphere-logo.svg"
                    alt="FinanceSphere logo"
                    width={200}
                    height={52}
                    priority
                    className={`w-auto transition-[height] duration-200 ${scrolled ? 'h-12' : 'h-14'}`}
                  />
                </Link>
              </motion.div>

              {/* Primary nav items — desktop only */}
              <ul className="hidden items-center gap-0.5 lg:flex" role="menubar">
                {links.map((item, i) => (
                  <NavItem key={item.label} item={item} isActive={activeCheck} index={i} />
                ))}
              </ul>
            </div>

            {/* ── CENTER: AI Copilot Command Bar — desktop only, flex-1.
                 min-w-0 lets this flex item shrink without overflowing its siblings. */}
            <div className="hidden min-w-0 flex-1 lg:block">
              <CopilotInput className="w-full" />
            </div>

            {/* ── RIGHT: CTA · Region · Currency · Theme ── */}
            <div className="hidden items-center gap-2 lg:flex">
              {/* Start a Decision CTA */}
              <motion.button
                onClick={() => setDecisionModalOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
              >
                <span>▶</span>
                <span className="hidden xl:inline">Start a Decision</span>
                <span className="xl:hidden">Start</span>
              </motion.button>

              {/* Region selector + currency badge */}
              <RegionSelector
                isIndiaContext={isIndiaContext}
                currentRegionLabel={currentRegionLabel}
                currentCurrencyLabel={currentCurrencyLabel}
                onRegionChange={switchRegion}
              />

              {/* Theme toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className="rounded-lg border border-slate-300 p-1.5 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle dark mode"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.08 }}
              >
                {darkMode ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                )}
              </motion.button>
            </div>

            {/* ── MOBILE: Copilot toggle + hamburger ── */}
            <div className="ml-auto flex items-center gap-2 lg:hidden">
              {/* Copilot quick-access icon */}
              <motion.button
                onClick={() => setMobileCopilotVisible((v) => !v)}
                whileTap={{ scale: 0.9 }}
                className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                aria-label={mobileCopilotVisible ? 'Hide AI Copilot' : 'Open AI Copilot'}
                aria-expanded={mobileCopilotVisible}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.button>

              {/* Hamburger */}
              <motion.button
                className="rounded-xl border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                animate={mobileOpen ? 'open' : 'closed'}
                whileTap={{ scale: 0.92 }}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <motion.line x1="2" y1="5" x2="18" y2="5" variants={hamTop} transition={{ duration: 0.22 }} />
                  <motion.line x1="2" y1="10" x2="18" y2="10" variants={hamMid} transition={{ duration: 0.15 }} />
                  <motion.line x1="2" y1="15" x2="18" y2="15" variants={hamBot} transition={{ duration: 0.22 }} />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* ── MOBILE: Copilot full-width row (animated) ── */}
          <AnimatePresence initial={false}>
            {mobileCopilotVisible && (
              <motion.div
                key="mobile-copilot"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } }}
                exit={{ height: 0, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
                className="overflow-hidden lg:hidden"
              >
                <div className="pb-2 pt-1">
                  <CopilotInput className="w-full" compact />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Mobile slide-in drawer */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={links}
        pathname={pathname}
        isActive={activeCheck}
        isIndiaContext={isIndiaContext}
        expandedGroup={expandedGroup}
        setExpandedGroup={(g) => setExpandedGroup(g)}
        currentRegionLabel={currentRegionLabel}
        currentCurrencyLabel={currentCurrencyLabel}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onRegionChange={switchRegion}
        onStartDecision={() => setDecisionModalOpen(true)}
      />

      {/* Start a Decision modal */}
      <StartDecisionModal open={decisionModalOpen} onClose={() => setDecisionModalOpen(false)} />
    </>
  );
}
