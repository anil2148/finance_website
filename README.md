# FinanceSite – Modern Personal Finance Platform

FinanceSite is a JAMstack + serverless personal finance platform built with **Next.js App Router**, **TypeScript**, **TailwindCSS**, **Framer Motion**, **Recharts**, **NextAuth**, and **Prisma/PostgreSQL**.

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

## Deploy (Vercel)

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output: `.next`

## Newsletter (Double Opt-in, no database)

This project uses a token-based double opt-in flow and does **not** store newsletter subscribers in a local database.

### Environment variables (`.env.local`)

```bash
# Required secret for signed confirmation tokens (min 32 chars)
NEWSLETTER_TOKEN_SECRET="replace-with-a-long-random-secret"

# App URL used to build confirmation links
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Choose ONE provider block below

# Mailchimp Marketing API (audience subscribe on confirmation)
MAILCHIMP_API_KEY="your-mailchimp-marketing-api-key"
MAILCHIMP_SERVER_PREFIX="us21"
MAILCHIMP_AUDIENCE_ID="your-audience-id"

# OR ConvertKit API (form subscribe on confirmation)
CONVERTKIT_API_SECRET="your-convertkit-api-secret"
CONVERTKIT_FORM_ID="your-convertkit-form-id"

# Optional: Mailchimp Transactional (Mandrill) for sending confirmation email
MAILCHIMP_TRANSACTIONAL_API_KEY="your-mailchimp-transactional-key"
NEWSLETTER_FROM_EMAIL="newsletter@yourdomain.com"
NEWSLETTER_FROM_NAME="FinanceSite"
```

If transactional email variables are missing, the app logs the confirmation email HTML server-side for local development.

### Local test flow

1. Start the app:

```bash
npm install
npm run dev
```

2. Submit an email in the newsletter form (`/` or `/blog`).
3. Confirm you see: **“Check your email to confirm subscription.”**
4. Open the confirmation link (`/newsletter/confirm/[token]`).
5. Confirm the page shows subscription success and verify the contact in Mailchimp or ConvertKit.

### Deploying (Vercel)

1. Add all newsletter env vars in Project Settings → Environment Variables.
2. Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://yourdomain.com`).
3. Redeploy.
4. Run a production subscription test to confirm both emails + audience subscription.
