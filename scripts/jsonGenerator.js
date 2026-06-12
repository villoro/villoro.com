const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const CONTENT_DEPTH = 2;
const JSON_FOLDER = "./.json";
const PUBLIC_FOLDER = "./public";
const BLOG_FOLDER = "src/content/blog";

// Cap the indexed body per post so search.json stays small. Plain text only —
// long posts lose tail-end recall, which is an acceptable trade-off.
const MAX_CONTENT_LENGTH = 5000;

// Convert MDX to plain text at build time so the client doesn't need to parse
// markdown (this keeps `marked` out of the browser bundle — see SearchResult).
const plainify = (mdxContent) => {
  const withoutImports = mdxContent.replace(/^(import|export)\s.*$/gm, "");
  // strip MDX component tags (capitalized, possibly multiline attributes,
  // e.g. <FancyLink linkText="…" url="…"/>) before markdown parsing —
  // marked escapes them in some contexts so the HTML-tag strip below
  // wouldn't catch them
  const withoutComponents = withoutImports.replace(
    /<\/?[A-Z][a-zA-Z]*(\s[^<>]*?)?\/?>/gs,
    " ",
  );
  const html = marked.parse(withoutComponents);
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

// get data from markdown
const getData = (folder, groupDepth) => {
  const getPath = fs.readdirSync(folder);
  const removeIndex = getPath.filter((item) => !item.startsWith("-"));

  const getPaths = removeIndex.flatMap((filename) => {
    const filepath = path.join(folder, filename);
    const stats = fs.statSync(filepath);
    const isFolder = stats.isDirectory();

    if (isFolder) {
      return getData(filepath, groupDepth);
    } else if (filename.endsWith(".md") || filename.endsWith(".mdx")) {
      const file = fs.readFileSync(filepath, "utf-8");
      const { data, content } = matter(file);

      // skip drafts here — the slimmed frontmatter below no longer carries
      // the `draft` flag, so it can't be filtered later
      if (data.draft) return [];

      const pathParts = filepath.split(path.sep);
      const slug =
        data.slug ||
        pathParts
          .slice(CONTENT_DEPTH)
          .join("/")
          .replace(/\.[^/.]+$/, "");
      const group = pathParts[groupDepth];

      return {
        group: group,
        slug: slug,
        frontmatter: {
          title: data.title,
          description: data.description,
          image: data.image,
          category: data.category,
          tags: data.tags,
        },
        content: plainify(content).slice(0, MAX_CONTENT_LENGTH),
      };
    } else {
      return [];
    }
  });

  return getPaths;
};

try {
  // create folder if it doesn't exist
  if (!fs.existsSync(JSON_FOLDER)) {
    fs.mkdirSync(JSON_FOLDER);
  }

  // create json files
  fs.writeFileSync(
    `${JSON_FOLDER}/posts.json`,
    JSON.stringify(getData(BLOG_FOLDER, 2)),
  );

  // search.json is served from /public so it can be fetched lazily by the
  // SearchModal (only on first open) instead of bundled into the initial JS.
  const posts = require(`../${JSON_FOLDER}/posts.json`);
  const search = [...posts];
  fs.writeFileSync(`${PUBLIC_FOLDER}/search.json`, JSON.stringify(search));
} catch (err) {
  console.error(err);
}
