'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { getCountryForPath, getCountrySwitchPath } from '@/lib/preferences';
import { setPreferredRegionCookie } from '@/lib/region-preference';
import { MobileMenu } from '@/components/navbar/MobileMenu';
import { NavItem } from '@/components/navbar/NavItem';
import { StartDecisionModal } from '@/components/money-copilot/StartDecisionModal';

type NavLink = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

const globalLinks: NavLink[] = [
  { label: 'Decisions', href: '/comparison' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Learn', href: '/learn' },
  { label: 'AI Copilot', href: '/ai-money-copilot' }
];

const indiaLinks: NavLink[] = [
  { label: 'Decisions', href: '/in/loans' },
  { label: 'Calculators', href: '/in/calculators' },
  { label: 'Learn', href: '/in/banking' },
  { label: 'AI Copilot', href: '/ai-money-copilot' }
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const hamVariants = {
  closed: {},
  open: {},
};

const hamTop = {
  closed: { rotate: 0, translateY: 0 },
  open: { rotate: 45, translateY: 6 },
};

const hamMid = {
  closed: { opacity: 1 },
  open: { opacity: 0 },
};

const hamBot = {
  closed: { rotate: 0, translateY: 0 },
  open: { rotate: -45, translateY: -6 },
};

const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { country, darkMode, setCountry, toggleDarkMode } = usePreferences();

  useEffect(() => {
    const pathCountry = getCountryForPath(pathname);
    if (pathCountry !== country) setCountry(pathCountry);
  }, [country, pathname, setCountry]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isIndiaContext = pathname === '/in' || pathname.startsWith('/in/');
  const links = isIndiaContext ? indiaLinks : globalLinks;
  const currentRegionLabel = isIndiaContext ? 'India' : 'United States';
  const currentCurrencyLabel = isIndiaContext ? 'INR' : 'USD';
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);

  const switchRegion = (nextRegion: 'India' | 'US') => {
    const nextPath = getCountrySwitchPath(pathname, nextRegion);
    const regionCookieValue = nextRegion === 'India' ? 'in' : 'us';
    setPreferredRegionCookie(regionCookieValue);
    setCountry(nextRegion);
    if (nextPath !== pathname) {
      // Route through the API endpoint so the response sets the cookie server-side
      // before redirecting to the destination page.
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
          backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.90)',
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
          <div className="flex items-center justify-between gap-3">
            {/* Logo with entrance animation */}
            <motion.div variants={logoVariants} initial="hidden" animate="visible">
              <Link href={isIndiaContext ? '/in' : '/'} className="inline-flex items-center" aria-label="FinanceSphere home">
                <Image
                  src="/images/financesphere-logo.svg"
                  alt="FinanceSphere logo"
                  width={260}
                  height={64}
                  loading="lazy"
                  priority={false}
                  className={`w-auto transition-[height] duration-200 ${scrolled ? 'h-14' : 'h-16'}`}
                />
              </Link>
            </motion.div>

            {/* Mobile hamburger — animated icon */}
            <motion.button
              className="rounded-xl border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 md:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              variants={hamVariants}
              animate={open ? 'open' : 'closed'}
              whileTap={{ scale: 0.92 }}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <motion.line x1="2" y1="5" x2="18" y2="5" variants={hamTop} transition={{ duration: 0.22 }} />
                <motion.line x1="2" y1="10" x2="18" y2="10" variants={hamMid} transition={{ duration: 0.15 }} />
                <motion.line x1="2" y1="15" x2="18" y2="15" variants={hamBot} transition={{ duration: 0.22 }} />
              </svg>
            </motion.button>

            {/* Desktop nav */}
            <div className="hidden items-center gap-3 md:flex">
              <ul className="flex items-center gap-0.5" role="menubar">
                {links.map((item, i) => (
                  <NavItem key={item.label} item={item} isActive={activeCheck} index={i} />
                ))}
              </ul>

              {/* Start a Decision primary CTA */}
              <motion.button
                onClick={() => setDecisionModalOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
              >
                <span>▶</span> Start a Decision
              </motion.button>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Region</span>
                <select
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  aria-label="Region"
                  value={isIndiaContext ? 'India' : 'US'}
                  onChange={(event) => switchRegion(event.target.value as 'India' | 'US')}
                >
                  <option value="India">India</option>
                  <option value="US">United States</option>
                </select>
              </label>
              <span className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
                {currentRegionLabel} ({currentCurrencyLabel})
              </span>
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
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer — rendered in a portal-like fashion outside the header */}
      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
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

      {/* Start a Decision guided flow modal */}
      <StartDecisionModal open={decisionModalOpen} onClose={() => setDecisionModalOpen(false)} />
    </>
  );
}
