import { getCollection, type CollectionEntry } from "astro:content";
import { SHOW_DRAFTS } from "@/lib/drafts";

export type BlogPost = CollectionEntry<"blog">;

/**
 * Every post that is live: no drafts. This is the single source for the home
 * page, listings, tags, categories, related posts, RSS and the search index.
 */
export const getPublishedPosts = (): Promise<BlogPost[]> =>
  getCollection("blog", ({ data }) => !data.draft);

/**
 * Posts that get a page: the published ones, plus the drafts when SHOW_DRAFTS
 * (dev and deploy previews). ONLY the route list of /blog/[single] may use
 * this; everything else must stay on getPublishedPosts().
 */
export const getPostsToBuild = (): Promise<BlogPost[]> =>
  SHOW_DRAFTS ? getCollection("blog") : getPublishedPosts();

/** URL slug of a post: the frontmatter `slug`, else the filename minus its numeric prefix. */
export const postSlug = (post: BlogPost): string => post.data.slug || post.id;
