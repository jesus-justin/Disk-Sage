export type TabKey = "overview" | "large" | "duplicates" | "unused" | "temp";

export interface FileEntry {
  path: string;
  size: number;
  last_accessed: string;
  last_modified: string;
  file_type: string;
  is_hidden: boolean;
}

export interface DuplicateGroup {
  hash: string;
  files: FileEntry[];
  total_size: number;
}

export interface Recommendation {
  id: string;
  reason: string;
  confidence: number;
  total_size: number;
  files: FileEntry[];
}

export interface TempCategory {
  label: string;
  path: string;
  size_bytes: number;
}
