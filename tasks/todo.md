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
