# AGENTS.md

This file helps AI agents understand the repo structure and conventions without exploring it from scratch.

## Project Overview

Personal website/blog for Arnau Villoro (Data Engineer, Barcelona). Built with **Astro 6** as a static site with MDX content, deployed on Netlify.

Site: https://villoro.com

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6.1.8 (static site generator) |
| Language | TypeScript + MDX |
| UI | React 18 (client islands only) |
| Styling | Tailwind CSS 4 + custom theme |
| Icons | react-icons 5 (Font Awesome 6, `Fa*` prefix) |
| Images | Sharp (optimization), `astro:assets` |
| Comments | Giscus (GitHub Discussions) |
| Deploy | Netlify (push to main) |

## Dev Commands

```bash
npm run dev           # starts dev server (auto-runs generate-json first)
npm run build         # production build (auto-runs generate-json first)
npm run preview       # preview prod build locally
npm run generate-json # parse blog frontmatter → .json/posts.json + .json/search.json
npm run format        # prettier on src/
```

> **Important**: `.json/` is gitignored. The search index is regenerated at build time by `scripts/jsonGenerator.js`.

## Directory Structure

```
src/
├── pages/                  # Astro routes
│   ├── index.astro
│   ├── about.astro
│   ├── blog/               # blog listing + [single].astro + page/[slug].astro
│   ├── categories/         # [category].astro + [category]/page/[slug].astro
│   └── tags/               # [tag].astro + [tag]/page/[slug].astro
├── content/                # Astro content collections
│   ├── blog/               # Blog posts (*.md / *.mdx), years as subfolders
│   ├── about/              # About page content (-index.md)
│   └── homepage/           # Homepage banner + companies list (-index.md)
├── layouts/
│   ├── Base.astro          # HTML shell, head, analytics
│   ├── PostSingle.astro    # Blog post template
│   ├── components/         # Reusable .astro components
│   ├── shortcodes/         # Auto-imported MDX components (.tsx)
│   ├── helpers/            # Client-side React helpers (search, icons)
│   └── partials/           # Header.astro, Footer.astro
├── lib/                    # Utility functions
│   ├── contentParser.astro # Content collection helpers
│   ├── blogUtils.astro     # Blog-specific queries
│   ├── taxonomyParser.astro
│   ├── categoryMetadata.ts # Category name → icon/color mapping
│   └── utils/              # dateFormat, readingTime, sortFunctions, etc.
├── config/                 # JSON config files (not TS)
│   ├── config.json         # Site metadata, pagination (12), giscus config
│   ├── theme.json          # Colors + typography (light/dark)
│   ├── menu.json           # Nav menu
│   └── social.json         # Social links + icon names
├── styles/                 # CSS files (main.css imports the rest)
└── images/                 # Astro-optimized images
    ├── posts/              # Blog post images, organized by year
    └── companies/          # Company logos (name + name_dark variants)

public/                     # Static assets, copied verbatim to dist/
scripts/                    # Build scripts (jsonGenerator.js, removeDarkmode.js)
.github/workflows/          # CI.yaml (PR checks) + tag_commits_on_main.yaml
```

## Content Collections Schema

Defined in `src/content.config.ts` (Zod).

### Blog post frontmatter

```yaml
title: string           # required
meta_title: string      # optional (defaults to title in <head>)
description: string     # optional
date: ISO date          # optional, used for sorting
image: string           # optional, path relative to /public/images/
slug: string            # optional, auto-derived from filepath if omitted
author: string          # default "Admin"
category: string        # default "Others" — maps to categoryMetadata.ts
tags: [string]          # default ["Others"]
draft: boolean          # if true, excluded from all listings
```

- Content lives in `src/content/blog/` (organized by year: `2020/`, `2021/`, etc.)
- Index files are named `-index.md` and filtered out from listings
- Drafts are excluded via `getCollection('blog', ({ data }) => !data.draft)`

## Shortcodes (auto-imported in MDX)

These components are available in any `.mdx` file without importing:

| Shortcode | Description |
|---|---|
| `<Notice type="warning">` | Callout/alert box |
| `<Accordion>` | Collapsible section |
| `<Button>` | Styled button |
| `<FancyLink>` | Enhanced link |
| `<Tab>` / `<Tabs>` | Tab group |
| `<TerminalOutput>` | Terminal block |
| `<Video>` | Embedded video |

## Callout Syntax (remark-callouts)

Also usable directly in markdown without shortcodes:

```markdown
> [!NOTE] Optional title
> Content here

> [!WARNING]
> Content here
```

Supported types: `abstract`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `quote`
Aliases: `summary`→abstract, `hint`→tip, `check`→success, `help`→question, `caution`→warning, `fail`→failure, `error`→danger, `cite`→quote

## Styling Conventions

- **Dark mode**: Class-based (`dark` on `<html>`), not media-query. Toggle handled by `ThemeSwitcher.astro`.
- **Colors**: Defined in `src/config/theme.json`, auto-generated to `src/styles/generated-theme.css`. Never hardcode hex colors — use theme variables.
- **Fonts**: Heebo (body) + Signika (headings), loaded from Google Fonts in `Base.astro`.
- **Grid**: `tailwind-bootstrap-grid` plugin is included — Bootstrap-style grid classes work.

## Image Conventions

- Blog post images go in `src/images/posts/<year>/`
- Company logos go in `src/images/companies/` — dark variants named `logo_dark.png`
- Public images (not Astro-optimized) go in `public/images/`
- CI checks that blog images are 16:9 and favicons are 1:1 (`.github/scripts/check_aspect_ratio.py`)

## CI/CD

**On pull request** (`.github/workflows/CI.yaml`):
- `pre_commit`: code quality checks
- `labeler`: auto-labels PRs from `.github/labeler.yml`
- `check_version`: validates `package.json` version
- `aspect_ratio_check`: validates image dimensions

**On push to main**:
- Auto-tags the commit if `package.json` version changed
- Netlify deploys automatically

## Key Files to Know

| File | Why it matters |
|---|---|
| `src/content.config.ts` | Content collection schemas (Zod) |
| `src/config/config.json` | Pagination size, giscus repo, site URL |
| `src/config/theme.json` | Colors + fonts — edit this, not CSS |
| `src/lib/categoryMetadata.ts` | Add new categories here |
| `astro.config.mjs` | Markdown plugins, integrations |
| `scripts/jsonGenerator.js` | Generates search index at build time |
