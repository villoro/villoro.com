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

/**
 * Posts for the home page cards: the published ones, plus the drafts ONLY in
 * `astro dev`, so a draft can be seen in context while writing it. Deploy
 * previews and production never list drafts (unlike SHOW_DRAFTS, which also
 * covers previews). PostCard marks drafts with a "Draft" chip.
 */
export const getPostsToList = (): Promise<BlogPost[]> =>
  import.meta.env.DEV ? getCollection("blog") : getPublishedPosts();

/** URL slug of a post: the frontmatter `slug`, else the whole filename (so always set `slug`). */
export const postSlug = (post: BlogPost): string => post.data.slug || post.id;
