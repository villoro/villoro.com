import { marked } from "marked";

// Convert MDX to plain text at build time, so the search index holds text and
// the browser never has to parse markdown.
export const plainifyMdx = (mdxContent: string): string => {
  const withoutImports = mdxContent.replace(/^(import|export)\s.*$/gm, "");
  // strip MDX component tags (capitalized, possibly multiline attributes,
  // e.g. <FancyLink linkText="…" url="…"/>) before markdown parsing —
  // marked escapes them in some contexts so the HTML-tag strip below
  // wouldn't catch them
  const withoutComponents = withoutImports.replace(
    /<\/?[A-Z][a-zA-Z]*(\s[^<>]*?)?\/?>/gs,
    " ",
  );
  // callout markers ("> [!abstract] Optional title") are syntax, not text
  const withoutCallouts = withoutComponents.replace(
    /^(\s*>\s*)\[![a-zA-Z]+\]/gm,
    "$1",
  );
  const html = marked.parse(withoutCallouts) as string;
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
