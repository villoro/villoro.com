import { format } from "date-fns";
import { ca, es } from 'date-fns/locale';

// MMM for short month format, MMMM for full month name
const dateFormat = (
  date: Date | string,
  pattern: string = "dd MMMM, yyyy",
): string => {
  const dateObj = new Date(date);
  const output = format(dateObj, pattern, {locale: ca});
  return output;
};

export default dateFormat;
