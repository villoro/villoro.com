# Improvement Proposals

Audit of `villoro.com` done on **2026-11-11** against `origin/main` at `d17fa2c` (v3.2.26, Astro 7, 76 published posts, 215 built pages). It replaces the June 2026 audit.

**Goals, in the order they drive priority:** reach/SEO, speed, low maintenance, writing workflow.

**Decisions already taken with Villoro** (don't re-open them):

- **React goes away.** Search is rewritten in plain JS and the shortcodes become `.astro` components.
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
| 4 | Shortcodes to `.astro` | Speed, maintenance | Medium | Medium | subagent |
| 5 | Search without React, drop React | Speed, maintenance | Medium–High | High | senior |
| 6 | Dead config and stale docs | Maintenance | Low | Low | subagent |
| 7 | CI: one build job, real budgets, no audit noise | Maintenance | Medium | Medium | subagent |
| 8 | Tests on the built site | Maintenance | Medium | High | senior designs, subagent writes |
| 9 | Draft previews and strict frontmatter | Writing | Medium | Medium | senior |
| 11 | Major dependency upgrades | Maintenance | Medium | Low | subagent, after PR 5 |
| 12 | Lighthouse budget on previews | Speed | Medium | Medium | later |
| 13 | Colour contrast | Accessibility | Low | Medium | later |

"Senior" means the item needs design judgement; "subagent" means the change is specified well enough below to hand over.

---

## PR 1. Metadata leftovers

The metadata bugs are fixed (author, JSON-LD placement and image, trimmed metas, home description, `og:site_name`, home `Person`/`WebSite`, `robots.txt`). What is left is small:

- **`og:title` and `<title>` use `meta_title`, the JSON-LD headline uses `title`.** Decide whether that is intended and write the rule in `AGENTS.md`.
- **Trailing-slash links.** Canonicals have no trailing slash, but 42 in-post `FancyLink`s point to `https://villoro.com/blog/<slug>/`. Handled in PR 4 (FancyLink strips it). The RSS feed keeps the slash **on purpose**: the link is also the item GUID, and changing it makes feed readers show every old post as new.
- **Category/tag descriptions are generic** ("All posts in the 🐍 Python category."). Add an optional `description` to `categoryMetadata.ts`.

## PR 4. Shortcodes to `.astro`

First half of removing React. Nine shortcodes are auto-imported; usage across the 82 MDX files:

| Shortcode | Posts using it | Action |
| --- | --- | :--- |
| `FancyLink` | 73 | port to `.astro` |
| `FileName` | 31 | port to `.astro` |
| `TerminalOutput` | 7 | port to `.astro` |
| `Accordion` | 6 | port to `.astro` on top of `<details>`/`<summary>` |
| `Button` | 4 | port to `.astro` |
| `Tabs`, `Tab`, `Video`, `Notice` | 0 | delete |

- `Accordion` is the only one hydrated (`client:load` in 6 posts, 15 places). With `<details>` it needs no JS; remove the `client:load` attributes from those posts.
- `helpers/DynamicIcon.tsx` has no consumer: delete it. With `Notice` gone, **`react-icons` has no consumer either**: remove the dependency.
- Deleting `Tabs.tsx` also clears the only two ESLint warnings in the repo.
- `astro-auto-import` accepts `.astro` files; update the list in `astro.config.mjs` and the shortcode section of `AGENTS.md`.

**Check:** build, then compare the rendered HTML of one post per shortcode before and after (`0073` for Accordion, `0054` for the most `client:load`s).

## PR 5. Search without React, drop React

`SearchModal client:idle` in `BaseRedesign` is the last island. Because of it **every page downloads `client.*.js`, 213 KB (React + ReactDOM)**, for a modal most visitors never open.

- Rewrite `SearchModal.tsx` + `SearchResult.tsx` (389 lines) as one `.astro` component with a `<dialog>` and a plain `<script>`. Keep the behaviour: lazy fetch of `/search.json` on first open, keyboard shortcut, arrow-key navigation, highlighted matches.
- Load the script **on first open** (dynamic `import()` from the search trigger), not on idle.
- It must survive `ClientRouter` navigations: bind on `astro:page-load`, or mark the dialog `transition:persist`.
- `search.json` is 370 KB uncompressed for 76 posts and grows with every post. It's fetched lazily, so it isn't urgent, but lower the per-post text cap or drop the body and index title + description + headings + tags.
- Then remove `react`, `react-dom`, `@astrojs/react`, `@types/react*`, `eslint-plugin-react*`, the `react()` integration, `"jsx": "react"` in `tsconfig.json`, and the React blocks in `eslint.config.js`.
- `marked` is imported by `SearchResult.tsx`, `textConverter.ts` and `search.json.ts`; check whether it is still needed once the first is gone. `gray-matter` and `github-slugger` are used by `src/lib/blogIndex.mjs` (sitemap rules), so they stay.

**Check:** the JS budget of PR 7 should drop from 300 KB to well under 50 KB. Test search in the preview build on a phone-sized viewport, in both themes, after a soft navigation.

## PR 6. Dead config and stale docs

- `tailwind.config.js`: inert under Tailwind 4. Delete.
- `scripts/removeDarkmode.js` and the `remove-darkmode` npm script. Delete.
- `BaseRedesign.astro`: `<meta name="theme-name" content="astroplate">`, `<meta http-equiv="Content-Type">`, `item-prop="url"` on the canonical, and the header comment that mentions the removed `Base.astro`. Delete.
- Root `images/` folder (`logo.png`, `mockup_*.jpg`, `pagespeed_rating.png`): only the README uses it. Keep what the README shows, delete the rest.
- **Two broken favicons**: posts reference `/favicons/apache.ico` and `/favicons/aws-dark.ico`, which don't exist. Fix the mapping in `FancyLink` (or add the files).
- **Ten `http://` outbound links** (numba, flask.pocoo.org, jinja.pocoo.org, supervisord, eepurl…). Move to `https://` where the site supports it, including `subscribe.link` in `config.json`.
- `.github/labeler.yml` lists paths that no longer exist (`postcss.config.js`, `src/content/config.ts`, `src/hooks/**`, `src/content/contact/**`). Bring it in line with the tree.
- **`AGENTS.md` is out of date**: says Astro 6 and React 18 (it's Astro 7; React 19 until PR 5), still lists the dead `@/partials/*` alias as present (already removed from `tsconfig.json`), says the prose styles live in `ArticleLayout.astro` at "~700 lines" (it's 373 lines; they moved to `src/styles/prose.css`), and doesn't mention the PWA, `rss.xml.ts`, `npm run lint`/`typecheck`/`size`, or the `bundle_size` and `lint_and_typecheck` CI jobs. Rewrite those parts.
- `README.md` still credits the Astroplate template and layout that the redesign removed. Refresh.
- Add `.nvmrc` with `22`: the repo requires Node 22 and it's easy to run it with another version locally.

## PR 7. CI: one build job, real budgets, no audit noise

- **`npm audit` reports 29 vulnerabilities (14 high) and none are in the site.** They come from `@size-limit/preset-app`, which installs Puppeteer and Chromium to time page loads we don't measure. Swap it for `@size-limit/file` (size only). This also makes `npm ci` much faster in CI and on Netlify.
- **The budgets don't guard anything.** They are measured after Brotli: JS is 104 KB against a 300 KB limit, CSS is 19 KB against 100 KB. Either could triple without failing. After PR 5, set each close to the real number (measured + 15%).
- **Three jobs each run `npm ci`**, and the build only happens inside `bundle_size`. Merge `lint_and_typecheck` and `bundle_size` into one `build` job: lint, typecheck, build, size, then the tests of PR 8.
- **Old action versions**: `actions/checkout@v3`, `actions/setup-python@v4`, `actions/labeler@v4`, `dorny/paths-filter@v2`. Update them.
- **Dependabot**: three PRs have been open since August (#360, #361, #363). There is no `.github/dependabot.yml`, so these are ungrouped security updates. Add a config that groups npm updates weekly into one PR and also covers `github-actions`, then close the stale ones.
- **Build time**: a build with an empty image cache takes 6 to 10 minutes and one with a warm cache about 20 seconds, because each build writes ~1,800 optimized images (524 AVIF, 660 WebP, 591 JPG). Since v3.2.30 the cache is kept between builds on Netlify, and since v3.2.31 in CI (`warm_image_cache.yaml` saves it from `main`, the build job restores it). If builds get slow again, the next lever is fewer variants: dropping WebP (AVIF plus the JPG fallback covers every browser) removes a third of the files.
- **Image weight**: `src/images/blog` is 23 MB; 29 hero images are over 300 KB and `0001-personal-web.png` is 945 KB. The originals don't ship, so this only costs build time and repo size. Add a size limit (400 KB, matching the hero-image rule in `AGENTS.md`) to `check_aspect_ratio.py` and recompress the ones over it. Low priority within this PR; split it out if it gets noisy.

## PR 8. Tests on the built site

There are no tests. For a static site the cheapest useful ones are **data-quality checks on the output**, the same idea as dbt tests on a model: build once, then assert things about `dist/`. The metadata bugs fixed in November 2026 (author "Admin", JSON-LD outside `<html>`, a 404 image URL) would all have been caught by them.

One script (`node --test`, no new dependency) that walks `dist/**/*.html` and asserts:

- every internal `href`/`src` resolves to a file (today: 2 failures, the favicons of PR 6);
- every page has exactly one `<h1>`, a unique `<title>`, a non-empty description without leading/trailing whitespace, and a canonical;
- every post has JSON-LD inside `<head>` that parses, with an author that isn't "Admin" and an image URL that exists in `dist/`;
- every URL in the sitemap exists and isn't `noindex`;
- no draft slug appears in the sitemap, RSS or `search.json`;
- no request to Google Fonts, and no `client.*.js` (after PR 5).

Then a few unit tests with Vitest for the pure functions that have subtle logic: `plainify` in `textConverter.ts`, the MDX-to-text code in `search.json.ts`, `similarItems`, `readingTime`.

Do this PR next, so the rest of the list is developed against it.

## PR 9. Draft previews and strict frontmatter

- **Drafts can't be previewed.** `AGENTS.md` says to release a post with `draft: true` "so it can be checked live before it shows in listings", but `getSinglePage` filters drafts out of `getStaticPaths`, so a draft has no page at all, live or in the deploy preview. Build draft pages when `CONTEXT` isn't `production` (Netlify sets it to `deploy-preview` on PRs), always `noindex`, never in listings, RSS, sitemap or search. In dev, show them too.
- **Unknown frontmatter keys pass silently.** The schema is a plain `z.object`, so a typo like `update_date:` is ignored. Use `z.strictObject`. The memory of past sessions already records confusion about snake_case keys; `imageAlt` and `readingTime` are the two camelCase leftovers, rename them.
- **`category` is a free string** defaulting to `"Others"`, which isn't a key in `categoryMetadata.ts` (the key is `others`). Make it `z.enum` over the keys of `categoryMetadata` so a wrong category fails the build instead of rendering a grey chip.
- **The blog schema serves two things.** `src/content/blog/-index.md` (the listing's hero copy) lives in the same collection as the posts, so the post schema carries `hero` and `section` fields that no post uses, and every query has to filter the `-index` entry out by id. Move it to its own small collection. In the homepage schema, `banner`, `slogan` and `blog` look like template leftovers: confirm they have no consumer and delete.
- **`getSinglePage(collectionName: string)`** casts everything to `"blog"`, and `similarItems` is typed `any`. Type them properly; `rss.xml.ts` and `search.json.ts` re-implement the draft filter and should call the same helper.
- **A `npm run new-post` script** that creates `9999-<slug>.mdx` with the full frontmatter would remove the copy-paste step. Optional.

## PR 11. Major dependency upgrades

After PR 5 (several of these disappear with React). Outdated by a major today: `@astrojs/mdx` 7 → 8, `@vite-pwa/astro` 1 → 2, `eslint` 9 → 10, `eslint-plugin-astro` 1 → 3, `prettier-plugin-astro` 0.14 → 1, `typescript` 6 → 7, `astro-auto-import` 0.5 → 0.6. One PR per risky one (mdx, PWA), the lint/format tooling together.

Also revisit the comment in `astro.config.mjs`: Astro 7 defaults to the native Sätteri markdown pipeline and the site pins the `unified` one for three plugins (`remark-callouts`, `remark-toc` + `remark-collapse`, `rehype-sectionize`). No file in `src/content` has a "Table of contents" heading (`ArticleTOC` replaced it), so `remark-toc` and `remark-collapse` do nothing and can be removed.

## PR 12. Lighthouse budget on previews

Run Lighthouse against the Netlify deploy preview of each PR and fail on a budget (LCP, total JS). Worth doing only after PR 5, when there is a good number to protect. The fonts are self-hosted since v3.2.32 and PageSpeed hasn't been re-run since: the last numbers (June 2026, mobile) were Perf 70, FCP 3.8 s, LCP 5.1 s. Also check CLS, because the metric-adjusted fallback fonts that `astro-font` generated are gone.

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
