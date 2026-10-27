# AGENTS.md

Context for AI agents working on this repo. Read this first — it's designed to eliminate the need to grep around to figure out where things live.

## Project

Personal website/blog for Arnau Villoro (Data Engineer, Barcelona). Static Astro site, MDX content, deployed on Netlify on push to `main`.

- Live: https://villoro.com
- Currently on **redesign 3.0** (branch prefix `v3/`). Legacy v2 layouts (`Base.astro`, `PostSingle.astro`, `partials/Header.astro`, `partials/Footer.astro`) have been removed and replaced with redesign components — see "Layouts" below.

## Tech Stack

| Layer       | Tech                                              |
| ----------- | ------------------------------------------------- |
| Framework   | Astro 6 (static SSG)                              |
| Content     | MDX + Astro content collections (Zod schemas)     |
| Language    | TypeScript (strict)                               |
| UI islands  | React 18 (search modal, shortcodes)               |
| Styling     | Tailwind CSS 4 (`@theme` block) + custom tokens   |
| Icons       | `react-icons` (FA6, `Fa*` prefix), inline SVGs    |
| Images      | `astro:assets` + Sharp                            |
| Comments    | Giscus                                            |
| Deploy      | Netlify (auto on push to `main`)                  |
| Node        | **22.x required** (`engines.node` enforces this)  |

## Commands

```bash
npm install
npm run dev            # astro dev
npm run build          # astro build
npm run preview        # serve dist/ locally
npm run format         # prettier on src/
```

The search index is an Astro endpoint (`src/pages/search.json.ts`): built to `dist/search.json`, lazy-fetched by `SearchModal` on first open. It stores plain text (capped per post) and 320px pipeline thumbnails.

## Path aliases (`tsconfig.json`)

```
@/components/*   →  src/layouts/components/*
@/shortcodes/*   →  src/layouts/shortcodes/*
@/helpers/*      →  src/layouts/helpers/*
@/partials/*     →  src/layouts/partials/*   (folder no longer exists — alias is dead, can be removed)
@/*              →  src/*
```

## Directory map

```
src/
├── pages/                          Astro routes
│   ├── index.astro                 home (hero + featured grid)
│   ├── about.astro                 about page
│   ├── 404.astro
│   ├── blog/
│   │   ├── index.astro             /blog (listing, page 1)
│   │   ├── page/[slug].astro       /blog/page/2, 3, …
│   │   └── [single].astro          /blog/<slug> — single post
│   ├── categories/
│   │   ├── [category].astro
│   │   └── [category]/page/[slug].astro
│   └── tags/
│       ├── [tag].astro
│       └── [tag]/page/[slug].astro
├── layouts/
│   ├── BaseRedesign.astro          <html><head> + fonts + ClientRouter — used by ALL pages
│   ├── ArticleLayout.astro         single-post layout (~700 lines, prose styles inside)
│   ├── BlogListingLayout.astro     blog/category/tag listing layout (heroVariant: "full" | "simple")
│   ├── components/                 reusable .astro UI (see "Components" below)
│   ├── shortcodes/                 auto-imported MDX components (.tsx)
│   └── helpers/                    React islands: SearchModal, SearchResult, DynamicIcon
├── content/                        Astro content collections (schemas in src/content.config.ts)
│   ├── blog/                       *.mdx, FLAT (not by year). `9999-*` prefix = drafts/WIP
│   ├── about/-index.md
│   └── homepage/-index.md
├── lib/
│   ├── categoryMetadata.ts         category slug → display name + color (10 categories)
│   ├── contentParser.astro         getSinglePage(folder) — main collection helper
│   ├── blogUtils.astro             blog-specific queries
│   ├── taxonomyParser.astro        getTaxonomy() for tags/categories
│   ├── listingData.ts              CategoryItem type + ribbon data
│   └── utils/                      blogImages (resolveImage), dateFormat, readingTime, similarItems, sortFunctions, taxonomyFilter, textConverter (humanize, slugify, plainify)
├── config/
│   ├── config.json                 site, settings (pagination=9, blog_folder="blog"), giscus, subscribe, buymeacoffee
│   ├── theme.json                  legacy colors + fonts (consumed by generated-theme.css)
│   ├── menu.json                   nav links
│   └── social.json                 social links + icon name (used by SocialIcon)
├── styles/                         see "Styling" below
├── plugins/remark-callouts.mjs     custom callout syntax plugin
├── images/                         astro:assets-optimized
├── content.config.ts               Zod schemas for blog/about/homepage collections
└── env.d.ts

scripts/
└── removeDarkmode.js               one-off utility (rarely used)

.github/
├── workflows/
│   ├── CI.yaml                     PR checks: pre-commit, labeler, version bump, image aspect-ratio
│   └── tag_commits_on_main.yaml    auto-tag if package.json version changed
├── scripts/check_aspect_ratio.py   asserts blog images are 16:9, favicon 1:1
└── labeler.yml                     PR auto-labels
```

