# FinanceSphere Live Remediation Plan (March 18, 2026)

## 1) Ranked issue list (highest impact first)
1. **Blog article body depth was inconsistent** across core ranking pages, with many articles under ~200 words and lacking scenario detail.
2. **Journey continuity gaps** between blog content and action pages (calculators/comparisons/hubs/help/contact).
3. **Hub pages referenced stale/non-canonical article links** that reduced trust and discoverability.
4. **Blog visual repetition** remained noticeable in list and category pages, especially within investing/loan clusters.
5. **Comparison pages had incomplete support/disclosure pathways** for users needing help beyond a table.
6. **Homepage journey to support pages was under-emphasized** for users unsure where to begin.

## 2) Blog inventory action plan
Source of truth: `content/audit/blog-cleanup-inventory.json`.

- **Keep + rewrite:** 20 canonical posts (`KEEP_IMPROVE`) retained as editorial core.
- **Merge:** 46 posts redirected into stronger canonical pages.
- **Redirect:** 76 posts redirected to canonical equivalents.
- **Delete/remove:** 1,024 low-value or duplicate pages excluded from public listing.
- **Convert to hub-support:** 35 pages converted to hub-level intent coverage.

Principle used: **fewer, stronger pages** with clearer intent and internal journeys.

## 3) Title/snippet/content rewrite scope
- Rewrote all 20 retained canonical posts with topic-specific sections, concrete scenarios, practical tradeoffs, and action steps.
- Preserved focused titles/snippets while strengthening body quality and depth.
- Added explicit next-step routing to calculators, comparisons, hubs, and support pages.

## 4) Image / visual system improvements
- Replaced single-image-per-category pattern with **category-aware image variant pools**.
- Added deterministic per-slug variation to reduce repeated cards while preserving consistent aspect ratio.
- Refined category-specific alt text and gradient treatments for better editorial differentiation.

## 5) Hub and page journey improvements
- Updated hub resources to point only to active canonical content.
- Added support-path block on hub pages linking to Help and Contact.
- Strengthened blog landing page with “Start here” guide-to-calculator flow.
- Improved homepage with explicit “Read guide → Help → Contact” progression cards.
- Added Help/Contact links inside comparison “How we review” panel.

## 6) Updated code scope
- Blog content (`content/blog/seo-*.mdx` canonical set)
- Blog visual selection (`lib/blogVisuals.ts`)
- Blog landing UX (`app/blog/page.tsx`)
- Hub page journey/content links (`app/learn/[cluster]/page.tsx`)
- Internal link integrity (`lib/internalLinks.ts`)
- Comparison trust/support linkage (`components/comparison/SeoComparisonPage.tsx`)
- Homepage support flow (`components/home/HomepageLayout.tsx`)

## 7) Redirect map for removed / merged posts
Primary redirect source remains:
- `content/audit/blog-redirect-map.json`
- `next.config.js` `redirects()` loader

No new redirect primitives required in this pass because canonical map already covered merged/legacy URLs.

## 8) Why these changes
These updates prioritize editorial trust and practical usability:
- deeper article quality,
- cleaner canonical architecture,
- lower template repetition,
- and a clearer user path from learning to decision to support.
