import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkBrowserCapabilities,
  generateUUID,
  initBrowserCompat,
  isBrowserSupported,
  showCompatibilityWarning,
  type BrowserCapabilities,
} from '../utils/browserCompat';
import { errorLogger, ErrorCategory, ErrorSeverity } from '../utils/errorLogger';

describe('browserCompat', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('reports available capabilities', () => {
    const caps = checkBrowserCapabilities();

    expect(caps).toHaveProperty('localStorage');
    expect(caps).toHaveProperty('crypto');
    expect(caps).toHaveProperty('notifications');
    expect(caps).toHaveProperty('serviceWorker');
  });

  it('uses crypto.randomUUID when available', () => {
    const originalRandomUUID = crypto.randomUUID;
    const randomUUIDMock = vi.fn(() => 'uuid-from-crypto');

    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: randomUUIDMock,
    });

    expect(generateUUID()).toBe('uuid-from-crypto');
    expect(randomUUIDMock).toHaveBeenCalledTimes(1);

    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: originalRandomUUID,
    });
  });

  it('falls back to Math.random UUID generation when crypto.randomUUID is unavailable', () => {
    const originalCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: undefined,
    });

    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.1234);
    const uuid = generateUUID();

    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(randomSpy).toHaveBeenCalled();

    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: originalCrypto,
    });
  });

  it('logs critical issue when required capabilities are missing', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const originalCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: undefined,
    });

    const supported = isBrowserSupported();

    expect(supported).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.CRITICAL,
      'Browser does not meet minimum requirements',
      undefined,
      expect.objectContaining({ crypto: false })
    );

    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: originalCrypto,
    });
  });

  it('shows warning and alerts when required capabilities are missing', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    const caps: BrowserCapabilities = {
      localStorage: false,
      crypto: false,
      storageEstimate: true,
      notifications: true,
      serviceWorker: true,
    };

    showCompatibilityWarning(caps);

    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.CRITICAL,
      'Browser compatibility issues detected',
      undefined,
      expect.objectContaining({ missing: ['localStorage', 'crypto API'] })
    );
    // User-facing warning is now routed through errorLogger instead of raw console.error + alert
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.CRITICAL,
      expect.stringContaining('Your browser does not support')
    );
  });

  it('logs successful compatibility check in initBrowserCompat', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    initBrowserCompat();

    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.LOW,
      'Browser compatibility check passed',
      undefined,
      expect.any(Object)
    );
  });
});
