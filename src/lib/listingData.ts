/**
 * listingData.ts — shared helpers for blog/category/tag listing pages.
 */
import { categoryMetadata } from "@/lib/categoryMetadata";
import config from "@/config/config.json";

export type CategoryItem = { key: string; name: string; count: number };

/**
 * Build the category ribbon data from ALL sorted posts.
 * Returns the total post count + ordered category list (with "All" first).
 */
export function getCategoryRibbonData(sortedPosts: any[]): {
  postCount: number;
  categories: CategoryItem[];
} {
  const postCount = sortedPosts.length;
  const counts: Record<string, number> = {};
  for (const post of sortedPosts) {
    const cat = post.data.category;
    if (cat) counts[cat] = (counts[cat] || 0) + 1;
  }
  const categories: CategoryItem[] = [
    { key: "all", name: "All", count: postCount },
    ...Object.entries(categoryMetadata)
      .filter(([key]) => counts[key])
      .map(([key, m]) => ({ key, name: m.name, count: counts[key]! })),
  ];
  return { postCount, categories };
}

/** Integer years elapsed since the site's writing_since date. */
export function getYearsWriting(): number {
  const d = new Date(config.settings.writing_since);
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}
