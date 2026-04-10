'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type NavLink = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

interface NavItemProps {
  item: NavLink;
  isActive: (href: string) => boolean;
  index: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: 'easeOut' },
  }),
};

export function NavItem({ item, isActive, index }: NavItemProps) {
  const active = item.href ? isActive(item.href) : false;

  return (
    <motion.li
      className="group relative"
      role="none"
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      {item.href ? (
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <Link
            className={`relative rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 ${
              active
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-blue-500/20 dark:text-blue-200 dark:ring-blue-500/40'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
            href={item.href}
            role="menuitem"
          >
            {item.label}
            {active && (
              <motion.span
                layoutId="active-underline"
                className="absolute inset-x-1 bottom-0.5 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </Link>
        </motion.div>
      ) : (
        <Fragment>
          <button
            className="comparison-nav-trigger inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-haspopup="true"
          >
            {item.label}
            <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>
          <ul className="comparison-dropdown" role="menu" aria-label={`${item.label} menu`}>
            {item.children?.map((child) => (
              <li key={child.href}>
                <Link className="comparison-dropdown-link" href={child.href}>
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </Fragment>
      )}
    </motion.li>
  );
}
