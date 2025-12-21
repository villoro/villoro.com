import { defineCollection, z } from "astro:content";

// Post collection schema
const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    image: z.string().optional(),
    author: z.string().default("Admin"),
    category: z.string().default("Others"),
    tags: z.array(z.string()).default(["Others"]),
    draft: z.boolean().optional(),
  }),
});

// Author collection schema
const authorsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    email: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    social: z
      .array(
        z
          .object({
            name: z.string().optional(),
            icon: z.string().optional(),
            link: z.string().optional(),
          })
          .optional(),
      )
      .optional(),
    draft: z.boolean().optional(),
  }),
});

const aboutCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),

    info: z
      .object({
        title: z.string().optional(),
        imageAlt: z.string().optional(),
      })
      .optional(),
  }),
});

const homepageCollection = defineCollection({
  type: "content",
  schema: z.object({
    banner: z.object({
      image: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
    }),

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

// Pages collection schema
const pagesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

// Export collections
export const collections = {
  blog: blogCollection,
  authors: authorsCollection,
  pages: pagesCollection,
  about: aboutCollection,
  homepage: homepageCollection,
};
