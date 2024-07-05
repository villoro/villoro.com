// Fisher-Yates shuffle algorithm to get N random elements from an array
function getRandomElements<T>(arr: T[], n: number): T[] {
  const shuffled = arr.slice();
  let currentIndex = shuffled.length;
  let temporaryValue: T;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }

  return shuffled.slice(0, n);
}

const similarItems = (
  currentItem: any,
  allItems: any[],
  limit: number = 3
) => {
  let categories: string[] = [];
  let tags: string[] = [];

  if (currentItem.data.category) {
    categories = [currentItem.data.category];
  }

  if (currentItem.data.tags && currentItem.data.tags.length > 0) {
    tags = currentItem.data.tags;
  }

  let scoredItems: { item: any; score: number }[] = [];

  allItems.forEach((item: any) => {
    if (item.slug === currentItem.slug) return;

    const itemCategories = item.data.category ? [item.data.category] : [];
    const itemTags = item.data.tags ? item.data.tags : [];

    let score = 0;

    if (categories.some((category) => itemCategories.includes(category))) {
      score += 3;
    }

    score += tags.filter((tag) => itemTags.includes(tag)).length;

    if (score > 0) {
      scoredItems.push({ item, score });
    }
  });

  scoredItems.sort((a, b) => b.score - a.score);

  const uniqueItems = scoredItems.slice(0, limit).map((scoredItem) => scoredItem.item);

  const randomResults = getRandomElements(uniqueItems, limit);

  return randomResults;
};

export default similarItems;
