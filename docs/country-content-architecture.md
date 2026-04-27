# Country-Specific Content Architecture (US + India)

## Goals
- Remove globally generic financial copy that does not reflect local regulations.
- Keep one canonical guide per intent per country.
- Standardize terminology for US and India in templates and editorial checklists.

## Route design
- Canonical US landing: `/us`
- Canonical India landing: `/india`
- Legacy India alias: `/in` (301/308 redirect to `/india`)

## Content clusters

### United States (`/us/*`)
- Tax planning (IRS, federal/state brackets, capital gains)
- Retirement planning (401(k), Roth IRA, traditional IRA)
- Credit and debt management (FICO, utilization, APR)
- Mortgage and savings (HYSA, CD ladders)

### India (`/india/*`)
- Tax planning (income tax slabs, old vs new regime, GST impact)
- Investing pathways (SIP, ELSS, PPF)
- Borrowing and EMI planning (home loan EMI, personal loan)
- Savings and banking (fixed deposits, sweep-in, liquidity planning)

## Thin-page cleanup rule
For each topic, only keep:
1. one US canonical URL
2. one India canonical URL
3. optional migration redirect from legacy slug

If a page has no country-specific guidance and no calculator/action path, merge it into the nearest cluster hub and redirect.

## Editorial terminology checklist
- US pages: US GAAP, IRS, 401(k), capital gains
- India pages: Ind AS, GST, income tax slabs, SIP, ELSS

## SEO policy
- Every localized page must define:
  - canonical URL
  - hreflang alternates (`en-US`, `en-IN`, `x-default`)
  - country keywords in metadata
- Non-existent and empty pages must return real 404 with `noindex`.
