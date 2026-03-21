# Lessons

- When a task naturally splits into "apply changes" and "deliver follow-up planning", check whether the user wants the code committed first and prioritize the commit before writing the next-phase plan.
- After App Router or theme migrations, verify theme-driven runtime structures like navbar/page-map wiring in addition to build success; a passing build does not prove navigational metadata is configured correctly.
- When keeping `next-view-transitions` in an App Router app, do browser-level route-click verification and scope transitions away from heavy content routes; a passing build does not catch DOM-update timeout failures during navigation.
- When replacing a third-party UI wrapper with a theme package helper, verify client-side runtime behavior on real pages; a clean build is not enough for embed scripts like Cusdis that can fail after hydration.
- For iframe-based embeds like Cusdis, remember the browser default iframe height can look like a fixed-height layout bug even when no explicit CSS sets it; inspect the rendered iframe behavior, not just local styles.
- When hiding placeholder space for iframe embeds, collapse the parent container instead of forcing the iframe's own height to `0`; otherwise the embed may never become visible even after its script initializes.
- Cusdis uses a `srcdoc` iframe, so the parent page can measure the embedded document height directly; prefer syncing from the iframe's actual document height over relying on third-party resize callbacks alone.
