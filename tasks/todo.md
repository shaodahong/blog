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
- [x] Phase 2: replace Pages Router entrypoints with App Router equivalents using Nextra 4's `content/` directory while keeping `React 18`.
- [x] Replace [pages/_app.mdx](/Volumes/990pro/Workspace/Github/blog/pages/_app.mdx) with [app/layout.tsx](/Volumes/990pro/Workspace/Github/blog/app/layout.tsx), importing global CSS, `nextra-theme-blog` layout primitives, analytics scripts, and site metadata.
- [x] Replace [pages/index.mdx](/Volumes/990pro/Workspace/Github/blog/pages/index.mdx) and [pages/uses/index.mdx](/Volumes/990pro/Workspace/Github/blog/pages/uses/index.mdx) by moving MDX content into [content/index.mdx](/Volumes/990pro/Workspace/Github/blog/content/index.mdx) and [content/uses/index.mdx](/Volumes/990pro/Workspace/Github/blog/content/uses/index.mdx), rendered through [app/[[...mdxPath]]/page.tsx](/Volumes/990pro/Workspace/Github/blog/app/[[...mdxPath]]/page.tsx).
- [x] Preserve existing post permalinks by moving all post content from `pages/posts/**` into `content/posts/**` and rendering it through the Nextra 4 catch-all route.
- [x] Replace [pages/posts/index.md](/Volumes/990pro/Workspace/Github/blog/pages/posts/index.md) with [app/posts/page.tsx](/Volumes/990pro/Workspace/Github/blog/app/posts/page.tsx) and [app/posts/get-posts.ts](/Volumes/990pro/Workspace/Github/blog/app/posts/get-posts.ts), using Nextra page-map helpers for post and tag listings.
- [x] Replace [pages/tags/[tag].mdx](/Volumes/990pro/Workspace/Github/blog/pages/tags/[tag].mdx) with [app/tags/[tag]/page.tsx](/Volumes/990pro/Workspace/Github/blog/app/tags/[tag]/page.tsx) and `generateStaticParams()`.
- [x] Replace [theme.config.mjs](/Volumes/990pro/Workspace/Github/blog/theme.config.mjs) with [mdx-components.tsx](/Volumes/990pro/Workspace/Github/blog/mdx-components.tsx) and the app layout integration, then remove the obsolete theme config file. [@/components/ui/timeline-list.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/ui/timeline-list.tsx) and [@/components/ui/hover-card.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/ui/hover-card.tsx) were marked as client components for App Router MDX usage.
- [x] Remove the standalone RSS build script, [scripts/gen-rss.js](/Volumes/990pro/Workspace/Github/blog/scripts/gen-rss.js), and [public/feed.xml](/Volumes/990pro/Workspace/Github/blog/public/feed.xml); serve the feed from [app/feed.xml/route.ts](/Volumes/990pro/Workspace/Github/blog/app/feed.xml/route.ts).
- [x] Keep [app/api/og/route.tsx](/Volumes/990pro/Workspace/Github/blog/app/api/og/route.tsx) and verify the route after the root layout and metadata changes.
- [x] Replace `react-cusdis` with the built-in `nextra-theme-blog` comments component via [@/components/cusdis.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/cusdis.tsx), removing the stale React 17 peer dependency before the React 19 step.
- [x] Phase 2 validation: `pnpm build`, `pnpm audit --prod --json`, and runtime HTTP checks for `/`, `/posts`, `/posts/2021/2020-final`, `/uses`, `/tags/%E5%B9%B4%E7%BB%88%E6%80%BB%E7%BB%93`, `/feed.xml`, and `/api/og?title=test` all passed.
- [x] Phase 4: migrate styling from Tailwind 3 to Tailwind 4 as part of the Nextra 4 transition.
- [x] Update [styles/globals.css](/Volumes/990pro/Workspace/Github/blog/styles/globals.css) from `@tailwind` directives to the Tailwind 4 import model and include `nextra-theme-blog/style.css`.
- [x] Update [postcss.config.js](/Volumes/990pro/Workspace/Github/blog/postcss.config.js) to use `@tailwindcss/postcss`.
- [x] Revisit [tailwind.config.ts](/Volumes/990pro/Workspace/Github/blog/tailwind.config.ts) for the App Router + `content/**` structure and remove obsolete Tailwind 3-only assumptions.
- [x] Phase 3: upgrade to `react@19`, `react-dom@19`, `@types/react@19`, and `@types/react-dom@19` now that `Next 15 + App Router + Nextra 4 + Tailwind 4` are in place.
- [x] Audit React 19 compatibility in custom client components and App Router pages. The dependency upgrade to `react@19.2.4`, `react-dom@19.2.4`, `@types/react@19.2.14`, and `@types/react-dom@19.2.3` builds cleanly on the current codebase, and `pnpm audit --prod --json` still reports `0` vulnerabilities.
- [x] Scope `next-view-transitions` to lighter navigation paths by replacing heavy post-detail/list/back interactions with native Next navigation in local blog components, while keeping the top-level navbar transitions.
- [x] Add [app/loading.tsx](/Volumes/990pro/Workspace/Github/blog/app/loading.tsx) so route changes have a lightweight fallback available before heavy MDX content finishes rendering.
- [x] Browser validation for the transitions fix: verified `About -> Blog -> post -> Back -> Uses -> About` with `agent-browser` against the local dev server and no runtime timeout overlay appeared.
- [x] Replace the theme package Cusdis helper with a local controlled embed in [@/components/cusdis.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/cusdis.tsx) to avoid the `null.postMessage` runtime error during comment initialization on post pages.
- [x] Dev-browser validation for the Cusdis fix: opened `/posts/2021/2020-final` on the local Next dev server and confirmed the page rendered without the previous runtime error overlay.
- [x] Reset the Cusdis iframe's default browser height in [@/components/cusdis.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/cusdis.tsx) so the comments area is no longer visually capped by the default `150px` iframe height before Cusdis posts its real size.
- [ ] Final migration validation:
  compare generated routes against production paths,
  manually spot-check interactive MDX components on desktop and mobile,
  and confirm comments/theme switching behavior in the browser.

