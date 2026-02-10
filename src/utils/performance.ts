/**
 * Performance Monitoring and Optimization Utilities
 */

import { useState, useEffect, useRef } from 'react';
import { errorLogger, ErrorCategory, ErrorSeverity } from './errorLogger';

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: Date;
}

const performanceMetrics: PerformanceMetrics[] = [];
const MAX_METRICS = 100;

/**
 * Measure function execution time
 */
export const measurePerformance = <T>(name: string, fn: () => T): T => {
  const start = performance.now();
  try {
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    
    // Log slow operations
    if (duration > 1000) {
      errorLogger.log(
        ErrorCategory.UNKNOWN,
        ErrorSeverity.MEDIUM,
        `Slow operation detected: ${name}`,
        undefined,
        { duration, name }
      );
    }
    
    // Store metric
    performanceMetrics.push({
      name,
      duration,
      timestamp: new Date(),
    });
    
    // Keep only recent metrics
    if (performanceMetrics.length > MAX_METRICS) {
      performanceMetrics.shift();
    }
    
    return result;
  } catch (error) {
    const end = performance.now();
    errorLogger.log(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.HIGH,
      `Error in measured operation: ${name}`,
      error as Error,
      { duration: end - start }
    );
    throw error;
  }
};

/**
 * Measure async function execution time
 */
export const measurePerformanceAsync = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 2000) {
      errorLogger.log(
        ErrorCategory.UNKNOWN,
        ErrorSeverity.MEDIUM,
        `Slow async operation: ${name}`,
        undefined,
        { duration, name }
      );
    }
    
    performanceMetrics.push({
      name,
      duration,
      timestamp: new Date(),
    });
    
    if (performanceMetrics.length > MAX_METRICS) {
      performanceMetrics.shift();
    }
    
    return result;
  } catch (error) {
    const end = performance.now();
    errorLogger.log(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.HIGH,
      `Error in async measured operation: ${name}`,
      error as Error,
      { duration: end - start }
    );
    throw error;
  }
};

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics[] {
  return [...performanceMetrics];
}

/**
 * Clear performance metrics
 */
export function clearPerformanceMetrics(): void {
  performanceMetrics.length = 0;
}

/**
 * Debounce function execution
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic debounce requires flexible types
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function execution
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic throttle requires flexible types
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};
