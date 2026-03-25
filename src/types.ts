/** Represents the available navigation tabs in the application */
export type TabKey = "overview" | "large" | "duplicates" | "unused" | "temp";

/** Represents a file entry with metadata */
export interface FileEntry {
  path: string;
  size: number;
  last_accessed: string;
  last_modified: string;
  file_type: string;
  is_hidden: boolean;
}

/** Represents a group of duplicate files with the same hash */
export interface DuplicateGroup {
  hash: string;
  files: FileEntry[];
  total_size: number;
}

/** Represents a cleanup recommendation */
export interface Recommendation {
  id: string;
  reason: string;
  confidence: number;
  total_size: number;
  files: FileEntry[];
}

/** Represents a temporary file category */
export interface TempCategory {
  label: string;
  path: string;
  size_bytes: number;
}
