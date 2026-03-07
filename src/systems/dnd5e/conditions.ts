export interface Dnd5eCondition {
  id: string;
  name: string;
}

export const DND5E_CONDITION_NAMES: string[] = [
  'Blinded',
  'Charmed',
  'Deafened',
  'Frightened',
  'Grappled',
  'Incapacitated',
  'Invisible',
  'Paralyzed',
  'Petrified',
  'Poisoned',
  'Prone',
  'Restrained',
  'Stunned',
  'Unconscious',
];

export function normalizeConditionId(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

export function normalizeDnd5eConditions(
  conditions: Dnd5eCondition[] | undefined
): Dnd5eCondition[] {
  if (!Array.isArray(conditions)) return [];

  const deduped = new Map<string, Dnd5eCondition>();
  for (const condition of conditions) {
    if (!condition || typeof condition.name !== 'string') continue;
    const name = condition.name.trim();
    if (!name) continue;
    const id = normalizeConditionId(condition.id || name);
    if (!deduped.has(id)) {
      deduped.set(id, { id, name });
    }
  }

  return Array.from(deduped.values());
}

export function hasDnd5eCondition(
  conditions: Dnd5eCondition[] | undefined,
  conditionId: string
): boolean {
  if (!Array.isArray(conditions) || conditions.length === 0) return false;
  const normalized = normalizeConditionId(conditionId);
  return conditions.some(
    (condition) => normalizeConditionId(condition.id || condition.name) === normalized
  );
}
