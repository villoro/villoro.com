import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

/**
 * Every post that is live: no drafts. This is the single source for the home
 * page, listings, tags, categories, related posts, RSS and the search index.
 */
export const getPublishedPosts = (): Promise<BlogPost[]> =>
  getCollection("blog", ({ data }) => !data.draft);

/** URL slug of a post: the frontmatter `slug`, else the filename minus its numeric prefix. */
export const postSlug = (post: BlogPost): string => post.data.slug || post.id;
