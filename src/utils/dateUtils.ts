/**
 * Date and time manipulation utilities
 */

/**
 * Adds days to a given date
 * @param date - The base date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Formats a date to ISO string
 * @param date - The date to format
 * @returns ISO format string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Checks if a date is in the past
 * @param date - The date to check
 * @returns Whether the date is before now
 */
export const isPast = (date: Date): boolean => {
  return date.getTime() < Date.now();
};

/**
 * Checks if a date is in the future
 * @param date - The date to check
 * @returns Whether the date is after now
 */
export const isFuture = (date: Date): boolean => {
  return date.getTime() > Date.now();
};

/**
 * Gets the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference (absolute value)
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs(date1.getTime() - date2.getTime()) / msPerDay);
};

/**
 * Checks if a date is today
 * @param date - The date to check
 * @returns Whether the date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Gets the start of day (midnight) for a given date
 * @param date - The date
 * @returns Date set to midnight
 */
export const getStartOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Gets the end of day (23:59:59.999) for a given date
 * @param date - The date
 * @returns Date set to end of day
 */
export const getEndOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};
