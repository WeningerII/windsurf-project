/**
 * Error Logging and Monitoring Utilities
 *
 * Provides centralized error logging with categorization and context.
 * Integrates with Sentry for production error monitoring when VITE_SENTRY_DSN is set.
 */

import * as Sentry from '@sentry/browser';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  VALIDATION = 'validation',
  STORAGE = 'storage',
  DATA_LOAD = 'data_load',
  RENDER = 'render',
  USER_ACTION = 'user_action',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

export interface ErrorLog {
  timestamp: Date;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Error context requires flexible type
  context?: Record<string, any>;
  userAgent?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  log(
    category: ErrorCategory,
    severity: ErrorSeverity,
    message: string,
    error?: Error,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Error context requires flexible type
    context?: Record<string, any>
  ): void {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      category,
      severity,
      message,
      stack: error?.stack,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.logs.push(errorLog);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output based on severity (suppress LOW in production).
    // Outside DEV, log only the category and message: the raw `error` and
    // `context` objects can carry user content (documents, names, notes)
    // that must not be emitted to the production console.
    const isDev = import.meta.env.DEV;
    if (severity === ErrorSeverity.CRITICAL || severity === ErrorSeverity.HIGH) {
      if (isDev) {
        console.error(`[${category}] ${message}`, error, context);
      } else {
        console.error(`[${category}] ${message}`);
      }
    } else if (severity === ErrorSeverity.MEDIUM) {
      if (isDev) {
        console.warn(`[${category}] ${message}`, context);
      } else {
        console.warn(`[${category}] ${message}`);
      }
    } else if (isDev) {
      // eslint-disable-next-line no-console -- Intentional low-severity dev-only trace; gated on import.meta.env.DEV and tree-shaken from production builds.
      console.log(`[${category}] ${message}`, context);
    }

    // HIGH and CRITICAL both reach production monitoring: HIGH failures
    // (data loads, sync) were previously invisible outside the console.
    if (severity === ErrorSeverity.CRITICAL || severity === ErrorSeverity.HIGH) {
      this.sendToMonitoring(errorLog);
    }
  }

  private sendToMonitoring(errorLog: ErrorLog): void {
    if (Sentry.getClient()) {
      const error = errorLog.stack
        ? Object.assign(new Error(errorLog.message), { stack: errorLog.stack })
        : new Error(errorLog.message);
      Sentry.captureException(error, {
        tags: { category: errorLog.category, severity: errorLog.severity },
        extra: errorLog.context,
      });
      return;
    }

    // Fallback when Sentry is not configured (dev / CI) — reserved for
    // CRITICAL so the diagnostic bucket keeps its meaning now that HIGH is
    // also routed through monitoring.
    if (errorLog.severity !== ErrorSeverity.CRITICAL) {
      return;
    }

    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        const criticalErrors = JSON.parse(localStorage.getItem('critical-errors') || '[]');
        criticalErrors.push(errorLog);
        localStorage.setItem('critical-errors', JSON.stringify(criticalErrors.slice(-10)));
      }
    } catch (e) {
      console.error('Failed to store critical error', e);
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  getLogsByCategory(category: ErrorCategory): ErrorLog[] {
    return this.logs.filter((log) => log.category === category);
  }

  getLogsBySeverity(severity: ErrorSeverity): ErrorLog[] {
    return this.logs.filter((log) => log.severity === severity);
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const errorLogger = new ErrorLogger();

/**
 * Wrapper for async functions with error logging
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic async function wrapper requires flexible types
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  category: ErrorCategory,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Error context requires flexible type
  context?: Record<string, any>
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorLogger.log(
        category,
        ErrorSeverity.HIGH,
        `Error in ${fn.name || 'anonymous function'}`,
        error as Error,
        // Do not forward raw call arguments to monitoring: they can contain
        // character documents, names, and other user content (PII). Capture
        // only non-identifying metadata.
        { ...context, argCount: args.length }
      );
      throw error;
    }
  }) as T;
}

/**
 * Safe function execution with fallback
 */
export function safeExecute<T>(
  fn: () => T,
  fallback: T,
  category: ErrorCategory = ErrorCategory.UNKNOWN
): T {
  try {
    return fn();
  } catch (error) {
    errorLogger.log(category, ErrorSeverity.MEDIUM, 'Safe execution caught error', error as Error);
    return fallback;
  }
}
