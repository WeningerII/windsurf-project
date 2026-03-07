import { Modifier } from '../core/common';

export interface AttributeScore {
  base: number;
  racial: number;
  asi: number; // Ability Score Improvements
  temporary: number;
  modifiers: Modifier[];
}

export interface AttributeScores {
  str: AttributeScore;
  dex: AttributeScore;
  con: AttributeScore;
  int: AttributeScore;
  wis: AttributeScore;
  cha: AttributeScore;
}

export interface ComputedAttribute {
  score: number;
  modifier: number;
  savingThrow: number;
  savingThrowProficient: boolean;
}

export type AttributeGenerationMethod =
  | 'standard-array'
  | 'point-buy'
  | 'manual'
  | 'roll-4d6-drop-lowest'
  | 'roll-3d6';

export interface PointBuyConfig {
  points: number;
  minScore: number;
  maxScore: number;
  costs: Record<number, number>; // score -> cost
}
