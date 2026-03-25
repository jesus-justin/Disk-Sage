/**
 * File type detection and classification utilities
 */

/** Common document file extensions */
const DOCUMENT_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx", ".ppt", ".pptx"];

/** Common image file extensions */
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"];

/** Common media file extensions */
const MEDIA_EXTENSIONS = [".mp3", ".mp4", ".wav", ".flac", ".avi", ".mov", ".mkv"];

/** Common executable file extensions */
const EXECUTABLE_EXTENSIONS = [".exe", ".dll", ".bat", ".cmd", ".sh", ".com", ".msi"];

/**
 * Detects the category of a file based on its extension
 * @param filePath - The full file path or extension
 * @returns File category (document, image, media, executable, or unknown)
 */
export const detectFileCategory = (filePath: string): string => {
  const ext = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();

  if (DOCUMENT_EXTENSIONS.includes(ext)) return "document";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (MEDIA_EXTENSIONS.includes(ext)) return "media";
  if (EXECUTABLE_EXTENSIONS.includes(ext)) return "executable";
  return "unknown";
};

/**
 * Determines if a file is likely safe to delete
 * @param fileType - The detected file type
 * @returns Whether the file type is safe to delete
 */
export const isSafeToDelete = (fileType: string): boolean => {
  const unsafeTypes = ["executable", "unknown"];
  return !unsafeTypes.includes(fileType);
};
