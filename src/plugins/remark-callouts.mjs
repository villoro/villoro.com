import { visit } from "unist-util-visit";

const TYPE_ALIASES = {
  summary: "abstract",
  tldr: "abstract",
  hint: "tip",
  important: "tip",
  check: "success",
  done: "success",
  help: "question",
  faq: "question",
  caution: "warning",
  attention: "warning",
  fail: "failure",
  missing: "failure",
  error: "danger",
  cite: "quote",
};

function remarkCallouts() {
  return (tree) => {
    visit(tree, "blockquote", (node, index, parent) => {
      if (!parent) return;

      const firstChild = node.children[0];
      if (!firstChild || firstChild.type !== "paragraph") return;

      const firstText = firstChild.children[0];
      if (!firstText || firstText.type !== "text") return;

      const match = firstText.value.match(/^\[!(\w+)\][^\n]*/i);
      if (!match) return;

      const rawType = match[1].toLowerCase();
      const type = TYPE_ALIASES[rawType] ?? rawType;

      // Strip [!TYPE] line from content; remaining text after the newline becomes content
      const remaining = firstText.value.slice(match[0].length).replace(/^\n/, "");

      let children;

      if (!remaining && firstChild.children.length === 1) {
        children = node.children.slice(1);
      } else if (!remaining) {
        children = [
          { ...firstChild, children: firstChild.children.slice(1) },
          ...node.children.slice(1),
        ];
      } else {
        children = [
          {
            ...firstChild,
            children: [
              { ...firstText, value: remaining },
              ...firstChild.children.slice(1),
            ],
          },
          ...node.children.slice(1),
        ];
      }

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "Notice",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "type",
            value: type,
          },
        ],
        children,
      };
    });
  };
}

export default remarkCallouts;
