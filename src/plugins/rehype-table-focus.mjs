// Make every Markdown table reachable with the keyboard.
//
// prose.css makes tables their own horizontal scroll container
// (`display: block; overflow-x: auto`), so on a phone most of them scroll.
// A scroll container that can't take focus can't be scrolled with the
// arrow keys (axe: `scrollable-region-focusable`). `tabindex="0"` fixes it
// in the static HTML, with no client JS.
function addTabindex(node) {
  if (node.type === "element" && node.tagName === "table") {
    node.properties = { ...node.properties, tabIndex: 0 };
  }
  node.children?.forEach(addTabindex);
}

export default function rehypeTableFocus() {
  return addTabindex;
}
