# Improvement Proposals

Audit of `villoro.com` (Astro 6 + Tailwind, Netlify). Proposals are grouped by category with current state, suggested change, and rough effort/impact.

> Note: Proposals reference paths discovered during audit. Verify each against current code before implementing — some may already be partially addressed.
> 
> **When an improvement is implemented, remove it from this file.** Keep the list current and actionable.

---

## Performance

> PageSpeed Insights baseline (May 2026, homepage): **Mobile 66 / Desktop 86**. Mobile LCP **5.1s** (target ≤2.5s), FCP **3.0s**, Speed Index **12.7s**. Desktop LCP **1.3s**, Speed Index **6.1s**. CrUX field data: not enough traffic yet — these are lab numbers only. The PSI items below cite the report estimates; re-run PSI after each fix to confirm impact.

### P4. Audit/compress blog images
- **Current:** CI verifies aspect ratio only, not size.
- **Change:** Add a size budget (e.g. <200KB) to CI, batch-compress existing images.
- **Effort:** Medium / **Impact:** Medium

### P9. Audit render-blocking requests
- **Current:** PSI: ~150 ms mobile, ~40 ms desktop. Tailwind's compiled CSS is the main suspect; the GA `gtag/js` tag is `async` so it shouldn't block.
- **Change:** Run a Lighthouse trace, identify the blocking resources, and either inline critical CSS or defer the rest. If `main.css` is the blocker, evaluate Astro's `inlineStylesheets: 'auto'`.
- **Effort:** Medium / **Impact:** Medium

---

## DX & Tooling

### D2. Add a test harness (Vitest)
- Start with utilities (`textConverter`, `readingTime`, `similarItems`).
- **Effort:** High / **Impact:** High

### D4. Lighthouse / Unlighthouse CI step on previews
- **Effort:** Medium / **Impact:** Medium

---

## Content & Collections

### M3. Precompute related posts
- Build-time index instead of runtime `similarItems`.
- **Effort:** Medium / **Impact:** Low (until corpus grows)

---

## Dependencies

### Dep2. Consider replacing `react-icons`
- Switch to inline SVGs or Tabler Icons for smaller bundle / fewer transitive deps.
- **Effort:** Medium / **Impact:** Low

---

## Accessibility (PSI: 87 mobile / 90 desktop)

### A2. Fix color contrast on flagged elements
- **Current:** PSI flags "Background and foreground colors do not have a sufficient contrast ratio." Likely culprits: muted greys for meta text (`pc-*__meta`, `bl-grid-meta`, `hp-stats__label`) and the yellow chip on light backgrounds.
- **Change:** Run axe DevTools on `/` and `/blog`, identify each failing pair, and bump the muted greys one shade darker (or adjust `--color-grey-500`). Verify against `tokens.css`.
- **Effort:** Low / **Impact:** Medium

---

## SEO

### SEO1. Confirm robots.txt is reachable in production
- **Current:** Desktop PSI run reported "robots.txt is not valid — Lighthouse was unable to download a robots.txt file" (mobile run passed). The file exists at `public/robots.txt` and is valid, so this is likely a transient fetch from Lighthouse — but worth verifying after next deploy that `https://villoro.com/robots.txt` returns 200 with the expected body.
- **Effort:** Low / **Impact:** Low (verification only)

### SEO2. Use `og:type="article"` for blog posts
- **Current:** `BaseRedesign.astro:136` hardcodes `<meta property="og:type" content="website" />` for every page, including individual posts. Social previews therefore treat articles as generic pages and skip article-specific cards (e.g. author byline, published time).
- **Change:** Accept an `ogType?: "website" | "article"` prop on `BaseRedesign`, default `"website"`, override to `"article"` from `ArticleLayout.astro`. When `"article"`, also emit `<meta property="article:published_time">` and (when present) `<meta property="article:modified_time">` and `<meta property="article:author">`.
- **Effort:** Trivial / **Impact:** Medium (correct social previews, minor SEO)

