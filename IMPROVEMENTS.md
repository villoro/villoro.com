# Improvement Proposals

What is left to improve on `villoro.com`, and how to carry on. It started as an audit on 2026-11-11 (v3.2.26); most of it is done. **Start with "Handover", then pick an item.**

**Goals, in the order they drive priority:** reach/SEO, speed, low maintenance, writing workflow.

**Decisions already taken with Villoro** (don't re-open them):

- **No React**, and no other UI framework. Search is plain JS and the shortcodes are `.astro` components.
- **The PWA stays.** Only audit it for correctness.
- **GA4 stays as it is.** No consent banner, no replacement.
- **The brand blue `#3a76ff` stays everywhere**, logos included, even where it is under the contrast standard (see PR 13). Don't change it or anything drawn with it.

**Rules for this file:**

- When an item is implemented, **remove it** in the same PR and fix cross-references. Don't strike it through.
- Don't write version numbers in it ("since v3.2.x"): they go stale on every rebase.
- Figures were measured on the built `dist/` when the item was written. Re-check before implementing.

## Handover (state on 2026-11-12)

### Done since the audit

Sitemap without `noindex`/thin pages and with `lastmod`; post metadata bugs (author, JSON-LD, share image); all fonts self-hosted; related posts stable; shortcodes ported to `.astro`; search rewritten without React and React removed; trailing-slash URLs everywhere; a 400 KB limit on hero images; Prettier configured and checked in CI; the post hero no longer overlaps its breadcrumb on phones; tables scroll with the keyboard; no post is wider than a phone screen; the dead `shikiConfig` removed (code blocks are github-dark tokens on `#272822`, set in `prose.css`); category descriptions and the `title`/`meta_title` rule; unused content fields and the unrendered `companies` block removed, draft previews confirmed in `npm run dev`; default hero image and SVG logos; image cache kept between builds (Netlify builds went from ~6.5 min to ~30 s, CI from ~7 min to under 2); tests on the built site; dead config and stale docs; CI as one job with grouped Dependabot; colour contrast (except the brand blue); draft previews (a `draft: true` post has a `noindex` page with a banner in dev and in Netlify previews only), strict frontmatter and `npm run new-post`.

### Open pull requests

None of ours. Dependabot's weekly PRs are not merged: Villoro runs an update of all dependencies when one shows up, so leave them alone.

### How the work was done, and what to keep doing

- **One PR per topic, opened by the agent with `gh pr create`; Villoro reviews and merges**, or says "merge it" and the agent merges after checking the deploy preview. Delete merged branches and fast-forward local `main` afterwards.
- **`check_version` only accepts `main` + 1.** Two open PRs can't both be mergeable: after one merges, rebase the next and bump it. Open them anyway so Villoro can review, and say which is next.
- **Required checks on `main`** (ruleset `main-protection`): `check_version`, `netlify/villoro/deploy-preview`, `aspect_ratio_check`, `pre_commit`, `tests`. If a PR renames or removes a CI job, update the ruleset in the same breath (`gh api repos/villoro/villoro.com/rulesets/<id>`), and tell Villoro.
- **"CI green" includes the Netlify deploy preview**, not only GitHub Actions. Look at the preview before saying a PR is ready, and before merging on Villoro's behalf.
- **Subagents did the mechanical PRs; the main agent reviews every diff and re-runs the checks itself.** Things review caught that the subagent's own report missed: headings silently falling back to another font (it compared computed styles, not pixels), a change that would have re-flagged every post in RSS readers, changes that altered the brand blue. Look at screenshots for anything visual.
- **Verify on the built site**: `npm run build`, `npm test`, and a headless Chrome run for behaviour (`playwright-core` with the system Chrome works; nothing needs to be added to the repo).
- **Node**: the repo needs Node 22 (`.nvmrc`). On Villoro's machine the default is Node 24 and the installed Node 22 patch is older than Astro accepts, so: run `npm ci` with Node 22, then build, lint, typecheck and test with Node 24. `npm ci` under Node 24 leaves `astro check` stuck at an install prompt (always run it with `CI=true` and a timeout).
- **Builds are fast only with a warm image cache** (`node_modules/.astro`). `npm ci` wipes it: copy it aside and back, or expect one build of several minutes.
- **Agent worktrees** (`.claude/worktrees/`) hold full `node_modules` copies: remove them when the subagent is done, and lint with `--ignore-pattern '.claude/**'` while they exist.

### Suggested order for what is left

1. PR 11: the PWA plugin and TypeScript 7 are waiting on upstream (see the item).

## Summary

| PR | Topic | Goal | Effort | Impact |
| --- | :--- | :--- | --- | --- |
| 7 | Build and CI leftovers | Maintenance | Low | Medium |
| 11 | Major dependency upgrades | Maintenance | Medium | Low |
| 13 | Accessibility and layout leftovers | Accessibility | Low | Medium |

The numbers are the ones the items had in the original audit; the gaps are items already done.

---

## PR 7. Build and CI leftovers

CI is one `tests` job since November 2026 (lint, format check, typecheck, build, size, tests), the size check no longer installs Puppeteer, actions are on current majors and Dependabot opens one grouped PR a week. Blog hero images over 400 KB fail CI (`check_aspect_ratio.py --max-kb`). What is left:

- **`npm audit` reports 17 findings (15 moderate, 2 low)**, down from 29. They are in build tooling (`deepmerge`, `glob`, `minimatch`, `postcss-selector-parser`), not in what the site ships. Check them again after the major upgrades of PR 11. ESLint 10 adds two entries (`eslint`, `@eslint/config-array`), but they are the same `minimatch` advisory reached through a new path.
- **Build time**: a build with an empty image cache takes 6 to 10 minutes and one with a warm cache about 20 seconds, because each build writes ~1,800 optimized images (524 AVIF, 660 WebP, 591 JPG). Since v3.2.30 the cache is kept between builds on Netlify, and since v3.2.31 in CI (`warm_image_cache.yaml` saves it from `main`, the build job restores it). If builds get slow again, the next lever is fewer variants: dropping WebP (AVIF plus the JPG fallback covers every browser) removes a third of the files.
- **Search index size**: `search.json` is 370 KB uncompressed for 74 posts and grows with each one. It is fetched only when search opens, so it isn't urgent; lower the per-post cap in `src/pages/search.json.ts` (5,000 characters today) if it becomes one.

## PR 11. Major dependency upgrades

Done: `@astrojs/mdx` 8 with `astro-auto-import` 0.6 (and `remark-toc`/`remark-collapse` removed), and the lint, format and size tooling (ESLint 10, `eslint-plugin-astro` 3, `prettier-plugin-astro` 1, `size-limit` 14). Two majors are **deliberately left for later** (checked 2026-11-12):

- **`@vite-pwa/astro` 1 → 2: wait.** v2 (released 2026-10-31) is a rewrite on `@unplugin-pwa` 0.0.x, which replaces Google Workbox, renames the export (`AstroPWAIntegration`) and changes the docs. A service-worker regression stays cached on visitors' devices, so wait until `@unplugin-pwa` reaches 1.0. v1.2 works with Astro 7; npm reports only a peer-range warning (`astro ^1–^5`).
- **`typescript` 6 → 7: blocked.** `typescript-eslint` accepts `<6.1` and `@astrojs/check` accepts `^5 || ^6`. Upgrade when both support 7.

## PR 13. Accessibility and layout leftovers

An axe audit (WCAG 2 A/AA) of 25 pages in both themes was fixed in November 2026: muted labels, category names and chips, footer text, the 404 page in dark theme, code comments. What is left:

- **The brand blue is below the contrast standard, on purpose.** White on `#3a76ff` is 4.02:1 and `#3a76ff` on the page background is 3.89:1, against a required 4.5:1. It affects links, the active nav item, kickers, primary buttons and table headers. **Villoro decided to keep `#3a76ff` everywhere (November 2026): don't change it.** If that is ever revisited, the fix that keeps the logo is a slightly darker blue only where it carries text (about `#2f67e8`). Audit tools will keep reporting these.

---

## Checked and fine

So nobody audits these again soon:

- **Page speed, measured on 2026-11-12** with Lighthouse 13 locally (mobile, simulated slow 4G, 3 runs each, live site). Lab numbers, not field data:

  | Page | Perf | FCP | LCP | TBT | CLS |
  | --- | ---: | ---: | ---: | ---: | ---: |
  | `/` | 87–99 | 1.1–1.3 s | 1.5–1.6 s (one run 4.0 s) | 80–90 ms | 0 |
  | `/blog/duckdb-instead-of-spark/` | 86–89 | 1.1 s | 3.7 s | 110–190 ms | 0 |

  Up from June 2026 (PageSpeed mobile: Perf 70, FCP 3.8 s, LCP 5.1 s). CLS is 0. The size budgets stay; no Lighthouse budget in CI (scores vary between runs). The post LCP (3.7 s) is the hero image, which phones download at 1920w. **A 1280w candidate was considered and rejected:** the hero is `object-fit: cover` in a box about 340 px tall, so it is drawn about 605 px wide on any phone. At pixel ratio 2.6–3 (most current phones) that needs 1600–1800 px, the 1920w file anyway. Only Lighthouse's emulated phone (ratio 1.75) and older ratio-2 phones would have gained, so it wasn't worth an extra variant per post.
- Every page has exactly one `<h1>` and a unique `<title>`.
- Drafts don't leak into the sitemap, RSS or search index.
- The 577 images with empty `alt` are all decorative favicons inside `FancyLink`, where an empty `alt` is correct.
- Hero images are preloaded with responsive AVIF, originals don't ship, OG images are JPG.
- The PWA precaches only hashed assets and serves pages network-first (#376).
- Security headers are set in `netlify.toml`. A `Content-Security-Policy` is missing, but with inline scripts, GA and Giscus it would need care to be worth it; not proposed.
- Old `/post/*` URLs are redirected.
