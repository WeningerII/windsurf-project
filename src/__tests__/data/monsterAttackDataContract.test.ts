import { describe, it, expect } from 'vitest';

import { dnd5eMonsters } from '../../data/dnd/5e-2014/monsters';
import { dnd5e2024Monsters } from '../../data/dnd/5e-2024/monsters';
import { normalizeAttack } from '../../rules';
import type { Monster } from '../../types/creatures/monsters';

/**
 * DATA CONTRACT: every shipped monster with a resolvable attack must carry it as
 * STRUCTURED fields (attackBonus + damage[]), not only in prose.
 *
 * Background: 5e-2024 statblocks originally described attacks only in the action
 * `description` string, so combat resolved to "+0 to hit / for 0" until a runtime
 * prose parser was added. The structured fields were then backfilled from that
 * parser. This test makes the structured data the contract: if a new monster (or
 * an edit) ships an attack action that only normalizes via prose, CI fails here
 * and points at the exact monster — keeping the runtime parser a safety net
 * rather than the thing combat silently depends on.
 */

/**
 * A structured attack action carries `attackBonus`. Damage may be empty — a
 * to-hit attack can deal no dice and instead apply a condition (e.g. a Giant
 * Spider's Web restrains; a grapple). So the contract is "has attackBonus", not
 * "has attackBonus AND damage".
 */
function isStructuredAttack(action: Monster['actions'][number]): boolean {
  return action.attackBonus != null;
}

function hasStructuredAttack(monster: Monster): boolean {
  return (monster.actions ?? []).some(isStructuredAttack);
}

/** Actions that normalize to an attack ONLY through prose (no structured fields). */
function proseOnlyAttackNames(monster: Monster): string[] {
  return (monster.actions ?? [])
    .filter((a) => !isStructuredAttack(a) && normalizeAttack(a) !== undefined)
    .map((a) => a.name);
}

describe('monster attack data contract — structured, not prose-only', () => {
  for (const [label, monsters] of [
    ['D&D 5e 2014', dnd5eMonsters],
    ['D&D 5e 2024', dnd5e2024Monsters],
  ] as const) {
    it(`${label}: no monster relies on prose-only attacks`, () => {
      const offenders = monsters
        .map((m) => ({ id: m.id, prose: proseOnlyAttackNames(m) }))
        .filter((m) => m.prose.length > 0);

      // Helpful failure message naming the exact monster + action(s).
      expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
    });

    it(`${label}: every monster that can attack has structured fields`, () => {
      // A monster with an attack action (per the prose) must expose it structurally.
      const missing = monsters
        .filter((m) => (m.actions ?? []).some((a) => normalizeAttack(a) !== undefined))
        .filter((m) => !hasStructuredAttack(m))
        .map((m) => m.id);
      expect(missing).toEqual([]);
    });
  }
});