### SEO3. Emit a canonical URL on every page (not just articles)
- **Current:** Only `[single].astro` passes `canonical`. Home, `/blog`, `/about`, `/categories/*`, `/tags/*`, and paginated pages have no `<link rel="canonical">`. With trailing-slash normalization and possible `www` vs apex variants, this leaves room for duplicate-URL ambiguity.
- **Change:** Compute canonical in `BaseRedesign.astro` automatically from `config.site.base_url + Astro.url.pathname` when no explicit `canonical` prop is provided. Keep the override path so articles can still pass their own.
- **Effort:** Trivial / **Impact:** Low–Medium

### SEO4. Per-page OG image
- **Current:** Home, blog index, about, tag, and category pages all fall back to `config.metadata.meta_image` for OG/Twitter cards. Sharing any of these gives the same card.
- **Change:** Pass an `image` prop from `index.astro`, `BlogListingLayout` (with a distinct hero per variant), `about.astro` so each surface has a recognizable preview.
- **Effort:** Low / **Impact:** Low

---

## Performance (LCP focus)

### P10. Preload the article hero image (LCP)
- **Current:** Mobile LCP is 5.1s; the hero `<img>` in `ArticleLayout.astro` is almost certainly the LCP element. It loads via `astro:assets` with `loading="eager"` but is not preloaded, so the browser only discovers it after parsing the body.
- **Change:** Emit `<link rel="preload" as="image" href={image} imagesrcset=… imagesizes=…>` in the `<head>` for article pages. Either thread the image through `BaseRedesign` props or use a named slot.
- **Effort:** Low / **Impact:** High (direct LCP win)

### P11. Inline critical CSS (or `inlineStylesheets: 'auto'`)
- **Current:** Astro defaults to a separate stylesheet link. The compiled Tailwind CSS is the main render-blocking request (overlaps with P9).
- **Change:** Set `build.inlineStylesheets: 'auto'` in `astro.config.mjs`. Astro decides per-file whether to inline based on size threshold. Verify there is no FOUC and measure CSS payload before/after.
- **Effort:** Trivial / **Impact:** Medium

---

## Privacy & Compliance

### PR1. Don't ship the Google Analytics script on non-production hosts
- **Current:** `BaseRedesign.astro:54` always emits `<script async src="https://www.googletagmanager.com/gtag/js?id=…">`. The inline `gtag('config', …)` call is guarded by a host check, but the *script* still loads from `localhost:4321` and Netlify previews, leaking the GA endpoint and slowing local dev.
- **Change:** Wrap the entire GA tag in `{import.meta.env.PROD && (...)}`, or move it to a small Astro component that early-returns on non-prod.
- **Effort:** Trivial / **Impact:** Low (DX, privacy hygiene)

---

## Security

### SEC1. Add security headers in `netlify.toml`
- **Current:** No `[[headers]]` block. Browsers fall back to defaults; no `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`, or HSTS.
- **Change:** Add a baseline `[[headers]]` block:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - HSTS is already managed by Netlify when the custom domain has HTTPS enforced — verify in the dashboard.
  - A full CSP is more invasive (GA, Google Fonts, Giscus) and should be a separate, tested rollout.
- **Effort:** Trivial / **Impact:** Medium (security posture, scorecard wins)

---

## PWA / Mobile

### PWA1. Add a web app manifest
- **Current:** `public/pwa/` already ships `pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512x512.png`, but there is no `site.webmanifest` and no `<link rel="manifest">`. The icons are unused by browsers for add-to-homescreen.
- **Change:** Create `public/site.webmanifest` referencing the existing icons (name, short_name, theme_color from `config.json`, background_color, display: "standalone"). Link it from `BaseRedesign.astro` `<head>`.
- **Effort:** Trivial / **Impact:** Low (mobile UX, Lighthouse PWA score)

---

## Accessibility (additional)

### A3. Audit `prefers-reduced-motion`
- **Current:** Redesign 3.0 components use CSS transitions (hover scale on cards, fade animations, smooth scroll for anchors). No global `@media (prefers-reduced-motion: reduce)` block found in `src/styles/`.
- **Change:** Add a base-level rule in `base.css` that disables transitions/animations for users with the reduce-motion preference; audit individual `transition:` declarations if needed.
- **Effort:** Low / **Impact:** Low (a11y, vestibular safety)
