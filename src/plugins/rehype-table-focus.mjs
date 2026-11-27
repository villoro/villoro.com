// Make every Markdown table usable without a mouse or a screen.
//
// prose.css makes tables their own horizontal scroll container
// (`display: block; overflow-x: auto`), so on a phone most of them scroll.
// Done in the static HTML, with no client JS:
// - `tabindex="0"`: a scroll container that can't take focus can't be scrolled
//   with the arrow keys (axe: `scrollable-region-focusable`).
// - `aria-label`: a focusable box needs a name. It is the heading the table
//   sits under ("Table: Results"), numbered when one heading has several.
// - `scope="col"` on the header cells, so a screen reader announces the
//   column a cell belongs to.
// The fade that hints at more content off-screen is TableScrollHint.astro.

const textOf = (node) =>
  node.type === "text"
    ? node.value
    : (node.children ?? []).map(textOf).join("");

export default function rehypeTableFocus() {
  return (tree) => {
    let heading = "";
    const perHeading = new Map();

    const visit = (node) => {
      if (node.type !== "element") {
        node.children?.forEach(visit);
        return;
      }
      if (/^h[1-6]$/.test(node.tagName)) {
        heading = textOf(node).trim();
      } else if (node.tagName === "table") {
        const n = (perHeading.get(heading) ?? 0) + 1;
        perHeading.set(heading, n);
        const base = heading ? `Table: ${heading}` : "Table";
        node.properties = {
          ...node.properties,
          tabIndex: 0,
          ariaLabel: n > 1 ? `${base} (${n})` : base,
        };
      } else if (node.tagName === "th" && !node.properties?.scope) {
        node.properties = { ...node.properties, scope: "col" };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
