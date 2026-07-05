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
    sitemap(),
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
        // Precache only the app shell (JS/CSS/HTML/SVG/fonts) and the PWA
        // icons. Raster images are NOT precached — public/images alone is
        // >20 MB of originals plus Sharp variants, which made first-visit
        // installs download ~75 MB in the background. Images are cached
        // lazily as they're viewed via the runtimeCaching rule below.
        globPatterns: [
          "**/*.{js,css,html,svg,woff,woff2}",
          "pwa/*.png",
          "images/favicon.png",
        ],
        // No navigateFallback: serving "/" for any uncached URL while
        // offline masks real 404s and confuses deep links on a blog.
        navigateFallback: null,
        runtimeCaching: [
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
        "@/shortcodes/Accordion",
        "@/shortcodes/Button",
        "@/shortcodes/FileName",
        "@/shortcodes/FancyLink",
        "@/shortcodes/Notice",
        "@/shortcodes/Tab",
        "@/shortcodes/Tabs",
        "@/shortcodes/TerminalOutput",
        "@/shortcodes/Video",
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
