export function debounce<TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  wait: number
): {
  (...args: TArgs): void;
  cancel: () => void;
  flush: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: TArgs | undefined;

  const debounced = function (...args: TArgs) {
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

export function throttle<TThis, TArgs extends unknown[], TResult>(
  func: (this: TThis, ...args: TArgs) => TResult,
  limit: number
): (this: TThis, ...args: TArgs) => void {
  let inThrottle = false;
  return function (this: TThis, ...args: TArgs) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
