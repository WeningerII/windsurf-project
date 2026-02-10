/**
 * Comprehensive Input Validation for Edge Cases
 * 
 * Provides safe parsing and validation functions that handle null, undefined,
 * extreme values, and malformed inputs gracefully. All functions return sensible
 * defaults rather than throwing errors, and log validation issues for debugging.
 * 
 * @module inputValidation
 * @example
 * ```typescript
 * const level = validateLevel(userInput); // Always returns 1-20
 * const name = validateCharacterName(input); // Never returns empty string
 * ```
 */

import { GAME_RULES } from '../constants/game-rules';
import { errorLogger, ErrorCategory, ErrorSeverity } from './errorLogger';

/**
 * Safely parse integer with bounds checking and type coercion
 * 
 * Handles null, undefined, numbers, and strings. Clamps result to min/max bounds.
 * Returns defaultValue for invalid inputs.
 * 
 * @param value - Value to parse (can be string, number, null, undefined)
 * @param min - Minimum allowed value (default: Number.MIN_SAFE_INTEGER)
 * @param max - Maximum allowed value (default: Number.MAX_SAFE_INTEGER)
 * @param defaultValue - Value to return if parsing fails (default: 0)
 * @returns Parsed and clamped integer
 * 
 * @example
 * ```typescript
 * safeParseInt('42', 1, 100, 1); // Returns 42
 * safeParseInt('999', 1, 100, 1); // Returns 100 (clamped)
 * safeParseInt('invalid', 1, 100, 1); // Returns 1 (default)
 * ```
 */
export function safeParseInt(
  value: unknown,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER,
  defaultValue: number = 0
): number {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return defaultValue;
  }

  // Handle already numeric
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      errorLogger.log(
        ErrorCategory.VALIDATION,
        ErrorSeverity.MEDIUM,
        'Non-finite number encountered',
        undefined,
        { value }
      );
      return defaultValue;
    }
    return Math.max(min, Math.min(max, Math.floor(value)));
  }

  // Handle string conversion
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return defaultValue;
    
    const parsed = parseInt(trimmed, 10);
    if (Number.isNaN(parsed)) {
      errorLogger.log(
        ErrorCategory.VALIDATION,
        ErrorSeverity.LOW,
        'Failed to parse integer',
        undefined,
        { value }
      );
      return defaultValue;
    }
    
    return Math.max(min, Math.min(max, parsed));
  }

  // Unsupported type
  errorLogger.log(
    ErrorCategory.VALIDATION,
    ErrorSeverity.MEDIUM,
    'Unexpected type in safeParseInt',
    undefined,
    { value, type: typeof value }
  );
  return defaultValue;
}

/**
 * Validate and sanitize character level input
 * 
 * Ensures level is between 1-20 (configurable in GAME_RULES).
 * 
 * @param input - Raw level input from user
 * @returns Valid level between MIN_CHARACTER_LEVEL and MAX_CHARACTER_LEVEL
 * 
 * @example
 * ```typescript
 * validateLevel('5'); // Returns 5
 * validateLevel(999); // Returns 20 (max level)
 * validateLevel('invalid'); // Returns 1 (min level)
 * ```
 */
export function validateLevel(input: unknown): number {
  return safeParseInt(
    input,
    GAME_RULES.MIN_CHARACTER_LEVEL,
    GAME_RULES.MAX_CHARACTER_LEVEL,
    GAME_RULES.MIN_CHARACTER_LEVEL
  );
}

/**
 * Validate and sanitize ability score input (STR, DEX, CON, INT, WIS, CHA)
 * 
 * Clamps to valid ability score range (typically 1-30 for D&D).
 * 
 * @param input - Raw ability score input
 * @returns Valid ability score within game rules bounds
 */
export function validateAbilityScore(input: unknown): number {
  return safeParseInt(
    input,
    GAME_RULES.MIN_ABILITY_SCORE,
    GAME_RULES.MAX_ABILITY_SCORE,
    GAME_RULES.DEFAULT_ABILITY_SCORE
  );
}

/**
 * Validate and sanitize HP values
 */
export function validateHP(input: unknown, isMax: boolean = false): number {
  const min = isMax ? GAME_RULES.MIN_HIT_POINTS : GAME_RULES.MIN_CURRENT_HP;
  const max = 9999; // Reasonable upper bound
  const defaultValue = isMax ? GAME_RULES.MIN_HIT_POINTS : 0;
  
  return safeParseInt(input, min, max, defaultValue);
}

/**
 * Safely parse and validate string with length limits
 */
export function safeParseString(
  value: unknown,
  maxLength: number = 1000,
  defaultValue: string = ''
): string {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return defaultValue;
  }

  // Convert to string
  let str: string;
  if (typeof value === 'string') {
    str = value;
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    str = String(value);
  } else {
    errorLogger.log(
      ErrorCategory.VALIDATION,
      ErrorSeverity.LOW,
      'Unexpected type in safeParseString',
      undefined,
      { type: typeof value }
    );
    return defaultValue;
  }

  // Truncate if too long
  if (str.length > maxLength) {
    errorLogger.log(
      ErrorCategory.VALIDATION,
      ErrorSeverity.LOW,
      'String truncated due to length',
      undefined,
      { original: str.length, max: maxLength }
    );
    return str.substring(0, maxLength);
  }

  return str;
}

/**
 * Validate character name with edge cases
 */
export function validateCharacterName(input: unknown): string {
  const str = safeParseString(input, GAME_RULES.MAX_CHARACTER_NAME_LENGTH, 'Unnamed Character');
  
  // Ensure non-empty after trimming
  const trimmed = str.trim();
  if (trimmed.length < GAME_RULES.MIN_CHARACTER_NAME_LENGTH) {
    return 'Unnamed Character';
  }
  
  return trimmed;
}

/**
 * Validate array input with bounds
 */
export function safeParseArray<T>(
  value: unknown,
  maxLength: number = 1000,
  defaultValue: T[] = []
): T[] {
  if (!Array.isArray(value)) {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    errorLogger.log(
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Non-array value passed to safeParseArray',
      undefined,
      { type: typeof value }
    );
    return defaultValue;
  }

  if (value.length > maxLength) {
    errorLogger.log(
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Array truncated due to length',
      undefined,
      { original: value.length, max: maxLength }
    );
    return value.slice(0, maxLength);
  }

  return value;
}

/**
 * Validate object input
 */
export function safeParseObject<T extends Record<string, any>>(
  value: unknown,
  defaultValue: T
): T {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    errorLogger.log(
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Invalid object type',
      undefined,
      { type: typeof value, isArray: Array.isArray(value) }
    );
    return defaultValue;
  }

  return value as T;
}

/**
 * Validate and clamp numeric value
 */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    errorLogger.log(
      ErrorCategory.VALIDATION,
      ErrorSeverity.HIGH,
      'Non-finite value in clamp',
      undefined,
      { value }
    );
    return min;
  }
  
  return Math.max(min, Math.min(max, value));
}
