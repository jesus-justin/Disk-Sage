/**
 * Array and collection manipulation utilities
 */

/**
 * Removes duplicates from an array while preserving order
 * @param array - The array to deduplicate
 * @param key - Optional key function for object arrays
 * @returns Array with duplicates removed
 */
export const removeDuplicates = <T>(
  array: T[],
  key?: (item: T) => unknown
): T[] => {
  const seen = new Set<unknown>();
  return array.filter((item) => {
    const identifier = key ? key(item) : item;
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
};

/**
 * Chunks an array into smaller arrays of specified size
 * @param array - The array to chunk
 * @param size - The size of each chunk
 * @returns Array of chunks
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Groups array elements by a key function
 * @param array - The array to group
 * @param key - Function that determines the grouping key
 * @returns Object with grouped elements
 */
export const groupBy = <T, K extends string | number>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce(
    (acc, item) => {
      const groupKey = key(item);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
};

/**
 * Flattens a nested array structure
 * @param array - The nested array to flatten
 * @param depth - How deep to flatten (default: infinite)
 * @returns Flattened array
 */
export const flatten = <T>(array: any[], depth: number = Infinity): T[] => {
  if (depth <= 0) return array;
  return array.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
};
