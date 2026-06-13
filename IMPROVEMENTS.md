# Improvement Proposals

Audit of `villoro.com` (Astro 6 + Tailwind 4, Netlify). Proposals are grouped by category with current state, suggested change, and rough effort/impact.

> Note: Proposals reference paths discovered during audit. Verify each against current code before implementing — some may already be partially addressed.
>
> **When an improvement is implemented, remove it from this file.** Keep the list current and actionable.

---

## Performance

> PageSpeed Insights baseline (May 2026, homepage): **Mobile 66 / Desktop 86**. Mobile LCP **5.1s** (target ≤2.5s), FCP **3.0s**, Speed Index **12.7s**. Desktop LCP **1.3s**, Speed Index **6.1s**. CrUX field data: not enough traffic yet — these are lab numbers only. Re-run PSI after each fix to confirm impact.

### P4. Audit/compress blog images
- **Current:** `src/images/blog` is 21 MB across 74 images (~290 KB average). CI verifies aspect ratio only, not size. Originals no longer ship in `dist`, but smaller sources still mean smaller optimized variants and faster builds.
- **Change:** Add a size budget (e.g. <200 KB) to `.github/scripts/` checks, batch-compress existing images.
- **Effort:** Medium / **Impact:** Medium

### P9. Audit render-blocking requests
- **Current:** PSI: ~150 ms mobile, ~40 ms desktop. Note `inlineStylesheets: "auto"` is **already enabled** in `astro.config.mjs`, so the original suggestion is partially done. Remaining suspects: the Google Fonts stylesheets + AstroFont (five font families total: Heebo, Signika, Fraunces, Instrument Serif, JetBrains Mono).
- **Change:** Run a Lighthouse trace to identify remaining blockers. Consider self-hosting the fonts (fontsource) and trimming the family/weight set — five families is a lot for a blog.
- **Effort:** Medium / **Impact:** Medium

---

## DX & Tooling

### D2. Add a test harness (Vitest)
- Start with utilities (`textConverter`, `readingTime`, `similarItems`) and the MDX plainify logic in `src/pages/search.json.ts` (subtle and currently untested).
- **Effort:** High / **Impact:** High

### D4. Lighthouse / Unlighthouse CI step on previews
- Netlify deploy previews exist; wire a Lighthouse assertion (LCP budget) against them so the recently-landed hero-preload work doesn't regress.
- **Effort:** Medium / **Impact:** Medium

### D5. Dead-config cleanup
- **Current:** Several inert leftovers confirmed in the repo:
  - `tailwind.config.js` at root — inert under Tailwind v4 (`@theme` lives in `generated-theme.css`).
  - `@/partials/*` alias in `tsconfig.json` — `src/layouts/partials/` no longer exists.
  - `<meta name="theme-name" content="astroplate" />` in `BaseRedesign.astro` — theme-vendor leftover.
  - `item-prop="url"` on the canonical `<link>` in `BaseRedesign.astro` — invalid attribute (itemprop misspelled, and pointless on a `<link rel=canonical>`).
  - `<meta http-equiv="Content-Type" …>` — redundant; charset comes from the HTTP header/doctype.
  - `scripts/removeDarkmode.js` — one-off utility; delete or move out of `scripts/`.
- **Change:** Remove all of the above; update `AGENTS.md` gotchas accordingly.
- **Effort:** Low / **Impact:** Low (hygiene, less confusion for the next agent/dev)

---

## Content & Collections

### M3. Precompute related posts (and fix their randomness)
- Build-time index instead of runtime `similarItems`. Note: `similarItems` currently takes the top-N scored posts and then **shuffles them with `Math.random()`** — so "related posts" change on every build and the scoring order is discarded. Decide if that's intentional; if not, drop `getRandomElements` (one-line fix, independent of the precompute).
- **Effort:** Medium / **Impact:** Low (until corpus grows)

---

## Dependencies

### Dep2. Consider replacing `react-icons`
- **Current:** Only two consumers remain: `helpers/DynamicIcon.tsx` and `shortcodes/Notice.tsx`. Everything else already uses inline SVGs (`IconArrow`, `SocialIcon`), per the AGENTS.md convention.
- **Change:** Inline the handful of icons those two files use, drop the dependency.
- **Effort:** Low–Medium / **Impact:** Low–Medium (bundle + dep tree)

---

## Accessibility (PSI: 87 mobile / 90 desktop)

### A2. Fix color contrast on flagged elements
- **Current:** PSI flags "Background and foreground colors do not have a sufficient contrast ratio." Likely culprits: muted greys for meta text (`pc-*__meta`, `bl-grid-meta`, `hp-stats__label`) and the yellow chip on light backgrounds.
- **Change:** Run axe DevTools on `/` and `/blog`, identify each failing pair, and bump the muted greys one shade darker (or adjust `--color-grey-500`). Verify against `tokens.css`.
- **Effort:** Low / **Impact:** Medium

---

## SEO

### SEO1. Tidy robots.txt and reference the sitemap
- **Current:** `public/robots.txt` exists and is valid (the desktop-PSI "unable to download" report was likely transient — still worth a post-deploy spot check). But it contains `Disallow: /api/*` (there is no `/api` on this static site) and does **not** reference the sitemap generated by `@astrojs/sitemap`.
- **Change:** Add `Sitemap: https://villoro.com/sitemap-index.xml`, drop the `/api` rule, end with a newline.
- **Effort:** Low / **Impact:** Low

### SEO4. Per-page OG image
- **Current:** Home, blog index, about, tag, and category pages all fall back to `config.metadata.meta_image` for OG/Twitter cards. Sharing any of these gives the same card. (`BaseRedesign` already accepts an `image` prop — only article pages use it.)
- **Change:** Pass an `image` prop from `index.astro`, `BlogListingLayout` (with a distinct hero per variant), `about.astro` so each surface has a recognizable preview.
- **Effort:** Low / **Impact:** Low

### SEO5. Add JSON-LD structured data
- **Current:** No `<script type="application/ld+json">` anywhere. Articles already pass `publishedTime`/`modifiedTime`/`author` to `BaseRedesign` for OG tags, so the data is at hand.
- **Change:** Emit `BlogPosting` (headline, image, dates, author) on article pages and `Person`/`WebSite` on the homepage, inside `BaseRedesign` driven by the existing props.
- **Effort:** Low / **Impact:** Medium (rich results eligibility)
