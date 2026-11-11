import { getEntry } from "astro:content";

/** Hero and section copy of the /blog listing (src/content/listing/blog.md). */
export const getBlogListingCopy = async () => {
  const entry = await getEntry("listing", "blog");
  if (!entry) throw new Error("src/content/listing/blog.md is missing");
  return entry.data;
};
