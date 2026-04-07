/**
 * Centralized AdSense slot IDs.
 * Set the corresponding NEXT_PUBLIC_ADSENSE_SLOT_* environment variables in
 * your hosting dashboard (Vercel / .env.local) before going live.
 * Leaving a variable unset keeps the slot empty so the component can
 * suppress rendering, which prevents "No fill" impressions on un-configured slots.
 */
export const AD_SLOTS = {
  BLOG_INDEX: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_INDEX ?? '',
  BLOG_POST_TOP: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_POST_TOP ?? '',
  BLOG_POST_BOTTOM: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_POST_BOTTOM ?? '',
  CALCULATOR: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CALCULATOR ?? '',
  COMPARE: process.env.NEXT_PUBLIC_ADSENSE_SLOT_COMPARE ?? '',
  INDIA: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INDIA ?? '',
} as const;
