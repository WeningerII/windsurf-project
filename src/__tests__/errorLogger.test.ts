import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Sentry from '@sentry/browser';
import {
  ErrorCategory,
  ErrorSeverity,
  errorLogger,
  safeExecute,
  withErrorLogging,
} from '../utils/errorLogger';

// Default to "Sentry not configured" so the localStorage fallback paths run;
// individual tests flip getClient to a truthy client to exercise capture.
vi.mock('@sentry/browser', () => ({
  getClient: vi.fn(() => undefined),
  captureException: vi.fn(),
}));

describe('errorLogger', () => {
  beforeEach(() => {
    errorLogger.clearLogs();
    localStorage.removeItem('critical-errors');
    vi.restoreAllMocks();
    // mockReset restores the factory implementations above (getClient →
    // undefined) so a test that stubs a Sentry client cannot leak it.
    vi.mocked(Sentry.getClient).mockReset();
    vi.mocked(Sentry.captureException).mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
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

  it('logs only category + message outside DEV (no raw error/context objects)', () => {
    vi.stubEnv('DEV', false);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const context = { document: { name: 'Secret PC', notes: 'private' } };

    errorLogger.log(ErrorCategory.STORAGE, ErrorSeverity.HIGH, 'high', new Error('x'), context);
    errorLogger.log(ErrorCategory.STORAGE, ErrorSeverity.CRITICAL, 'crit', new Error('y'), context);
    errorLogger.log(ErrorCategory.STORAGE, ErrorSeverity.MEDIUM, 'medium', undefined, context);
    errorLogger.log(ErrorCategory.STORAGE, ErrorSeverity.LOW, 'low', undefined, context);

    expect(errorSpy).toHaveBeenCalledWith('[storage] high');
    expect(errorSpy).toHaveBeenCalledWith('[storage] crit');
    expect(warnSpy).toHaveBeenCalledWith('[storage] medium');
    // LOW stays suppressed entirely outside DEV.
    expect(logSpy).not.toHaveBeenCalled();
    // No console call anywhere received the context payload.
    for (const spy of [errorSpy, warnSpy, logSpy]) {
      for (const call of spy.mock.calls) {
        expect(call).not.toContain(context);
      }
    }
  });

  it('sends HIGH and CRITICAL (but not MEDIUM/LOW) to Sentry when configured', () => {
    vi.mocked(Sentry.getClient).mockReturnValue({} as ReturnType<typeof Sentry.getClient>);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    errorLogger.log(ErrorCategory.DATA_LOAD, ErrorSeverity.HIGH, 'load failed', new Error('boom'), {
      requestId: 'r1',
    });
    errorLogger.log(ErrorCategory.RENDER, ErrorSeverity.CRITICAL, 'render dead');
    errorLogger.log(ErrorCategory.VALIDATION, ErrorSeverity.MEDIUM, 'meh');
    errorLogger.log(ErrorCategory.USER_ACTION, ErrorSeverity.LOW, 'noise');

    expect(Sentry.captureException).toHaveBeenCalledTimes(2);
    expect(Sentry.captureException).toHaveBeenNthCalledWith(1, expect.any(Error), {
      tags: { category: ErrorCategory.DATA_LOAD, severity: ErrorSeverity.HIGH },
      extra: { requestId: 'r1' },
    });
    expect(Sentry.captureException).toHaveBeenNthCalledWith(2, expect.any(Error), {
      tags: { category: ErrorCategory.RENDER, severity: ErrorSeverity.CRITICAL },
      extra: undefined,
    });
    // With Sentry active the localStorage fallback must stay untouched.
    expect(localStorage.getItem('critical-errors')).toBeNull();
  });

  it('keeps the localStorage fallback reserved for CRITICAL when Sentry is absent', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    errorLogger.log(ErrorCategory.DATA_LOAD, ErrorSeverity.HIGH, 'high only');
    expect(localStorage.getItem('critical-errors')).toBeNull();

    errorLogger.log(ErrorCategory.RENDER, ErrorSeverity.CRITICAL, 'crit');
    const stored = JSON.parse(localStorage.getItem('critical-errors') || '[]') as Array<{
      message: string;
    }>;
    expect(stored).toHaveLength(1);
    expect(stored[0]?.message).toBe('crit');
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

  it('withErrorLogging logs and rethrows failures with arg metadata, not raw args', async () => {
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
      { requestId: 'xyz', argCount: 1 }
    );
  });

  it('safeExecute returns fallback and logs on failure', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    const success = safeExecute(() => 7, 99, ErrorCategory.VALIDATION);
    const fallback = safeExecute(
      () => {
        throw new Error('nope');
      },
      99,
      ErrorCategory.VALIDATION
    );

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
