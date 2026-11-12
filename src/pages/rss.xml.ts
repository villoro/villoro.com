import rss from "@astrojs/rss";
import { getPublishedPosts, postSlug } from "@/lib/posts";
import config from "@/config/config.json";
import { sortByDate } from "@/lib/utils/sortFunctions";

export async function GET(context: { site?: URL }) {
  const posts = sortByDate(await getPublishedPosts());

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
      // Keep the trailing slash: this URL is also the item GUID, and changing it
      // makes feed readers show every old post as new.
      link: `/blog/${postSlug(post)}/`,
    })),
    customData: `<language>en</language>`,
  });
}
