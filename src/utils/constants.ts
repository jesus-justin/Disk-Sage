/**
 * Application-wide constants
 */

/** Size thresholds for file categorization (in bytes) */
export const FILE_SIZE_THRESHOLDS = {
  SMALL: 1024 * 100, // 100 KB
  MEDIUM: 1024 * 1024, // 1 MB
  LARGE: 1024 * 1024 * 100, // 100 MB
};

/** Common UI timeouts (in milliseconds) */
export const TIMEOUTS = {
  QUICK_FEEDBACK: 300,
  STANDARD_ANIMATION: 500,
  SCAN_DEBOUNCE: 1000,
};

/** Default pagination sizes */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 1000,
};

/** Confidence score thresholds */
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.8,
  MEDIUM: 0.5,
  LOW: 0.3,
};
