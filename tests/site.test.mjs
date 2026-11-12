// Data-quality checks on the built site, the same idea as dbt tests on a
// model: build once (`npm run build`), then assert things about `dist/`.
// Run with `npm test`. No dependencies: Node's own test runner.
//
// Each test collects every offender and fails once with the list, so one run
// tells you everything that is wrong.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import matter from "gray-matter";
import { slug as slugify } from "github-slugger";

const DIST = path.resolve("dist");
const SITE = "https://villoro.com";
const BLOG_SRC = path.resolve("src/content/blog");

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  throw new Error("dist/ is missing: run `npm run build` before `npm test`.");
}

// ── Load the built site once ────────────────────────────────────────────────

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const first = (text, regex) => text.match(regex)?.[1];
const all = (text, regex) => [...text.matchAll(regex)].map((m) => m[1]);

const pages = walk(DIST)
  .filter((file) => file.endsWith(".html"))
  .map((file) => {
    const html = fs.readFileSync(file, "utf8");
    const headEnd = html.indexOf("</head>");
    const head = html.slice(0, headEnd);
    const rel = path.relative(DIST, file);
    return {
      file: rel,
      // "blog/x/index.html" -> "/blog/x/", "index.html" -> "/"
      url: "/" + rel.replace(/index\.html$/, ""),
      html,
      head,
      body: html.slice(headEnd),
      is404: rel === "404.html",
    };
  });

const pageByUrl = new Map(pages.map((page) => [page.url, page]));
const postPages = pages.filter((page) => /^\/blog\/[^/]+\/$/.test(page.url));

// Posts with `draft: true`. Dev and deploy previews build a noindex page for
// each; the live site and a plain `npm run build` build none.
const draftSlugs = fs
  .readdirSync(BLOG_SRC)
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => ({ file, data: matter(fs.readFileSync(path.join(BLOG_SRC, file), "utf8")).data }))
  .filter(({ data }) => data.draft)
  .map(({ file, data }) => data.slug || slugify(file.replace(/\.mdx?$/, "")));
const draftUrls = new Set(draftSlugs.map((slug) => `/blog/${slug}/`));
const isNoindex = (page) => /<meta name="robots" content="[^"]*noindex/.test(page.head);
const publishedPostPages = postPages.filter((page) => !draftUrls.has(page.url));

// A local path resolves when it is a file in dist/ or a directory with an index.html
const resolves = (urlPath) => {
  const clean = decodeURIComponent(urlPath.replace(/[?#].*$/, ""));
  const target = path.join(DIST, clean);
  if (!fs.existsSync(target)) return false;
  return fs.statSync(target).isFile() || fs.existsSync(path.join(target, "index.html"));
};

// Internal = site-relative, or absolute on our own domain. Returns the path, or null.
const internalPath = (url) => {
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (url === SITE || url.startsWith(SITE + "/")) return url.slice(SITE.length) || "/";
  return null;
};

// Netlify 301s "/blog/x" to "/blog/x/", so pages must be linked with the slash
const hasFinalForm = (urlPath) => {
  const clean = urlPath.replace(/[?#].*$/, "");
  return clean.endsWith("/") || /\.[a-z0-9]+$/i.test(clean.split("/").pop());
};

const report = (offenders) => {
  const shown = offenders.slice(0, 15).join("\n  ");
  const more = offenders.length > 15 ? `\n  … and ${offenders.length - 15} more` : "";
  return `${offenders.length} offender(s):\n  ${shown}${more}`;
};

const expectNone = (offenders) => assert.equal(offenders.length, 0, report(offenders));

const sitemapUrls = fs
  .readdirSync(DIST)
  .filter((file) => /^sitemap-\d+\.xml$/.test(file))
  .flatMap((file) => all(fs.readFileSync(path.join(DIST, file), "utf8"), /<loc>([^<]+)<\/loc>/g));

// ── Tests ───────────────────────────────────────────────────────────────────

test("the build produced pages, posts and a sitemap", () => {
  assert.ok(pages.length > 100, `only ${pages.length} pages`);
  assert.ok(postPages.length > 50, `only ${postPages.length} posts`);
  assert.ok(sitemapUrls.length > 50, `only ${sitemapUrls.length} sitemap URLs`);
});

test("every internal href and src resolves to a built file", () => {
  const offenders = [];
  for (const page of pages) {
    for (const url of all(page.html, /\s(?:href|src)="([^"]+)"/g)) {
      const local = internalPath(url);
      // 404.html is served for any missing URL, so its own canonical has no page
      if (page.is404 && local === "/404/") continue;
      if (local && !resolves(local)) offenders.push(`${page.file}: ${url}`);
    }
  }
  expectNone([...new Set(offenders)]);
});

test("every internal link uses the trailing-slash form", () => {
  const offenders = [];
  for (const page of pages) {
    for (const url of all(page.html, /<a\s[^>]*href="([^"]+)"/g)) {
      const local = internalPath(url);
      if (local && !hasFinalForm(local)) offenders.push(`${page.file}: ${url}`);
    }
  }
  expectNone([...new Set(offenders)]);
});

test("every page has exactly one <h1>", () => {
  expectNone(
    pages
      .map((page) => [page.file, all(page.body, /<(h1)[\s>]/g).length])
      .filter(([, count]) => count !== 1)
      .map(([file, count]) => `${file}: ${count} <h1>`),
  );
});

test("every page has a unique, non-empty <title>", () => {
  const seen = new Map();
  const offenders = [];
  for (const page of pages) {
    const title = first(page.head, /<title>([^<]*)<\/title>/);
    if (!title?.trim()) offenders.push(`${page.file}: no title`);
    else if (seen.has(title)) offenders.push(`${page.file}: same title as ${seen.get(title)}`);
    else seen.set(title, page.file);
  }
  expectNone(offenders);
});

test("no meta tag has an empty value or stray whitespace", () => {
  const offenders = [];
  for (const page of pages) {
    const description = first(page.head, /<meta name="description" content="([^"]*)"/);
    if (!description) offenders.push(`${page.file}: no description`);
    for (const [, name, content] of page.head.matchAll(
      /<meta (?:name|property)="([^"]+)" content="([^"]*)"/g,
    )) {
      if (content !== content.trim()) offenders.push(`${page.file}: whitespace around ${name}`);
    }
  }
  expectNone(offenders);
});

test("every canonical is absolute, in its final form, and points to a built page", () => {
  const offenders = [];
  for (const page of pages.filter((page) => !page.is404)) {
    const canonical = first(page.head, /<link rel="canonical" href="([^"]+)"/);
    if (!canonical) offenders.push(`${page.file}: no canonical`);
    else if (!canonical.startsWith(SITE + "/")) offenders.push(`${page.file}: ${canonical}`);
    else if (!hasFinalForm(canonical)) offenders.push(`${page.file}: ${canonical} would redirect`);
    else if (!pageByUrl.has(internalPath(canonical)))
      offenders.push(`${page.file}: ${canonical} is not a built page`);
    const ogUrl = first(page.head, /<meta property="og:url" content="([^"]+)"/);
    if (ogUrl !== canonical) offenders.push(`${page.file}: og:url differs from the canonical`);
  }
  expectNone(offenders);
});

