import { getPublishedPosts } from "@/lib/posts";
import { slugify } from "@/lib/utils/textConverter";

/** Unique, slugified values of a post field ("tags" or "category") across published posts. */
export const getTaxonomy = async (name: "tags" | "category"): Promise<string[]> => {
  const posts = await getPublishedPosts();
  const values = posts.flatMap((post) => {
    const value = post.data[name];
    return Array.isArray(value) ? value : [value];
  });
  return [...new Set(values.map((value) => slugify(value)))];
};
