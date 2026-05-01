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

### P3. Responsive `srcset` for hero images
- **Current:** Hero in `ArticleLayout.astro` is 1920×1080 served to all viewports.
- **Change:** Add `sizes` prop + srcset for 640/1024/1920 breakpoints.
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

### S4. Skip-to-content link
- Add visually hidden `<a href="#main">Skip to main content</a>` before nav, plus `id="main"` on the main wrapper of each layout (BlogListingLayout, ArticleLayout, index, about, 404).
- **Effort:** Low / **Impact:** Low

### S5. Audit `aria-label` on icon-only buttons
- Check `ShareRow.astro`, theme switcher, social icons.
- **Effort:** Trivial / **Impact:** Medium

### S6. Enforce alt text in content schema
- Require `alt` field on post images (or fail build).
- **Effort:** Trivial / **Impact:** Medium

### S7. Audit heading hierarchy
- Ensure no skipped levels (h1 → h3) on listing pages and articles.
- **Effort:** Low / **Impact:** Low

### S9. `rel="next"` / `rel="prev"` on pagination
- Complement to S3 (already implemented). Add sequence hints to listing pages.
- **Effort:** Low / **Impact:** Low

### S10. Extend JSON-LD with `dateModified`
- S1 implemented base `BlogPosting`. Once M1 (updatedDate) lands, add `dateModified` to the JSON-LD.
- **Effort:** Trivial

---

## Code Quality & Architecture

### C2. Type `config.json` with Zod or interfaces
- **Current:** Untyped imports across components.
- **Change:** `src/types/config.ts` with schema + parse on load.
- **Effort:** Low / **Impact:** Low (DX)

### C3. Wrap unsafe `(post as any).body` casts
- Centralize remaining occurrences in a `getPostBody(entry)` helper. (Reading-time call sites already cleaned up via C7.)
- **Effort:** Low / **Impact:** Low

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

### D3. Bundle-size monitoring
- Add `size-limit` or `bundlesize` with CI check.
- **Effort:** Low / **Impact:** Medium

### D4. Lighthouse / Unlighthouse CI step on previews
- **Effort:** Medium / **Impact:** Medium

### D5. Simplify npm scripts
- `dev` and `build` both call `npm run generate-json`. Move into an Astro hook (`astro:build:start`) or `prebuild`/`predev`.
- **Effort:** Low

### D6. Use `npm ci` in Netlify/CI instead of `npm install`
- Reproducible builds, fewer surprises. (Note: Netlify currently has no explicit build command in `netlify.toml` — uses package.json default. May need a `[build]` block.)
- **Effort:** Trivial

---

## Content & Collections

### M1. Optional `updatedDate` in blog schema
- Display "Updated: …" when present. Helps SEO and reader trust. Pair with S10.
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

## Implemented (for reference)

- **C1** — Removed dead `@/partials/*` alias.
- **P5** — Already correct (`RelatedPostsGrid` passes `loading="lazy"`).
- **P7** — Removed obsolete Squoosh comment.
- **S1** — JSON-LD `BlogPosting` schema added in `src/pages/blog/[single].astro`.
- **S3** — `noindex` on paginated listing pages > 1.
- **S8** — `.github/FUNDING.yml` added.
- **C5** — N/A (`SearchModal.tsx` has no `.map()` calls).
- **C6** — Color system docstring added in `src/styles/main.css`.
- **C7** — `readingTimeForPost` helper centralizes the try/catch; 3 call sites simplified.
