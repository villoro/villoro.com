import { describe, it, expect, vi, afterEach } from "vitest";
import similarItems from "./similarItems";

const makeItem = (
  id: string,
  category?: string,
  tags: string[] = []
) => ({ id, data: { category, tags } });

const ids = (items: { id: string }[]) => items.map((item) => item.id).sort();

afterEach(() => {
  vi.restoreAllMocks();
});

describe("similarItems", () => {
  it("excludes the current item from the results", () => {
    const current = makeItem("a", "aws", ["s3"]);
    const all = [current, makeItem("b", "aws", ["s3"])];

    const result = similarItems(current, all);

    expect(result.map((item) => item.id)).not.toContain("a");
  });

  it("ignores items that share neither category nor tags", () => {
    const current = makeItem("a", "aws", ["s3"]);
    const all = [current, makeItem("b", "gcp", ["bigquery"])];

    expect(similarItems(current, all)).toHaveLength(0);
  });

  it("matches items by shared category", () => {
    const current = makeItem("a", "aws", []);
    const all = [current, makeItem("b", "aws", []), makeItem("c", "gcp", [])];

    expect(ids(similarItems(current, all))).toEqual(["b"]);
  });

  it("matches items by shared tags", () => {
    const current = makeItem("a", "aws", ["s3", "glue"]);
    const all = [
      current,
      makeItem("b", "gcp", ["s3"]),
      makeItem("c", "gcp", ["glue", "s3"]),
    ];

    expect(ids(similarItems(current, all))).toEqual(["b", "c"]);
  });

  it("limits the number of results", () => {
    const current = makeItem("a", "aws", ["s3"]);
    const all = [
      current,
      makeItem("b", "aws", ["s3"]),
      makeItem("c", "aws", ["s3"]),
      makeItem("d", "aws", ["s3"]),
      makeItem("e", "aws", ["s3"]),
    ];

    expect(similarItems(current, all, 2)).toHaveLength(2);
  });

  it("prefers higher-scored items (category + tags beat tags alone)", () => {
    // Math.random -> 0 makes the post-selection shuffle a deterministic no-op.
    vi.spyOn(Math, "random").mockReturnValue(0);

    const current = makeItem("a", "aws", ["s3"]);
    const all = [
      current,
      makeItem("tagOnly", "gcp", ["s3"]), // score 1
      makeItem("categoryAndTag", "aws", ["s3"]), // score 4
    ];

    expect(similarItems(current, all, 1).map((item) => item.id)).toEqual([
      "categoryAndTag",
    ]);
  });
});
