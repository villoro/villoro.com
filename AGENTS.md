# AGENTS.md

Context for AI agents working on this repo. Read this first — it's designed to eliminate the need to grep around to figure out where things live.

## Project

Personal website/blog for Arnau Villoro (Data Engineer, Barcelona). Static Astro site, MDX content, deployed on Netlify on push to `main`. It is also an installable PWA (`@vite-pwa/astro`): hashed assets are precached, pages are served network-first.

- Live: https://villoro.com
- Currently on **redesign 3.0**. The legacy v2 layouts and partials are gone; every page uses the layouts and components described below.

## Tech Stack

| Layer       | Tech                                              |
| ----------- | ------------------------------------------------- |
| Framework   | Astro 7 (static SSG)                              |
| Content     | MDX + Astro content collections (Zod schemas)     |
| Language    | TypeScript (strict)                               |
| Client JS   | No framework: plain `<script>` in `.astro` components |
| Styling     | Tailwind CSS 4 (`@theme` block) + custom tokens   |
| Icons       | Inline SVGs (no icon library)                     |
| Images      | `astro:assets` + Sharp                            |
| Comments    | Giscus                                            |
| Deploy      | Netlify (auto on push to `main`)                  |
| PWA         | `@vite-pwa/astro` (service worker, manifest)      |
| Node        | **22.x required** (`engines.node`, `.nvmrc`)      |

## Commands

```bash
npm install
npm run dev            # astro dev
npm run build          # astro build
npm run preview        # serve dist/ locally
npm run lint           # eslint .
npm run typecheck      # astro check
npm run size           # size-limit on dist/ (JS and CSS budgets); build first
npm run format         # prettier on src/
npm test               # checks on the built site + unit tests (run `npm run build` first)
```

The search index is an Astro endpoint (`src/pages/search.json.ts`): built to `dist/search.json`, lazy-fetched by `SearchModal` on first open. It stores plain text (capped per post) and 320px pipeline thumbnails. The modal is `src/layouts/components/SearchModal.astro`: static markup plus a ~4 KB script that listens on `document` (so it survives `ClientRouter` navigations) and renders results as HTML strings, escaping everything that comes from the index or the query.

## Tests

`npm test` runs Node's built-in test runner on `tests/*.test.mjs`. No test framework.

- **`tests/site.test.mjs`** checks the built `dist/`, like dbt tests on a model: every internal link resolves and ends with `/`, one `<h1>` and a unique title per page, canonicals and sitemap URLs point to real indexable pages, every post has valid JSON-LD, drafts are published nowhere (a draft may only have a `noindex` page with its marker, and only in a preview build: run `CONTEXT=deploy-preview npm run build` then `npm test` to check that mode), the search index is plain text, no Google Fonts and no framework islands. **When you fix a bug that shows in the built HTML, add an assertion here.**
- **`tests/unit.test.mjs`** covers the pure helpers (`withTrailingSlash`, `plainify`, `plainifyMdx`, `similarItems`). It imports the `.ts` sources directly (Node strips the types), so those helpers must not import through the `@/` alias.
- CI runs it in the single `tests` job (install once, then lint, typecheck, build, bundle size, tests).

## Path aliases (`tsconfig.json`)

```
@/components/*   →  src/layouts/components/*
@/shortcodes/*   →  src/layouts/shortcodes/*
@/*              →  src/*
```

## Directory map

