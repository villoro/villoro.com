import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import AstroPWA from "@vite-pwa/astro";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkCallouts from "./src/plugins/remark-callouts.mjs";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sectionize from "@hbsnow/rehype-sectionize";
import config from "./src/config/config.json";
import { isThinTag, readPublishedPosts, tagCounts } from "./src/lib/blogIndex.mjs";

const posts = readPublishedPosts();
const counts = tagCounts(posts);
const lastmodBySlug = new Map(
  posts.filter((p) => p.date).map((p) => [p.slug, new Date(p.date).toISOString()]),
);
const pathOf = (url) => url.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");

export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",

  build: {
    inlineStylesheets: "auto",
  },

  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    sitemap({
      // Paginated listings are noindex; thin tag pages are noindex too.
      filter: (url) => {
        const pathname = pathOf(url);
        if (pathname.includes("/page/")) return false;
        const tag = pathname.match(/^\/tags\/([^/]+)$/)?.[1];
        return !(tag && isThinTag(counts.get(tag) ?? 0));
      },
      serialize: (item) => {
        const slug = pathOf(item.url).match(/^\/blog\/([^/]+)$/)?.[1];
        const lastmod = slug && lastmodBySlug.get(slug);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    AstroPWA({
      registerType: "autoUpdate",
      includeAssets: ["images/favicon.png"],
      manifest: {
        name: "Villoro",
        short_name: "Villoro",
        description: config.metadata.meta_description,
        start_url: "/",
        display: "standalone",
        theme_color: "#3a76ff",
        background_color: "#3a76ff",
        icons: [
          {
            src: "/pwa/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Precache only hashed static assets (JS/CSS/SVG/fonts) and the PWA
        // icons. HTML is NOT precached: precached pages are served
        // cache-first, so new posts never appeared until the service worker
        // managed to update (rare on mobile / with ClientRouter soft
        // navigations), and every deploy forced re-downloading ~215 pages.
        // Pages go through the NetworkFirst rule below instead.
        // Raster images are NOT precached either — public/images alone is
        // >20 MB of originals plus Sharp variants. They're cached lazily as
        // they're viewed via the runtimeCaching rule below.
        globPatterns: [
          "**/*.{js,css,svg,woff,woff2}",
          "pwa/*.png",
          "images/favicon.png",
        ],
        // No navigateFallback: serving "/" for any uncached URL while
        // offline masks real 404s and confuses deep links on a blog.
        navigateFallback: null,
        runtimeCaching: [
          {
            // Pages: always try the network so new posts show up right
            // away; fall back to the last cached copy when offline or the
            // network is too slow. Only pages actually visited are cached.
            urlPattern: ({ request, sameOrigin }) =>
              sameOrigin && request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                purgeOnQuotaError: true,
              },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: ({ request, sameOrigin }) =>
              sameOrigin && request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                purgeOnQuotaError: true,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Accordion.astro",
        "@/shortcodes/Button.astro",
        "@/shortcodes/FileName.astro",
        "@/shortcodes/FancyLink.astro",
        "@/shortcodes/Notice.astro",
        "@/shortcodes/TerminalOutput.astro",
      ],
    }),
    mdx(),
  ],
  markdown: {
    // Astro 7 defaults to the native Sätteri pipeline; keep the unified
    // (remark/rehype) processor so our custom plugins keep working.
    processor: unified({
      remarkPlugins: [
        remarkCallouts,
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [sectionize],
      shikiConfig: {
        theme: "monokai",
        wrap: true,
      },
    }),
  },
});
