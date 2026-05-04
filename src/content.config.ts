import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    updatedDate: z.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    slug: z.string().optional(),
    author: z.string().default("Admin"),
    category: z.string().default("Others"),
    tags: z.array(z.string()).default(["Others"]),
    draft: z.boolean().optional(),

    hero: z
      .object({
        h1: z.array(z.string()).optional(),
        lede: z.string().optional(),
        count_label: z.string().optional(),
      })
      .optional(),

    section: z
      .object({
        title: z.string().optional(),
        meta: z.string().optional(),
      })
      .optional(),
  }),
});

const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/about" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),

    hero: z.object({
      watermark: z.string(),
      h1: z.tuple([z.string(), z.string()]),
      lede: z.string(),
      badge: z.string(),
    }),

    story: z.object({
      kicker: z.string(),
      label: z.string(),
      paragraphs: z.array(z.string()),
    }),

    timeline: z.object({
      kicker: z.string(),
      heading_suffix: z.string(),
      sub: z.string(),
      entries: z.array(
        z.object({
          year: z.string(),
          role: z.string(),
          co: z.string(),
          desc: z.string(),
        }),
      ),
    }),

    hobbies: z.object({
      kicker: z.string(),
      heading: z.string(),
      entries: z.array(
        z.object({
          emoji: z.string(),
          title: z.string(),
          text: z.string(),
        }),
      ),
    }),

    info: z
      .object({
        title: z.string().optional(),
        imageAlt: z.string().optional(),
      })
      .optional(),
  }),
});

const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/homepage" }),
  schema: z.object({
    meta: z.object({
      title: z.string(),
      description: z.string().optional(),
    }),

    hero: z.object({
      h1_lines: z.tuple([z.string(), z.string(), z.string()]),
      lede: z.string(),
      cta_blog: z.string(),
      cta_about: z.string(),
      badge_most_read: z.string(),
      new_post_prefix: z.string(),
      stats_posts_label: z.string(),
      stats_years_label: z.string(),
    }),

    ribbon: z.object({
      slogan: z.string(),
      slogan_em: z.string(),
    }),

    latest: z.object({
      heading: z.string(),
      sub: z.string(),
      badge: z.string(),
      cta: z.string(),
    }),

    banner: z
      .object({
        image: z.string().optional(),
        title: z.string(),
        content: z.string().optional(),
      })
      .optional(),

    slogan: z
      .object({
        title: z.string().optional(),
      })
      .optional(),

    blog: z
      .object({
        title: z.string().optional(),
        button: z.string().optional(),
      })
      .optional(),

    companies: z
      .object({
        title: z.string().optional(),
        logos: z
          .array(
            z.object({
              name: z.string(),
              image: z.string().optional(),
              link: z.string().url().optional(),
            }),
          )
          .optional(),
      })
      .optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  about: aboutCollection,
  homepage: homepageCollection,
};
