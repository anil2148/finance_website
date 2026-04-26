'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { RegionSelector } from '@/components/navbar/RegionSelector';
import type { NavLink } from '@/components/navbar/NavItem';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  isActive: (href: string) => boolean;
  isIndiaContext: boolean;
  expandedGroup: string | null;
  setExpandedGroup: (group: string | null) => void;
  onRegionChange: (region: 'India' | 'US') => void;
  onStartDecision?: () => void;
}

export function MobileMenu({
  open,
  onClose,
  links,
  isActive,
  isIndiaContext,
  expandedGroup,
  setExpandedGroup,
  onRegionChange,
  onStartDecision,
}: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

          <motion.div
            className="fixed inset-x-0 top-[65px] z-50 flex max-h-[calc(100vh-65px)] w-full flex-col border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 md:hidden"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <ul className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
              {links.map((item) => (
                <li key={item.label}>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700">
                    <Link
                      href={item.href ?? '#'}
                      onClick={(event) => {
                        if (!item.children?.length) onClose();
                        if (!item.href) event.preventDefault();
                      }}
                      className={`flex items-center justify-between px-3 py-3 text-sm font-medium ${
                        item.href && isActive(item.href) ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      <span className="relative">
                        {item.label}
                        {item.href && isActive(item.href) ? <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-current" /> : null}
                      </span>
                      {item.children?.length ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            setExpandedGroup(expandedGroup === item.label ? null : item.label);
                          }}
                          aria-label={`Toggle ${item.label}`}
                        >
                          <ChevronDownIcon className={`h-4 w-4 transition ${expandedGroup === item.label ? 'rotate-180' : ''}`} />
                        </button>
                      ) : null}
                    </Link>

                    {item.children?.length && expandedGroup === item.label ? (
                      <ul className="space-y-1 border-t border-slate-200 px-3 py-2 dark:border-slate-700">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link className="block rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" href={child.href} onClick={onClose}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}

              <li>
                <RegionSelector mobile isIndiaContext={isIndiaContext} onRegionChange={(region) => {
                  onRegionChange(region);
                  onClose();
                }} />
              </li>
            </ul>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartDecision?.();
                }}
                className="w-full rounded-xl border border-blue-600 bg-blue-600 py-2.5 text-sm font-semibold text-white"
              >
                Start a decision
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
