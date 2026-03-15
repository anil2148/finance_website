# Potential Bug Audit

Date: 2026-03-15

## 1) Production build is currently blocked by route conflict
- **Severity:** Critical (deployment blocker)
- **Location:** `app/newsletter/confirm/[token]/`
- **What happens:** Next.js App Router does not allow `page.tsx` and `route.ts` at the same segment level, and `npm run build` fails.
- **Evidence:** build output reports conflicting resolution between `/newsletter/confirm/[token]/page` and `/newsletter/confirm/[token]/route`.
- **Suggested fix:** move mutation endpoint to `app/api/newsletter/confirm/[token]/route.ts` and have the UI page call `/api/newsletter/confirm/:token`.

## 2) Lint command is not CI-safe (interactive prompt)
- **Severity:** High (quality gate cannot run non-interactively)
- **Location:** project ESLint setup
- **What happens:** `npm run lint` opens Next.js setup prompt instead of running checks, so linting cannot run in CI/non-interactive environments.
- **Suggested fix:** add an explicit ESLint config (e.g. `.eslintrc.json` with `next/core-web-vitals`) and rerun `next lint`.

## 3) Invalid token payload can return 500 instead of 400
- **Severity:** Medium (incorrect error classification)
- **Location:** `app/newsletter/confirm/[token]/route.ts`
- **What happens:** the route maps only some token-validation errors to status 400. If token parsing throws `Token payload is invalid.`, the route currently falls through to 500 even though the client sent a bad token.
- **Suggested fix:** broaden client-error matching (or use typed error classes) so all token validation errors return 400.

## 4) Demo auth accepts any password when an email is provided
- **Severity:** Critical in production; Low if intentionally demo-only
- **Location:** `lib/auth/options.ts`
- **What happens:** the credentials provider `authorize` callback checks only `email` and ignores `password`, allowing authentication bypass if this route is exposed in production.
- **Suggested fix:** enforce password verification (hashed credential store) or gate demo auth behind non-production checks.

