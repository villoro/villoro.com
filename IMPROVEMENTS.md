# Improvement Proposals

Audit of `villoro.com` done on **2026-11-11** against `origin/main` at `d17fa2c` (v3.2.26, Astro 7, 76 published posts, 215 built pages). It replaces the June 2026 audit.

**Goals, in the order they drive priority:** reach/SEO, speed, low maintenance, writing workflow.

**Decisions already taken with Villoro** (don't re-open them):

- **No React.** Done in v3.2.37: search is plain JS and the shortcodes are `.astro` components. Don't add a UI framework back.
- **The PWA stays.** Only audit it for correctness.
- **GA4 stays as it is.** No consent banner, no replacement.

**Rules for this file:**

- When an item is implemented, **remove it** in the same PR and fix cross-references.
- Every figure below was measured on the built `dist/` of the commit above. Re-check before implementing: some may have moved.
- Items are grouped into **one PR each**. Every PR bumps the version, so two open PRs always conflict on `package.json`: merge them one at a time and rebase the next.

## Summary

| PR | Topic | Goal | Effort | Impact | Who |
| --- | :--- | :--- | --- | --- | :--- |
| 1 | Metadata leftovers | SEO | Low | Low | subagent |
| 7 | CI: one build job, real budgets, no audit noise | Maintenance | Medium | Medium | subagent |
| 9 | Draft previews and strict frontmatter | Writing | Medium | Medium | senior |
| 11 | Major dependency upgrades | Maintenance | Medium | Low | subagent |
| 12 | Lighthouse budget on previews | Speed | Medium | Medium | later |
| 13 | Colour contrast | Accessibility | Low | Medium | later |

"Senior" means the item needs design judgement; "subagent" means the change is specified well enough below to hand over.

---

## PR 1. Metadata leftovers

The metadata bugs are fixed (author, JSON-LD placement and image, trimmed metas, home description, `og:site_name`, home `Person`/`WebSite`, `robots.txt`). What is left is small:

- **`og:title` and `<title>` use `meta_title`, the JSON-LD headline uses `title`.** Decide whether that is intended and write the rule in `AGENTS.md`.
- **Category/tag descriptions are generic** ("All posts in the 🐍 Python category."). Add an optional `description` to `categoryMetadata.ts`.

## PR 7. CI: one build job, real budgets, no audit noise

- **`npm audit` reports 29 vulnerabilities (14 high) and none are in the site.** They come from `@size-limit/preset-app`, which installs Puppeteer and Chromium to time page loads we don't measure. Swap it for `@size-limit/file` (size only). This also makes `npm ci` much faster in CI and on Netlify.
- **Three jobs each run `npm ci`**, and the build only happens inside `tests`. Merge `lint_and_typecheck` and `tests` into one `build` job: lint, typecheck, build, size, then `npm test`.
- **Old action versions**: `actions/checkout@v3`, `actions/setup-python@v4`, `actions/labeler@v4`, `dorny/paths-filter@v2`. Update them.
- **Dependabot**: three PRs have been open since August (#360, #361, #363). There is no `.github/dependabot.yml`, so these are ungrouped security updates. Add a config that groups npm updates weekly into one PR and also covers `github-actions`, then close the stale ones.
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

Outdated by a major today: `@astrojs/mdx` 7 → 8, `@vite-pwa/astro` 1 → 2, `eslint` 9 → 10, `eslint-plugin-astro` 1 → 3, `prettier-plugin-astro` 0.14 → 1, `typescript` 6 → 7, `astro-auto-import` 0.5 → 0.6. One PR per risky one (mdx, PWA), the lint/format tooling together.

Also revisit the comment in `astro.config.mjs`: Astro 7 defaults to the native Sätteri markdown pipeline and the site pins the `unified` one for three plugins (`remark-callouts`, `remark-toc` + `remark-collapse`, `rehype-sectionize`). No file in `src/content` has a "Table of contents" heading (`ArticleTOC` replaced it), so `remark-toc` and `remark-collapse` do nothing and can be removed.

## PR 12. Lighthouse budget on previews

Run Lighthouse against the Netlify deploy preview of each PR and fail on a budget (LCP, total JS). There is a good number to protect now: 42 KB of JavaScript in total after Brotli. The fonts are self-hosted since v3.2.32 and PageSpeed hasn't been re-run since: the last numbers (June 2026, mobile) were Perf 70, FCP 3.8 s, LCP 5.1 s. Also check CLS, because the metric-adjusted fallback fonts that `astro-font` generated are gone.

## PR 13. Colour contrast

Carried over from the June audit and **not re-verified**: PageSpeed flagged insufficient contrast, probably the muted greys of card metadata (`pc-*__meta`, `bl-grid-meta`, `hp-stats__label`). Run axe on `/`, `/blog` and one post in both themes, and darken the failing tokens in `tokens.css`.

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
