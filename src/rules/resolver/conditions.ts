/**
 * Conditions → attack advantage/disadvantage (5e).
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). 5e folds most condition
 * effects on an attack roll into advantage or disadvantage, with the rule that
 * any advantage and any disadvantage cancel to a normal roll. This maps the
 * unambiguous, melee/ranged-independent conditions; prone (which splits by melee
 * vs ranged) and purely positional ones are intentionally left out so the
 * baseline is always correct. Other systems track the same conditions but apply
 * their own (flat) modifiers elsewhere.
 */

/** Conditions on the TARGET that expose it to advantage from any attacker. */
const TARGET_GRANTS_ADVANTAGE = new Set([
  'blinded',
  'paralyzed',
  'petrified',
  'restrained',
  'stunned',
  'unconscious',
]);

/** Conditions on the ATTACKER that impose disadvantage on its attacks. */
const ATTACKER_HAS_DISADVANTAGE = new Set(['blinded', 'frightened', 'poisoned', 'restrained']);

/** Whether the attacker's and target's conditions yield advantage / disadvantage sources. */
export function statusAdvantage(
  attackerStatuses: readonly string[] | undefined,
  targetStatuses: readonly string[] | undefined
): { advantage: boolean; disadvantage: boolean } {
  const attacker = new Set((attackerStatuses ?? []).map((s) => s.toLowerCase()));
  const target = new Set((targetStatuses ?? []).map((s) => s.toLowerCase()));

  let advantage = false;
  let disadvantage = false;

  for (const condition of target) {
    if (TARGET_GRANTS_ADVANTAGE.has(condition)) advantage = true;
  }
  if (attacker.has('invisible')) advantage = true; // an unseen attacker

  for (const condition of attacker) {
    if (ATTACKER_HAS_DISADVANTAGE.has(condition)) disadvantage = true;
  }
  if (target.has('invisible')) disadvantage = true; // can't clearly see the target

  return { advantage, disadvantage };
}

export type RollMode = 'normal' | 'advantage' | 'disadvantage';

/**
 * Collapse advantage/disadvantage sources to a single roll mode under the 5e
 * rule: any advantage and any disadvantage cancel to normal.
 */
export function collapseRollMode(advantage: boolean, disadvantage: boolean): RollMode {
  if (advantage && disadvantage) return 'normal';
  if (advantage) return 'advantage';
  if (disadvantage) return 'disadvantage';
  return 'normal';
}
