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

export function mergeVancianSpellSlots(
  existing: Record<number, { total: number; used: number }> | undefined,
  totals: Record<number, number>
): Record<number, { total: number; used: number }> {
  const merged: Record<number, { total: number; used: number }> = {};
  const allLevels = new Set<number>([
    ...Object.keys(totals).map(Number),
    ...(existing ? Object.keys(existing).map(Number) : []),
  ]);

  for (const level of allLevels) {
    const total = Math.max(0, totals[level] ?? 0);
    const prevUsed = existing?.[level]?.used ?? 0;
    merged[level] = { total, used: Math.min(prevUsed, total) };
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
