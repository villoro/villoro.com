/**
 * Whether posts with `draft: true` get a page (at their normal /blog/<slug>/
 * URL, and only there: never in listings, tags, RSS, sitemap or search).
 *
 * Yes in `astro dev` and in Netlify deploy/branch previews, so a post can be
 * checked live before it is released. Netlify sets CONTEXT ("production" for
 * the live site); a local `npm run build` and GitHub CI have none, so they
 * build no drafts, exactly like production.
 */
export const SHOW_DRAFTS: boolean =
  import.meta.env.DEV ||
  process.env.CONTEXT === "deploy-preview" ||
  process.env.CONTEXT === "branch-deploy";
