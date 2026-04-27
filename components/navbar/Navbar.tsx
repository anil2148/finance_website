'use client';

import { AppNavbar } from '@/components/navbar/AppNavbar';

/**
 * Legacy compatibility export.
 *
 * Keep a single navigation implementation (AppNavbar) across the app.
 */
export function Navbar() {
  return <AppNavbar />;
}
