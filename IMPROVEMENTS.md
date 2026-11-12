# Improvement Proposals

What is left to improve on `villoro.com`, and how to carry on. It started as an audit on 2026-11-11 and the audit is done: **nothing here needs work today.** What remains is a watch list (act when its trigger happens) and two upgrades waiting on upstream. New proposals go under "Open items".

**Goals, in the order they drive priority:** reach/SEO, speed, low maintenance, writing workflow.

**Decisions already taken with Villoro** (don't re-open them):

- **No React**, and no other UI framework. Search is plain JS and the shortcodes are `.astro` components.
- **The PWA stays.** Only audit it for correctness.
- **GA4 stays as it is.** No consent banner, no replacement.
- **The brand blue `#3a76ff` stays everywhere**, logos included, even where it is under the contrast standard: white on `#3a76ff` is 4.02:1 and `#3a76ff` on the page background 3.89:1, against 4.5:1 (links, active nav item, kickers, primary buttons, table headers). Audit tools will keep reporting it. If it is ever revisited, the fix that keeps the logo is a slightly darker blue only where it carries text (about `#2f67e8`).
- **Posts in `src/content/` are not run through Prettier** (it would reflow their tables and markers). The rest of `src/` is, and CI checks it.
- **No 1280w post hero.** Phones draw the cover-cropped hero about 605 px wide, so at pixel ratio 2.6–3 they need the 1920w file anyway (see "Checked and fine").

**Rules for this file:**

- When an item is implemented, **remove it** in the same PR. Don't strike it through.
- Don't write version numbers in it: they go stale on every rebase.
- Figures were measured when the item was written. Re-check before acting on them.

## How to work on this repo

- **One PR per topic, opened by the agent with `gh pr create`; Villoro reviews and merges**, or says "merge it" and the agent merges after checking the deploy preview. Delete merged branches and fast-forward local `main` afterwards.
- **`check_version` only accepts `main` + 1** (patch + 1, or minor + 1 with patch 0 for big changes). Two open PRs can't both be mergeable: number them in the intended merge order, and after each merge rebase the next one onto `main`. Take `main`'s `package-lock.json` and re-run the `npm install` rather than merging lockfile conflicts by hand.
- **A PR with merge conflicts gets no GitHub Actions run at all**, so it shows only Netlify's checks. Rebase it.
- **Required checks on `main`** (ruleset `main-protection`): `check_version`, `netlify/villoro/deploy-preview`, `aspect_ratio_check`, `pre_commit`, `tests`. If a PR renames or removes a CI job, update the ruleset in the same breath (`gh api repos/villoro/villoro.com/rulesets/<id>`) and tell Villoro.
- **"CI green" includes the Netlify deploy preview**, not only GitHub Actions. Netlify skips `dependabot/*` branches on purpose (`netlify.toml`), so on those the preview shows as passed but canceled.
- **Dependabot PRs are Villoro's call.** Usually Villoro updates all dependencies by hand when one shows up; sometimes Villoro asks to merge one. To merge one: rebase its branch onto `main`, bump the version on it, push, and wait for CI.
- **Verify on the built site**: `npm run build`, `npm test`, and headless Chrome for anything visual or behavioural (`playwright-core` with the system Chrome works; nothing needs to be added to the repo). Look at before/after screenshots at phone (390–412 px) and desktop widths. For refactors and upgrades, compare `dist/` with `main`'s build file by file: several changes this round were proven byte-identical that way.
- **Subagents may do mechanical work; the main agent reviews every diff and re-runs the checks itself.** Past reviews caught a font fallback, an RSS change that would have re-flagged every post, and changes to the brand blue that the subagent reports missed.
- **Node**: the repo needs Node 22 (`.nvmrc`). On Villoro's machine the default is Node 24 and the installed Node 22 patch is older than some Astro packages ask for, so: run `npm ci`/`npm install` with Node 22 (`nvm use 22`), then build, lint, typecheck and test with Node 24. Always run `astro check` with `CI=true` and a timeout, or it can hang on an install prompt.
- **Builds are fast only with a warm image cache** (`node_modules/.astro`). `npm ci` wipes it: copy it aside and back, or expect one build of several minutes.
- **Agent worktrees** (`.claude/worktrees/`) hold full `node_modules` copies: remove them when the subagent is done, and lint with `--ignore-pattern '.claude/**'` while they exist.

## Open items

None.

## Waiting on upstream

Checked on 2026-11-12. Re-check when Dependabot or `npm outdated` shows a new release.

- **`@vite-pwa/astro` 1 → 2.** v2 (released 2026-10-31) is a rewrite on `@unplugin-pwa` 0.0.x: it replaces Google Workbox, renames the export (`AstroPWAIntegration`) and changes the docs. A service-worker regression stays cached on visitors' devices, so **wait until `@unplugin-pwa` reaches 1.0**. v1.2 works with Astro 7; npm only reports a peer-range warning (`astro ^1–^5`).
- **`typescript` 6 → 7.** Blocked: `typescript-eslint` accepts `<6.1` and `@astrojs/check` accepts `^5 || ^6`. **Upgrade when both support 7.**

## Watch list

Fine today. Each has the trigger that would make it worth a PR.

- **`npm audit`: 17 findings (15 moderate, 2 low)**, all in build and dev tooling (`deepmerge`, `glob`, `minimatch`, `postcss-selector-parser`, and the same `minimatch` advisory through ESLint 10), none in what the site ships. *Act when* a finding reaches a runtime dependency, or upstream fixes land and `npm audit fix` can apply them without a major.
- **Build time**: about 30 s with a warm image cache and 6 to 10 minutes with an empty one, because a build writes ~1,800 optimized images (AVIF, WebP and JPG). The cache is kept between builds on Netlify, and in CI (`warm_image_cache.yaml` saves it from `main`). *Act when* builds get slow again: dropping WebP (AVIF plus the JPG fallback covers every browser) removes a third of the files.
- **Search index size**: `search.json` is 370 KB uncompressed for 74 posts and grows with each one. It is fetched only when search opens. *Act when* opening search feels slow: lower the per-post cap in `src/pages/search.json.ts` (5,000 characters today).

## Checked and fine

So nobody audits these again soon:

- **Page speed, measured on 2026-11-12** with Lighthouse 13 locally (mobile, simulated slow 4G, 3 runs each, live site). Lab numbers, not field data:

  | Page                             | Perf  | FCP       | LCP                       | TBT        | CLS |
  | -------------------------------- | ----: | --------: | ------------------------: | ---------: | --: |
  | `/`                              | 87–99 | 1.1–1.3 s | 1.5–1.6 s (one run 4.0 s) | 80–90 ms   | 0   |
  | `/blog/duckdb-instead-of-spark/` | 86–89 | 1.1 s     | 3.7 s                     | 110–190 ms | 0   |

  Up from June 2026 (PageSpeed mobile: Perf 70, FCP 3.8 s, LCP 5.1 s). The size budgets stay; no Lighthouse budget in CI (scores vary between runs). The post LCP is the hero image, which phones download at 1920w. A 1280w candidate was rejected: the hero is `object-fit: cover` in a box about 340 px tall, so it is drawn about 605 px wide on any phone, and at pixel ratio 2.6–3 (most current phones) that needs 1600–1800 px anyway.
- **Accessibility**: an axe audit (WCAG 2 A/AA) of 25 pages in both themes was fixed in November 2026. Only the brand blue is still reported, on purpose (see the decisions above). Tables scroll with the keyboard.
- **Phone layout**: no page is wider than a 390 px screen (home hero, post hero, inline code, callouts). `npm test` checks HTML, not layout, so re-scan with headless Chrome after layout changes.
- Every page has exactly one `<h1>` and a unique `<title>`.
- Drafts don't leak into the sitemap, RSS or search index.
- The 577 images with empty `alt` are all decorative favicons inside `FancyLink`, where an empty `alt` is correct.
- Hero images are preloaded with responsive AVIF, originals don't ship, OG images are JPG.
- The PWA precaches only hashed assets and serves pages network-first.
- Security headers are set in `netlify.toml`. A `Content-Security-Policy` is missing, but with inline scripts, GA and Giscus it would need care to be worth it; not proposed.
- Old `/post/*` URLs are redirected.
