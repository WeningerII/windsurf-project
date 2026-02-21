/**
 * Shared helpers for d20 3.x-family systems (D&D 3.5e and Pathfinder 1e).
 */

/** Size modifier for AC and attack rolls */
export const SIZE_MODS: Record<string, number> = {
  fine: 8, diminutive: 4, tiny: 2, small: 1, medium: 0,
  large: -1, huge: -2, gargantuan: -4, colossal: -8,
};

/** Size modifier for grapple (D&D 3.5e — opposite sign, larger steps) */
export const GRAPPLE_SIZE_MODS: Record<string, number> = {
  fine: -16, diminutive: -12, tiny: -8, small: -4, medium: 0,
  large: 4, huge: 8, gargantuan: 12, colossal: 16,
};

/** Size modifier for CMB/CMD (Pathfinder 1e — opposite sign from AC) */
export const CMB_SIZE_MODS: Record<string, number> = {
  fine: -8, diminutive: -4, tiny: -2, small: -1, medium: 0,
  large: 1, huge: 2, gargantuan: 4, colossal: 8,
};

/**
 * Compute base save bonus for a given class save progression.
 * Good save: 2 + level/2 (floored)
 * Poor save: level/3 (floored)
 */
export function baseSave(level: number, quality: 'good' | 'poor'): number {
  if (quality === 'good') return 2 + Math.floor(level / 2);
  return Math.floor(level / 3);
}

/**
 * Compute BAB for a class at a given level.
 * Full: level
 * Three-quarter: floor(level * 3/4)
 * Half: floor(level / 2)
 */
export function classBAB(level: number, progression: 'full' | 'three-quarter' | 'half'): number {
  if (progression === 'full') return level;
  if (progression === 'three-quarter') return Math.floor(level * 3 / 4);
  return Math.floor(level / 2);
}
