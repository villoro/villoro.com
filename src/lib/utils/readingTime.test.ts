import { describe, it, expect } from "vitest";
import readingTime, { readingTimeForPost } from "./readingTime";

describe("readingTime", () => {
  it("returns a zero-padded short read for little content", () => {
    expect(readingTime("just a few words here")).toBe("01 Min read");
  });

  it("uses the plural form for reads of two minutes or more", () => {
    const content = Array(700).fill("word").join(" ");
    expect(readingTime(content)).toMatch(/^0[2-9] Mins read$/);
  });

  it("drops the zero padding once past ten minutes", () => {
    const content = Array(3500).fill("word").join(" ");
    expect(readingTime(content)).toMatch(/^\d{2,} Mins read$/);
    expect(readingTime(content).startsWith("0")).toBe(false);
  });
});

describe("readingTimeForPost", () => {
  it("reads the body field of a post", () => {
    expect(readingTimeForPost({ body: "a short body" })).toBe("01 Min read");
  });

  it("falls back to an empty body when the field is missing", () => {
    expect(readingTimeForPost({})).toBe("00 Min read");
  });

  it("falls back to an empty body for nullish input", () => {
    expect(readingTimeForPost(null)).toBe("00 Min read");
  });
});