```
src/
├── pages/                          Astro routes
│   ├── index.astro                 home (hero + featured grid)
│   ├── about.astro                 about page
│   ├── 404.astro
│   ├── rss.xml.ts                  RSS feed
│   ├── search.json.ts              search index endpoint (see above)
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
│   ├── ArticleLayout.astro         single-post layout (imports styles/prose.css for the MDX body)
│   ├── BlogListingLayout.astro     blog/category/tag listing layout (heroVariant: "full" | "simple")
│   ├── components/                 reusable .astro UI (see "Components" below)
│   └── shortcodes/                 auto-imported MDX components (.astro, no client JS)
├── content/                        Astro content collections (schemas in src/content.config.ts)
│   ├── blog/                       *.mdx, FLAT (not by year). `9999-*` prefix = drafts/WIP
│   ├── listing/blog.md             hero + section copy of the /blog listing (own collection)
│   ├── about/-index.md
│   └── homepage/-index.md
├── lib/
│   ├── drafts.ts                   SHOW_DRAFTS flag (dev + Netlify previews build draft pages)
│   ├── categoryMetadata.ts         category slug → display name + color (10 categories)
│   ├── blogIndex.mjs               plain .mjs (astro.config.mjs can't import .ts/.astro): published posts from frontmatter, thin-tag rule, sitemap lastmod
│   ├── posts.ts                    getPublishedPosts() — THE way to get posts; getPostsToBuild() (+drafts) is only for /blog/[single] routes; BlogPost type, postSlug()
│   ├── listingCopy.ts              getBlogListingCopy() — the `listing` collection entry
│   ├── taxonomy.ts                 getTaxonomy("tags" | "category") over published posts
│   ├── listingData.ts              CategoryItem type + ribbon data
│   └── utils/                      blogImages (resolveImage), dateFormat, readingTime, similarItems, sortFunctions, taxonomyFilter, textConverter (humanize, slugify, plainify), url (withTrailingSlash), searchText (plainifyMdx)
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

public/                             served verbatim
├── fonts/                          self-hosted woff2 (Heebo, Signika, JetBrains Mono)
├── favicons/                       FancyLink company icons
├── images/                         logos, default favicon
├── js/posts/                       per-post Chart.js scripts
├── pwa/                            PWA icons
└── robots.txt

tests/                              site.test.mjs (checks on dist/) + unit.test.mjs (pure helpers), see "Tests"

scripts/
└── new-post.mjs                    `npm run new-post -- "Title"`: creates a draft post

.github/
├── workflows/
│   ├── CI.yaml                     PR checks (see "Build / deploy")
│   ├── tag_commits_on_main.yaml    auto-tag if package.json version changed
│   └── warm_image_cache.yaml       builds on main to save Astro's image cache for PR builds
├── scripts/check_aspect_ratio.py   asserts blog images are 16:9, favicon 1:1
└── labeler.yml                     PR auto-labels
```

## Layouts

Three top-level layouts; every page picks one:

- **BaseRedesign.astro** — `<html><head>` shell only. Loads main.css (which imports `fonts.css`: `@font-face` for Heebo/Signika/JetBrains Mono, all self-hosted in `public/fonts`, no third-party font requests; `heebo-latin.woff2` and `signika-latin.woff2` are preloaded), gtag, ClientRouter. Renders `<TwSizeIndicator>` + `<SearchModal>` then `<slot />`. Pages render their own `SiteNav` and `SiteFooter`.
- **ArticleLayout.astro** — single blog post. Composes: `SiteNav` → hero (image + breadcrumb + title + tags + meta) → article (`ArticleTOC` sidebar + `<slot />` body + `CTAStrip` + `ShareRow` + `GiscusComments`) → `RelatedPostsGrid` → `SiteFooter`. The layout's own styles are scoped in the file; the **MDX prose styles live in `src/styles/prose.css`**, imported by this layout so they only ship on article pages.
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
| `SearchModal.astro`   | BaseRedesign                   | search dialog + its script; opened by any `[data-search-trigger]` or Ctrl/Cmd+K |
| `ImageMod.astro`      | many                           | thin wrapper over `astro:assets` Image                               |
| `TwSizeIndicator.astro`| BaseRedesign                  | dev-only Tailwind breakpoint indicator                               |

