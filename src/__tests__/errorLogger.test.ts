import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ErrorCategory,
  ErrorSeverity,
  errorLogger,
  safeExecute,
  withErrorLogging,
} from '../utils/errorLogger';

describe('errorLogger', () => {
  beforeEach(() => {
    errorLogger.clearLogs();
    localStorage.removeItem('critical-errors');
    vi.restoreAllMocks();
  });

  it('routes low/medium/high severities to the expected console methods', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    errorLogger.log(ErrorCategory.USER_ACTION, ErrorSeverity.LOW, 'low');
    errorLogger.log(ErrorCategory.USER_ACTION, ErrorSeverity.MEDIUM, 'medium');
    errorLogger.log(ErrorCategory.USER_ACTION, ErrorSeverity.HIGH, 'high');

    expect(logSpy).toHaveBeenCalledWith('[user_action] low', undefined);
    expect(warnSpy).toHaveBeenCalledWith('[user_action] medium', undefined);
    expect(errorSpy).toHaveBeenCalledWith('[user_action] high', undefined, undefined);
  });

  it('stores only the last 100 in-memory logs', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    for (let i = 0; i < 105; i += 1) {
      errorLogger.log(ErrorCategory.UNKNOWN, ErrorSeverity.LOW, `entry-${i}`);
    }

    const logs = errorLogger.getLogs();
    expect(logs).toHaveLength(100);
    expect(logs[0]?.message).toBe('entry-5');
    expect(logs.at(-1)?.message).toBe('entry-104');
  });

  it('stores critical errors in localStorage and caps persisted list to last 10', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    for (let i = 0; i < 12; i += 1) {
      errorLogger.log(
        ErrorCategory.RENDER,
        ErrorSeverity.CRITICAL,
        `critical-${i}`,
        new Error(`boom-${i}`)
      );
    }

    const stored = JSON.parse(localStorage.getItem('critical-errors') || '[]');
    expect(stored).toHaveLength(10);
    expect(stored[0]?.message).toBe('critical-2');
    expect(stored[9]?.message).toBe('critical-11');
  });

  it('handles localStorage monitoring failures gracefully', () => {
    vi.spyOn(JSON, 'parse').mockImplementationOnce(() => {
      throw new Error('parse fail');
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    errorLogger.log(ErrorCategory.STORAGE, ErrorSeverity.CRITICAL, 'cannot persist');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to store critical error',
      expect.any(Error)
    );
  });

  it('filters logs by category/severity and exports/clears logs', () => {
    errorLogger.log(ErrorCategory.DATA_LOAD, ErrorSeverity.HIGH, 'load-fail');
    errorLogger.log(ErrorCategory.VALIDATION, ErrorSeverity.MEDIUM, 'bad-input');

    expect(errorLogger.getLogsByCategory(ErrorCategory.DATA_LOAD)).toHaveLength(1);
    expect(errorLogger.getLogsBySeverity(ErrorSeverity.MEDIUM)).toHaveLength(1);

    const parsed = JSON.parse(errorLogger.exportLogs()) as Array<{ message: string }>;
    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.message).toBe('load-fail');

    errorLogger.clearLogs();
    expect(errorLogger.getLogs()).toHaveLength(0);
  });

  it('withErrorLogging returns wrapped success results', async () => {
    const fn = async (x: number) => x * 2;
    const wrapped = withErrorLogging(fn, ErrorCategory.NETWORK, { requestId: 'abc' });

    await expect(wrapped(4)).resolves.toBe(8);
  });

  it('withErrorLogging logs and rethrows failures with args/context', async () => {
    const err = new Error('explode');
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const fn = async (x: number) => {
      if (x > 0) throw err;
      return x;
    };
    const wrapped = withErrorLogging(fn, ErrorCategory.NETWORK, { requestId: 'xyz' });

    await expect(wrapped(1)).rejects.toThrow('explode');
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.NETWORK,
      ErrorSeverity.HIGH,
      'Error in fn',
      err,
      { requestId: 'xyz', args: [1] }
    );
  });

  it('safeExecute returns fallback and logs on failure', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    const success = safeExecute(() => 7, 99, ErrorCategory.VALIDATION);
    const fallback = safeExecute(() => {
      throw new Error('nope');
    }, 99, ErrorCategory.VALIDATION);

    expect(success).toBe(7);
    expect(fallback).toBe(99);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Safe execution caught error',
      expect.any(Error)
    );
  });
});
