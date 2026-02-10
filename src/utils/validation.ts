import { Character } from '../types/game-systems';
import { GAME_RULES } from '../constants/game-rules';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateCharacterName = (name: string): void => {
  if (!name || name.trim().length === 0) {
    throw new ValidationError('Character name cannot be empty', 'name');
  }
  if (name.length > GAME_RULES.MAX_CHARACTER_NAME_LENGTH) {
    throw new ValidationError(`Character name must be ${GAME_RULES.MAX_CHARACTER_NAME_LENGTH} characters or less`, 'name');
  }
};

export const validateLevel = (level: number): void => {
  if (!Number.isInteger(level)) {
    throw new ValidationError('Level must be a whole number', 'level');
  }
  if (level < GAME_RULES.MIN_CHARACTER_LEVEL || level > GAME_RULES.MAX_CHARACTER_LEVEL) {
    throw new ValidationError(`Level must be between ${GAME_RULES.MIN_CHARACTER_LEVEL} and ${GAME_RULES.MAX_CHARACTER_LEVEL}`, 'level');
  }
};

export const validateAttributeScore = (score: number, attributeName: string): void => {
  if (!Number.isInteger(score)) {
    throw new ValidationError(`${attributeName} must be a whole number`, attributeName);
  }
  if (score < GAME_RULES.MIN_ABILITY_SCORE || score > GAME_RULES.MAX_ABILITY_SCORE) {
    throw new ValidationError(`${attributeName} must be between ${GAME_RULES.MIN_ABILITY_SCORE} and ${GAME_RULES.MAX_ABILITY_SCORE}`, attributeName);
  }
};

export const validateHitPoints = (current: number, max: number, temp: number): void => {
  if (current < GAME_RULES.MIN_CURRENT_HP) {
    throw new ValidationError('Current HP cannot be negative', 'hitPoints.current');
  }
  if (max < GAME_RULES.MIN_HIT_POINTS) {
    throw new ValidationError(`Max HP must be at least ${GAME_RULES.MIN_HIT_POINTS}`, 'hitPoints.max');
  }
  if (temp < GAME_RULES.MIN_TEMP_HP) {
    throw new ValidationError('Temporary HP cannot be negative', 'hitPoints.temp');
  }
};

export const validateCharacter = (character: Partial<Character>): void => {
  if (character.name !== undefined) {
    validateCharacterName(character.name);
  }
  if (character.level !== undefined) {
    validateLevel(character.level);
  }
  if (character.baseAttributes) {
    Object.entries(character.baseAttributes).forEach(([attr, score]) => {
      validateAttributeScore(score, attr);
    });
  }
  if (character.hitPoints) {
    validateHitPoints(
      character.hitPoints.current,
      character.hitPoints.max,
      character.hitPoints.temp
    );
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
