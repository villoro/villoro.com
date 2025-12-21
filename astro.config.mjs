import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sectionize from "@hbsnow/rehype-sectionize";
import config from "./src/config/config.json";

export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",

  // Remove this entire "image" block: Sharp is the default in Astro 5
  // image: { service: squooshImageService() },

  integrations: [
    react(),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Accordion",
        "@/shortcodes/Button",
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
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    rehypePlugins: [sectionize],
    shikiConfig: {
      theme: "monokai",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
