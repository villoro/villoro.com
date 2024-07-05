// Fisher-Yates shuffle algorithm to get N random elements from an array
function getRandomElements<T>(arr: T[], n: number): T[] {
  const shuffled = arr.slice(); // Create a shallow copy of the array
  let currentIndex = shuffled.length;
  let temporaryValue: T;
  let randomIndex: number;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Swap it with the current element
    temporaryValue = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }

  // Return the first n elements after shuffling
  return shuffled.slice(0, n);
}

// similar items
const similarItems = (currentItem: any, allItems: any[], limit: number = 3) => {
  let categories: string[] = [];
  let tags: string[] = [];

  // Set categories
  if (currentItem.data.category) {
    categories = [currentItem.data.category];
  }

  // Set tags
  if (currentItem.data.tags && currentItem.data.tags.length > 0) {
    tags = currentItem.data.tags;
  }

  // Create an array of items with scores
  let scoredItems: { item: any, score: number }[] = [];

  allItems.forEach((item: any) => {
    if (item.slug === currentItem.slug) return;

    const itemCategories = item.data.category ? [item.data.category] : [];
    const itemTags = item.data.tags ? item.data.tags : [];

    let score = 0;

    // Calculate score based on matching criteria
    if (categories.some((category) => itemCategories.includes(category))) {
      score += 3; // Category match counts as 3
    }

    score += tags.filter((tag) => itemTags.includes(tag)).length; // Each tag match counts as 1

    if (score > 0) {
      scoredItems.push({ item, score });
    }
  });

  // Sort items by score in descending order
  scoredItems.sort((a, b) => b.score - a.score);

  // Select top N unique items after sorting
  const uniqueItems = scoredItems.slice(0, limit).map(scoredItem => scoredItem.item);

  // Shuffle the selected items
  const randomResults = getRandomElements(uniqueItems, limit);

  return randomResults;
};

export default similarItems;
