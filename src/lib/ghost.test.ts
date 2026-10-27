import { describe, expect, it } from "vitest";

import { formatDate, normaliseTags, parseGhostPosts } from "./ghost";

describe("formatDate", () => {
  it("formats a published date", () => {
    expect(formatDate("2026-08-29T12:00:00.000Z")).toBe("Aug 29, 2026");
  });

  it("returns empty text for missing or bad input", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("normaliseTags", () => {
  it("accepts strings, tag objects and slugs", () => {
    expect(
      normaliseTags(["Network", { name: "Tutorial" }, { slug: "ops" }, {}]),
    ).toEqual(["Network", "Tutorial", "ops"]);
  });

  it("returns an empty list for non-arrays", () => {
    expect(normaliseTags(undefined)).toEqual([]);
    expect(normaliseTags(null as unknown as [])).toEqual([]);
  });
});

describe("parseGhostPosts", () => {
  it("keeps valid posts, drops junk and sorts newest first", () => {
    const posts = parseGhostPosts({
      posts: [
        {
          title: "Older",
          url: "https://blog.example/1",
          published_at: "2025-01-01T12:00:00.000Z",
          excerpt: "old",
        },
        {
          title: "Newer",
          url: "https://blog.example/2",
          published_at: "2026-01-01T12:00:00.000Z",
          tags: [{ name: "Network" }],
        },
        { title: "Missing url" },
        { url: "https://blog.example/3" },
      ],
    });

    expect(posts.map((post) => post.title)).toEqual(["Newer", "Older"]);
    expect(posts[0].tags).toEqual(["Network"]);
    expect(posts[1].description).toBe("old");
  });

  it("returns an empty list when Ghost sends nothing usable", () => {
    expect(parseGhostPosts(null)).toEqual([]);
    expect(parseGhostPosts({ posts: "nope" })).toEqual([]);
    expect(parseGhostPosts({})).toEqual([]);
  });
});
