import { slugify } from "@/lib/utils/textConverter";

const taxonomyFilter = (posts: any[], name: string, key: string) =>
  posts.filter((post) => {
    const fieldValue = post.data[name];
    if (Array.isArray(fieldValue)) {
      return fieldValue.map((name: string) => slugify(name)).includes(key);
    } else if (typeof fieldValue === 'string') {
      return slugify(fieldValue) === key;
    }
    return false;
  });

export default taxonomyFilter;
