// Creates the draft of a new blog post:
//
//   npm run new-post -- "My post title"
//
// writes src/content/blog/9999-<slug>.mdx with the full frontmatter of a draft
// (`9999-` is the drafts prefix, `draft: true` keeps it off the live site; a
// default hero image comes from the schema). No dependencies.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BLOG_DIR = path.resolve("src/content/blog");

/** "Hard Deletes: The Rows Your Lake Never Hears About" -> "hard-deletes-the-rows-your-lake-never-hears-about" */
export function slugifyTitle(title) {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // accents: "café" -> "cafe"
    .toLowerCase()
    .replace(/['’]/g, "") // "don't" -> "dont"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** A YAML scalar: bare when it is safe, double-quoted (JSON is valid YAML) otherwise. */
export function yamlString(value) {
  const bare = /^[A-Za-z][A-Za-z0-9 '’,.()!?&/-]*$/.test(value) && !/^(true|false|yes|no|null|on|off)$/i.test(value);
  return bare && value === value.trim() ? value : JSON.stringify(value);
}

/** The full text of a new draft. `today` is an ISO date (YYYY-MM-DD). */
export function buildPost(title, today) {
  const slug = slugifyTitle(title);
  return `---
slug: ${slug}
title: ${yamlString(title)}
meta_title: ${yamlString(title)}
description: "TODO: one or two sentences for search results and cards."
date: ${today}
writing_date: ${today}
category: others # TODO: a key of src/lib/categoryMetadata.ts
tags: [Others] # TODO
draft: true
---

{/* TODO: write the post. Agree the thesis and the index first (AGENTS.md, "Writing blog posts"). */}
`;
}

function main(args) {
  const title = args.join(" ").trim();
  if (!title) {
    console.error('Usage: npm run new-post -- "My post title"');
    process.exit(2);
  }
  const slug = slugifyTitle(title);
  if (!slug) {
    console.error(`The title "${title}" has no letters or digits to make a slug from.`);
    process.exit(2);
  }

  const file = path.join(BLOG_DIR, `9999-${slug}.mdx`);
  const taken = fs
    .readdirSync(BLOG_DIR)
    .filter((name) => /\.mdx?$/.test(name))
    .find(
      (name) =>
        name.replace(/\.mdx?$/, "").replace(/^\d+-/, "") === slug ||
        new RegExp(`^slug:\\s*${slug}\\s*$`, "m").test(fs.readFileSync(path.join(BLOG_DIR, name), "utf8")),
    );
  if (taken) {
    console.error(`Not creating anything: src/content/blog/${taken} already uses the slug "${slug}".`);
    process.exit(1);
  }

  const today = new Date().toISOString().slice(0, 10);
  // "wx" fails instead of overwriting if the file appeared in the meantime
  fs.writeFileSync(file, buildPost(title, today), { flag: "wx" });
  console.log(path.relative(process.cwd(), file));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
