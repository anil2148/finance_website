# Finance Site (Next.js + TypeScript)

A JAMstack personal finance platform to compare products, use calculators, and read SEO blog content.

## Tech stack
- Next.js App Router + TypeScript
- TailwindCSS
- Recharts
- Framer Motion
- Heroicons + HeadlessUI
- MDX/Markdown content
- Fuse.js (ready for search extension)

## Project structure

```txt
finance-site/
├─ app/
│  └─ calculators/
│     ├─ mortgage-calculator/
│     ├─ loan-calculator/
│     ├─ retirement-calculator/
│     ├─ compound-interest-calculator/
│     └─ ... (15 calculator routes)
├─ components/
│  └─ calculators/
│     ├─ CalculatorLayout.tsx
│     ├─ InputSlider.tsx
│     ├─ ResultCard.tsx
│     ├─ ChartProjection.tsx
│     └─ CalculatorHeader.tsx
├─ lib/
│  └─ calculators/
│     ├─ mortgage.ts
│     ├─ loan.ts
│     ├─ compoundInterest.ts
│     ├─ retirement.ts
│     ├─ registry.ts
│     └─ engine.ts
├─ content/blog/
├─ styles/
└─ package.json
```

## Scalable calculator system

The calculator engine is designed to scale to 100+ calculators using a shared definition registry.

1. Add a compute function in `lib/calculators`.
2. Register the calculator in `lib/calculators/registry.ts` with:
   - slug, SEO title/description
   - FAQ content (used for FAQ schema)
   - internal blog links
   - default input values
3. Add a route in `app/calculators/<slug>/page.tsx` that calls the shared `CalculatorPage`.

### Shared UI features
- Input form + sliders for key financial assumptions
- Real-time calculation updates
- Result summary cards
- Projection charts (growth, amortization, pie, bar)
- Breakdown tables
- Tooltip text for financial terminology
- Mobile-first responsive fintech UI

### Implemented calculators
- Mortgage Calculator
- Loan Calculator
- Compound Interest Calculator
- Retirement Calculator
- Credit Card Payoff Calculator
- Savings Goal Calculator
- Debt Snowball Calculator
- Debt Avalanche Calculator
- Investment Growth Calculator
- FIRE Calculator
- Net Worth Calculator
- Budget Planner
- Salary After Tax Calculator
- Auto Loan Calculator
- Student Loan Calculator
- Debt Payoff Calculator

## Local setup

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000/calculators>.

## Generate blog posts

```bash
pnpm generate:blog
```
