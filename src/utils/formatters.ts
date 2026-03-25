/**
 * Formats a byte count into a human-readable string with appropriate units
 * @param bytes - The number of bytes to format
 * @returns Formatted string (e.g., "1.5 GB", "256 MB")
 */
export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`;
};

/**
 * Formats an ISO date string into a relative time description
 * @param isoDate - ISO format date string
 * @returns Relative time string (e.g., "today", "3 days ago")
 */
export const formatRelativeDays = (isoDate: string): string => {
  const input = new Date(isoDate).getTime();
  if (Number.isNaN(input)) return "Unknown";

  const days = Math.floor((Date.now() - input) / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};
