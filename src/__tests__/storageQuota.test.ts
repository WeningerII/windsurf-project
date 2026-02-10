import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearUnusedData,
  getStorageInfo,
  hasStorageSpace,
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
} from '../utils/storageQuota';
import { errorLogger, ErrorCategory, ErrorSeverity } from '../utils/errorLogger';

const originalNavigatorStorage = navigator.storage;
const originalLocalStorage = globalThis.localStorage;

function replaceLocalStorage(storage: Storage) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: storage,
  });
}

describe('storageQuota', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    replaceLocalStorage(originalLocalStorage);
    localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: originalNavigatorStorage,
    });
    replaceLocalStorage(originalLocalStorage);
  });

  it('reads storage information from navigator.storage.estimate', async () => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        estimate: vi.fn().mockResolvedValue({ usage: 200, quota: 1000 }),
      },
    });

    const info = await getStorageInfo();

    expect(info).toMatchObject({
      used: 200,
      quota: 1000,
      percentUsed: 20,
      available: 800,
    });
  });

  it('falls back to localStorage size estimate when storage API is unavailable', async () => {
    localStorage.setItem('a', '12345');
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {},
    });

    const info = await getStorageInfo();

    expect(info).not.toBeNull();
    expect(info?.quota).toBe(5 * 1024 * 1024);
    expect(info?.used).toBeGreaterThan(0);
    expect(info?.available).toBeLessThan(info?.quota as number);
  });

  it('checks whether required storage is available', async () => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        estimate: vi.fn().mockResolvedValue({ usage: 100, quota: 500 }),
      },
    });

    await expect(hasStorageSpace(350)).resolves.toBe(true);
    await expect(hasStorageSpace(450)).resolves.toBe(false);
  });

  it('returns true on successful safeSetItem', () => {
    expect(safeSetItem('test-key', 'value')).toBe(true);
    expect(localStorage.getItem('test-key')).toBe('value');
  });

  it('attempts recovery when quota is exceeded', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const quotaError = new DOMException('quota exceeded', 'QuotaExceededError');
    const mockStorage = {
      setItem: vi
        .fn()
        .mockImplementationOnce(() => {
          throw quotaError;
        })
        .mockImplementationOnce(() => undefined),
      getItem: vi.fn(() => null),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(() => null),
      length: 0,
    } as unknown as Storage;

    replaceLocalStorage(mockStorage);

    const result = safeSetItem('hero', 'payload');

    expect(result).toBe(true);
    expect(mockStorage.setItem).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.STORAGE,
      ErrorSeverity.LOW,
      'Storage recovery successful'
    );
  });

  it('returns false if quota recovery also fails', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const quotaError = new DOMException('quota exceeded', 'QuotaExceededError');
    const mockStorage = {
      setItem: vi.fn(() => {
        throw quotaError;
      }),
      getItem: vi.fn(() => null),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(() => null),
      length: 0,
    } as unknown as Storage;

    replaceLocalStorage(mockStorage);

    const result = safeSetItem('hero', 'payload');

    expect(result).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.STORAGE,
      ErrorSeverity.CRITICAL,
      'Storage recovery failed',
      expect.any(Error)
    );
  });

  it('returns fallback when safeGetItem fails', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const mockStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(() => {
        throw new Error('read failure');
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(() => null),
      length: 0,
    } as unknown as Storage;

    replaceLocalStorage(mockStorage);

    const value = safeGetItem('missing', 'fallback-value');

    expect(value).toBe('fallback-value');
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.STORAGE,
      ErrorSeverity.MEDIUM,
      'Failed to get localStorage item',
      expect.any(Error),
      { key: 'missing' }
    );
  });

  it('returns false when safeRemoveItem fails', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const mockStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(() => null),
      removeItem: vi.fn(() => {
        throw new Error('remove failure');
      }),
      clear: vi.fn(),
      key: vi.fn(() => null),
      length: 0,
    } as unknown as Storage;

    replaceLocalStorage(mockStorage);

    const result = safeRemoveItem('target');

    expect(result).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.STORAGE,
      ErrorSeverity.MEDIUM,
      'Failed to remove localStorage item',
      expect.any(Error),
      { key: 'target' }
    );
  });

  it('clears known unused data and reports freed bytes', async () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    localStorage.setItem('critical-errors', '0123456789');

    const freedBytes = await clearUnusedData();

    expect(freedBytes).toBe(20);
    expect(localStorage.getItem('critical-errors')).toBeNull();
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.STORAGE,
      ErrorSeverity.LOW,
      'Cleared 20 bytes of unused data'
    );
  });

  it('logs and returns null when getStorageInfo throws', async () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        estimate: vi.fn().mockRejectedValue(new Error('estimate failed')),
      },
    });

    const info = await getStorageInfo();

    expect(info).toBeNull();
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.STORAGE,
      ErrorSeverity.MEDIUM,
      'Failed to get storage info',
      expect.any(Error)
    );
  });
});
