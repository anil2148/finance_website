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
├─ components/
├─ data/
├─ content/blog/
├─ lib/
├─ public/images/
├─ styles/
├─ scripts/
├─ tailwind.config.ts
├─ next.config.js
├─ tsconfig.json
└─ package.json
```

## Local setup

```bash
npx create-next-app finance-site
cd finance-site
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

## Generate 100 blog posts

```bash
pnpm generate:blog
```

## Deploy to Vercel
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Keep framework preset as **Next.js**.
4. Build command: `pnpm build`
5. Output: `.next`
6. Deploy.

## GitHub push instructions

```bash
git add .
git commit -m "feat: build finance platform with comparisons, calculators, blog, and SEO"
git push origin <branch-name>
```

