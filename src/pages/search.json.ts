import { getPublishedPosts, postSlug } from "@/lib/posts";
import { getImage } from "astro:assets";
import { resolveImage } from "@/lib/utils/blogImages";
import { plainifyMdx } from "@/lib/utils/searchText";

// Static endpoint: built once into dist/search.json and fetched by
// SearchModal.astro the first time search opens. Being an Astro endpoint
// lets the thumbnails go through the image pipeline (blog images in
// src/images/blog are not served at their raw paths).

// Cap the indexed body per post so search.json stays small. Plain text only —
// long posts lose tail-end recall, which is an acceptable trade-off.
const MAX_CONTENT_LENGTH = 5000;
const THUMB_WIDTH = 320;

export async function GET() {
  const posts = await getPublishedPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      // thumbnail: optimized URL when the image resolves through the
      // pipeline, raw path otherwise (e.g. anything still in public/)
      let thumb = post.data.image;
      const loader = post.data.image ? resolveImage(post.data.image) : undefined;
      if (loader) {
        const mod = await loader();
        const img = await getImage({ src: mod.default, width: THUMB_WIDTH });
        thumb = img.src;
      }

      return {
        group: "blog",
        // same slug rule as rss.xml.ts and the blog routes
        slug: postSlug(post),
        frontmatter: {
          title: post.data.title,
          description: post.data.description,
          image: thumb,
          category: post.data.category,
          tags: post.data.tags,
        },
        content: plainifyMdx(post.body ?? "").slice(0, MAX_CONTENT_LENGTH),
      };
    }),
  );

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
}
