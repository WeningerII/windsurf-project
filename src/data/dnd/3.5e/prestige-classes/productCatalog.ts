export const dnd35eProductPrestigeClassIds = [
  'arcane-archer-35e',
  'arcane-trickster-35e',
  'archmage-35e',
  'assassin-35e',
  'blackguard-35e',
  'dragon-disciple-35e',
  'duelist-35e',
  'dwarven-defender-35e',
  'eldritch-knight-35e',
  'hierophant-35e',
  'horizon-walker-35e',
  'loremaster-35e',
  'mystic-theurge-35e',
  'shadowdancer-35e',
  'thaumaturgist-35e',
] as const;

const dnd35eProductPrestigeClassIdSet = new Set<string>(dnd35eProductPrestigeClassIds);

export function isDnd35eProductPrestigeClassId(classId: string): boolean {
  return dnd35eProductPrestigeClassIdSet.has(classId);
}
