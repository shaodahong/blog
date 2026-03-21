# Lessons

- When a task naturally splits into "apply changes" and "deliver follow-up planning", check whether the user wants the code committed first and prioritize the commit before writing the next-phase plan.
- After App Router or theme migrations, verify theme-driven runtime structures like navbar/page-map wiring in addition to build success; a passing build does not prove navigational metadata is configured correctly.
- When keeping `next-view-transitions` in an App Router app, do browser-level route-click verification and scope transitions away from heavy content routes; a passing build does not catch DOM-update timeout failures during navigation.
- When replacing a third-party UI wrapper with a theme package helper, verify client-side runtime behavior on real pages; a clean build is not enough for embed scripts like Cusdis that can fail after hydration.