# Catch-All Route Investigation

## Plan

- [x] Inspect the App Router catch-all page and Nextra `importPage()` resolution path.
- [x] Verify whether dev-only `/_next/...hot-update.json` requests can plausibly reach `app/[[...mdxPath]]/page.tsx`.
- [x] Separate likely cache/runtime corruption signals from route/code issues.
- [x] Record whether a `_next` short-circuit is a safe fix or only a defensive mask.

## Review

- Verified locally with `pnpm exec next dev -p 3002` plus a direct request to `/_next/static/webpack/test.webpack.hot-update.json`.
- The request reached `app/[[...mdxPath]]/page.tsx`, invoked both `generateMetadata()` and `Page()`, and produced the same Nextra errors at lines 61 and 69 before rendering the not-found HTML response.
- `nextra/pages` resolves routes by looking up `RouteToFilepath[pathSegments.join('/')]`; for unknown paths this becomes `undefined`, which is why the logged failure is `Cannot find module './undefined'`.
- No rewrites, middleware, `basePath`, or `assetPrefix` were found in `next.config.mjs`, so the fallthrough is not caused by custom route config in this repo.
- Conclusion: the earlier missing vendor chunk / webpack cache rename errors still point to a dev-cache or stale-HMR problem, while the catch-all route is a secondary robustness issue that turns those bad internal requests into noisy Nextra logs.

# Cusdis Height Follow-Up

## Plan

- [x] Replace the iframe `height = 0` workaround in [@/components/cusdis.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/cusdis.tsx) with a container-level collapse that waits for Cusdis' real `resize` message.
- [x] Keep theme syncing and route re-initialization intact without forcing the iframe itself to an invalid hidden height.
- [x] Re-run `pnpm build` to confirm the comment embed change does not regress the app build.

## Review

- Reworked [@/components/cusdis.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/cusdis.tsx) so the comments wrapper stays collapsed only until the embedded `srcdoc` iframe reports a measurable document height.
- Removed the iframe `height = 0` override entirely; the parent page now reads the iframe document's real height directly and writes that height back to the iframe, which avoids the browser's default `150px` placeholder without hiding the embed permanently.
- Split comment lifecycle handling so route changes still call `window.CUSDIS.initial()` and theme changes only call `window.CUSDIS.setTheme()`, avoiding unnecessary iframe reinitialization during theme toggles.
- `pnpm build` passed after the change.
- Production-browser validation passed against `next start`: the article page at `/posts/2021/2020-final` now shows the Cusdis form at the bottom again instead of leaving the section collapsed.

# Production Route Error

## Plan

- [x] Reproduce the published-site client-side route failure and capture the exact failing navigation path and console/runtime symptom.
- [x] Inspect current route-transition and catch-all route handling to identify code paths that can fail only after deployment.
- [x] Implement the minimal fix for the client-side exception without regressing intended navigation behavior.
- [x] Verify the fix with a production build plus browser-level route navigation checks.

## Review

- Reproduced the failure on the published site and locally against `next start`: navigating from `/posts/2021/2020-final` to top-level routes like `/uses` could end in the generic `Application error: a client-side exception has occurred while loading biewen.me`.
- Isolated the crash to the local Cusdis embed in [@/components/cusdis.tsx](/Volumes/990pro/Workspace/Github/blog/@/components/cusdis.tsx). The earlier height-sync implementation reached into the embedded iframe document and attached deep observers; removing `bottomContent={<Cusdis />}` made the route error disappear immediately.
- Replaced the fragile iframe-document probing with a lightweight observer that only watches the Cusdis iframe's own inline `style.height`, keeps the wrapper collapsed until Cusdis sets a real height, and still re-initializes comments correctly on route changes and theme changes.
- Added a reserved-path guard in [app/[[...mdxPath]]/page.tsx](/Volumes/990pro/Workspace/Github/blog/app/[[...mdxPath]]/page.tsx) so internal requests like `/_next/*`, `/_vercel/*`, and `/.well-known/*` short-circuit to `notFound()` instead of falling into Nextra's `importPage()` lookup.
- Verification passed with `pnpm build`, plus browser-level production checks against local `next start`: `/posts/2021/2020-final -> /uses` and `/posts/2021/2020-final -> /posts` both completed without any `Application error` or `client-side exception` text appearing in the page body.
