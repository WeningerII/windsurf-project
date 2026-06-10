type SpellSlotTable = Record<number, number[]>;

export function getSpellSlotsAtClassLevel(
  table: SpellSlotTable | undefined,
  classLevel: number
): Record<number, number> {
  if (!table) return {};

  const index = Math.max(0, Math.min(19, classLevel - 1));
  const slots: Record<number, number> = {};

  for (const [spellLevel, progression] of Object.entries(table)) {
    const level = Number(spellLevel);
    if (!Number.isFinite(level) || !Array.isArray(progression)) continue;
    slots[level] = progression[index] ?? 0;
  }

  return slots;
}

export interface VancianSpellSlot {
  total: number;
  used: number;
  /**
   * Persisted manual adjustment on top of the automated class-table total.
   * The sheet's slot editor and "Add Level" record deltas here so they survive
   * every re-prepare (the automated baseline is recomputed each time, then the
   * bonus is added back). May be negative when a user lowers a total.
   */
  manualBonus?: number;
}

/**
 * Merge automated class-table totals with existing slot state. The table value
 * is the automated baseline; any persisted `manualBonus` is added on top, so
 * manual edits survive re-prepares and level changes degrade sanely (the
 * baseline shrinks, the user delta is kept, and the result floors at 0).
 */
export function mergeVancianSpellSlots(
  existing: Record<number, VancianSpellSlot> | undefined,
  totals: Record<number, number>
): Record<number, VancianSpellSlot> {
  const merged: Record<number, VancianSpellSlot> = {};
  const allLevels = new Set<number>([
    ...Object.keys(totals).map(Number),
    ...(existing ? Object.keys(existing).map(Number) : []),
  ]);

  for (const level of allLevels) {
    const manualBonus = existing?.[level]?.manualBonus ?? 0;
    const total = Math.max(0, (totals[level] ?? 0) + manualBonus);
    const prevUsed = existing?.[level]?.used ?? 0;
    merged[level] = {
      total,
      used: Math.min(prevUsed, total),
      ...(manualBonus !== 0 ? { manualBonus } : {}),
    };
  }

  return merged;
}

export function mergeMaxUsedSpellSlots(
  existing: Record<number, { max: number; used: number }> | undefined,
  maxes: Record<number, number>
): Record<number, { max: number; used: number }> {
  const merged: Record<number, { max: number; used: number }> = {};
  const allLevels = new Set<number>([
    ...Object.keys(maxes).map(Number),
    ...(existing ? Object.keys(existing).map(Number) : []),
  ]);

  for (const level of allLevels) {
    const max = Math.max(0, maxes[level] ?? 0);
    const prevUsed = existing?.[level]?.used ?? 0;
    merged[level] = { max, used: Math.min(prevUsed, max) };
  }

  return merged;
}
