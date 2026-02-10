/**
 * Browser Compatibility Checks and Polyfills
 * 
 * Detects browser capabilities (localStorage, crypto, notifications, etc.)
 * and provides fallback implementations where needed. Essential for ensuring
 * the app works across different browsers and environments.
 * 
 * @module browserCompat
 */

import { errorLogger, ErrorCategory, ErrorSeverity } from './errorLogger';

export interface BrowserCapabilities {
  localStorage: boolean;
  crypto: boolean;
  storageEstimate: boolean;
  notifications: boolean;
  serviceWorker: boolean;
}

/**
 * Check which browser capabilities are available
 * 
 * Tests for localStorage, crypto API, storage estimate API, notifications,
 * and service workers. Logs errors when capabilities are missing.
 * 
 * @returns Object indicating which capabilities are available
 * 
 * @example
 * ```typescript
 * const caps = checkBrowserCapabilities();
 * if (!caps.localStorage) {
 *   console.warn('localStorage not available - data will not persist');
 * }
 * ```
 */
export function checkBrowserCapabilities(): BrowserCapabilities {
  const hasWindow = typeof window !== 'undefined';
  const hasNavigator = typeof navigator !== 'undefined';
  const capabilities: BrowserCapabilities = {
    localStorage: false,
    crypto: false,
    storageEstimate: false,
    notifications: false,
    serviceWorker: false,
  };

  // Check localStorage
  if (hasWindow && 'localStorage' in window) {
    try {
      const test = '__test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      capabilities.localStorage = true;
    } catch (e) {
      errorLogger.log(
        ErrorCategory.UNKNOWN,
        ErrorSeverity.HIGH,
        'localStorage not available',
        e as Error
      );
    }
  }

  // Check crypto API
  capabilities.crypto = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';

  // Check Storage Estimate API
  capabilities.storageEstimate =
    hasNavigator && 'storage' in navigator && 'estimate' in (navigator.storage || {});

  // Check Notifications API
  capabilities.notifications = hasWindow && 'Notification' in window;

  // Check Service Worker
  capabilities.serviceWorker = hasNavigator && 'serviceWorker' in navigator;

  return capabilities;
}

/**
 * Generate a UUID using browser crypto API with fallback
 * 
 * Attempts to use crypto.randomUUID() for cryptographically secure UUIDs.
 * Falls back to Math.random() if crypto API is unavailable (less secure but functional).
 * 
 * @returns A UUID v4 string (e.g., '550e8400-e29b-41d4-a716-446655440000')
 * 
 * @example
 * ```typescript
 * const id = generateUUID();
 * const character = { id, name: 'Gandalf', ... };
 * ```
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Check if browser is supported
 */
export function isBrowserSupported(): boolean {
  const capabilities = checkBrowserCapabilities();
  
  // Minimum requirements
  const required = capabilities.localStorage && capabilities.crypto;
  
  if (!required) {
    errorLogger.log(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.CRITICAL,
      'Browser does not meet minimum requirements',
      undefined,
      capabilities
    );
  }
  
  return required;
}

/**
 * Display browser compatibility warning
 */
export function showCompatibilityWarning(capabilities: BrowserCapabilities): void {
  const missing: string[] = [];
  
  if (!capabilities.localStorage) missing.push('localStorage');
  if (!capabilities.crypto) missing.push('crypto API');
  
  if (missing.length > 0) {
    const message = `Your browser does not support: ${missing.join(', ')}. The application may not function correctly.`;
    
    errorLogger.log(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.CRITICAL,
      'Browser compatibility issues detected',
      undefined,
      { missing, capabilities }
    );
    
    // Show user-facing warning
    if (typeof window !== 'undefined') {
      console.error(message);
      alert(message);
    }
  }
}

/**
 * Initialize browser compatibility checks
 */
export function initBrowserCompat(): void {
  const capabilities = checkBrowserCapabilities();
  
  if (!isBrowserSupported()) {
    showCompatibilityWarning(capabilities);
  } else {
    errorLogger.log(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.LOW,
      'Browser compatibility check passed',
      undefined,
      capabilities
    );
  }
}
