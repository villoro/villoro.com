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

  // Limit to the specified number of elements
  const limitedResults = filterBySlug.slice(0, limit);

  return limitedResults;
};

export default similarItems;
