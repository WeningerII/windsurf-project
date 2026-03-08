import * as fs from 'fs';

let p = 'src/utils/performance.ts';
let code = fs.readFileSync(p, 'utf8');

// Only keep debounce and throttle.
// The file might contain memoize, useDebounce, usePrevious, getPerformanceMetrics, clearPerformanceMetrics, measurePerformance, measurePerformanceAsync.

const newCode = `/**
 * Simple debounce function to limit how often a function is called
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;

  const debounced = function (...args: Parameters<T>) {
    lastArgs = args;
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      lastArgs = undefined;
      timeoutId = undefined;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    lastArgs = undefined;
  };

  debounced.flush = () => {
    if (timeoutId !== undefined && lastArgs !== undefined) {
      clearTimeout(timeoutId);
      func(...lastArgs);
      lastArgs = undefined;
      timeoutId = undefined;
    }
  };

  return debounced;
}

/**
 * Simple throttle function to limit how often a function is called
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | undefined;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = undefined;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}
`;

fs.writeFileSync(p, newCode);

p = 'src/main.tsx';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/import \{ reportWebVitals \} from '\.\/utils\/performanceMonitoring';\n/, '');
code = code.replace(/reportWebVitals\(console\.table\);\n/, '');
fs.writeFileSync(p, code);
