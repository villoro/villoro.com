import type { BlogPost } from "@/lib/posts";
import { slugify } from "@/lib/utils/textConverter";

/** Posts whose `tags` / `category` contain a value that slugifies to `key`. */
const taxonomyFilter = (posts: BlogPost[], name: "tags" | "category", key: string): BlogPost[] => {
  const lowercasedKey = key.toLowerCase();
  return posts.filter((post) => {
    const fieldValue = post.data[name];
    const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
    return values.some((value) => slugify(value).toLowerCase() === lowercasedKey);
  });
};

export default taxonomyFilter;
