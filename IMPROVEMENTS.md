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

Sitemap without `noindex`/thin pages and with `lastmod`; post metadata bugs (author, JSON-LD, share image); all fonts self-hosted; related posts stable; shortcodes ported to `.astro`; search rewritten without React and React removed; trailing-slash URLs everywhere; default hero image and SVG logos; image cache kept between builds (Netlify builds went from ~6.5 min to ~30 s, CI from ~7 min to under 2); tests on the built site; dead config and stale docs; CI as one job with grouped Dependabot; colour contrast (except the brand blue).

### Open pull requests

Merge in this order. Each one must carry a version exactly one above `main` at the moment it merges.

| PR | What | State |
| --- | :--- | :--- |
| branch `feat/draft-previews` | Draft previews, strict frontmatter, typed post helpers, `npm run new-post` (PR 9 below) | verified locally in both build modes (production and `CONTEXT=deploy-preview`); look for its PR, or open one from the branch |
| #399, #400 | Dependabot (GitHub Actions group, npm group) | each needs a version bump on its branch before it can merge (see PR 7) |

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

1. Land the draft-previews PR.
2. PR 7 leftovers: the Dependabot version bump (it unblocks #399 and #400 and every future weekly PR), then the image size limit.
3. PR 1 leftovers (category descriptions need Villoro's wording).
4. PR 13 leftovers (keyboard-scrollable tables, the code theme setting).
5. PR 11, the major upgrades, one risky package per PR.
6. PR 12 as a one-off measurement.

## Summary

| PR | Topic | Goal | Effort | Impact |
| --- | :--- | :--- | --- | --- |
| 1 | Metadata leftovers | SEO | Low | Low |
| 7 | Build and CI leftovers | Maintenance | Low | Medium |
| 9 | Draft previews and strict frontmatter | Writing | Medium | Medium |
| 11 | Major dependency upgrades | Maintenance | Medium | Low |
| 12 | Measure page speed once | Speed | Low | Low |
| 13 | Accessibility leftovers | Accessibility | Low | Low |

The numbers are the ones the items had in the original audit; the gaps are items already done.

---

## PR 1. Metadata leftovers

The metadata bugs are fixed (author, JSON-LD placement and image, trimmed metas, home description, `og:site_name`, home `Person`/`WebSite`, `robots.txt`). What is left is small:

- **`og:title` and `<title>` use `meta_title`, the JSON-LD headline uses `title`.** Decide whether that is intended and write the rule in `AGENTS.md`.
- **Category/tag descriptions are generic** ("All posts in the 🐍 Python category."). Add an optional `description` to `categoryMetadata.ts`.

## PR 7. Build and CI leftovers

CI is one `tests` job since November 2026 (lint, typecheck, build, size, tests), the size check no longer installs Puppeteer, actions are on current majors and Dependabot opens one grouped PR a week. What is left:

- **Dependabot PRs fail `check_version`.** Every PR must bump the version by one and Dependabot doesn't. Until that is automated (a small workflow that bumps the version on `dependabot/*` branches), bump it by hand on the PR branch.
- **`npm audit` still reports 15 findings (13 moderate, 2 low)**, down from 29. They are in build tooling (`deepmerge`, `glob`, `minimatch`, `postcss-selector-parser`), not in what the site ships. Check them again after the major upgrades of PR 11.
- **Build time**: a build with an empty image cache takes 6 to 10 minutes and one with a warm cache about 20 seconds, because each build writes ~1,800 optimized images (524 AVIF, 660 WebP, 591 JPG). Since v3.2.30 the cache is kept between builds on Netlify, and since v3.2.31 in CI (`warm_image_cache.yaml` saves it from `main`, the build job restores it). If builds get slow again, the next lever is fewer variants: dropping WebP (AVIF plus the JPG fallback covers every browser) removes a third of the files.
- **Search index size**: `search.json` is 370 KB uncompressed for 74 posts and grows with each one. It is fetched only when search opens, so it isn't urgent; lower the per-post cap in `src/pages/search.json.ts` (5,000 characters today) if it becomes one.
- **Image weight**: `src/images/blog` is 23 MB; 29 hero images are over 300 KB and `0001-personal-web.png` is 945 KB. The originals don't ship, so this only costs build time and repo size. Add a size limit (400 KB, matching the hero-image rule in `AGENTS.md`) to `check_aspect_ratio.py` and recompress the ones over it. Low priority within this PR; split it out if it gets noisy.

## PR 9. Draft previews and strict frontmatter

- **Drafts can't be previewed.** `AGENTS.md` says to release a post with `draft: true` "so it can be checked live before it shows in listings", but `getSinglePage` filters drafts out of `getStaticPaths`, so a draft has no page at all, live or in the deploy preview. Build draft pages when `CONTEXT` isn't `production` (Netlify sets it to `deploy-preview` on PRs), always `noindex`, never in listings, RSS, sitemap or search. In dev, show them too.
- **Unknown frontmatter keys pass silently.** The schema is a plain `z.object`, so a typo like `update_date:` is ignored. Use `z.strictObject`. The memory of past sessions already records confusion about snake_case keys; `imageAlt` and `readingTime` are the two camelCase leftovers, rename them.
- **`category` is a free string** defaulting to `"Others"`, which isn't a key in `categoryMetadata.ts` (the key is `others`). Make it `z.enum` over the keys of `categoryMetadata` so a wrong category fails the build instead of rendering a grey chip.
- **The blog schema serves two things.** `src/content/blog/-index.md` (the listing's hero copy) lives in the same collection as the posts, so the post schema carries `hero` and `section` fields that no post uses, and every query has to filter the `-index` entry out by id. Move it to its own small collection. In the homepage schema, `banner`, `slogan` and `blog` look like template leftovers: confirm they have no consumer and delete.
- **`getSinglePage(collectionName: string)`** casts everything to `"blog"`. Type it properly; `rss.xml.ts` and `search.json.ts` re-implement the draft filter and should call the same helper.
- **A `npm run new-post` script** that creates `9999-<slug>.mdx` with the full frontmatter would remove the copy-paste step. Optional.

## PR 11. Major dependency upgrades

`size-limit` and `@size-limit/file` must move together (12 → 14). Outdated by a major today: `@astrojs/mdx` 7 → 8, `@vite-pwa/astro` 1 → 2, `eslint` 9 → 10, `eslint-plugin-astro` 1 → 3, `prettier-plugin-astro` 0.14 → 1, `typescript` 6 → 7, `astro-auto-import` 0.5 → 0.6. One PR per risky one (mdx, PWA), the lint/format tooling together.

Also revisit the comment in `astro.config.mjs`: Astro 7 defaults to the native Sätteri markdown pipeline and the site pins the `unified` one for three plugins (`remark-callouts`, `remark-toc` + `remark-collapse`, `rehype-sectionize`). No file in `src/content` has a "Table of contents" heading (`ArticleTOC` replaced it), so `remark-toc` and `remark-collapse` do nothing and can be removed.

## PR 12. Measure page speed once

The audit proposed a Lighthouse budget on every deploy preview. **Recommendation: don't add it.** The size budgets (`.size-limit.json`: 50 KB of JS, 23 KB of CSS after Brotli) and `npm test` already catch regressions, cheaply and without flakiness, while Lighthouse scores vary from run to run on CI machines.

What is missing is one measurement. The last PageSpeed numbers are from June 2026 (mobile: Perf 70, FCP 3.8 s, LCP 5.1 s) and predate everything that should have moved them: self-hosted fonts, no React (JS went from 104 KB to 42 KB), trailing-slash URLs without a redirect. Run PageSpeed Insights (or `npx lighthouse` against the live site) on the home page and one post, mobile, and write the numbers here. Check CLS in particular: the metric-adjusted fallback fonts that `astro-font` generated are gone. If LCP is still over 2.5 s, the next suspects are the hero image and the 17 KB `ClientRouter` script.

## PR 13. Accessibility leftovers

An axe audit (WCAG 2 A/AA) of 25 pages in both themes was fixed in November 2026: muted labels, category names and chips, footer text, the 404 page in dark theme, code comments. What is left:

- **The brand blue is below the contrast standard, on purpose.** White on `#3a76ff` is 4.02:1 and `#3a76ff` on the page background is 3.89:1, against a required 4.5:1. It affects links, the active nav item, kickers, primary buttons and table headers. **Villoro decided to keep `#3a76ff` everywhere (November 2026): don't change it.** If that is ever revisited, the fix that keeps the logo is a slightly darker blue only where it carries text (about `#2f67e8`). Audit tools will keep reporting these.
- **Wide tables can't be scrolled with the keyboard.** axe reports `scrollable-region-focusable` on a table in the numba post: a scrollable table needs `tabindex="0"`. Add it to tables in `prose.css`/the markdown pipeline.
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
