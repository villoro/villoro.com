# Improvement Proposals

Audit of `villoro.com` (Astro 6 + Tailwind, Netlify). Proposals are grouped by category with current state, suggested change, and rough effort/impact.

> Note: Proposals reference paths discovered during audit. Verify each against current code before implementing — some may already be partially addressed.

---

## Quick Wins (do first)

1. **Remove dead `@/partials/*` alias** in `tsconfig.json` (folder was removed in redesign 3.0). _Trivial._
2. **Add `noindex` to pagination pages > 1** (`/blog/page/2+`) to consolidate SEO. _Low / Medium impact._
3. **Add JSON-LD `BlogPosting` schema** to `ArticleLayout.astro` for rich snippets. _Low / High impact._
4. **Generate RSS feed** via `@astrojs/rss`, link in `<head>`. _Low / Medium impact._
5. **Remove obsolete Sharp/Squoosh comment** in `astro.config.mjs`. _Trivial._

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

### P3. Responsive `srcset` for hero images
- **Current:** Hero in `ArticleLayout.astro` is 1920×1080 served to all viewports.
- **Change:** Add `sizes` prop + srcset for 640/1024/1920 breakpoints.
- **Effort:** Low / **Impact:** Medium

### P4. Audit/compress blog images
- **Current:** CI verifies aspect ratio only, not size.
- **Change:** Add a size budget (e.g. <200KB) to CI, batch-compress existing images.
- **Effort:** Medium / **Impact:** Medium

### P5. Ensure lazy loading on below-fold images
- **Current:** `RelatedPostsGrid.astro` may not always pass `loading="lazy"` to `PostCard`.
- **Change:** Always pass `loading="lazy"` for non-hero images.
- **Effort:** Trivial / **Impact:** Low

### P6. Move prose styles out of `ArticleLayout.astro`
- **Current:** ~420 lines of `<style is:global>` in the layout file.
- **Change:** Extract to `src/styles/prose.css`, import where needed.
- **Effort:** Medium / **Impact:** Low (mostly maintainability)

### P7. Remove obsolete Squoosh comment
- **Current:** `astro.config.mjs` has commented-out Sharp/Squoosh config block.
- **Change:** Delete it (Sharp is default in Astro 5+).
- **Effort:** Trivial

---

## SEO & Accessibility

### S1. JSON-LD structured data for articles
- Add `BlogPosting` schema (author, datePublished, dateModified, image, headline) in `ArticleLayout.astro`.
- **Effort:** Low / **Impact:** High

### S2. RSS feed
- Add `@astrojs/rss`, route at `/rss.xml`, `<link rel="alternate">` in `<head>`.
- **Effort:** Low / **Impact:** Medium

### S3. `noindex` on paginated pages
- Add `noindex` for `/blog/page/N` where N > 1, plus `rel="next"` / `rel="prev"`.
- **Effort:** Low / **Impact:** Medium

### S4. Skip-to-content link
- Add visually hidden `<a href="#main">Skip to main content</a>` before nav.
- **Effort:** Trivial / **Impact:** Low

### S5. Audit `aria-label` on icon-only buttons
- Check `ShareRow.astro`, theme switcher, social icons.
- **Effort:** Trivial / **Impact:** Medium

### S6. Enforce alt text in content schema
- Require `alt` field on post images (or fail build).
- **Effort:** Trivial / **Impact:** Medium

### S7. Audit heading hierarchy
- Ensure no skipped levels (h1 → h3) on listing pages and articles.
- **Effort:** Low / **Impact:** Low

### S8. Add `.github/FUNDING.yml`
- Enables GitHub Sponsors button using existing config links.
- **Effort:** Trivial

---

## Code Quality & Architecture

### C1. Remove dead tsconfig alias
- Delete `@/partials/*` mapping in `tsconfig.json`.
- **Effort:** Trivial

### C2. Type `config.json` with Zod or interfaces
- **Current:** Untyped imports across components.
- **Change:** `src/types/config.ts` with schema + parse on load.
- **Effort:** Low / **Impact:** Low (DX)

### C3. Wrap unsafe `(post as any).body` casts
- Centralize in a `getPostBody(entry)` helper.
- **Effort:** Low / **Impact:** Low

### C4. Extract `SearchModal.tsx` keyboard logic
- Move 100+ lines of useEffect into a `useSearchKeyboard` hook.
- **Effort:** Low / **Impact:** Low (testability)

### C5. Add React `key` props in `SearchModal`
- Map output currently missing `key={item.slug}`.
- **Effort:** Trivial

### C6. Document the two color systems
- `tokens.css` vs `generated-theme.css` coexistence (per AGENTS.md).
- Add a short note in `main.css` explaining when to use each.
- **Effort:** Low

### C7. Simplify reading-time utility
- Remove repeated try/catch around `.body` at call sites; handle in helper.
- **Effort:** Trivial

---

## DX & Tooling

### D1. Add ESLint (or Biome) + `tsc --noEmit` in pre-commit
- **Current:** Pre-commit only runs ast/yaml/json/merge-conflict checks.
- **Effort:** Medium / **Impact:** High

### D2. Add a test harness (Vitest)
- Start with utilities (`textConverter`, `readingTime`, `similarItems`).
- **Effort:** High / **Impact:** High

### D3. Bundle-size monitoring
- Add `size-limit` or `bundlesize` with CI check.
- **Effort:** Low / **Impact:** Medium

### D4. Lighthouse / Unlighthouse CI step on previews
- **Effort:** Medium / **Impact:** Medium

### D5. Simplify npm scripts
- `dev` and `build` both call `npm run generate-json`. Move into an Astro hook (`astro:build:start`) or `prebuild`.
- **Effort:** Low

### D6. Use `npm ci` in Netlify/CI instead of `npm install`
- Reproducible builds, fewer surprises.
- **Effort:** Trivial

---

## Content & Collections

### M1. Optional `updatedDate` in blog schema
- Display "Updated: …" when present. Helps SEO and reader trust.
- **Effort:** Low

### M2. Precompute reading time
- Optional `readingTime` field; compute at build, runtime fallback.
- **Effort:** Low / **Impact:** Low

### M3. Precompute related posts
- Build-time index instead of runtime `similarItems`.
- **Effort:** Medium / **Impact:** Low (until corpus grows)

---

## Dependencies

### Dep1. `npm audit` + lockfile discipline
- Run `npm audit`, fix or document advisories. Use `npm ci` in CI.
- **Effort:** Trivial

### Dep2. Consider replacing `react-icons`
- Switch to inline SVGs or Tabler Icons for smaller bundle / fewer transitive deps.
- **Effort:** Medium / **Impact:** Low

---

## Summary

| Category | Items | Notes |
|---|---|---|
| Performance | 7 | Fonts + image formats are biggest wins |
| SEO/A11y | 8 | JSON-LD + RSS + noindex pagination = highest ROI |
| Code Quality | 7 | Mostly cleanup, low risk |
| DX/Tooling | 6 | Linting + tests are the foundation |
| Content | 3 | Schema enrichments |
| Dependencies | 2 | Hygiene |

**Recommended order:** Quick Wins → S1/S2/S3 (SEO trio) → P1/P2 (perf) → D1/D2 (lint + tests) → everything else.
