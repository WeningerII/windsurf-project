import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clamp,
  safeParseArray,
  safeParseInt,
  safeParseObject,
  safeParseString,
  validateAbilityScore,
  validateCharacterName,
  validateHP,
  validateLevel,
} from '../utils/inputValidation';
import { errorLogger, ErrorCategory, ErrorSeverity } from '../utils/errorLogger';

describe('inputValidation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('safeParseInt handles nullish values and defaults', () => {
    expect(safeParseInt(null, 1, 10, 7)).toBe(7);
    expect(safeParseInt(undefined, 1, 10, 7)).toBe(7);
  });

  it('safeParseInt handles number values including clamping and floor', () => {
    expect(safeParseInt(5.9, 1, 10, 0)).toBe(5);
    expect(safeParseInt(-50, 1, 10, 0)).toBe(1);
    expect(safeParseInt(999, 1, 10, 0)).toBe(10);
  });

  it('safeParseInt logs and returns default for non-finite numbers', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    expect(safeParseInt(Number.POSITIVE_INFINITY, 1, 10, 2)).toBe(2);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Non-finite number encountered',
      undefined,
      { value: Number.POSITIVE_INFINITY }
    );
  });

  it('safeParseInt handles strings including empty, invalid, and valid paths', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    expect(safeParseInt('   ', 1, 10, 3)).toBe(3);
    expect(safeParseInt('oops', 1, 10, 4)).toBe(4);
    expect(safeParseInt('42', 1, 10, 4)).toBe(10);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.LOW,
      'Failed to parse integer',
      undefined,
      { value: 'oops' }
    );
  });

  it('safeParseInt logs and returns default for unsupported types', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    expect(safeParseInt(Symbol('x'), 1, 10, 6)).toBe(6);
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Unexpected type in safeParseInt',
      undefined,
      { value: expect.any(Symbol), type: 'symbol' }
    );
  });

  it('validateLevel/validateAbilityScore/validateHP apply configured bounds', () => {
    expect(validateLevel('0')).toBe(1);
    expect(validateLevel('25')).toBe(20);
    expect(validateAbilityScore('0')).toBe(1);
    expect(validateAbilityScore('99')).toBe(30);
    expect(validateHP('-10', false)).toBe(0);
    expect(validateHP('-10', true)).toBe(1);
    expect(validateHP('12000', true)).toBe(9999);
  });

  it('safeParseString handles primitive values and default fallback', () => {
    expect(safeParseString(null, 10, 'default')).toBe('default');
    expect(safeParseString(42, 10, '')).toBe('42');
    expect(safeParseString(true, 10, '')).toBe('true');
  });

  it('safeParseString logs for invalid types and truncation', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    expect(safeParseString({ value: 'x' }, 5, 'fallback')).toBe('fallback');
    expect(safeParseString('abcdefgh', 3, '')).toBe('abc');

    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.LOW,
      'Unexpected type in safeParseString',
      undefined,
      { type: 'object' }
    );
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.LOW,
      'String truncated due to length',
      undefined,
      { original: 8, max: 3 }
    );
  });

  it('validateCharacterName trims valid names and enforces unnamed fallback', () => {
    expect(validateCharacterName('  Lia  ')).toBe('Lia');
    expect(validateCharacterName('   ')).toBe('Unnamed Character');
  });

  it('safeParseArray handles nullish, invalid, truncation, and pass-through', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    expect(safeParseArray<number>(null, 2, [9])).toEqual([9]);
    expect(safeParseArray<number>('oops', 2, [8])).toEqual([8]);
    expect(safeParseArray<number>([1, 2, 3], 2, [])).toEqual([1, 2]);
    expect(safeParseArray<number>([1, 2], 3, [])).toEqual([1, 2]);

    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Non-array value passed to safeParseArray',
      undefined,
      { type: 'string' }
    );
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Array truncated due to length',
      undefined,
      { original: 3, max: 2 }
    );
  });

  it('safeParseObject handles nullish, invalid object type, and valid object', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    const fallback = { a: 1 };

    expect(safeParseObject(null, fallback)).toBe(fallback);
    expect(safeParseObject([1, 2], fallback)).toBe(fallback);
    expect(safeParseObject({ a: 2 }, fallback)).toEqual({ a: 2 });

    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Invalid object type',
      undefined,
      { type: 'object', isArray: true }
    );
  });

  it('clamp returns bounded values and handles non-finite inputs', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});

    expect(clamp(50, 1, 20)).toBe(20);
    expect(clamp(-50, 1, 20)).toBe(1);
    expect(clamp(10, 1, 20)).toBe(10);
    expect(clamp(Number.NaN, 1, 20)).toBe(1);

    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.VALIDATION,
      ErrorSeverity.HIGH,
      'Non-finite value in clamp',
      undefined,
      { value: Number.NaN }
    );
  });
});
