/**
 * String manipulation and formatting utilities
 */

/**
 * Truncates a string to a maximum length and adds ellipsis
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
};

/**
 * Extracts the filename from a full path
 * @param path - Full file path
 * @returns Just the filename
 */
export const getFileName = (path: string): string => {
  return path.split(/[\\/]/).pop() || path;
};

/**
 * Extracts the directory from a full path
 * @param path - Full file path
 * @returns Directory path
 */
export const getDirName = (path: string): string => {
  return path.substring(0, path.lastIndexOf(/[\\/]/)) || path;
};

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts camelCase to space-separated words
 * @param str - The camelCase string
 * @returns Space-separated words
 */
export const camelCaseToWords = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
};

/**
 * Checks if a string is empty or contains only whitespace
 * @param str - The string to check
 * @returns Whether the string is considered empty
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Repeats a string multiple times
 * @param str - The string to repeat
 * @param count - How many times to repeat
 * @returns Repeated string
 */
export const repeatString = (str: string, count: number): string => {
  return Array(Math.max(0, count)).fill(str).join("");
};
