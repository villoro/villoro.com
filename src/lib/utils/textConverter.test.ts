import { describe, it, expect } from "vitest";
import {
  slugify,
  markdownify,
  humanize,
  titleify,
  plainify,
} from "./textConverter";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips punctuation", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });
});

describe("markdownify", () => {
  it("parses inline markdown without wrapping in a block element", () => {
    expect(markdownify("**bold**")).toBe("<strong>bold</strong>");
  });

  it("parses block markdown when div is true", () => {
    expect(markdownify("**bold**", true).trim()).toBe(
      "<p><strong>bold</strong></p>"
    );
  });
});

describe("humanize", () => {
  it("replaces underscores and hyphens with spaces and capitalizes", () => {
    expect(humanize("hello_world-foo")).toBe("Hello world foo");
  });

  it("trims surrounding whitespace and underscores", () => {
    expect(humanize("  _draft_  ")).toBe("Draft");
  });
});

describe("titleify", () => {
  it("capitalizes each word", () => {
    expect(titleify("hello_world-foo")).toBe("Hello World Foo");
  });
});

describe("plainify", () => {
  it("strips html tags from rendered markdown", () => {
    expect(plainify("**bold** text").trim()).toBe("bold text");
  });

  it("decodes html entities", () => {
    expect(plainify("Tom & Jerry").trim()).toBe("Tom & Jerry");
  });
});
