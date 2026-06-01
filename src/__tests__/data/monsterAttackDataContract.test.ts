import { describe, it, expect } from 'vitest';

import { dnd5eMonsters } from '../../data/dnd/5e-2014/monsters';
import { dnd5e2024Monsters } from '../../data/dnd/5e-2024/monsters';
import { normalizeAttack, normalizeSaveAction } from '../../rules';
import type { Monster } from '../../types/creatures/monsters';

/**
 * DATA CONTRACT: every shipped monster damaging action must carry STRUCTURED
 * fields, not only prose — attacks via `attackBonus`, save-based area effects
 * (breath weapons) via `savingThrow` + `damage`.
 *
 * Background: 5e-2024 statblocks originally described attacks/breath weapons only
 * in the action `description` string, so combat resolved to "+0 to hit / for 0"
 * (and dragons couldn't breathe) until runtime prose parsers were added. The
 * structured fields were then backfilled from those parsers. This test makes the
 * structured data the contract: if a new monster (or an edit) ships a damaging
 * action that only normalizes via prose, CI fails here and names the exact
 * monster — keeping the runtime parsers a safety net rather than the thing combat
 * silently depends on.
 */

type MonsterAction = Monster['actions'][number];

/**
 * A structured attack action carries `attackBonus`. Damage may be empty — a
 * to-hit attack can deal no dice and instead apply a condition (e.g. a Giant
 * Spider's Web restrains; a grapple). So the contract is "has attackBonus", not
 * "has attackBonus AND damage".
 */
function isStructuredAttack(action: MonsterAction): boolean {
  return action.attackBonus != null;
}

/** A structured save action carries `savingThrow` + `damage`. */
function isStructuredSave(action: MonsterAction): boolean {
  return action.savingThrow != null && (action.damage?.length ?? 0) > 0;
}

/** Damaging actions that normalize ONLY through prose (no structured fields). */
function proseOnlyActionNames(monster: Monster): string[] {
  return (monster.actions ?? [])
    .filter((a) => {
      if (isStructuredAttack(a) || isStructuredSave(a)) return false;
      return normalizeAttack(a) !== undefined || normalizeSaveAction(a) !== undefined;
    })
    .map((a) => a.name);
}

describe('monster action data contract — structured, not prose-only', () => {
  for (const [label, monsters] of [
    ['D&D 5e 2014', dnd5eMonsters],
    ['D&D 5e 2024', dnd5e2024Monsters],
  ] as const) {
    it(`${label}: no monster relies on prose-only attacks or breath weapons`, () => {
      const offenders = monsters
        .map((m) => ({ id: m.id, prose: proseOnlyActionNames(m) }))
        .filter((m) => m.prose.length > 0);

      // Helpful failure message naming the exact monster + action(s).
      expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
    });
  }
});
