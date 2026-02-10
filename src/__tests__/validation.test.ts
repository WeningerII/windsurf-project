import { describe, expect, it } from 'vitest';
import {
  ValidationError,
  sanitizeInput,
  validateAttributeScore,
  validateCharacter,
  validateCharacterName,
  validateHitPoints,
  validateLevel,
} from '../utils/validation';

describe('validation utilities', () => {
  it('validateCharacterName throws for empty/too-long names and accepts valid input', () => {
    expect(() => validateCharacterName('')).toThrow(ValidationError);
    expect(() => validateCharacterName('a'.repeat(101))).toThrow(ValidationError);
    expect(() => validateCharacterName('Valid Name')).not.toThrow();
  });

  it('validateLevel enforces integer and range constraints', () => {
    expect(() => validateLevel(1.5)).toThrow(ValidationError);
    expect(() => validateLevel(0)).toThrow(ValidationError);
    expect(() => validateLevel(21)).toThrow(ValidationError);
    expect(() => validateLevel(10)).not.toThrow();
  });

  it('validateAttributeScore validates integer/range with attribute context', () => {
    expect(() => validateAttributeScore(10.2, 'str')).toThrow('str must be a whole number');
    expect(() => validateAttributeScore(0, 'dex')).toThrow('dex must be between 1 and 30');
    expect(() => validateAttributeScore(31, 'con')).toThrow('con must be between 1 and 30');
    expect(() => validateAttributeScore(14, 'wis')).not.toThrow();
  });

  it('validateHitPoints enforces current/max/temp constraints', () => {
    expect(() => validateHitPoints(-1, 10, 0)).toThrow('Current HP cannot be negative');
    expect(() => validateHitPoints(10, 0, 0)).toThrow('Max HP must be at least 1');
    expect(() => validateHitPoints(10, 10, -1)).toThrow('Temporary HP cannot be negative');
    expect(() => validateHitPoints(10, 10, 0)).not.toThrow();
  });

  it('validateCharacter executes optional checks only when fields are present', () => {
    expect(() => validateCharacter({})).not.toThrow();
    expect(() =>
      validateCharacter({
        name: '  ',
      })
    ).toThrow(ValidationError);

    expect(() =>
      validateCharacter({
        name: 'Valid',
        level: 3,
        baseAttributes: { str: 12, dex: 14 },
        hitPoints: { current: 8, max: 10, temp: 0 },
      })
    ).not.toThrow();
  });

  it('sanitizeInput trims whitespace and removes angle brackets', () => {
    expect(sanitizeInput('  <Gandalf>  ')).toBe('Gandalf');
    expect(sanitizeInput('NoTags')).toBe('NoTags');
  });
});
