# Dependency Upgrade Review

## Plan

- [x] Inspect package manager, dependency manifests, and workspace status.
- [x] Query available dependency updates and identify important changes.
- [x] Upgrade safe, high-value dependencies and refresh the lockfile.
- [x] Verify the project still builds after the upgrades.
- [x] Record the outcome and any follow-up work.

## Review

- Upgraded the current major lines instead of forcing framework migrations: `next` to `14.2.35`, `tailwindcss` to `3.4.19`, `@vercel/analytics` to `1.6.1`, `@radix-ui/react-hover-card` to `1.1.15`, `tailwind-merge` to `2.6.1`, `sharp` to `0.34.5`, and supporting tooling updates in `autoprefixer`, `typescript`, `prettier`, `@types/*`, and `fast-glob`.
- `pnpm build` passed on the upgraded dependency set.
- `pnpm audit --prod --json` dropped from `critical: 1, high: 10, moderate: 11` to `critical: 0, high: 1, moderate: 3`.
- Remaining audit findings are all tied to `next@14.x` and require `Next 15+` for full remediation. This repo currently uses `nextra@2` with the Pages Router, so moving to `Next 15/16`, `React 19`, `Nextra 4`, and `Tailwind 4` should be treated as a migration task, not a routine dependency bump.
- The repo does not define `rewrites`, `remotePatterns`, middleware, or Server Actions, so the remaining `next` advisories appear lower-risk for the current configuration. This is an inference from the checked-in code, not a guarantee about deployment.
- `react-cusdis@2.1.3` still reports a stale peer range (`react@^17` / `react-dom@^17`), but the build succeeds with React 18 and this warning pre-existed the upgrade path.

## Next Migration Prep

- [x] Phase 1 compatibility check: `nextra@2.13.4` and `nextra-theme-blog@2.13.4` both accept broad `next >=9.5.3` and `react >=16.13.1` peer ranges, so `Next 15 + React 18` is package-compatible.
- [x] Phase 1: moved from `Next 14 + Pages Router + Nextra 2` to `Next 15.5.14 + Pages Router + React 18`, keeping `nextra@2` in place. This removed the remaining audited production vulnerabilities without mixing router migration into the same step.
- [x] Phase 1 files:
  [next.config.mjs](/Volumes/990pro/Workspace/Github/blog/next.config.mjs),
  [package.json](/Volumes/990pro/Workspace/Github/blog/package.json),
  [pnpm-lock.yaml](/Volumes/990pro/Workspace/Github/blog/pnpm-lock.yaml)
- [x] Phase 1 validation: `pnpm build`, `pnpm audit --prod`, and runtime HTTP checks for `/`, `/posts`, `/tags/%E5%B9%B4%E7%BB%88%E6%80%BB%E7%BB%93`, `/uses`, and `/api/og?title=test` all passed. `pnpm audit --prod --json` now reports `0` vulnerabilities.
- [ ] Phase 2: replace Pages Router entrypoints with App Router equivalents for Nextra 4.
- [ ] Replace [pages/_app.mdx](/Volumes/990pro/Workspace/Github/blog/pages/_app.mdx) with an `app/layout.(t|j)sx` root layout that imports global CSS, `nextra-theme-blog/style.css`, analytics scripts, and footer/head configuration.
- [ ] Replace [pages/index.mdx](/Volumes/990pro/Workspace/Github/blog/pages/index.mdx) with `app/page.mdx`.
- [ ] Replace [pages/uses/index.mdx](/Volumes/990pro/Workspace/Github/blog/pages/uses/index.mdx) with `app/uses/page.mdx`.
- [ ] Replace [pages/posts/index.md](/Volumes/990pro/Workspace/Github/blog/pages/posts/index.md) with `app/posts/page.(t|j)sx` using Nextra 4 blog helpers for post/tag listing.
- [ ] Replace [pages/tags/[tag].mdx](/Volumes/990pro/Workspace/Github/blog/pages/tags/[tag].mdx) with `app/tags/[tag]/page.(t|j)sx` and `generateStaticParams()`.
- [ ] Decide content layout strategy before touching posts:
  keep posts in a dedicated `content/` tree for Nextra 4, or
  convert each post under `pages/posts/**` into `app/posts/**/page.mdx`.
- [ ] If using the `content/` strategy, update RSS and tag helpers to read from the Nextra 4 content/page map APIs instead of filesystem globs over `pages/posts/**`.
- [ ] If using the `page.mdx` strategy, preserve existing permalinks like `/posts/2024/japan-9-days-8-nights-free-and-easy-travel` exactly.
- [ ] Replace [theme.config.mjs](/Volumes/990pro/Workspace/Github/blog/theme.config.mjs) with the Nextra 4 blog theme layout pattern. Re-check custom components such as [@/components/ui/timeline-list.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/ui/timeline-list.tsx) and [@/components/ui/hover-card.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/ui/hover-card.tsx) inside MDX.
- [ ] Remove the standalone RSS build script path in [scripts/gen-rss.js](/Volumes/990pro/Workspace/Github/blog/scripts/gen-rss.js) once `/rss.xml` is served from an App Router route handler.
- [ ] Add `app/rss.xml/route.(t|j)s` and port feed generation there; do not keep `public/feed.xml` as the source of truth after migration.
- [ ] Keep [app/api/og/route.tsx](/Volumes/990pro/Workspace/Github/blog/app/api/og/route.tsx), but verify the route still works after the root layout and metadata changes.
- [ ] Phase 3: upgrade to `React 19`, `@types/react@19`, `@types/react-dom@19`, `nextra@4`, and `nextra-theme-blog@4` after the App Router structure exists.
- [ ] Audit for React 19 compatibility before that step:
  custom JSX runtime assumptions,
  legacy refs/defaultProps usage,
  and third-party packages with stale peer ranges such as `react-cusdis`.
- [ ] Either replace `react-cusdis` with a React 19-compatible comments integration, or pin and verify it explicitly in an isolated test branch before the main migration branch.
- [ ] Phase 4: migrate styling from Tailwind 3 to Tailwind 4.
- [ ] Update [styles/globals.css](/Volumes/990pro/Workspace/Github/blog/styles/globals.css) from `@tailwind` directives to the Tailwind 4 import model and review any utility renames.
- [ ] Update [postcss.config.js](/Volumes/990pro/Workspace/Github/blog/postcss.config.js) to use `@tailwindcss/postcss`; remove `autoprefixer` if the final Tailwind 4 setup no longer needs it.
- [ ] Revisit [tailwind.config.ts](/Volumes/990pro/Workspace/Github/blog/tailwind.config.ts) because some Tailwind 3-era configuration may move to CSS-first configuration in v4.
- [ ] Final migration validation:
  build the site,
  confirm generated routes and metadata,
  compare post URLs against production paths,
  verify RSS output,
  and spot-check interactive MDX components on desktop and mobile.