test("every page has a share image that exists", () => {
  const offenders = [];
  for (const page of pages) {
    const image = first(page.head, /<meta property="og:image" content="([^"]*)"/);
    // The site has no default share image yet: pages without one emit an empty tag.
    if (!image) continue;
    const local = internalPath(image);
    if (!local || !resolves(local)) offenders.push(`${page.file}: ${image}`);
  }
  expectNone(offenders);
});

test("every post has valid BlogPosting JSON-LD inside <head>", () => {
  const offenders = [];
  for (const page of postPages) {
    if (/<script type="application\/ld\+json"/.test(page.body)) {
      offenders.push(`${page.file}: JSON-LD outside <head>`);
    }
    const blocks = all(page.head, /<script type="application\/ld\+json">(.*?)<\/script>/gs);
    let posting;
    try {
      posting = blocks.map((block) => JSON.parse(block)).find((b) => b["@type"] === "BlogPosting");
    } catch (error) {
      offenders.push(`${page.file}: JSON-LD does not parse (${error.message})`);
      continue;
    }
    if (!posting) {
      offenders.push(`${page.file}: no BlogPosting`);
      continue;
    }
    if (!posting.headline) offenders.push(`${page.file}: no headline`);
    if (!posting.datePublished) offenders.push(`${page.file}: no datePublished`);
    if (!posting.author?.name || posting.author.name === "Admin") {
      offenders.push(`${page.file}: author is "${posting.author?.name}"`);
    }
    const image = posting.image && internalPath(posting.image);
    if (!image || !resolves(image)) offenders.push(`${page.file}: image ${posting.image}`);
    if (!hasFinalForm(posting.mainEntityOfPage ?? "")) {
      offenders.push(`${page.file}: mainEntityOfPage ${posting.mainEntityOfPage}`);
    }
  }
  expectNone(offenders);
});

test("nothing is rendered before <html>", () => {
  expectNone(
    pages
      .filter((page) => !/^<!doctype html>\s*<html/i.test(page.html))
      .map((page) => `${page.file}: starts with ${JSON.stringify(page.html.slice(0, 60))}`),
  );
});

test("every sitemap URL is a built, indexable page in its final form", () => {
  const offenders = [];
  for (const url of sitemapUrls) {
    const page = pageByUrl.get(internalPath(url) ?? "");
    if (!hasFinalForm(url)) offenders.push(`${url}: would redirect`);
    else if (!page) offenders.push(`${url}: not a built page`);
    else if (/<meta name="robots" content="[^"]*noindex/.test(page.head))
      offenders.push(`${url}: is noindex`);
  }
  expectNone(offenders);
});

