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

// similar products
const similarItems = (currentItem: any, allItems: any[], limit: number = 3) => {
  let categories: string[] = [];

  // set categories
  if (currentItem.data.categories.length > 0) {
    categories = currentItem.data.categories;
  }

  // filter by categories
  const filterByCategories = allItems.filter((item: any) =>
    categories.find((category) => item.data.categories.includes(category)),
  );

  // filter by slug
  const filterBySlug = filterByCategories.filter(
    (product) => product.slug !== currentItem.slug,
  );

  // Get N random elements
  const randomResults = getRandomElements(filterBySlug, limit);

  return randomResults;
};

export default similarItems;
