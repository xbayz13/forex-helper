/**
 * ErrorLogger
 * Service for logging errors
 */

export interface ErrorLogEntry {
  timestamp: Date;
  level: "error" | "warning" | "critical";
  message: string;
  error?: Error;
  context?: Record<string, unknown>;
  userId?: string;
  requestId?: string;
}

export interface ErrorLogger {
  log(entry: ErrorLogEntry): Promise<void>;
  error(message: string, error?: Error, context?: Record<string, unknown>): Promise<void>;
  warning(message: string, context?: Record<string, unknown>): Promise<void>;
  critical(message: string, error?: Error, context?: Record<string, unknown>): Promise<void>;
}

export class ConsoleErrorLogger implements ErrorLogger {
  async log(entry: ErrorLogEntry): Promise<void> {
    const logMessage = {
      timestamp: entry.timestamp.toISOString(),
      level: entry.level,
      message: entry.message,
      error: entry.error
        ? {
            name: entry.error.name,
            message: entry.error.message,
            stack: entry.error.stack,
          }
        : undefined,
      context: entry.context,
      userId: entry.userId,
      requestId: entry.requestId,
    };

    if (entry.level === "critical" || entry.level === "error") {
      console.error(JSON.stringify(logMessage, null, 2));
    } else if (entry.level === "warning") {
      console.warn(JSON.stringify(logMessage, null, 2));
    }
  }

  async error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      timestamp: new Date(),
      level: "error",
      message,
      error,
      context,
    });
  }

  async warning(message: string, context?: Record<string, unknown>): Promise<void> {
    await this.log({
      timestamp: new Date(),
      level: "warning",
      message,
      context,
    });
  }

  async critical(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      timestamp: new Date(),
      level: "critical",
      message,
      error,
      context,
    });
  }
}

