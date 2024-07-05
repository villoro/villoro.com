export const sortByDate = (array: any[]) => {
  return array.sort(
    (a: any, b: any) =>
      new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
  );
};

export const sortByWeight = (array: any[]) => {
  const withWeight = array.filter((item) => item.data.weight);
  const withoutWeight = array.filter((item) => !item.data.weight);
  const sortedWeightedArray = withWeight.sort(
    (a, b) => a.data.weight - b.data.weight
  );
  return [...new Set([...sortedWeightedArray, ...withoutWeight])];
};