## Layouts

Three top-level layouts; every page picks one:

- **BaseRedesign.astro** — `<html><head>` shell only. Loads main.css, AstroFont (Heebo/Signika, self-hosted in `public/fonts`), Google Fonts (Fraunces/Instrument Serif/JetBrains Mono), gtag, ClientRouter. Renders `<TwSizeIndicator>` + `<SearchModal client:load>` then `<slot />`. Pages render their own `SiteNav` and `SiteFooter`.
- **ArticleLayout.astro** — single blog post. Composes: `SiteNav` → hero (image + breadcrumb + title + tags + meta) → article (`ArticleTOC` sidebar + `<slot />` body + `CTAStrip` + `ShareRow` + `GiscusComments`) → `RelatedPostsGrid` → `SiteFooter`. **All MDX prose styles live in this file's `<style is:global>`** — that's where you go for h1-h6, blockquote, code-block, table, link styling.
- **BlogListingLayout.astro** — listings (blog/category/tag). `heroVariant="full"` for blog+category (big "Notes from production" hero), `"simple"` for tags (compact h1).

## Components (`src/layouts/components/`)

| Component             | Used in                        | Notes                                                                |
| --------------------- | ------------------------------ | -------------------------------------------------------------------- |
| `SiteNav.astro`       | every page                     | sticky top nav, search trigger, theme switcher, subscribe CTA        |
| `SiteFooter.astro`    | every page                     | dark footer with email + social icons                                |
| `Logo.astro`          | SiteNav                        | accepts optional `src` / `srcDarkmode` overrides                     |
| `ThemeSwitcher.astro` | SiteNav                        | toggles `.dark` on `<html>`, persists to localStorage                |
| `Breadcrumb.astro`    | ArticleLayout, BlogListing     | `variant: "dark" \| "light"`                                         |
| `CategoryRibbon.astro`| BlogListingLayout              | sticky blue bar with category chips                                  |
| `PostCard.astro`      | index.astro, listings, related | `variant: "big" \| "medium" \| "small"` — single file, 3 layouts     |
| `Pagination.astro`    | listing pages                  | windowed pagination (window size from config.settings)               |
| `ArticleTOC.astro`    | ArticleLayout                  | sticky sidebar TOC. Exports `TocItem` type                           |
| `CTAStrip.astro`      | ArticleLayout                  | "Enjoyed this?" — Buy-me-a-coffee + Subscribe                        |
| `ShareRow.astro`      | ArticleLayout                  | copy-link + LinkedIn/Twitter/Email buttons                           |
| `GiscusComments.astro`| ArticleLayout                  | reads giscus config from config.json                                 |
| `RelatedPostsGrid.astro` | ArticleLayout               | bottom-of-post grid                                                  |
| `IconArrow.astro`     | many                           | shared right-arrow SVG. Props: `size?: number` (default 14), `class?` |
| `SocialIcon.astro`    | SiteFooter, ShareRow           | shared SVGs. Props: `name: "github"\|"linkedin"\|"twitter"\|"email"\|"copy"`, `size?: number` (default 17) |
| `ImageMod.astro`      | many                           | thin wrapper over `astro:assets` Image                               |
| `TwSizeIndicator.astro`| BaseRedesign                  | dev-only Tailwind breakpoint indicator                               |