**When adding a new icon:** if it's the right-arrow, use `<IconArrow />`. If it's a social/share icon already in `SocialIcon`, use that. Otherwise inline the SVG (don't pull in a heavy icon library).

## Shortcodes (auto-imported in MDX)

Listed in `astro.config.mjs` under `AutoImport.imports` — available in any `.mdx` without import:

`Accordion`, `Button`, `FancyLink`, `FileName`, `Notice`, `TerminalOutput`

`Notice` is what `remark-callouts` emits for `> [!TYPE]` blocks, so it is used by almost every post even though no post writes `<Notice>`. `Accordion` is a native `<details>`/`<summary>` (no JS, no `client:` directive); styles in `components.css`.

Source files are `src/layouts/shortcodes/*.astro`. To add a new shortcode: drop a `.astro` in that folder and add `"@/shortcodes/Name.astro"` (explicit extension) to the `AutoImport` list. Don't use `client:*` directives in MDX.

**`FancyLink` `company` prop:** the component picks a favicon from `public/favicons` based on `company` (default: derived from the host; `x.apache.org` maps to `x`). A missing `-dark` file falls back to the light icon and a missing icon to `default`. When linking to a site without a dedicated favicon mapping, set `company="default"` (used for generic links like RFCs, IETF, MDN, etc.). Existing `company="..."` values in posts (e.g. `iceberg`) map to specific brand icons.

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

Schemas in `src/content.config.ts` (Zod). Four collections:

- **blog** — flat folder of `*.mdx` (not subfolder-by-year). Filenames like `0067-marimo-notebooks.mdx`. The `9999-*` prefix is convention for drafts/WIP. Real drafts use frontmatter `draft: true` (`getPublishedPosts()` leaves them out).
- **listing** — `listing/blog.md`: hero and section copy of the `/blog` listing (and of the category listings), read with `getBlogListingCopy()`. It is its own collection so the post schema only has post fields.
- **about** — single `-index.md` with rich schema (hero/story/timeline/hobbies).
- **homepage** — single `-index.md` with hero + ribbon + latest + companies blocks.

All three schemas are **strict** (`z.strictObject`, nested objects too): an unknown key, e.g. the typo `update_date:` for `updated_date:`, fails the build with `Unrecognized key`. Keys are snake_case. To add a field, add it to the schema first.

Blog post frontmatter (commonly used):

```yaml
title: string                  # required
slug: string                   # URL slug. Always set it: the default is the whole filename (e.g. `0067-marimo-notebooks`)
meta_title: string             # optional, <title> / og:title (default: title)
description: string            # optional, used in <meta> and cards
date: ISO date                 # optional, used for sorting
updated_date: ISO date         # optional, shown as "Updated ..."
writing_date: ISO date         # optional, internal only (when drafting started), never rendered
image: string                  # optional ("/images/blog/<file>", file in src/images/blog/); falls back to 0000-default.jpg
image_alt: string              # optional (not rendered today)
reading_time: number           # optional (not used: reading time is computed from the body)
author: string                 # default: config.metadata.meta_author
category: enum                 # one of the keys of categoryMetadata.ts (default `others`); anything else fails the build
tags: [string]                 # default ["Others"]
highlight: boolean             # the post shown in the home page's "Most read" card
draft: boolean                 # if true: no page on the live site; previewable in dev/deploy previews, never listed
```

## Categories (`src/lib/categoryMetadata.ts`)

Currently 10 categories. Adding a new one:
1. Add an entry: `{ name: "🎯 Display Name", color: "#hex" }`
2. Use that key in blog post frontmatter `category:` field

The schema takes its allowed values from these keys (`categoryKeys`), so a typo in a post's `category:` fails the build. Existing keys: `AI`, `API`, `DE`, `cloud_devops`, `git`, `hardware`, `others`, `python`, `tools`, `web`.

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
├── @import "./fonts.css"             ← @font-face for the self-hosted fonts
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

`src/styles/prose.css`, imported by `ArticleLayout.astro`. That's where inline code, code blocks, h2-h5 numbered counters, blockquotes, tables, links, and the TerminalOutput/FileName/Notice shortcodes are styled. The `.al-body .article-content` selector scopes them to the article body.

### Heading numbering

ArticleLayout uses CSS counters: H2 → "1.", H3 → "1.1", H4 → "1.1.1", H5 → "1.1.1.1". Shared rules use `:is(h2,h3,h4,h5)` to avoid duplication. TOC (`ArticleTOC.astro`) shows H2+H3 only; numbering is computed in `[single].astro` from `headings` returned by `render(post)`.

## Routing patterns

- Listing pages take `Astro.params` like `[category]` or `[tag]` and call `getStaticPaths()` to enumerate them.
- Pagination uses `[slug]` (the page number) under `page/`. Page 1 is always the bare URL (no `/page/1`).
- Single posts use `slug` from frontmatter or filename (filename minus the numeric prefix, e.g. `0067-marimo-notebooks.mdx` → `marimo-notebooks`).
- **Internal links always end with `/`.** Netlify serves every page with a trailing slash and 301-redirects the slashless form, so `trailing_slash` is `true` and every URL we generate (hrefs, canonical, sitemap, JSON-LD) must already be the final one. Build them with `withTrailingSlash()` from `src/lib/utils/url.ts` or write the `/` directly; do the same for links inside posts (`/blog/<slug>/`). Files with an extension (`/rss.xml`) and `#anchor` links are the exception.

## Build / deploy

- Netlify deploys from `main`. PR previews are configured.
- CI (`.github/workflows/CI.yaml`) runs on every PR:
  - `pre_commit` (code quality)
  - `tests` (one job, one `npm ci`: lint, typecheck, build with the image cache saved by `warm_image_cache.yaml`, `npm run size` against `.size-limit.json`, `npm test`)
  - `labeler` (auto PR labels from `.github/labeler.yml`)
  - `check_version` (`package.json` and `package-lock.json` version must be exactly one above `main`)
  - `aspect_ratio_check` — `python .github/scripts/check_aspect_ratio.py` validates blog images are 16:9, favicons 1:1
- Dependabot (`.github/dependabot.yml`) opens one weekly PR per ecosystem (npm minor/patch only, GitHub Actions); majors are upgraded by hand.
  Dependabot PRs don't bump `package.json`, so `check_version` fails on them: bump the version on the PR branch (`npm version patch --no-git-tag-version`) before merging.
- `tag_commits_on_main.yaml` auto-tags commits on main if `package.json` version bumped.

## Image conventions

- Blog post hero images: 16:9 (CI enforced), in `src/images/blog/`. Frontmatter keeps the `/images/blog/...` path; `resolveImage` (`src/lib/utils/blogImages.ts`) maps it to `src/images/blog` first, then `public/images` (logo, favicon).
- Post-body images: `src/images/posts/<year>/...`, imported directly in the MDX. SVG diagrams need an opaque background (see "SVG diagrams" below).
- `src/images/` → optimized via `astro:assets` (use `ImageMod` or `<Image>`); originals never ship in `dist`. `public/` → served verbatim.
- `image:` is optional: a post without it gets `/images/blog/0000-default.jpg` (white logo on brand blue, `DEFAULT_POST_IMAGE` in `src/content.config.ts`, applied as a schema default), so a new draft renders before its real hero exists. That JPG was rendered with sharp from `public/images/logo-white.svg`.
- Logo SVGs in `public/images/`: `logo.svg` / `logo-white.svg` (horizontal) and `logo-square.svg` / `logo-square-white.svg` (square AV mark). Every blue logo uses `#3a76ff`; don't change the fills.
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

- **Start from the script.** `npm run new-post -- "Working title"` creates `src/content/blog/9999-<slug>.mdx` with the full frontmatter of a draft (`slug`, `title`, `meta_title`, `description`, `date` = `writing_date` = today, `category`, `tags`, `draft: true`) and a `{/* TODO */}` body; it refuses to overwrite or reuse a slug and prints the path. There is no `image:`: the schema applies the default hero until the real one exists. Fix the `TODO`s in the frontmatter as the post takes shape.
- **Free draft first, then direction, then section by section.** (1) Write the whole post freely as a proposal, from the sources (code, measurements, earlier posts), with `{/* TODO Villoro: … */}` comments wherever you assumed something. (2) Villoro reads it and you agree on the thesis, audience and index together. (3) Rewrite one or two sections per round, with Villoro's direction and corrections.
- **Commit what Villoro accepts, then continue.** Leave each change uncommitted until Villoro says it's good, so they can review it as a diff. When they accept it, commit that part (message prefixed `Draft:`) and only then move on to the next thing they asked for. Don't run ahead to the next section.
- **Length:** most posts are ~300–500 lines of MDX. Keep the main body lean; push detail (per-case numbers, tables of measurements) to an appendix and give the main text a headline figure.
- **Voice:** first person, direct, short paragraphs, **bold** for the key phrase, bullets over long prose. Match an existing post (e.g. `0068-be-nice-data.mdx`) rather than inventing a style. **Plain and explanatory, not literary:** no dramatic fragments ("It doesn't change. It disappears."), no punchline triplets ("It's cheap, it's fast, and it has one blind spot"), no paired contrasts ("For its users… For the lake…"), no "you will be asked"-style asides. Say what happens and why, in complete sentences.
- **No manual numbers in headings.** H2–H5 are auto-numbered (see "Heading numbering"), so `### 1. Attach` renders as "4.1 1. Attach". Write `### Attach`.
- **Break up long text.** Use callouts (`[!abstract]` for the thesis, `[!tip]` for a striking number or aside), small tables, and SVG diagrams. Villoro likes diagrams: propose one whenever a concept has a shape (zones, flows, before/after).
- **Link generously.** Earlier posts on the same topic (`<FancyLink url="https://villoro.com/blog/<slug>/" dark="true"/>`) and official docs for any tool, extension or connector mentioned.
- **Be honest with numbers.** Use only figures from a source (the code, a measurement, Villoro). If you assume something (same workload, production vs. rehearsal, cluster size), say so in your summary so Villoro can confirm it. Never invent a statistic to make a claim stronger.
- **Rewriting an existing draft:** start a new `9999-*.mdx` on a branch from fresh `origin/main` and read the old draft with `git show <branch>:<path>` instead of building on top of it.
- **When the free draft lacks punch, agree the thesis before the index.** A draft with good material but no single claim to defend reads flat. Propose two or three thesis options with the number that backs each, let Villoro pick, then agree the index, commit a skeleton (the headings, each with its intent as a `{/* */}` comment, no prose) and write it section by section. When Villoro says "commit, then fix", commit the version they reviewed first, so the fix shows as its own diff.
- **Top callouts:** if the post continues an earlier one, say so in an `[!info]` callout before the first heading. The `[!abstract]` states the claim and what the post covers; keep the numbers for the results section instead of spoiling them up front.
- **Independent review before the PR.** Have a different model (Codex, say) review the whole post against the code and the measurements it quotes, reporting findings without committing. It catches what the author can't: in `0075` it found a bug in our own benchmark (repeated ids) that had inflated a figure. Apply the findings Villoro agrees with as one uncommitted round.
- **Previewing and releasing a draft:** a post with `draft: true` has a page at its normal URL (`/blog/<slug>/`) in `npm run dev` and in Netlify deploy/branch previews (`SHOW_DRAFTS`, `src/lib/drafts.ts`, true when Netlify's `CONTEXT` is `deploy-preview` or `branch-deploy`), so it can be checked live before it is published. That page is `noindex`, shows a "Draft — not published" banner under the hero, and exists nowhere else: not in the home page, listings, tags, categories, related posts, RSS, the sitemap or `search.json`. On the live site (`CONTEXT=production`), in CI and in a plain local `npm run build` it has no page at all. To release: rename `9999-*.mdx` to the next number, keep `draft: true` while you check the page in the PR's deploy preview, remove it to publish, and bump `package.json` (`npm version patch --no-git-tag-version`) in the PR.

### Hero image

- Propose a prompt in the style of the recent hero images (`0073`, `0074`): photorealistic, one playful visual metaphor for the thesis, wide 16:9. Short text in the image is fine (the SQL tree of `0073` has it). Offering three scenes plus one left to the generator works well.
- Villoro generates the images and leaves them as PNGs in the repo root. Convert the chosen one to a 1920×1080 JPG (quality about 80, so it stays under ~400 KB) at `src/images/blog/<nnnn>-<name>.jpg`, set `image:` in the frontmatter, and delete the PNGs.

### Charts and tables

- **Data charts use Chart.js**, not SVG: a `public/js/posts/<nnnn>-plots-<topic>.js` that loads Chart.js from the CDN (copy `0060-plots-duckdb.js`), a `<script type="module" src="/js/posts/...">` after the frontmatter, and a `<canvas id=...>` where the chart goes. Give the canvas `role="img"`, an `aria-label` with the numbers, and fallback text. Keep pandas in `#FF764D` as in earlier posts.
- **Tables right-align every column but the first** (`prose.css`), which suits numbers. For a column of text, mark it left-aligned in the Markdown (`| --- | :--- |`): it renders as an inline `text-align:left`, which wins over the stylesheet.

### SVG diagrams

- Live in `src/images/posts/<year>/`, embedded with `![alt](../../images/posts/<year>/name.svg)`. Copy the style of an existing one (`0074-duckdb-three-zones.svg`): `viewBox` 1600 wide, Inter font, `.ttl`/`.mut`/`.txt` classes, blue `#3a76ff` as the accent.
- **Colour means one thing per post.** When colours stand for concepts (in `0075`: E blue, T amber, L green), use them the same way in every diagram, and keep titles and labels neutral. A colour for "before/after" that is also a concept colour confuses the reader.
- Avoid glyphs like `→`, `≈` or `⋮` in SVG text: some renderers draw them as empty boxes. Use words, or draw the shape (three circles for an ellipsis).
- **They must have an opaque background card** (`<rect class="card" …/>` right after `<defs>`). An SVG loaded as `<img>` follows the OS `prefers-color-scheme`, not the site's `.dark` class, so dark text on a transparent background becomes unreadable when the site and OS themes differ.
- Check them by rendering to PNG with `sharp` (already a dependency). Sharp ignores `@media`, so to preview the dark variant, unwrap the `prefers-color-scheme` block into a scratch copy first.

## Common task playbook

| Task                                        | Touch                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Add a blog post                             | `npm run new-post -- "Title"` creates `src/content/blog/9999-<slug>.mdx` (draft frontmatter, TODO body). |
| Add a new category                          | `src/lib/categoryMetadata.ts` (add key + name + color). Use that key in post frontmatter.   |
| Edit prose / typography for posts           | `src/styles/prose.css`.                                                                      |
| Edit nav / footer                           | `src/layouts/components/SiteNav.astro` / `SiteFooter.astro`.                                |
| Edit colors                                 | `src/styles/tokens.css` (preferred) or `src/config/theme.json` → regenerates generated-theme.css. |
| Edit pagination size, similar-items count   | `src/config/config.json` → `settings`.                                                      |
| Add a shortcode                             | New `.astro` in `src/layouts/shortcodes/` + add `"@/shortcodes/Name.astro"` to `AutoImport.imports` in `astro.config.mjs`. |
| Add a callout type                          | `src/plugins/remark-callouts.mjs`.                                                          |
| Add a new icon (right-arrow / social)       | Use `<IconArrow />` / `<SocialIcon name="…" />`. Add a new `name` case to `SocialIcon` if needed. |
| Add a layout-level field to about/homepage  | Update Zod schema in `src/content.config.ts` AND the corresponding `-index.md`.             |

## Gotchas

- **Two color systems** — see the styling section. Don't reflexively unify them; the Tailwind class consumers depend on `generated-theme.css`.
- **`description` is no longer a `ShareRow` prop** (cleaned up). Don't pass it.
- **`ThemeSwitcher` takes no props** (`className` was removed; it was always undefined).
- **Reading time** is computed by `readingTimeForPost(post)` from the raw MDX `post.body` (typed on collection entries since Astro 7).
- **Tailwind v4** — config is in the `@theme` block (in `generated-theme.css`); there is no `tailwind.config.js`.
- **Astro 7 requires Node 22.x.** If you see `Node.js v20.x is not supported`, that's a local env issue, not the repo (`nvm use` reads `.nvmrc`).
- **Pages are cached network-first by the service worker** (`astro.config.mjs`, `AstroPWA`). A stale page after a deploy means the network was slow or offline, not a precache bug; don't add HTML to `globPatterns`.
