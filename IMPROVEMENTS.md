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

Sitemap without `noindex`/thin pages and with `lastmod`; post metadata bugs (author, JSON-LD, share image); all fonts self-hosted; related posts stable; shortcodes ported to `.astro`; search rewritten without React and React removed; trailing-slash URLs everywhere; a 400 KB limit on hero images; the post hero no longer overlaps its breadcrumb on phones; tables scroll with the keyboard; default hero image and SVG logos; image cache kept between builds (Netlify builds went from ~6.5 min to ~30 s, CI from ~7 min to under 2); tests on the built site; dead config and stale docs; CI as one job with grouped Dependabot; colour contrast (except the brand blue); draft previews (a `draft: true` post has a `noindex` page with a banner in dev and in Netlify previews only), strict frontmatter and `npm run new-post`.

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

1. PR 13 leftovers (the code theme setting).
2. PR 1 leftovers (category descriptions need Villoro's wording).
3. PR 11, the major upgrades, one risky package per PR.
4. PR 12 as a one-off measurement.

## Summary

| PR | Topic | Goal | Effort | Impact |
| --- | :--- | :--- | --- | --- |
| 1 | Metadata leftovers | SEO | Low | Low |
| 7 | Build and CI leftovers | Maintenance | Low | Medium |
| 9 | Content model leftovers | Writing | Low | Low |
| 11 | Major dependency upgrades | Maintenance | Medium | Low |
| 12 | Measure page speed once | Speed | Low | Low |
| 13 | Accessibility and layout leftovers | Accessibility | Low | Medium |

The numbers are the ones the items had in the original audit; the gaps are items already done.

---

## PR 1. Metadata leftovers

The metadata bugs are fixed (author, JSON-LD placement and image, trimmed metas, home description, `og:site_name`, home `Person`/`WebSite`, `robots.txt`). What is left is small:

- **`og:title` and `<title>` use `meta_title`, the JSON-LD headline uses `title`.** Decide whether that is intended and write the rule in `AGENTS.md`.
- **Category/tag descriptions are generic** ("All posts in the 🐍 Python category."). Add an optional `description` to `categoryMetadata.ts`.

## PR 7. Build and CI leftovers

CI is one `tests` job since November 2026 (lint, typecheck, build, size, tests), the size check no longer installs Puppeteer, actions are on current majors and Dependabot opens one grouped PR a week. Blog hero images over 400 KB fail CI (`check_aspect_ratio.py --max-kb`). What is left:

- **`npm audit` still reports 15 findings (13 moderate, 2 low)**, down from 29. They are in build tooling (`deepmerge`, `glob`, `minimatch`, `postcss-selector-parser`), not in what the site ships. Check them again after the major upgrades of PR 11.
- **Build time**: a build with an empty image cache takes 6 to 10 minutes and one with a warm cache about 20 seconds, because each build writes ~1,800 optimized images (524 AVIF, 660 WebP, 591 JPG). Since v3.2.30 the cache is kept between builds on Netlify, and since v3.2.31 in CI (`warm_image_cache.yaml` saves it from `main`, the build job restores it). If builds get slow again, the next lever is fewer variants: dropping WebP (AVIF plus the JPG fallback covers every browser) removes a third of the files.
- **Search index size**: `search.json` is 370 KB uncompressed for 74 posts and grows with each one. It is fetched only when search opens, so it isn't urgent; lower the per-post cap in `src/pages/search.json.ts` (5,000 characters today) if it becomes one.

## PR 9. Content model leftovers

Drafts are previewable, frontmatter is strict and posts come from one typed helper (`src/lib/posts.ts`). Small things noticed on the way and left alone:

- **Unused schema fields**: `image_alt` and `reading_time` in the post schema (nothing renders them), and `date`, `image`, `draft` in the about schema. Delete them or use them.
- **The home page `companies` block** is in the schema and in `src/content/homepage/-index.md`, but no page renders it. Render it or remove it.
- **`SHOW_DRAFTS` in `astro dev`** (`import.meta.env.DEV`) was not exercised, only the `CONTEXT=deploy-preview` build. Open a draft in `npm run dev` once to confirm.

## PR 11. Major dependency upgrades

`size-limit` and `@size-limit/file` must move together (12 → 14). Outdated by a major today: `@astrojs/mdx` 7 → 8, `@vite-pwa/astro` 1 → 2, `eslint` 9 → 10, `eslint-plugin-astro` 1 → 3, `prettier-plugin-astro` 0.14 → 1, `typescript` 6 → 7, `astro-auto-import` 0.5 → 0.6. One PR per risky one (mdx, PWA), the lint/format tooling together.

Also revisit the comment in `astro.config.mjs`: Astro 7 defaults to the native Sätteri markdown pipeline and the site pins the `unified` one for three plugins (`remark-callouts`, `remark-toc` + `remark-collapse`, `rehype-sectionize`). No file in `src/content` has a "Table of contents" heading (`ArticleTOC` replaced it), so `remark-toc` and `remark-collapse` do nothing and can be removed.

## PR 12. Measure page speed once

The audit proposed a Lighthouse budget on every deploy preview. **Recommendation: don't add it.** The size budgets (`.size-limit.json`: 50 KB of JS, 23 KB of CSS after Brotli) and `npm test` already catch regressions, cheaply and without flakiness, while Lighthouse scores vary from run to run on CI machines.

What is missing is one measurement. The last PageSpeed numbers are from June 2026 (mobile: Perf 70, FCP 3.8 s, LCP 5.1 s) and predate everything that should have moved them: self-hosted fonts, no React (JS went from 104 KB to 42 KB), trailing-slash URLs without a redirect. Run PageSpeed Insights (or `npx lighthouse` against the live site) on the home page and one post, mobile, and write the numbers here. Check CLS in particular: the metric-adjusted fallback fonts that `astro-font` generated are gone. If LCP is still over 2.5 s, the next suspects are the hero image and the 17 KB `ClientRouter` script.

## PR 13. Accessibility and layout leftovers

An axe audit (WCAG 2 A/AA) of 25 pages in both themes was fixed in November 2026: muted labels, category names and chips, footer text, the 404 page in dark theme, code comments. What is left:

- **The brand blue is below the contrast standard, on purpose.** White on `#3a76ff` is 4.02:1 and `#3a76ff` on the page background is 3.89:1, against a required 4.5:1. It affects links, the active nav item, kickers, primary buttons and table headers. **Villoro decided to keep `#3a76ff` everywhere (November 2026): don't change it.** If that is ever revisited, the fix that keeps the logo is a slightly darker blue only where it carries text (about `#2f67e8`). Audit tools will keep reporting these.
- **`shikiConfig.theme: "monokai"` has no visible effect.** Code blocks are painted with github-dark token colours on a background forced to `#272822` by `prose.css`. Either make the theme setting real or delete it; today the comment colour is patched with a CSS override.

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