**When adding a new icon:** if it's the right-arrow, use `<IconArrow />`. If it's a social/share icon already in `SocialIcon`, use that. Otherwise inline the SVG (don't pull in a heavy icon library).

## Shortcodes (auto-imported in MDX)

Listed in `astro.config.mjs` under `AutoImport.imports` — available in any `.mdx` without import:

`Accordion`, `Button`, `FancyLink`, `FileName`, `Notice`, `Tab`, `Tabs`, `TerminalOutput`, `Video`

Source files are `src/layouts/shortcodes/*.tsx`. To add a new shortcode: drop a `.tsx` in that folder and add `"@/shortcodes/Name"` to the `AutoImport` list.

**`FancyLink` `company` prop:** the component picks a favicon based on `company`. When linking to a site without a dedicated favicon mapping, set `company="default"` (used for generic links like RFCs, IETF, MDN, etc.). Existing `company="..."` values in posts (e.g. `iceberg`) map to specific brand icons.

## Custom callout syntax (remark-callouts)

Defined in `src/plugins/remark-callouts.mjs`. Usable in markdown without shortcodes:

```markdown
> [!NOTE] Optional title
> body

> [!WARNING]
> body
```

Types: `abstract` (alias `summary`), `tip` (`hint`), `success` (`check`), `question` (`help`), `warning` (`caution`), `failure` (`fail`), `danger` (`error`), `quote` (`cite`), `note`, `info`, `important`.

## Content collections

Schemas in `src/content.config.ts` (Zod). Three collections:

- **blog** — flat folder of `*.mdx` (not subfolder-by-year). Filenames like `0067-marimo-notebooks.mdx`. The `9999-*` prefix is convention for drafts/WIP. Real drafts use frontmatter `draft: true` (filtered by `getSinglePage`).
- **about** — single `-index.md` with rich schema (hero/story/timeline/hobbies).
- **homepage** — single `-index.md` with hero + ribbon + latest + companies blocks.

Blog post frontmatter (commonly used):

```yaml
title: string                  # required
description: string            # optional, used in <meta> and cards
date: ISO date                 # optional, used for sorting
image: string                  # "/images/blog/<file>" — file lives in src/images/blog/
category: string               # MUST match a key in categoryMetadata.ts (else falls back to humanize(slug))
tags: [string]                 # default ["Others"]
draft: boolean                 # if true, filtered out of listings
slug: string                   # optional override (default = filename minus prefix)
```

## Categories (`src/lib/categoryMetadata.ts`)

Currently 10 categories. Adding a new one:
1. Add an entry: `{ name: "🎯 Display Name", color: "#hex" }`
2. Use that key in blog post frontmatter `category:` field

Existing keys: `AI`, `API`, `DE`, `cloud_devops`, `git`, `hardware`, `others`, `python`, `tools`, `web`.

## Styling

CSS lives in `src/styles/`, loaded via `main.css`:

```
main.css
├── @import "tailwindcss" (v4 — the @theme block lives in generated-theme.css)
├── @plugin "@tailwindcss/forms"
├── @plugin "@tailwindcss/typography"
├── @custom-variant dark (&:where(.dark, .dark *))
├── @import "./generated-theme.css"   ← Tailwind @theme block (legacy palette)
├── @import "./tokens.css"            ← redesign 3.0 design tokens
├── @layer base       → base.css      ← @apply'd Tailwind classes for h1-h6, body
├── @layer components → components.css, buttons.css, search.css
└── @layer utilities  → utilities.css
```

### Two coexisting color systems (read this — easy footgun)

There are **two** color systems on purpose. Use the right one for the right job:

1. **`tokens.css`** — Redesign 3.0 design tokens. Semantic names (`--color-surface-card`, `--color-on-dark`, `--color-blue-500`, `--color-yellow-400`). Dark-mode remaps live in the same file in a `.dark { … }` block. **Use these in all redesign components and `<style>` blocks.**
2. **`generated-theme.css`** — auto-generated from `src/config/theme.json` (do not hand-edit). Wraps a Tailwind v4 `@theme {}` block exposing classes like `bg-body`, `text-dark`, `bg-primary`, `border-border`, `dark:bg-darkmode-body`, etc. Used by base.css/buttons.css/components.css/search.css/Pagination.astro and a few legacy spots. **Use only when you need a Tailwind utility class** (e.g. `class="bg-theme-light"`).

Don't try to merge the two — the values differ slightly and consumers depend on the Tailwind classes. If you find yourself wanting to pick a color, prefer `tokens.css` semantic names in component-scoped styles.

### Dark mode

Class-based: `.dark` on `<html>`, set by `ThemeSwitcher.astro` (persists to `localStorage`). All dark overrides should go either in `tokens.css`'s `.dark { … }` block (preferred) or use `dark:` Tailwind variant.

### Where prose styles live

`ArticleLayout.astro`'s `<style is:global>` block (~lines 160-580). That's where h2-h5 numbered counters, blockquotes, tables, code blocks, and link colors are defined. The `.al-body .article-content` selector scopes them to the article body.

### Heading numbering

ArticleLayout uses CSS counters: H2 → "1.", H3 → "1.1", H4 → "1.1.1", H5 → "1.1.1.1". Shared rules use `:is(h2,h3,h4,h5)` to avoid duplication. TOC (`ArticleTOC.astro`) shows H2+H3 only; numbering is computed in `[single].astro` from `headings` returned by `render(post)`.

## Routing patterns

- Listing pages take `Astro.params` like `[category]` or `[tag]` and call `getStaticPaths()` to enumerate them.
- Pagination uses `[slug]` (the page number) under `page/`. Page 1 is always the bare URL (no `/page/1`).
- Single posts use `slug` from frontmatter or filename (filename minus the numeric prefix, e.g. `0067-marimo-notebooks.mdx` → `marimo-notebooks`).

## Build / deploy

- Netlify deploys from `main`. PR previews are configured.
- CI (`.github/workflows/CI.yaml`) runs on every PR:
  - `pre_commit` (code quality)
  - `labeler` (auto PR labels from `.github/labeler.yml`)
  - `check_version` (`package.json` version must change for site-affecting PRs)
  - `aspect_ratio_check` — `python .github/scripts/check_aspect_ratio.py` validates blog images are 16:9, favicons 1:1
- `tag_commits_on_main.yaml` auto-tags commits on main if `package.json` version bumped.

## Image conventions

- Blog post hero images: 16:9 (CI enforced), in `src/images/blog/`. Frontmatter keeps the `/images/blog/...` path; `resolveImage` (`src/lib/utils/blogImages.ts`) maps it to `src/images/blog` first, then `public/images` (logo, favicon).
- Post-body images: `src/images/posts/<year>/...`, imported directly in the MDX. SVG diagrams need an opaque background (see "SVG diagrams" below).
- `src/images/` → optimized via `astro:assets` (use `ImageMod` or `<Image>`); originals never ship in `dist`. `public/` → served verbatim.
- Company logos: `src/images/companies/<name>.png` and `<name>_dark.png` for dark variant.

## Workflow preferences (how Villoro wants agents to work)

- **Branch from fresh `origin/main`.** Always `git fetch` first and base new branches on `origin/main` — never on local `main` (often stale) or another unmerged branch. PRs here squash-merge quickly, so re-check `origin/main` between tasks.
- **Incremental commits, like a developer.** Don't squash a whole task into one commit. Commit each logical step as you complete it (e.g. "move the files" → commit, "add the resolver" → commit, "fix the consumers" → commit, "update docs + version bump" → commit). Each commit message explains the why, not just the what.
- **Bump the version** (`package.json` + `package-lock.json`, e.g. `npm version X.Y.Z --no-git-tag-version`) in every site-affecting PR — CI's `check_version` fails otherwise. Fold it into the final docs/cleanup commit.
- **Keep `IMPROVEMENTS.md` current.** When implementing an item from it, remove that item (and fix cross-references) in the same PR.
- **Verify before opening a PR.** Build + typecheck + lint, and check the actual behavior in a browser against the built site (`npm run preview`), not just that the build passes.
- **PRs:** push the branch and open the PR yourself with `gh pr create` (installed and logged in); don't hand Villoro a compare URL to click. The repo owner reviews/merges. `gh pr checks` / `gh run view --log-failed` show why CI failed.

## Writing blog posts with Villoro

Posts are co-written, not generated in one go:

- **Free draft first, then direction, then section by section.** (1) Write the whole post freely as a proposal, from the sources (code, measurements, earlier posts), with `{/* TODO Villoro: … */}` comments wherever you assumed something. (2) Villoro reads it and you agree on the thesis, audience and index together. (3) Rewrite one or two sections per round, with Villoro's direction and corrections.
- **Commit what Villoro accepts, then continue.** Leave each change uncommitted until Villoro says it's good, so they can review it as a diff. When they accept it, commit that part (message prefixed `Draft:`) and only then move on to the next thing they asked for. Don't run ahead to the next section.
- **Length:** most posts are ~300–500 lines of MDX. Keep the main body lean; push detail (per-case numbers, tables of measurements) to an appendix and give the main text a headline figure.
- **Voice:** first person, direct, short paragraphs, **bold** for the key phrase, bullets over long prose. Match an existing post (e.g. `0068-be-nice-data.mdx`) rather than inventing a style. **Plain and explanatory, not literary:** no dramatic fragments ("It doesn't change. It disappears."), no punchline triplets ("It's cheap, it's fast, and it has one blind spot"), no paired contrasts ("For its users… For the lake…"), no "you will be asked"-style asides. Say what happens and why, in complete sentences.
- **No manual numbers in headings.** H2–H5 are auto-numbered (see "Heading numbering"), so `### 1. Attach` renders as "4.1 1. Attach". Write `### Attach`.
- **Break up long text.** Use callouts (`[!abstract]` for the thesis, `[!tip]` for a striking number or aside), small tables, and SVG diagrams. Villoro likes diagrams: propose one whenever a concept has a shape (zones, flows, before/after).
- **Link generously.** Earlier posts on the same topic (`<FancyLink url="https://villoro.com/blog/<slug>/" dark="true"/>`) and official docs for any tool, extension or connector mentioned.
- **Be honest with numbers.** Use only figures from a source (the code, a measurement, Villoro). If you assume something (same workload, production vs. rehearsal, cluster size), say so in your summary so Villoro can confirm it. Never invent a statistic to make a claim stronger.
- **Rewriting an existing draft:** start a new `9999-*.mdx` on a branch from fresh `origin/main` and read the old draft with `git show <branch>:<path>` instead of building on top of it.

### SVG diagrams

- Live in `src/images/posts/<year>/`, embedded with `![alt](../../images/posts/<year>/name.svg)`. Copy the style of an existing one (`0074-duckdb-three-zones.svg`): `viewBox` 1600 wide, Inter font, `.ttl`/`.mut`/`.txt` classes, blue `#3a76ff` as the accent.
- **They must have an opaque background card** (`<rect class="card" …/>` right after `<defs>`). An SVG loaded as `<img>` follows the OS `prefers-color-scheme`, not the site's `.dark` class, so dark text on a transparent background becomes unreadable when the site and OS themes differ.
- Check them by rendering to PNG with `sharp` (already a dependency). Sharp ignores `@media`, so to preview the dark variant, unwrap the `prefers-color-scheme` block into a scratch copy first.

## Common task playbook

| Task                                        | Touch                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Add a blog post                             | New `.mdx` in `src/content/blog/` with frontmatter. Done.                                   |
| Add a new category                          | `src/lib/categoryMetadata.ts` (add key + name + color). Use that key in post frontmatter.   |
| Edit prose / typography for posts           | `src/layouts/ArticleLayout.astro` `<style is:global>` block.                                |
| Edit nav / footer                           | `src/layouts/components/SiteNav.astro` / `SiteFooter.astro`.                                |
| Edit colors                                 | `src/styles/tokens.css` (preferred) or `src/config/theme.json` → regenerates generated-theme.css. |
| Edit pagination size, similar-items count   | `src/config/config.json` → `settings`.                                                      |
| Add a shortcode                             | New `.tsx` in `src/layouts/shortcodes/` + add to `AutoImport.imports` in `astro.config.mjs`. |
| Add a callout type                          | `src/plugins/remark-callouts.mjs`.                                                          |
| Add a new icon (right-arrow / social)       | Use `<IconArrow />` / `<SocialIcon name="…" />`. Add a new `name` case to `SocialIcon` if needed. |
| Add a layout-level field to about/homepage  | Update Zod schema in `src/content.config.ts` AND the corresponding `-index.md`.             |

## Gotchas

- **The `@/partials/*` tsconfig path alias is dead** — `src/layouts/partials/` was removed in redesign 3.0. Safe to drop.
- **Two color systems** — see the styling section. Don't reflexively unify them; the Tailwind class consumers depend on `generated-theme.css`.
- **`description` is no longer a `ShareRow` prop** (cleaned up). Don't pass it.
- **`ThemeSwitcher` takes no props** (`className` was removed; it was always undefined).
- **Reading time** is computed in `[single].astro` and listing pages from `(post as any).body` — the `.body` cast is needed because Astro 6's collection types don't expose body publicly. If you see `try { ... } catch { return ""; }` patterns around reading time, that's why.
- **Tailwind v4** — config is in `@theme` block (in `generated-theme.css`), not `tailwind.config.js`. The `tailwind.config.js` file at root is mostly inert under v4.
- **Astro 6 requires Node 22.x.** If you see `Node.js v20.x is not supported`, that's a local env issue, not the repo.
