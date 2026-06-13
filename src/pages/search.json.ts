import { getCollection } from "astro:content";
import { getImage } from "astro:assets";
import { marked } from "marked";
import { resolveImage } from "@/lib/utils/blogImages";

// Static endpoint: built once into dist/search.json and lazy-fetched by
// SearchModal on first open. Replaces the old scripts/jsonGenerator.js —
// being inside Astro lets thumbnails go through the image pipeline (blog
// images in src/images/blog are no longer served at their raw paths).

// Cap the indexed body per post so search.json stays small. Plain text only —
// long posts lose tail-end recall, which is an acceptable trade-off.
const MAX_CONTENT_LENGTH = 5000;
const THUMB_WIDTH = 320;

// Convert MDX to plain text at build time so the client doesn't need to parse
// markdown (this keeps `marked` out of the browser bundle — see SearchResult).
const plainifyMdx = (mdxContent: string): string => {
  const withoutImports = mdxContent.replace(/^(import|export)\s.*$/gm, "");
  // strip MDX component tags (capitalized, possibly multiline attributes,
  // e.g. <FancyLink linkText="…" url="…"/>) before markdown parsing —
  // marked escapes them in some contexts so the HTML-tag strip below
  // wouldn't catch them
  const withoutComponents = withoutImports.replace(
    /<\/?[A-Z][a-zA-Z]*(\s[^<>]*?)?\/?>/gs,
    " ",
  );
  const html = marked.parse(withoutComponents) as string;
  const withoutTags = html.replace(/<\/?[^>]+(>|$)/gm, " ");
  const decoded = withoutTags
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
  return decoded.replace(/\s+/g, " ").trim();
};

export async function GET() {
  const posts = await getCollection(
    "blog",
    ({ id, data }) => !id.startsWith("-") && !data.draft,
  );

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
        slug: post.data.slug || post.id,
        frontmatter: {
          title: post.data.title,
          description: post.data.description,
          image: thumb,
          category: post.data.category,
          tags: post.data.tags,
        },
        // Astro 6 collection types don't expose body publicly — see AGENTS.md
        content: plainifyMdx((post as { body?: string }).body ?? "").slice(
          0,
          MAX_CONTENT_LENGTH,
        ),
      };
    }),
  );

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
}
