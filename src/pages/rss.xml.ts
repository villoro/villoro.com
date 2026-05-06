import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import config from "@/config/config.json";
import { sortByDate } from "@/lib/utils/sortFunctions";

export async function GET(context: { site?: URL }) {
  const all = await getCollection("blog");
  const posts = sortByDate(
    all.filter((p) => p.id.match(/^(?!-)/) && !p.data.draft),
  );

  return rss({
    title: config.site.title,
    description: config.metadata.meta_description,
    site: context.site ?? config.site.base_url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      categories: post.data.tags,
      author: post.data.author,
      link: `/blog/${post.data.slug || post.id}/`,
    })),
    customData: `<language>en</language>`,
  });
}
