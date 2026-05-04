# Improvement Proposals

Audit of `villoro.com` (Astro 6 + Tailwind, Netlify). Proposals are grouped by category with current state, suggested change, and rough effort/impact.

> Note: Proposals reference paths discovered during audit. Verify each against current code before implementing — some may already be partially addressed.

---

## Performance

### P1. Optimize font loading
- **Current:** `BaseRedesign.astro` loads 7 Google Fonts via synchronous `<link>` plus AstroFont for Heebo/Signika.
- **Change:** Preload primary fonts, defer/swap secondary, consider `font-display: optional` for decorative.
- **Effort:** Low / **Impact:** High (faster FCP, less CLS)

### P2. AVIF + WebP with `<picture>` fallback
- **Current:** `ImageMod.astro` only emits `format="webp"`.
- **Change:** Emit AVIF + WebP using Astro's multi-format support.
- **Effort:** Low / **Impact:** Medium

### P4. Audit/compress blog images
- **Current:** CI verifies aspect ratio only, not size.
- **Change:** Add a size budget (e.g. <200KB) to CI, batch-compress existing images.
- **Effort:** Medium / **Impact:** Medium

### P6. Move prose styles out of `ArticleLayout.astro`
- **Current:** ~420 lines of `<style is:global>` in the layout file.
- **Change:** Extract to `src/styles/prose.css`, import where needed.
- **Effort:** Medium / **Impact:** Low (mostly maintainability)

---

## SEO & Accessibility

### S2. RSS feed
- Add `@astrojs/rss`, route at `/rss.xml`, `<link rel="alternate">` in `<head>`.
- **Effort:** Low / **Impact:** Medium

### S7. Audit heading hierarchy
- Ensure no skipped levels (h1 → h3) on listing pages and articles.
- **Effort:** Low / **Impact:** Low

---

## Code Quality & Architecture

### C4. Extract `SearchModal.tsx` keyboard logic
- Move 100+ lines of useEffect into a `useSearchKeyboard` hook.
- **Effort:** Low / **Impact:** Low (testability)

---

## DX & Tooling

### D1. Add ESLint (or Biome) + `tsc --noEmit` in pre-commit
- **Current:** Pre-commit only runs ast/yaml/json/merge-conflict checks.
- **Effort:** Medium / **Impact:** High

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


