# India UX parity audit (2026-04-03)

Routes compared:
- `/`
- `/in`
- `/in/blog`

## Root causes

1. **Breadcrumb labels in search snippets are likely inferred from URL segments on India pages because India blog routes do not emit BreadcrumbList JSON-LD.**
   - US blog article routes explicitly generate and inject `crumbsSchema`.
   - India blog hub/article routes use `createPageMetadata(...)` but do not inject breadcrumb JSON-LD scripts.

2. **India route content architecture is heavily duplicated in route files instead of using the shared markdown/article renderer.**
   - US blog uses `InteractiveArticleContent` and shared decision/trust sections.
   - India pages under `app/in/**` are mostly hand-authored JSX blocks with repeated section/table/link code.

3. **Dense India link groups are content-structure driven, not core link-style token failure.**
   - Many India pages put 5–7 long links into one cluster block.
   - Styling uses `content-link` or `content-link-chip`, but dense, long-label clusters still read text-heavy due volume and copy length.

4. **Structured content styling parity is inconsistent on India pages because table/section markup is mixed.**
   - Some India pages use `table-shell` + `comparison-table`.
   - Many India pages use raw `w-full min-w-[760px] text-sm` tables and plain `rounded-2xl border bg-white p-6` sections without richer shared wrappers.

5. **`/in/blog` is materially thinner than `/blog` in IA and discovery modules.**
   - US blog has search, categories, tags, featured cross-category cards, and all-recent listing.
   - India blog hub currently has only a pathways block + two guide cards.

## Smallest reusable fix set

1. Add a shared `RegionBreadcrumbSchema` helper and use it on India blog hub/article pages.
2. Introduce one shared `DecisionLinksCluster` component with:
   - capped link count per block
   - optional grouping headers
   - short-label variant.
3. Migrate India article-style pages to a shared content wrapper component (same table shell/CTA/decision panel primitives).
4. Add a shared `RegionBlogHubLayout` to power both `/blog` and `/in/blog` with regional data.
5. Keep URLs and metadata paths unchanged; move only rendering + component composition.
