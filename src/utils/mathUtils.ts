/**
 * Mathematical calculation and number utilities
 */

/**
 * Rounds a number to a specific number of decimal places
 * @param num - The number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export const roundTo = (num: number, decimals: number): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Clamps a number between min and max bounds
 * @param num - The number to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped number
 */
export const clamp = (num: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, num));
};

/**
 * Calculates a percentage
 * @param part - The part value
 * @param total - The total value
 * @returns Percentage (0-100)
 */
export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return roundTo((part / total) * 100, 2);
};

/**
 * Checks if a number is within a range (inclusive)
 * @param num - The number to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Whether the number is in range
 */
export const inRange = (num: number, min: number, max: number): boolean => {
  return num >= min && num <= max;
};

/**
 * Calculates the average of an array of numbers
 * @param numbers - Array of numbers
 * @returns Average value
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

/**
 * Finds the minimum value in an array
 * @param numbers - Array of numbers
 * @returns Minimum value or Infinity if empty
 */
export const min = (numbers: number[]): number => {
  return Math.min(...numbers);
};

/**
 * Finds the maximum value in an array
 * @param numbers - Array of numbers
 * @returns Maximum value or -Infinity if empty
 */
export const max = (numbers: number[]): number => {
  return Math.max(...numbers);
};

/**
 * Sums all values in an array of numbers
 * @param numbers - Array of numbers
 * @returns Sum of all numbers
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((total, num) => total + num, 0);
};

/**
 * Calculates the standard deviation of numbers
 * @param numbers - Array of numbers
 * @returns Standard deviation
 */
export const standardDeviation = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const avg = average(numbers);
  const variance =
    numbers.reduce((sum, num) => sum + Math.pow(num - avg, 2), 0) /
    numbers.length;
  return Math.sqrt(variance);
};
