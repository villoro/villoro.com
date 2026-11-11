// Unit tests for the pure helpers with subtle logic. They import the
// TypeScript sources directly: Node strips the types, so no build step and no
// test framework are needed. Run with `npm test`.
import assert from "node:assert/strict";
import { test } from "node:test";

import { plainifyMdx } from "../src/lib/utils/searchText.ts";
import similarItems from "../src/lib/utils/similarItems.ts";
import { plainify, slugify } from "../src/lib/utils/textConverter.ts";
import { withTrailingSlash } from "../src/lib/utils/url.ts";
import { isThinTag, MIN_POSTS_TO_INDEX_TAG } from "../src/lib/blogIndex.mjs";

test("withTrailingSlash adds the slash to internal page URLs", () => {
  const cases = {
    "/blog": "/blog/",
    "/blog/": "/blog/",
    "/": "/",
    "/blog/page/2": "/blog/page/2/",
    "/blog/post?utm=x": "/blog/post/?utm=x",
    "/blog/post#section": "/blog/post/#section",
    "https://villoro.com": "https://villoro.com/",
    "https://villoro.com/blog/post": "https://villoro.com/blog/post/",
  };
  for (const [input, expected] of Object.entries(cases)) {
    assert.equal(withTrailingSlash(input), expected, input);
  }
});

test("withTrailingSlash leaves files, anchors and external URLs alone", () => {
  for (const url of [
    "/rss.xml",
    "/search.json",
    "/images/logo.svg",
    "#section",
    "",
    "mailto:someone@example.com",
    "https://example.com/docs",
    "//cdn.example.com/x",
  ]) {
    assert.equal(withTrailingSlash(url), url, url);
  }
});

test("plainify strips markdown and surrounding whitespace", () => {
  assert.equal(plainify("Some **bold** text\n"), "Some bold text");
  assert.equal(plainify("A [link](https://example.com) here"), "A link here");
  assert.equal(plainify("Tom & Jerry's"), "Tom & Jerry's");
});

test("slugify matches the slugs used by the tag and category routes", () => {
  assert.equal(slugify("Best Practices"), "best-practices");
  assert.equal(slugify("DuckDB"), "duckdb");
  assert.equal(slugify("cloud_devops"), "cloud_devops");
});

test("plainifyMdx turns a post body into searchable text", () => {
  const mdx = [
    'import chart from "./chart.svg";',
    "",
    "> [!abstract] The claim",
    "> Most teams **don't** need Spark.",
    "",
    '<FancyLink linkText="DuckDB" url="https://duckdb.org" company="duckdb"/>',
    "",
    "## Heading",
    "",
    "Use `SELECT 1` &amp; move on.",
  ].join("\n");
  const text = plainifyMdx(mdx);

  assert.equal(text, "The claim Most teams don't need Spark. Heading Use SELECT 1 & move on.");
});

test("plainifyMdx keeps text that only looks like a callout", () => {
  assert.match(plainifyMdx("An array like [!important] stays."), /\[!important\]/);
});

const post = (id, category, tags, date) => ({
  id,
  data: { slug: id, category, tags, date: new Date(date) },
});

test("similarItems ranks by shared category and tags, newest first on ties", () => {
  const current = post("current", "DE", ["SQL", "DuckDB"], "2026-01-01");
  const posts = [
    current,
    post("same-category-old", "DE", [], "2020-01-01"),
    post("same-category-new", "DE", [], "2025-01-01"),
    post("category-and-tag", "DE", ["SQL"], "2019-01-01"),
    post("one-tag", "python", ["DuckDB"], "2026-06-01"),
    post("unrelated", "web", ["CSS"], "2026-06-01"),
  ];

  assert.deepEqual(
    similarItems(current, posts, 3).map((p) => p.id),
    ["category-and-tag", "same-category-new", "same-category-old"],
  );
  assert.deepEqual(
    similarItems(current, posts, 10).map((p) => p.id),
    ["category-and-tag", "same-category-new", "same-category-old", "one-tag"],
    "the current post and unrelated posts are never returned",
  );
});

test("similarItems gives the same answer whatever the input order", () => {
  const current = post("current", "DE", ["SQL"], "2026-01-01");
  const others = ["a", "b", "c", "d"].map((id, i) => post(id, "DE", [], `202${i}-01-01`));
  const forward = similarItems(current, [current, ...others], 3).map((p) => p.id);
  const backward = similarItems(current, [...others].reverse().concat(current), 3).map((p) => p.id);
  assert.deepEqual(forward, backward);
});

test("tags need a minimum number of posts to be indexed", () => {
  assert.equal(isThinTag(MIN_POSTS_TO_INDEX_TAG - 1), true);
  assert.equal(isThinTag(MIN_POSTS_TO_INDEX_TAG), false);
});
