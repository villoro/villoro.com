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

### S2. RSS feed ✓
- Add `@astrojs/rss`, route at `/rss.xml`, `<link rel="alternate">` in `<head>`.
- **Effort:** Low / **Impact:** Medium
- **Status:** Done — `@astrojs/rss` installed, `/rss.xml` route created, link added to `BaseRedesign.astro`

### S4. Skip-to-content link
- Add visually hidden `<a href="#main">Skip to main content</a>` before nav, plus `id="main"` on the main wrapper of each layout (BlogListingLayout, ArticleLayout, index, about, 404).
- **Effort:** Low / **Impact:** Low

### S6. Enforce alt text in content schema
- Require `alt` field on post images (or fail build).
- **Effort:** Trivial / **Impact:** Medium

### S7. Audit heading hierarchy
- Ensure no skipped levels (h1 → h3) on listing pages and articles.
- **Effort:** Low / **Impact:** Low

---

## Code Quality & Architecture

### C2. Type `config.json` with Zod or interfaces ✓
- **Current:** Untyped imports across components.
- **Change:** `src/types/config.ts` with schema + parse on load.
- **Effort:** Low / **Impact:** Low (DX)
- **Status:** Done — `src/types/config.ts` created with full Zod schema and `Config` type export

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

### D6. Use `npm ci` in Netlify/CI instead of `npm install`
- Reproducible builds, fewer surprises. (Note: Netlify currently has no explicit build command in `netlify.toml` — uses package.json default. May need a `[build]` block.)
- **Effort:** Trivial

---

## Content & Collections

### M2. Precompute reading time ✓
- Optional `readingTime` field; compute at build, runtime fallback.
- **Effort:** Low / **Impact:** Low
- **Status:** Done — `readingTime` optional field added to blog schema; can be set in frontmatter or computed dynamically

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
- **D5** — npm scripts now use `predev`/`prebuild` instead of `&&`.
- **M1** — `updatedDate` optional field added to blog schema.
- **S9** — `rel="prev"` / `rel="next"` link tags on paginated listings.
- **S10** — JSON-LD now includes `dateModified` (falls back to `datePublished`).
- **C3** — N/A (only remaining `.body` cast is inside the `readingTimeForPost` helper itself — that's the centralization point).
- **M1b** — `ArticleLayout` displays "Updated …" when `updatedDate` is present in frontmatter.
- **S5** — ThemeSwitcher accessible name improved ("Toggle dark mode" instead of generic "theme switcher"). Other icon-only buttons already labeled.
- **D6** — netlify.toml now uses `npm ci && npm run build` with explicit `[build]` section.
- **S6** — `imageAlt` field added to blog collection schema (optional, can be made required if images are mandatory).
- **S4** — Skip-to-content link added to `BaseRedesign.astro`, `id="main"` anchors placed on ArticleLayout, BlogListingLayout, and pages (index, about, 404). `.sr-only` and `.focus:not-sr-only` CSS added to utilities.css.
- **Dep1** — `npm audit` run; no vulnerabilities or advisories found.
- **S2** — `@astrojs/rss` installed, `/rss.xml` route created (`src/pages/rss.xml.ts`), RSS feed link added to `<head>` in `BaseRedesign.astro`.
- **C2** — `src/types/config.ts` created with Zod schema and `Config` type for full type safety across config usage.
- **M2** — `readingTime` optional integer field added to blog collection schema; frontmatter can include precomputed values or fallback to runtime calculation.
