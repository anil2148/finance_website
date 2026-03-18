# FinanceSphere Live Blog Remediation Report

_Date: 2026-03-18_

## 1) Full inventory + action classification
The full post-by-post classification is maintained in:
- `content/audit/blog-cleanup-inventory.json` (all blog posts, one row per slug)
- `content/audit/blog-redirect-map.json` (redirectable legacy URLs)

### Action totals
- KEEP + REWRITE (`KEEP_IMPROVE`): **20**
- MERGE INTO STRONGER ARTICLE (`MERGE`): **46**
- REDIRECT TO BETTER PAGE (`REDIRECT`): **76**
- DELETE / REMOVE (`DELETE_REMOVE`): **1024**
- CONVERT INTO HUB SUPPORT (`CONVERT_HUB_SUPPORT`): **35**

## 2) Ranked list: worst repetitive/low-trust posts
Ranked by thinnest content and templated slug/title patterns.

| Rank | Slug | Words | Action | Reason |
|---|---|---:|---|---|
| 1 | `mortgage-tips-17` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 2 | `mortgage-tips-26` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 3 | `mortgage-tips-35` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 4 | `mortgage-tips-44` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 5 | `mortgage-tips-53` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 6 | `mortgage-tips-62` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 7 | `mortgage-tips-71` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 8 | `mortgage-tips-8` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 9 | `mortgage-tips-80` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 10 | `mortgage-tips-89` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 11 | `mortgage-tips-98` | 55 | REDIRECT | Consolidate thin numbered mortgage tips variants into the preapproval checklist canonical page. |
| 12 | `tax-saving-strategies-18` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 13 | `tax-saving-strategies-27` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 14 | `tax-saving-strategies-36` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 15 | `tax-saving-strategies-45` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 16 | `tax-saving-strategies-54` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 17 | `tax-saving-strategies-63` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 18 | `tax-saving-strategies-72` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 19 | `tax-saving-strategies-81` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 20 | `tax-saving-strategies-9` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 21 | `tax-saving-strategies-90` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 22 | `tax-saving-strategies-99` | 56 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 23 | `best-travel-credit-cards-74` | 57 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 24 | `best-travel-credit-cards-83` | 57 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 25 | `best-travel-credit-cards-92` | 57 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 26 | `how-to-improve-credit-score-13` | 58 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 27 | `how-to-improve-credit-score-22` | 58 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 28 | `how-to-improve-credit-score-31` | 58 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 29 | `how-to-improve-credit-score-4` | 58 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |
| 30 | `how-to-improve-credit-score-40` | 58 | DELETE_REMOVE | Thin templated post with repetitive structure and no unique insight. |

## 3) Canonical editorial set after cleanup
The blog is intentionally reduced to 20 stronger, maintained articles (fully rewritten in this update) across:
- Investing
- Credit cards
- Savings/budgeting
- Loans/mortgage readiness

## 4) Redirect strategy highlights
Key low-trust families now consolidated:
- `beginner-investing-guides-*` → `/blog/beginner-investing-roadmap-year-one-milestones`
- `how-to-save-500-month-*` → `/blog/seo-automate-your-savings-plan`
- `mortgage-tips-*` → `/blog/mortgage-preapproval-checklist-underwriting`

This avoids redirect chains and sends each legacy URL to the closest intent match.
