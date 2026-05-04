import { z } from "astro/zod";

export const configSchema = z.object({
  site: z.object({
    title: z.string(),
    base_url: z.string().url(),
    base_path: z.string(),
    trailing_slash: z.boolean(),
    favicon: z.string(),
    logo: z.string(),
    logo_darkmode: z.string(),
    logo_width: z.string(),
    logo_height: z.string(),
    logo_text: z.string(),
  }),

  settings: z.object({
    search: z.boolean(),
    theme_switcher: z.boolean(),
    default_theme: z.enum(["light", "dark", "system"]),
    pagination: z.number().int().positive(),
    pagination_window_size: z.number().int().positive(),
    similar_items_length: z.number().int().positive(),
    blog_folder: z.string(),
    page_name: z.string(),
    writing_since: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),

  subscribe: z.object({
    link: z.string().url(),
    title: z.string(),
  }),

  buymeacoffee: z.object({
    username: z.string(),
  }),

  metadata: z.object({
    meta_author: z.string(),
    meta_description: z.string(),
  }),

  footer: z.object({
    email: z.string().email(),
  }),

  giscus: z.object({
    repo: z.string(),
    repoId: z.string(),
    category: z.string(),
    categoryId: z.string(),
  }),
});

export type Config = z.infer<typeof configSchema>;
