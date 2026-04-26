'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export type NavLink = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

interface NavItemProps {
  item: NavLink;
  isActive: (href: string) => boolean;
  index: number;
}

export function NavItem({ item, isActive, index }: NavItemProps) {
  const active = item.href ? isActive(item.href) : item.children?.some((child) => isActive(child.href));

  return (
    <motion.li className="group relative" role="none" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.2 }}>
      {item.href ? (
        <Link
          className={`relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 ${
            active ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
          }`}
          href={item.href}
          role="menuitem"
        >
          {item.label}
          {item.children?.length ? <ChevronDownIcon className="h-4 w-4" /> : null}
          {active ? <span className="absolute inset-x-1 bottom-0 h-0.5 bg-current" /> : null}
        </Link>
      ) : null}

      {item.children?.length ? (
        <ul className="comparison-dropdown" role="menu" aria-label={`${item.label} menu`}>
          {item.children.map((child) => (
            <li key={child.href}>
              <Link className="comparison-dropdown-link" href={child.href}>
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.li>
  );
}
