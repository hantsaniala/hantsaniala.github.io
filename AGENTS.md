# AGENTS.md

## Commands
- `npm run dev` — dev server
- `npm run build` — build (only available check; no tests/lint/typecheck exist)
- `npm run preview` — serve build

## Git workflow
- NEVER run `git push`. User pushes. Work stays on branch `feat/astro-migration`; integration is via PR to `master`.
- Angular Conventional Commits: `type(scope): subject` (e.g. `feat(i18n):`, `fix(seo):`, `perf(head):`).
- One logical change per commit; keep commits atomic/revert-friendly.
- Preserve original author + committer dates on every commit (set `GIT_AUTHOR_DATE`/`GIT_COMMITTER_DATE` to the parent commit's dates).
- To integrate `master`: merge, not rebase (branch is pushed/shared).

## Deployment
- `.github/workflows/deploy.yml` deploys to GitHub Pages on push to `master` only. Production ships via PR merge to master.

## Architecture
- Astro 5 static site. Entry: `src/pages/index.astro` → `src/layouts/BaseLayout.astro`.
- Content data: `src/data/site.ts` (identity/contact/socials/nav) + `src/data/*.json` (skills, experience, education).
- Blog: Markdown posts in `src/content/blog/` (frontmatter: title, description, date, tags[], draft).
- i18n: landing page only. Dict (en/fr) in `src/layouts/BaseLayout.astro`; elements tagged `data-i18n="key"`; language switch via `#lang-switcher`. Blog/privacy/terms stay English.
- Theme: design tokens in `src/styles/global.css` (`--accent` #ffd200 light / #eab308 dark; accent buttons always dark text via `--accent-text`).

## Gotchas
- Projects list lives in `src/components/Projects.astro` (creations/contributions arrays) + matching `projects.*.desc` i18n keys — keep both in sync.
- No test suite; `npm run build` is the verification gate before committing.
