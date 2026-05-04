import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
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
