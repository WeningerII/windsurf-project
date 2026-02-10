/**
 * Storage Quota Management and Recovery
 * 
 * Handles localStorage quota limits and provides recovery strategies
 */

import { errorLogger, ErrorCategory, ErrorSeverity } from './errorLogger';

export interface StorageInfo {
  used: number;
  quota: number;
  percentUsed: number;
  available: number;
}

export class StorageQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

/**
 * Get storage quota information
 */
export async function getStorageInfo(): Promise<StorageInfo | null> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage ?? 0;
      const quota = estimate.quota ?? 0;
      
      return {
        used,
        quota,
        percentUsed: quota > 0 ? (used / quota) * 100 : 0,
        available: quota - used,
      };
    }
    
    // Fallback for browsers without Storage API
    return estimateLocalStorageSize();
  } catch (error) {
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.MEDIUM,
      'Failed to get storage info',
      error as Error
    );
    return null;
  }
}

/**
 * Estimate localStorage size (fallback method)
 */
function estimateLocalStorageSize(): StorageInfo {
  let totalSize = 0;
  
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }
  
  // Assume 5MB quota for localStorage (common limit)
  const quota = 5 * 1024 * 1024;
  const used = totalSize * 2; // UTF-16 encoding
  
  return {
    used,
    quota,
    percentUsed: (used / quota) * 100,
    available: quota - used,
  };
}

/**
 * Check if storage has sufficient space
 */
export async function hasStorageSpace(requiredBytes: number): Promise<boolean> {
  const info = await getStorageInfo();
  if (!info) return true; // Assume space available if can't check
  
  return info.available >= requiredBytes;
}

/**
 * Safe localStorage setItem with quota handling
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      errorLogger.log(
        ErrorCategory.STORAGE,
        ErrorSeverity.HIGH,
        'Storage quota exceeded',
        error,
        { key, valueSize: value.length }
      );
      
      // Attempt recovery
      return attemptStorageRecovery(key, value);
    }
    
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.HIGH,
      'Failed to set localStorage item',
      error as Error,
      { key }
    );
    return false;
  }
}

/**
 * Attempt to recover from quota exceeded error
 */
function attemptStorageRecovery(key: string, value: string): boolean {
  errorLogger.log(
    ErrorCategory.STORAGE,
    ErrorSeverity.MEDIUM,
    'Attempting storage recovery'
  );
  
  // Strategy 1: Remove old error logs
  try {
    localStorage.removeItem('critical-errors');
  } catch (e) {
    // Ignore
  }
  
  // Strategy 2: Try again
  try {
    localStorage.setItem(key, value);
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.LOW,
      'Storage recovery successful'
    );
    return true;
  } catch (error) {
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.CRITICAL,
      'Storage recovery failed',
      error as Error
    );
    return false;
  }
}

/**
 * Get localStorage item safely
 */
export function safeGetItem(key: string, fallback: string | null = null): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.MEDIUM,
      'Failed to get localStorage item',
      error as Error,
      { key }
    );
    return fallback;
  }
}

/**
 * Remove localStorage item safely
 */
export function safeRemoveItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.MEDIUM,
      'Failed to remove localStorage item',
      error as Error,
      { key }
    );
    return false;
  }
}

/**
 * Clear old or unused data to free space
 */
export async function clearUnusedData(): Promise<number> {
  let freedBytes = 0;
  
  try {
    // Remove critical error logs (oldest first)
    const criticalErrors = safeGetItem('critical-errors');
    if (criticalErrors) {
      freedBytes += criticalErrors.length * 2;
      safeRemoveItem('critical-errors');
    }
    
    // Could add more cleanup strategies here
    // - Remove old character versions
    // - Compress data
    // - Archive to IndexedDB
    
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.LOW,
      `Cleared ${freedBytes} bytes of unused data`
    );
  } catch (error) {
    errorLogger.log(
      ErrorCategory.STORAGE,
      ErrorSeverity.MEDIUM,
      'Failed to clear unused data',
      error as Error
    );
  }
  
  return freedBytes;
}
