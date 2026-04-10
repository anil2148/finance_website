'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

type NavLink = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  pathname: string;
  isActive: (href: string) => boolean;
  isIndiaContext: boolean;
  expandedGroup: string | null;
  setExpandedGroup: (group: string | null) => void;
  currentRegionLabel: string;
  currentCurrencyLabel: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onRegionChange: (region: 'India' | 'US') => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
};

const drawerVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 320, damping: 32, mass: 0.9 },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  exit: {},
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, x: 12, transition: { duration: 0.12, ease: 'easeIn' } },
};

export function MobileMenu({
  open,
  onClose,
  links,
  isActive,
  isIndiaContext,
  expandedGroup,
  setExpandedGroup,
  currentRegionLabel,
  currentCurrencyLabel,
  darkMode,
  toggleDarkMode,
  onRegionChange,
}: MobileMenuProps) {
  // Prevent background scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC key closes menu
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-in drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Menu</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Nav links with stagger */}
            <motion.ul
              className="flex-1 space-y-1 px-4 py-4 text-sm"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {links.map((item) => (
                <motion.li key={item.label} variants={itemVariants}>
                  {item.href ? (
                    <Link
                      className={`block rounded-xl px-3 py-2.5 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:text-slate-200 ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200'
                          : 'text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      href={item.href}
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700">
                      <button
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-medium text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:text-slate-100 dark:hover:bg-slate-800/50"
                        onClick={() => setExpandedGroup(expandedGroup === item.label ? null : item.label)}
                        aria-expanded={expandedGroup === item.label}
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: expandedGroup === item.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDownIcon className="h-4 w-4 text-slate-500" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {expandedGroup === item.label && (
                          <motion.ul
                            key="children"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
                            exit={{ height: 0, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-slate-200 px-2 py-2 dark:border-slate-700">
                              {item.children?.map((child) => (
                                <li key={child.href} className="list-none">
                                  <Link
                                    className="block rounded-lg px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 dark:text-slate-300 dark:hover:bg-slate-800"
                                    href={child.href}
                                    onClick={onClose}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </div>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.li>
              ))}
            </motion.ul>

            {/* Bottom actions */}
            <motion.div
              className="space-y-3 border-t border-slate-200 px-4 py-4 dark:border-slate-700"
              variants={itemVariants}
            >
              <Link
                href={isIndiaContext ? '/ai-money-copilot' : '/ai-money-copilot'}
                className="btn-primary w-full text-sm"
                onClick={onClose}
              >
                ✦ AI Copilot
              </Link>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">Region</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  aria-label="Region"
                  value={isIndiaContext ? 'India' : 'US'}
                  onChange={(e) => {
                    onRegionChange(e.target.value as 'India' | 'US');
                    onClose();
                  }}
                >
                  <option value="India">India</option>
                  <option value="US">United States</option>
                </select>
                <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Current: {currentRegionLabel} ({currentCurrencyLabel})
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
