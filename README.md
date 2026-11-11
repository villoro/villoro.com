# <img src="images/logo.png" alt="logo_villoro" width="90px"/> My Personal Webpage

[![Netlify Status](https://api.netlify.com/api/v1/badges/6f3b0fb4-f908-426f-b880-6629be37bc4b/deploy-status)](https://app.netlify.com/sites/villoro/deploys)
[![powered by Astro](https://img.shields.io/badge/powered_by-Astro-orange.svg)](https://astro.build/)

This is the code for my personal webpage and blog. You can view it live here: [villoro.com](https://villoro.com/).

## Overview

A static site built with [Astro](https://astro.build/) 7. The posts are MDX files in `src/content/blog/`, styled with [Tailwind CSS](https://tailwindcss.com/) 4, with no UI framework: the few interactive parts (search, theme switcher, copy link) are plain scripts inside `.astro` components. It is installable as a PWA and deployed on [Netlify](https://www.netlify.com/).

`AGENTS.md` describes the layout of the code in detail, and `IMPROVEMENTS.md` lists what is planned.

## Run the site

It needs Node 22 (`.nvmrc` is provided, so `nvm use` picks it).

```bash
npm install
npm run dev        # dev server
npm run build      # static build into dist/
npm run preview    # serve dist/ locally
```

Checks that CI also runs:

```bash
npm run lint
npm run typecheck
npm run size       # bundle size budget, needs a build first
```

## Version management

Every change that affects the site bumps the version in `package.json` (CI checks it):

```bash
npm version patch --no-git-tag-version
```

## Updating dependencies

```bash
npm outdated       # list outdated packages
npm update         # update within the ranges defined in package.json
```

After updating, run `npm run lint`, `npm run typecheck` and `npm run build`.

## Deployment

Netlify builds and deploys every push to `main`, and builds a preview for each pull request.

## Authors

- [Arnau Villoro](https://villoro.com)

## License

The content of this repository is licensed under the [MIT License](https://opensource.org/licenses/MIT).
