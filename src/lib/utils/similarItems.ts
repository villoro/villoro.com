import type { CollectionEntry } from "astro:content";

type BlogEntry = CollectionEntry<"blog">;

const timestamp = (item: BlogEntry): number =>
  item.data.date ? new Date(item.data.date).getTime() : 0;

// Score by shared category (+3) and shared tags (+1 each). Ties go to the newest post,
// so the output is deterministic.
const similarItems = (
  currentItem: BlogEntry,
  allItems: BlogEntry[],
  limit: number = 3,
): BlogEntry[] => {
  const category = currentItem.data.category;
  const tags: string[] = currentItem.data.tags ?? [];
  const currentKey = currentItem.data.slug || currentItem.id;

  const scoredItems: { item: BlogEntry; score: number }[] = [];

  allItems.forEach((item) => {
    if ((item.data.slug || item.id) === currentKey) return;

    const itemTags: string[] = item.data.tags ?? [];

    let score = 0;
    if (category && item.data.category === category) score += 3;
    score += tags.filter((tag) => itemTags.includes(tag)).length;

    if (score > 0) scoredItems.push({ item, score });
  });

  scoredItems.sort(
    (a, b) => b.score - a.score || timestamp(b.item) - timestamp(a.item),
  );

  return scoredItems.slice(0, limit).map((scored) => scored.item);
};

export default similarItems;
