import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import config from "@/config/config.json";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => {
      const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
      const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
      return dateB - dateA;
    });

  return rss({
    title: config.site.title,
    description: config.metadata.meta_description,
    site: config.site.base_url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || "",
      link: `/${config.settings.blog_folder}/${post.data.slug || post.id}`,
      categories: post.data.tags,
    })),
  });
}
