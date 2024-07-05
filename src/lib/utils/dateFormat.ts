import { format } from "date-fns";

// MMM for short month format, MMMM for full month name
const dateFormat = (
  date: Date | string,
  pattern: string = "yyyy-MM-dd"
): string => {
  const dateObj = new Date(date);
  return format(dateObj, pattern);
};

export default dateFormat;
