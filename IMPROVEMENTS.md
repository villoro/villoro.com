# Improvement Proposals

Audit of `villoro.com` (Astro 6 + Tailwind 4, Netlify). Proposals are grouped by category with current state, suggested change, and rough effort/impact.

> Note: Proposals reference paths discovered during audit. Verify each against current code before implementing — some may already be partially addressed.
>
> **When an improvement is implemented, remove it from this file.** Keep the list current and actionable.

---

## Performance

> PageSpeed Insights baseline (May 2026, homepage): **Mobile 66 / Desktop 86**. Mobile LCP **5.1s** (target ≤2.5s), FCP **3.0s**, Speed Index **12.7s**. Desktop LCP **1.3s**, Speed Index **6.1s**. CrUX field data: not enough traffic yet — these are lab numbers only. Re-run PSI after each fix to confirm impact.
>
> **Diagnosis (homepage).** The mobile LCP gap is mostly self-inflicted on the home page and is *not* present on article pages, which already do the right thing. Two independent cost centers:
> 1. **LCP image is discovered late and over-sized.** The hero "Most read" card image (`PostCard variant="medium"` in `index.astro`, `loading="eager" fetchpriority="high"`) is the mobile LCP element, but — unlike the article hero — it is **not** `<link rel="preload">`ed and is passed **no `sizes`/`widths`**. So the browser can't start the fetch until after CSS parses, and `astro:assets` ships a variant sized for the 640px `width` attr rather than the actual mobile slot. `ArticleLayout.astro` (lines ~95–150) already solves both with a `getImage()`-driven preload + responsive `sizes` — the homepage just needs the same treatment.
> 2. **Fonts on the critical path.** Five families (Heebo, Signika, Fraunces, Instrument Serif, JetBrains Mono) loaded from Google's CDN across **three** requests, each needing a cross-origin DNS+TLS+fetch to `fonts.googleapis.com` then `fonts.gstatic.com`. This is the main driver of FCP 3.0s on mobile.
>
> Tackle in the order below — P1/P2 are the cheapest wins against LCP, P10 is the biggest win against FCP.

### P1. Preload the homepage LCP image + give cards responsive `sizes`/`widths`  ⭐ start here
- **Current:** The hero "Most read" card (`heroPost`) image is `eager`/`fetchpriority=high` but undiscoverable until the CSS arrives, and no `sizes`/`widths` are set on any `PostCard` `ImageMod` (`PostCard.astro` lines 57–65, 95–104, 129–137). On a 400px-wide phone at DPR 2–3 the pipeline serves a variant far larger than the rendered slot.
- **Change:**
  1. In `index.astro`, mirror the proven `ArticleLayout.astro` pattern (lines 95–137): `await getImage()` on `heroPost.data.image` with explicit `widths`/`format: "avif"`, then emit a `<link slot="head" rel="preload" as="image" type="image/avif" imagesrcset=… imagesizes=… fetchpriority="high">`.
  2. Pass matching `widths` + `sizes` down through `PostCard` → `ImageMod` for the `medium` (hero) card so the preload URL and the rendered `<source>` match exactly (otherwise the preload is wasted and the image downloads twice).
  3. Add sensible `sizes` to the `big` and `small` variants too (small grid cards render at ~1/3 container width on desktop, full width on mobile — e.g. `(max-width:767px) 100vw, (max-width:1023px) 50vw, 33vw`).
- **Effort:** Low–Medium / **Impact:** High (directly targets mobile LCP 5.1s)

