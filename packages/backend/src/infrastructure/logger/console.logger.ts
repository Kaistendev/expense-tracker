import { ILogger } from "../../application/ports";

export class ConsoleLogger implements ILogger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  info(message: string, meta?: Record<string, unknown>): void {
    console.log(`[${this.formatTimestamp()}] INFO: ${message}`, meta ?? "");
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(`[${this.formatTimestamp()}] WARN: ${message}`, meta ?? "");
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    console.error(
      `[${this.formatTimestamp()}] ERROR: ${message}`,
      error?.stack ?? error ?? "",
      meta ?? ""
    );
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    console.debug(`[${this.formatTimestamp()}] DEBUG: ${message}`, meta ?? "");
  }
}
