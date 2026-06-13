import { describe, it, expect, beforeEach } from 'vitest';
import {
  guardSync,
  safeExecute,
  errorLogger,
  ErrorCategory,
  ErrorSeverity,
} from '../../utils/errorLogger';

beforeEach(() => {
  errorLogger.clearLogs();
});

describe('guardSync', () => {
  it('returns the operation result when it succeeds, logging nothing', () => {
    const result = guardSync(() => 21 * 2, {
      fallback: -1,
      category: ErrorCategory.USER_ACTION,
      message: 'should not log',
    });
    expect(result).toBe(42);
    expect(errorLogger.getLogs()).toHaveLength(0);
  });

  it('returns the fallback and never throws when the operation throws', () => {
    const result = guardSync(
      (): number => {
        throw new Error('engine blew up');
      },
      { fallback: -1, category: ErrorCategory.USER_ACTION, message: 'combat failed' }
    );
    expect(result).toBe(-1);
  });

  it('records the failure at HIGH severity (reaches monitoring) with context', () => {
    guardSync(
      () => {
        throw new Error('malformed token');
      },
      {
        fallback: undefined,
        category: ErrorCategory.USER_ACTION,
        message: 'Combat attack resolution failed',
        context: { systemId: 'pf2e', attackerId: 'a1' },
      }
    );
    const logs = errorLogger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].severity).toBe(ErrorSeverity.HIGH);
    expect(logs[0].category).toBe(ErrorCategory.USER_ACTION);
    expect(logs[0].message).toBe('Combat attack resolution failed');
    expect(logs[0].context).toEqual({ systemId: 'pf2e', attackerId: 'a1' });
    // The original stack is preserved for monitoring.
    expect(logs[0].stack).toContain('malformed token');
  });

  it('preserves the engine outcome type through the union with the fallback', () => {
    // Mirrors the SceneManager usage: fn returns an object, fallback is undefined.
    const ok = guardSync(() => ({ hit: true }) as { hit: boolean } | undefined, {
      fallback: undefined,
      category: ErrorCategory.USER_ACTION,
      message: 'x',
    });
    expect(ok?.hit).toBe(true);
  });
});

describe('safeExecute remains a distinct lower-severity guard', () => {
  it('logs at MEDIUM (does not escalate to monitoring) and returns fallback', () => {
    const out = safeExecute(
      (): number => {
        throw new Error('minor');
      },
      0,
      ErrorCategory.UNKNOWN
    );
    expect(out).toBe(0);
    expect(errorLogger.getLogs()[0].severity).toBe(ErrorSeverity.MEDIUM);
  });
});
