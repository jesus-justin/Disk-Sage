/**
 * Error handling and debugging utilities
 */

/** Log levels supported by the application */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Logs a message with the specified level
 * @param level - The log level
 * @param message - The message to log
 * @param data - Optional contextual data
 */
export const log = (level: LogLevel, message: string, data?: unknown): void => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level}: ${message}`;

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(logEntry, data);
      break;
    case LogLevel.INFO:
      console.info(logEntry, data);
      break;
    case LogLevel.WARN:
      console.warn(logEntry, data);
      break;
    case LogLevel.ERROR:
      console.error(logEntry, data);
      break;
  }
};

/**
 * Creates a user-friendly error message from an error object
 * @param error - The error to format
 * @returns A user-friendly error message
 */
export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

/**
 * Wraps async operations with error handling
 * @param fn - The async function to execute
 * @param errorMessage - Optional custom error message
 * @returns Promise that resolves to result or error
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const message = errorMessage || formatError(error);
    log(LogLevel.ERROR, message, error);
    return { success: false, error: message };
  }
};
