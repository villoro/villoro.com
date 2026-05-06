import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import AstroPWA from "@vite-pwa/astro";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCallouts from "./src/plugins/remark-callouts.mjs";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sectionize from "@hbsnow/rehype-sectionize";
import config from "./src/config/config.json";

export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",

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
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff,woff2}"],
        navigateFallback: "/",
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
  },
});
