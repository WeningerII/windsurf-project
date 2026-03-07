/** Hit die size by class ID (D&D 5e / 3.5e / PF1e) */
export const HIT_DICE: Record<string, number> = {
  barbarian: 12,
  fighter: 10,
  paladin: 10,
  ranger: 10,
  bard: 8,
  cleric: 8,
  druid: 8,
  monk: 8,
  rogue: 8,
  warlock: 8,
  sorcerer: 6,
  wizard: 6,
};

/** Get hit die size for a class, defaulting to 8 */
export function hitDieSize(classId: string): number {
  return HIT_DICE[classId] ?? 8;
}

/** Get hit die notation string for a class, e.g. "d8" */
export function hitDieString(classId: string): string {
  return `d${hitDieSize(classId)}`;
}
