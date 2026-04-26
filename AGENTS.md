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
npm run dev            # generates search index, then astro dev
npm run build          # generates search index, then astro build
npm run preview        # serve dist/ locally
npm run generate-json  # only regenerate scripts/jsonGenerator.js outputs
npm run format         # prettier on src/
```

`scripts/jsonGenerator.js` writes `.json/posts.json` and `.json/search.json` (gitignored) — these are the search-modal index. They get rebuilt at every `dev`/`build`.

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
│   └── utils/                      dateFormat, readingTime, similarItems, sortFunctions, taxonomyFilter, textConverter (humanize, slugify, plainify), bgImageMod
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
├── jsonGenerator.js                builds .json/posts.json + .json/search.json
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

- **BaseRedesign.astro** — `<html><head>` shell only. Loads main.css, AstroFont (Heebo/Signika), Google Fonts (Fraunces/Instrument Serif/JetBrains Mono), gtag, ClientRouter. Renders `<TwSizeIndicator>` + `<SearchModal client:load>` then `<slot />`. Pages render their own `SiteNav` and `SiteFooter`.
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
image: string                  # path under /images/posts/...
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

- `dev` and `build` always pre-run `generate-json`. Don't import or read the `.json/` folder during page rendering — it's only used by the search modal at runtime.
- Netlify deploys from `main`. PR previews are configured.
- CI (`.github/workflows/CI.yaml`) runs on every PR:
  - `pre_commit` (code quality)
  - `labeler` (auto PR labels from `.github/labeler.yml`)
  - `check_version` (`package.json` version must change for site-affecting PRs)
  - `aspect_ratio_check` — `python .github/scripts/check_aspect_ratio.py` validates blog images are 16:9, favicons 1:1
- `tag_commits_on_main.yaml` auto-tags commits on main if `package.json` version bumped.

## Image conventions

- Blog post hero images: 16:9 (CI enforced). Place under `src/images/posts/<topic>/...` or `public/images/posts/...`.
- `src/images/` → optimized via `astro:assets` (use `ImageMod` or `<Image>`). `public/` → served verbatim.
- Company logos: `src/images/companies/<name>.png` and `<name>_dark.png` for dark variant.

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
- **`.json/` is gitignored** and rebuilt every dev/build. Don't commit it.
- **Tailwind v4** — config is in `@theme` block (in `generated-theme.css`), not `tailwind.config.js`. The `tailwind.config.js` file at root is mostly inert under v4.
- **Astro 6 requires Node 22.x.** If you see `Node.js v20.x is not supported`, that's a local env issue, not the repo.
