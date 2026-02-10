import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearPerformanceMetrics,
  debounce,
  getPerformanceMetrics,
  measurePerformance,
  measurePerformanceAsync,
  memoize,
  throttle,
  useDebounce,
  usePrevious,
} from '../utils/performance';
import { errorLogger, ErrorCategory, ErrorSeverity } from '../utils/errorLogger';

function DebounceProbe({ value, delay }: { value: string; delay: number }) {
  const debounced = useDebounce(value, delay);
  return <div data-testid="debounced">{debounced}</div>;
}

function PreviousProbe({ value }: { value: number }) {
  const previous = usePrevious(value);
  return <div data-testid="previous">{String(previous)}</div>;
}

describe('performance utilities', () => {
  beforeEach(() => {
    clearPerformanceMetrics();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('measures sync operations and stores metrics', () => {
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(25);

    const result = measurePerformance('fast-sync', () => 42);
    const metrics = getPerformanceMetrics();

    expect(result).toBe(42);
    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toMatchObject({ name: 'fast-sync', duration: 25 });
  });

  it('logs slow sync operations', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(1250);

    measurePerformance('slow-sync', () => 'ok');

    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.MEDIUM,
      'Slow operation detected: slow-sync',
      undefined,
      expect.objectContaining({ duration: 1240, name: 'slow-sync' })
    );
  });

  it('logs and rethrows sync errors', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(5);

    expect(() =>
      measurePerformance('explode-sync', () => {
        throw new Error('boom');
      })
    ).toThrow('boom');

    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.HIGH,
      'Error in measured operation: explode-sync',
      expect.any(Error),
      expect.objectContaining({ duration: 5 })
    );
  });

  it('measures async operations and logs slow async calls', async () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(2300);

    const result = await measurePerformanceAsync('slow-async', async () => 'done');

    expect(result).toBe('done');
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.MEDIUM,
      'Slow async operation: slow-async',
      undefined,
      expect.objectContaining({ duration: 2200, name: 'slow-async' })
    );
  });

  it('logs and rethrows async errors', async () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(200)
      .mockReturnValueOnce(450);

    await expect(
      measurePerformanceAsync('explode-async', async () => {
        throw new Error('async boom');
      })
    ).rejects.toThrow('async boom');

    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.UNKNOWN,
      ErrorSeverity.HIGH,
      'Error in async measured operation: explode-async',
      expect.any(Error),
      expect.objectContaining({ duration: 250 })
    );
  });

  it('debounces function calls', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    debounced('second');

    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  it('throttles function calls', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('first');
    throttled('second');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('first');

    vi.advanceTimersByTime(100);
    throttled('third');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('third');
  });

  it('memoizes repeated calls with same arguments', () => {
    const compute = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(compute);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(2, 2)).toBe(4);

    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('useDebounce returns delayed value', () => {
    vi.useFakeTimers();
    const { rerender } = render(<DebounceProbe value="a" delay={100} />);

    expect(screen.getByTestId('debounced')).toHaveTextContent('a');

    rerender(<DebounceProbe value="b" delay={100} />);
    expect(screen.getByTestId('debounced')).toHaveTextContent('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByTestId('debounced')).toHaveTextContent('b');
  });

  it('usePrevious returns previous render value', () => {
    const { rerender } = render(<PreviousProbe value={1} />);
    expect(screen.getByTestId('previous')).toHaveTextContent('undefined');

    rerender(<PreviousProbe value={2} />);
    expect(screen.getByTestId('previous')).toHaveTextContent('1');

    rerender(<PreviousProbe value={3} />);
    expect(screen.getByTestId('previous')).toHaveTextContent('2');
  });

  it('can clear captured performance metrics', () => {
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10);

    measurePerformance('clear-target', () => true);
    expect(getPerformanceMetrics()).toHaveLength(1);

    clearPerformanceMetrics();
    expect(getPerformanceMetrics()).toHaveLength(0);
  });
});