### P2. Stop loading two eager images above the same fold
- **Current:** Both the hero "Most read" card *and* the big "Latest" featured card are `loading="eager"` (`index.astro` lines 86–94 and 161–171). On mobile the featured card sits **below** the hero, so it competes for bandwidth with the actual LCP image during the most critical window.
- **Change:** Make the featured card `loading="lazy"` (it's below the fold on mobile and barely above it on desktop). Keep exactly **one** eager+high-priority image per page — the hero card. The 6 grid cards are already `lazy` (good).
- **Effort:** Low / **Impact:** Medium (frees bandwidth for the LCP fetch)

### P4. Audit/compress blog images
- **Current:** `src/images/blog` is 21 MB across 74 images (~290 KB average). CI verifies aspect ratio only, not size. Originals no longer ship in `dist`, but smaller sources still mean smaller optimized variants and faster builds.
- **Change:** Add a size budget (e.g. <200 KB) to `.github/scripts/` checks, batch-compress existing images.
- **Effort:** Medium / **Impact:** Medium

### P10. Self-host fonts and trim the family set  ⭐ biggest FCP win
- **Current:** `BaseRedesign.astro` loads five families over three cross-origin Google requests: Heebo + Signika via `AstroFont` (lines 140–161), Fraunces via one preload-as-style (lines 122–127), and Instrument Serif + JetBrains Mono via a second (lines 128–133). `inlineStylesheets: "auto"` is already on, so the remaining render-blocking cost is the font handshakes, not the app CSS.
- **Change:**
  1. **Self-host** with `@fontsource`/`@fontsource-variable` (or vendored `woff2` in `public/fonts/`). Same-origin removes the `fonts.googleapis.com` + `fonts.gstatic.com` DNS/TLS round-trips entirely, and the two `<link rel="preconnect">` lines can go.
  2. **`<link rel="preload">` only the fonts the first paint actually uses** — Heebo (body) and Signika (UI/headings, currently `display:optional`+`preload:false`, so confirm whether the hero H1 should preload at all). Keep `font-display: swap`/`optional` to avoid blocking.
  3. **Trim weights** to those actually rendered (Heebo 400/600, Signika 500/700 per `theme.json`).
- **Effort:** Medium / **Impact:** High (attacks FCP 3.0s directly)

### P11. Don't ship code/accent fonts on pages that never use them
- **Current:** Instrument Serif (`--font-accent`, "small accent italics") and JetBrains Mono (`--font-mono`, code blocks) are requested in `BaseRedesign.astro` for **every** page, including the homepage — which renders neither. They're paid for on the LCP-critical home route for zero visual benefit.
- **Change:** Move these two families out of the shared `<head>` and load them only where used (JetBrains Mono → `ArticleLayout`/prose pages with code; Instrument Serif → wherever the accent italic actually appears). Pairs naturally with P10's self-hosting. Re-audit whether Instrument Serif earns its place at all — Fraunces already has an italic.
- **Effort:** Low–Medium / **Impact:** Medium (smaller critical path on the home/listing routes)

### P12. Trim third-party / deferred JS on the critical path
- **Current:** Several scripts load on every page: GA `gtag` (`async`, fine), `ClientRouter` view-transitions, `SearchModal client:idle`, and `registerSW({ immediate: true })`. Mobile Speed Index is **12.7s** — disproportionately high vs. LCP, which points at main-thread/script time (or a slow lab trace) rather than bytes.
- **Change:** Capture a Lighthouse **trace** (not just the score) to confirm the long-task sources before changing anything. Candidates if confirmed: drop `immediate: true` on `registerSW` (let it register after load), and re-evaluate whether `ClientRouter` earns its cost on a content site. Verify GA only ever loads in PROD (already gated) and consider a lighter analytics tag.
- **Effort:** Medium / **Impact:** Medium–High (targets Speed Index / TBT) — **measure first**

### P9. Audit render-blocking requests
- **Current:** PSI: ~150 ms mobile, ~40 ms desktop. `inlineStylesheets: "auto"` is **already enabled** in `astro.config.mjs`, so the original CSS-inlining suggestion is done. The remaining render-blockers are the font requests — see **P10/P11**.
- **Change:** Folded into P10/P11. Keep this entry only as a reminder to re-run a Lighthouse trace after those land to confirm no blockers remain.
- **Effort:** — / **Impact:** — (subsumed by P10/P11)

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
