# SEO Wording Cleanup Report

## Objective
Remove user-facing breadcrumb wording that exposed the internal `seo-` slug prefix (for example: `Home / Blog / Seo Common Loan Mistakes`) and verify whether similar issues exist elsewhere.

## Search Method (Extensive)
Commands used:

1. `rg -n "Seo Common Loan Mistakes|SEO Common Loan Mistakes|Seo|SEO" .`
2. `rg -n "common loan mistakes|Common Loan Mistakes|seo common|Seo Common" app components content data`
3. `rg -n "Home|Blog|breadcrumb|slug" app components lib -g '!**/*.map'`
4. `rg -n "^slug:\s*\"seo-|/seo-" content/blog`
5. `rg -n "replace\(/\^seo-|split\('-'\)|toLabel\(|slug\)" components app lib`

## Findings Before Change
- Breadcrumb labels were generated directly from URL path segments.
- For blog posts with slugs like `seo-common-loan-mistakes`, breadcrumb output became:
  - **Before:** `Home / Blog / Seo Common Loan Mistakes`
- Root cause was in `components/layout/Breadcrumbs.tsx` where `toLabel` transformed hyphenated segments into title case without removing the `seo-` prefix.

## Change Applied
- Updated breadcrumb label formatter to strip the internal prefix before title-casing.
- Logic added:
  - `segment.replace(/^seo-/, '')`

## Results After Change
- Breadcrumb for the same page now renders:
  - **After:** `Home / Blog / Common Loan Mistakes`
- Internal slug values remain unchanged, so routing/canonical URLs are unaffected.

## Scope Verification
- Reviewed slug and breadcrumb-related rendering paths and found no additional user-visible places where `seo-` is converted into a visible title in the UI.
- Blog cards and article pages use frontmatter `title`, not slug-derived labels, so they are already clean.
