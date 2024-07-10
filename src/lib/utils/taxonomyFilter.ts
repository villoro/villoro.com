import { slugify } from "@/lib/utils/textConverter";

const taxonomyFilter = (posts, name, key) => {
  const lowercasedKey = key.toLowerCase();
  return posts.filter((post) => {
    const fieldValue = post.data[name];
    if (Array.isArray(fieldValue)) {
      return fieldValue.some((name) => slugify(name).toLowerCase() === lowercasedKey);
    } else if (typeof fieldValue === "string") {
      return slugify(fieldValue).toLowerCase() === lowercasedKey;
    }
    return false;
  });
};

export default taxonomyFilter;
