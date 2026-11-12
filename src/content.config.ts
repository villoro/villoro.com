import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";
import config from "./config/config.json";
import { categoryKeys } from "./lib/categoryMetadata";

// Hero used by posts that set no `image:` (e.g. a new draft). Same
// "/images/blog/<file>" convention as frontmatter; see resolveImage.
export const DEFAULT_POST_IMAGE = "/images/blog/0000-default.jpg";

// Strict on purpose: a typo like `update_date:` fails the build instead of being
// silently ignored. Keys are snake_case.
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.strictObject({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    updated_date: z.date().optional(),
    // Internal only: when the post was written; never rendered
    writing_date: z.date().optional(),
    image: z.string().default(DEFAULT_POST_IMAGE),
    slug: z.string().optional(),
    author: z.string().default(config.metadata.meta_author),
    // A key of categoryMetadata (src/lib/categoryMetadata.ts)
    category: z.enum(categoryKeys).default("others"),
    tags: z.array(z.string()).default(["Others"]),
    draft: z.boolean().optional(),
    highlight: z.boolean().optional(),
  }),
});

// Hero and section copy of the /blog listing, which lives apart from the posts
const listingCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/listing" }),
  schema: z.strictObject({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string(),
    hero: z.strictObject({
      h1: z.tuple([z.string(), z.string()]),
      lede: z.string(),
      count_label: z.string(),
    }),
    section: z.strictObject({
      title: z.string(),
      meta: z.string(),
    }),
  }),
});

const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/about" }),
  schema: z.strictObject({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),

    hero: z.strictObject({
      watermark: z.string(),
      h1: z.tuple([z.string(), z.string()]),
      lede: z.string(),
      badge: z.string(),
    }),

    story: z.strictObject({
      kicker: z.string(),
      label: z.string(),
      paragraphs: z.array(z.string()),
    }),

    timeline: z.strictObject({
      kicker: z.string(),
      heading_suffix: z.string(),
      sub: z.string(),
      entries: z.array(
        z.strictObject({
          year: z.string(),
          role: z.string(),
          co: z.string(),
          desc: z.string(),
        }),
      ),
    }),

    hobbies: z.strictObject({
      kicker: z.string(),
      heading: z.string(),
      entries: z.array(
        z.strictObject({
          emoji: z.string(),
          title: z.string(),
          text: z.string(),
        }),
      ),
    }),
  }),
});

const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/homepage" }),
  schema: z.strictObject({
    meta: z.strictObject({
      title: z.string(),
      description: z.string().optional(),
    }),

    hero: z.strictObject({
      h1_lines: z.tuple([z.string(), z.string(), z.string()]),
      lede: z.string(),
      cta_blog: z.string(),
      cta_about: z.string(),
      badge_most_read: z.string(),
      new_post_prefix: z.string(),
      stats_posts_label: z.string(),
      stats_years_label: z.string(),
    }),

    ribbon: z.strictObject({
      slogan: z.string(),
      slogan_em: z.string(),
    }),

    latest: z.strictObject({
      heading: z.string(),
      sub: z.string(),
      badge: z.string(),
      cta: z.string(),
    }),
  }),
});

export const collections = {
  blog: blogCollection,
  listing: listingCollection,
  about: aboutCollection,
  homepage: homepageCollection,
};