test("every published post is in the sitemap, with a lastmod", () => {
  const sitemap = fs
    .readdirSync(DIST)
    .filter((file) => /^sitemap-\d+\.xml$/.test(file))
    .map((file) => fs.readFileSync(path.join(DIST, file), "utf8"))
    .join("");
  expectNone(
    publishedPostPages
      .filter((page) => !sitemap.includes(`<loc>${SITE}${page.url}</loc><lastmod>`))
      .map((page) => page.url),
  );
});

test("drafts are never published, only previewed as noindex pages", () => {
  const published = {
    "sitemap": sitemapUrls.join("\n"),
    "rss.xml": fs.readFileSync(path.join(DIST, "rss.xml"), "utf8"),
    "search.json": fs.readFileSync(path.join(DIST, "search.json"), "utf8"),
  };
  const offenders = [];
  const withPage = draftSlugs.filter((slug) => pageByUrl.has(`/blog/${slug}/`));
  // A preview build has a page for every draft; the live site for none
  if (withPage.length !== 0 && withPage.length !== draftSlugs.length) {
    const missing = draftSlugs.filter((slug) => !withPage.includes(slug));
    offenders.push(`only some drafts have a page, missing: ${missing.join(", ")}`);
  }
  for (const slug of draftSlugs) {
    const url = `/blog/${slug}/`;
    const page = pageByUrl.get(url);
    if (page && !isNoindex(page)) offenders.push(`${slug}: page is indexable`);
    if (page && !page.body.includes("data-draft-banner")) offenders.push(`${slug}: page has no draft marker`);
    for (const [name, content] of Object.entries(published)) {
      if (content.includes(url) || content.includes(`"slug":"${slug}"`)) {
        offenders.push(`${slug}: appears in ${name}`);
      }
    }
    // Drafts may link to each other (a series); no published page may link to one
    for (const other of pages.filter((other) => !draftUrls.has(other.url))) {
      if (other.html.includes(url)) offenders.push(`${slug}: linked from ${other.file}`);
    }
  }
  // The marker belongs to drafts only
  for (const page of publishedPostPages) {
    if (page.body.includes("data-draft-banner")) offenders.push(`${page.url}: published post with a draft marker`);
  }
  expectNone(offenders);
});

test("the search index covers every post and holds plain text", () => {
  const index = JSON.parse(fs.readFileSync(path.join(DIST, "search.json"), "utf8"));
  assert.equal(index.length, publishedPostPages.length, "one entry per published post");
  const offenders = [];
  for (const item of index) {
    if (!pageByUrl.has(`/blog/${item.slug}/`)) offenders.push(`${item.slug}: no such page`);
    if (!item.frontmatter?.title) offenders.push(`${item.slug}: no title`);
    if (/\[![a-z]+\]/i.test(item.content)) offenders.push(`${item.slug}: callout marker in text`);
    if (/<\/?[A-Z][a-zA-Z]*[\s/>]/.test(item.content)) offenders.push(`${item.slug}: MDX tag in text`);
    const image = item.frontmatter?.image;
    if (image && !resolves(image)) offenders.push(`${item.slug}: thumbnail ${image}`);
  }
  expectNone(offenders);
});

test("every table in a post can take keyboard focus, so it can be scrolled", () => {
  // Tables are their own scroll container (prose.css); without a tabindex
  // they can't be scrolled with the keyboard (axe: scrollable-region-focusable).
  const offenders = postPages.flatMap((page) =>
    all(page.body, /<table([^>]*)>/g)
      .filter((attrs) => !/\btabindex="0"/.test(attrs))
      .map(() => page.url),
  );
  assert.deepEqual([...new Set(offenders)], []);
});

test("no page loads Google Fonts or a framework island", () => {
  const offenders = [];
  for (const page of pages) {
    if (/fonts\.(googleapis|gstatic)\.com/.test(page.html)) offenders.push(`${page.file}: Google Fonts`);
    if (page.html.includes("<astro-island")) offenders.push(`${page.file}: <astro-island>`);
  }
  expectNone(offenders);
});

test("paginated listings are noindex,follow and the first page is indexable", () => {
  // Page 1 of a listing is its bare URL; a /page/1/ would be a duplicate.
  const offenders = pages.filter((page) => /\/page\/1\/$/.test(page.url)).map((page) => `${page.file}: duplicate of the first page`);
  for (const page of pages.filter((page) => page.url.includes("/page/"))) {
    if (!page.head.includes('<meta name="robots" content="noindex,follow"')) {
      offenders.push(`${page.file}: not noindex,follow`);
    }
  }
  for (const url of ["/", "/blog/", "/about/"]) {
    if (/<meta name="robots" content="[^"]*noindex/.test(pageByUrl.get(url)?.head ?? "noindex")) {
      offenders.push(`${url}: missing or noindex`);
    }
  }
  expectNone(offenders);
});
