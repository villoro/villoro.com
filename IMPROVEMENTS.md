# Improvement Proposals

Audit of `villoro.com` (Astro 6 + Tailwind, Netlify). Proposals are grouped by category with current state, suggested change, and rough effort/impact.

> Note: Proposals reference paths discovered during audit. Verify each against current code before implementing — some may already be partially addressed.

---

## Performance

### P4. Audit/compress blog images
- **Current:** CI verifies aspect ratio only, not size.
- **Change:** Add a size budget (e.g. <200KB) to CI, batch-compress existing images.
- **Effort:** Medium / **Impact:** Medium

### P6. Move prose styles out of `ArticleLayout.astro`
- **Current:** ~420 lines of `<style is:global>` in the layout file.
- **Change:** Extract to `src/styles/prose.css`, import where needed.
- **Effort:** Medium / **Impact:** Low (mostly maintainability)

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

### Dep2. Consider replacing `react-icons`
- Switch to inline SVGs or Tabler Icons for smaller bundle / fewer transitive deps.
- **Effort:** Medium / **Impact:** Low
