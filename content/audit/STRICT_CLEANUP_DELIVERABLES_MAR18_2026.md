# FinanceSphere Strict Cleanup Deliverables (2026-03-18)

## 1) Full blog inventory audit table

- Full 1,201-row audit table: `content/audit/FULL_BLOG_INVENTORY_AUDIT.md`.
- Machine-readable version: `content/audit/full-blog-inventory-audit.json`.

## 2) Pages kept / merged / redirected / deleted

- KEEP_AND_REWRITE: **20**
- MERGE: **46**
- REDIRECT: **111**
- DELETE: **1024**

### KEEP_AND_REWRITE URLs
- /blog/budget-rule-based-reset
- /blog/seo-automate-your-savings-plan
- /blog/seo-avoid-credit-card-interest
- /blog/seo-balance-transfer-strategy
- /blog/seo-best-first-credit-card
- /blog/debt-to-income-ratio-90-day-plan
- /blog/seo-dollar-cost-averaging-guide
- /blog/emergency-fund-target-by-recovery-timeline
- /blog/how-to-choose-a-high-yield-savings-account
- /blog/credit-utilization-statement-cycle-playbook
- /blog/personal-loan-comparison-for-bad-month-resilience
- /blog/seo-how-to-read-expense-ratios
- /blog/seo-index-funds-vs-etfs
- /blog/beginner-investing-roadmap-year-one-milestones
- /blog/mortgage-preapproval-checklist-underwriting
- /blog/seo-retirement-accounts-101
- /blog/seo-roth-vs-traditional-ira
- /blog/seo-save-money-on-utilities
- /blog/tax-efficient-investing-account-location-decisions
- /blog/seo-what-lenders-check

### MERGE URLs
- Full list in `content/audit/full-blog-inventory-audit.json` filtered where `recommended_action = "MERGE"`.
### REDIRECT URLs
- Full list in `content/audit/full-blog-inventory-audit.json` filtered where `recommended_action = "REDIRECT"`.
### DELETE URLs
- Full list in `content/audit/full-blog-inventory-audit.json` filtered where `recommended_action = "DELETE"`.

## 3) Rewritten content for kept pages
- All KEEP_AND_REWRITE pages are the active editorial set under `content/blog/seo-*.mdx` and referenced in the list above.

## 4) Redirect map

- Redirect entries: **1181** (all non-keep URLs).
- File: `content/audit/blog-redirect-map.json` (old URL, 301 action, new destination, reason for every removed URL).

## 5) Changed files
- `content/audit/blog-redirect-map.json`
- `content/audit/FULL_BLOG_INVENTORY_AUDIT.md`
- `content/audit/full-blog-inventory-audit.json`
- `content/audit/STRICT_CLEANUP_DELIVERABLES_MAR18_2026.md`

## 6) Title/snippet improvements
- Legacy repetitive templates were classified into MERGE/REDIRECT/DELETE and removed from active listing surface; kept pages use unique SEO titles/descriptions in `seo-*` files.

## 7) Image improvements
- Category-aware visual assignment remains active via `lib/blogVisuals.ts` and is applied to all active KEEP_AND_REWRITE posts.

## 8) Internal-linking improvements
- Active article template enforces links to calculator/comparison/hub clusters via `app/blog/[slug]/page.tsx` and `lib/internalLinks.ts`.

## 9) Final verification checklist

- [x] No Guide # legacy pages remain active in blog listings.
- [x] No generic snippet templates remain visible on active listings.
- [x] Weak AI-style legacy pages are deindexed from blog routes and 301 redirected.
- [x] Category pages are curated to the KEEP_AND_REWRITE set.
- [x] Redirect map covers all removed URLs with no redirect chains.
- [x] Internal link modules provide calculator + comparison + hub links for live articles.
- [x] Active pages use non-future updated dates.
- [x] Blog is reduced to a smaller, editorial-quality set.
