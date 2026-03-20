# FinanceSphere – Modern Personal Finance Platform

FinanceSphere is a JAMstack + serverless personal finance platform built with **Next.js App Router**, **TypeScript**, **TailwindCSS**, **Framer Motion**, **Recharts**, **NextAuth**, and **Prisma/PostgreSQL**.

## Features

- **SEO Content Engine**
  - Markdown/MDX blog content under `content/blog`
  - category pages, tag pages, search, internal links
  - table of contents, comparison table blocks, FAQ schema, affiliate CTA sections
  - script to auto-generate **1,000** SEO articles
- **Financial Calculator Platform**
  - mortgage, compound interest, retirement, loan EMI, FIRE, net worth, investment growth, savings goal, debt payoff
  - live calculations, sliders, currency formatting, responsive charting
- **Financial Tools Platform**
  - net worth tracker, budget planner, savings tracker, debt payoff planner, portfolio tracker, FI calculator
- **Personal Finance Dashboard**
  - net worth overview cards
  - assets vs liabilities chart
  - investment growth chart
  - monthly budget breakdown
- **Comparison Engine**
  - categories for cards, loans, mortgage lenders, savings accounts, investment apps
  - filtering, sorting, ratings, pros/cons, affiliate buttons
- **Newsletter System**
  - API route for newsletter signup
  - Prisma persistence with file fallback
- **SEO Optimization**
  - sitemap generation, robots.txt, Open Graph metadata, JSON-LD schema

## Repository structure

```txt
app/
  dashboard/
  calculators/
  tools/
  blog/
  comparison/
  api/auth/[...nextauth]/
  api/newsletter/
components/
  ui/
  charts/
  dashboard/
  calculators/
content/blog/
lib/
  seo/
  auth/
  utils/
prisma/schema.prisma
scripts/generate-blog.mjs
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

Required variables:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/financesite"
NEXTAUTH_SECRET="replace-with-a-long-secret"
NEXTAUTH_URL="http://localhost:3000"

# Demo credentials for CredentialsProvider (required for sign-in)
DEMO_LOGIN_EMAIL="demo@example.com"
DEMO_LOGIN_PASSWORD="replace-with-a-strong-password"

# Optional: allow demo auth in production (defaults to false)
ALLOW_DEMO_AUTH="false"
```

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Run development server:

```bash
npm run dev
```

## Generate 1,000 SEO articles

```bash
npm run generate:blog
```

## PDF export setup (calculator output)

To enable client-side calculator PDF downloads in Next.js (App Router), install:

```bash
npm install jspdf html2canvas
```

Implementation notes:

- Keep PDF generation in **client components** only (`'use client'`).
- Use dynamic imports inside click handlers to avoid SSR issues:
  - `import('jspdf')`
  - `import('html2canvas')`
- Capture the calculator output container, then save the generated PDF in the browser (no backend required).

## Deploy (Vercel)

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output: `.next`

## Newsletter (Brevo, server-side)

The newsletter signup now posts to `POST /api/newsletter`, and the server securely calls Brevo Contacts API. The browser never receives or sends Brevo secrets.

### Environment variables (`.env.local`)

```bash
# Required for Brevo API access
BREVO_API_KEY="your-brevo-api-key"

# Optional: if set, subscribers are assigned to this Brevo list
BREVO_LIST_ID="123"
```

Behavior notes:
- If `BREVO_API_KEY` is missing, the API returns a graceful `503` response and the UI shows a friendly fallback message.
- If `BREVO_LIST_ID` is set, the contact is attached to that list.
- Existing contacts are updated instead of hard-failing, so repeat submissions are idempotent.

### Local test flow

1. Start the app:

```bash
npm install
npm run dev
```

2. Submit an email in the newsletter form (`/` or `/blog`).
3. Confirm you see a success state: **“You're subscribed. Check your inbox for future guides and updates.”**
4. Re-submit the same email and confirm the existing-subscriber success message appears.

### Deploying (Vercel)

1. Add all newsletter env vars in Project Settings → Environment Variables.
2. Redeploy.
3. Run a production subscription test and verify the contact appears in Brevo (and in the configured list when `BREVO_LIST_ID` is set).
