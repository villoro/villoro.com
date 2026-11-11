// Plain .mjs so astro.config.mjs (which cannot import .ts/.astro) and the
// pages can share the same SEO rules for thin tag pages and sitemap lastmod.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slug as slugify } from "github-slugger";

/** Tag pages with fewer published posts than this are noindex and not in the sitemap. */
export const MIN_POSTS_TO_INDEX_TAG = 3;

export const isThinTag = (count) => count < MIN_POSTS_TO_INDEX_TAG;

const BLOG_DIR = path.resolve("src/content/blog");

/** Published posts (no drafts) read straight from frontmatter. */
export function readPublishedPosts(dir = BLOG_DIR) {
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => ({ file: f, data: matter(fs.readFileSync(path.join(dir, f), "utf8")).data }))
    .filter((p) => !p.data.draft)
    .map((p) => ({
      // Same id the content collection gets: frontmatter slug, else filename
      slug: p.data.slug || slugify(p.file.replace(/\.mdx?$/, "")),
      tags: p.data.tags ?? ["Others"],
      date: p.data.updated_date ?? p.data.date,
    }));
}

/** Tag slug -> number of published posts. Slugified like the /tags/[tag] routes. */
export function tagCounts(posts = readPublishedPosts()) {
  const counts = new Map();
  for (const post of posts) {
    for (const tag of new Set(post.tags.map((t) => slugify(t)))) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}
