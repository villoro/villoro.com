/** Newest first. Returns a new array. */
export const sortByDate = <T extends { data: { date?: Date } }>(
  array: T[],
): T[] =>
  [...array].sort(
    (a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0),
  );
