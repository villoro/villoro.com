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

Sitemap without `noindex`/thin pages and with `lastmod`; post metadata bugs (author, JSON-LD, share image); all fonts self-hosted; related posts stable; shortcodes ported to `.astro`; search rewritten without React and React removed; trailing-slash URLs everywhere; a 400 KB limit on hero images; the post hero no longer overlaps its breadcrumb on phones; tables scroll with the keyboard; no post is wider than a phone screen; the dead `shikiConfig` removed (code blocks are github-dark tokens on `#272822`, set in `prose.css`); category descriptions and the `title`/`meta_title` rule; unused content fields and the unrendered `companies` block removed, draft previews confirmed in `npm run dev`; default hero image and SVG logos; image cache kept between builds (Netlify builds went from ~6.5 min to ~30 s, CI from ~7 min to under 2); tests on the built site; dead config and stale docs; CI as one job with grouped Dependabot; colour contrast (except the brand blue); draft previews (a `draft: true` post has a `noindex` page with a banner in dev and in Netlify previews only), strict frontmatter and `npm run new-post`.

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

1. PR 11, the major upgrades, one risky package per PR.
2. PR 12: measured; decide whether a 1280w post hero is worth an extra image variant.

## Summary

| PR | Topic | Goal | Effort | Impact |
| --- | :--- | :--- | --- | --- |
| 7 | Build and CI leftovers | Maintenance | Low | Medium |
| 11 | Major dependency upgrades | Maintenance | Medium | Low |
| 12 | Post hero image on phones | Speed | Low | Low |
| 13 | Accessibility and layout leftovers | Accessibility | Low | Medium |

The numbers are the ones the items had in the original audit; the gaps are items already done.

---

## PR 7. Build and CI leftovers

CI is one `tests` job since November 2026 (lint, typecheck, build, size, tests), the size check no longer installs Puppeteer, actions are on current majors and Dependabot opens one grouped PR a week. Blog hero images over 400 KB fail CI (`check_aspect_ratio.py --max-kb`). What is left:

- **`npm audit` reports 17 findings (15 moderate, 2 low)**, down from 29. They are in build tooling (`deepmerge`, `glob`, `minimatch`, `postcss-selector-parser`), not in what the site ships. Check them again after the major upgrades of PR 11. ESLint 10 adds two entries (`eslint`, `@eslint/config-array`), but they are the same `minimatch` advisory reached through a new path.
- **Prettier is not configured.** There is no `.prettierrc`, so `prettier-plugin-astro` and `prettier-plugin-tailwindcss` never load, `npm run format` fails on `.astro` files ("No parser could be inferred"), and `prettier --check src` reports 106 unformatted files. Either add a config and format everything once, in a PR of its own, or drop Prettier and its plugins.
- **Build time**: a build with an empty image cache takes 6 to 10 minutes and one with a warm cache about 20 seconds, because each build writes ~1,800 optimized images (524 AVIF, 660 WebP, 591 JPG). Since v3.2.30 the cache is kept between builds on Netlify, and since v3.2.31 in CI (`warm_image_cache.yaml` saves it from `main`, the build job restores it). If builds get slow again, the next lever is fewer variants: dropping WebP (AVIF plus the JPG fallback covers every browser) removes a third of the files.
- **Search index size**: `search.json` is 370 KB uncompressed for 74 posts and grows with each one. It is fetched only when search opens, so it isn't urgent; lower the per-post cap in `src/pages/search.json.ts` (5,000 characters today) if it becomes one.

## PR 11. Major dependency upgrades

The lint, format and size tooling is upgraded (ESLint 10, `eslint-plugin-astro` 3, `prettier-plugin-astro` 1, `size-limit` 14). Still outdated by a major: `@astrojs/mdx` 7 → 8 with `astro-auto-import` 0.5 → 0.6, `@vite-pwa/astro` 1 → 2, `typescript` 6 → 7. One PR each.

Also revisit the comment in `astro.config.mjs`: Astro 7 defaults to the native Sätteri markdown pipeline and the site pins the `unified` one for three plugins (`remark-callouts`, `remark-toc` + `remark-collapse`, `rehype-sectionize`). No file in `src/content` has a "Table of contents" heading (`ArticleTOC` replaced it), so `remark-toc` and `remark-collapse` do nothing and can be removed.

## PR 12. Post hero image on phones

**Measured on 2026-11-12** with Lighthouse 13 run locally (mobile, simulated slow 4G, 3 runs each) against the live site. These are lab numbers like PageSpeed's lab section, not field data:

| Page | Perf | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 87–99 | 1.1–1.3 s | 1.5–1.6 s (one run 4.0 s) | 80–90 ms | 0 |
| `/blog/duckdb-instead-of-spark/` | 86–89 | 1.1 s | 3.7 s | 110–190 ms | 0 |

June 2026 (PageSpeed, mobile) was Perf 70, FCP 3.8 s, LCP 5.1 s. CLS is 0 without the old fallback fonts. **The size budgets stay; no Lighthouse budget in CI** (scores vary run to run).

What is left is the post LCP (3.7 s, over 2.5 s). The LCP element is the hero `<img>`. On the emulated phone it downloads the **1920w AVIF (91 KB)**, and Lighthouse estimates 50 KB of waste. `sizes` in `ArticleLayout.astro` says the image is 640 px wide on phones, but the hero is `object-fit: cover` in a box about 412×340 px, so it really draws about 604 px wide (more for long titles, whose hero is taller). An accurate `sizes` alone doesn't help, because the candidates are 640/1024/1920 and about 1060 px is needed at pixel ratio 1.75. **The fix is a 1280w candidate plus an accurate `sizes`**, at the cost of one more image variant per post in each build. That's about 40–50 KB less on most phones; phones at pixel ratio 3 still need the 1920w file. Decide with Villoro whether that's worth it.

## PR 13. Accessibility and layout leftovers

An axe audit (WCAG 2 A/AA) of 25 pages in both themes was fixed in November 2026: muted labels, category names and chips, footer text, the 404 page in dark theme, code comments. What is left:

- **The brand blue is below the contrast standard, on purpose.** White on `#3a76ff` is 4.02:1 and `#3a76ff` on the page background is 3.89:1, against a required 4.5:1. It affects links, the active nav item, kickers, primary buttons and table headers. **Villoro decided to keep `#3a76ff` everywhere (November 2026): don't change it.** If that is ever revisited, the fix that keeps the logo is a slightly darker blue only where it carries text (about `#2f67e8`). Audit tools will keep reporting these.

---

## Checked and fine

So nobody audits these again soon:

- Every page has exactly one `<h1>` and a unique `<title>`.
- Drafts don't leak into the sitemap, RSS or search index.
- The 577 images with empty `alt` are all decorative favicons inside `FancyLink`, where an empty `alt` is correct.
- Hero images are preloaded with responsive AVIF, originals don't ship, OG images are JPG.
- The PWA precaches only hashed assets and serves pages network-first (#376).
- Security headers are set in `netlify.toml`. A `Content-Security-Policy` is missing, but with inline scripts, GA and Giscus it would need care to be worth it; not proposed.
- Old `/post/*` URLs are redirected.
