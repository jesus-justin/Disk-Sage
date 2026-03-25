/**
 * Input validation and sanitization utilities
 */

/**
 * Validates if a file path is absolute
 * @param path - The file path to validate
 * @returns Whether the path is absolute
 */
export const isAbsolutePath = (path: string): boolean => {
  // Windows: C:\ or Linux: /
  return /^[a-zA-Z]:[\\/]|^\//.test(path);
};

/**
 * Validates if a string is a valid file extension
 * @param extension - The extension to validate
 * @returns Whether the extension is valid
 */
export const isValidExtension = (extension: string): boolean => {
  return /^\.[\w]{1,10}$/.test(extension);
};

/**
 * Sanitizes a string by removing dangerous characters
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>:"|?*]/g, "") // Remove Windows invalid chars
    .replace(/[\x00-\x1F]/g, "") // Remove control characters
    .trim();
};

/**
 * Validates if a value is a positive integer
 * @param value - The value to check
 * @returns Whether the value is a positive integer
 */
export const isPositiveInteger = (value: unknown): value is number => {
  return Number.isInteger(value) && value > 0;
};

/**
 * Validates if a percentage value is within valid range (0-100)
 * @param value - The percentage value to validate
 * @returns Whether the value is a valid percentage
 */
export const isValidPercentage = (value: number): boolean => {
  return value >= 0 && value <= 100 && Number.isFinite(value);
};
