import { format } from "date-fns";
import { en } from 'date-fns/locale';

// MMM for short month format, MMMM for full month name
const dateFormat = (
  date: Date | string,
  pattern: string = "yyyy-MM-dd",
): string => {
  const dateObj = new Date(date);
  const output = format(dateObj, pattern, {locale: en});
  return output;
};

export default dateFormat;
