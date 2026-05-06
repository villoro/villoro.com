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

### P6. Move prose styles out of `ArticleLayout.astro`
- **Current:** ~420 lines of `<style is:global>` in the layout file.
- **Change:** Extract to `src/styles/prose.css`, import where needed.
- **Effort:** Medium / **Impact:** Low (mostly maintainability)


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
