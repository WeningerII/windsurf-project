/**
 * Adapter: loader-backed Monster → combat-ready data.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * Turns a shipped `Monster` statblock into the pieces the deterministic combat
 * pipeline needs: a scene token with HP, and the attack/damage effects + reach
 * a `TacticalActor` consumes. This is what makes a *shipped* goblin actually
 * fight — the data the app already loads becomes a real combatant, no invented
 * numbers.
 *
 * Monster HP uses the standard average of its hit dice (count × avg(die) +
 * modifier), the same number printed on a statblock, so setup is deterministic
 * without consuming the RNG stream. The primary attack action becomes the
 * combatant's attack/damage effects; reach in feet maps to grid cells (÷5).
 */

import type { Monster, Action } from '../../types/creatures/monsters';
import type { DiceType } from '../../types/core/common';
import type { SceneCoordinate, SceneToken } from '../../types/core/scene';
import { makeEffectId, type EffectInstance } from '../ir/types';

const FEET_PER_CELL = 5;

/** Faces of a die string like 'd8'. Returns NaN for unrecognized input. */
function dieFaces(die: DiceType | string): number {
  const match = /^d(\d+)$/.exec(die);
  return match ? Number(match[1]) : NaN;
}

/** Standard average of a die: (faces + 1) / 2. */
function averageDie(die: DiceType | string): number {
  const faces = dieFaces(die);
  return Number.isFinite(faces) ? (faces + 1) / 2 : 0;
}

/** Average (statblock) hit points from a monster's hit-dice DiceRoll. */
export function monsterAverageHitPoints(monster: Monster): number {
  const { count, die, modifier } = monster.hitPoints;
  const avg = count * averageDie(die) + (modifier ?? 0);
  return Math.max(1, Math.floor(avg));
}

/** Reach (in grid cells) of an action; melee actions default to 1 cell. */
function actionReachCells(action: Action): number {
  if (action.range) {
    return Math.max(1, Math.floor(action.range.normal / FEET_PER_CELL));
  }
  if (action.reach) {
    return Math.max(1, Math.floor(action.reach / FEET_PER_CELL));
  }
  return 1;
}

/** Pick the monster's primary attack action (first with an attack bonus). */
export function primaryAttackAction(monster: Monster): Action | undefined {
  return monster.actions.find((action) => action.attackBonus != null && action.damage?.length);
}

/** Build attack-roll effects for a monster's primary attack. */
export function monsterAttackEffects(monster: Monster, action: Action): EffectInstance[] {
  const bonus = action.attackBonus ?? 0;
  return [
    {
      id: makeEffectId(monster.system, 'attack', monster.id, action.name),
      systemId: monster.system as EffectInstance['systemId'],
      target: 'attack',
      operation: 'add',
      value: bonus,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: monster.id, label: `${monster.name}: ${action.name}` },
      label: `${action.name} attack bonus`,
      category: 'other',
    },
  ];
}

/**
 * Build damage effects for an action: each damage entry's dice become `add-die`
 * effects (one per die) plus a flat `add` for the modifier. Damage type
 * namespaces the target (`damage.piercing`), so resistances/terrain can key off
 * it later.
 */
export function monsterDamageEffects(monster: Monster, action: Action): EffectInstance[] {
  const effects: EffectInstance[] = [];
  const systemId = monster.system as EffectInstance['systemId'];

  for (const [damageIndex, damage] of (action.damage ?? []).entries()) {
    const target = `damage.${damage.type}`;
    const faces = dieFaces(damage.dice.die);
    const count = Number.isFinite(faces) ? damage.dice.count : 0;

    for (let dieIndex = 0; dieIndex < count; dieIndex += 1) {
      effects.push({
        id: makeEffectId(systemId, target, monster.id, action.name, 'die', damageIndex, dieIndex),
        systemId,
        target,
        operation: 'add-die',
        value: faces,
        stackPolicy: 'sum',
        source: { kind: 'custom', id: monster.id, label: `${monster.name}: ${action.name}` },
        label: `${action.name} ${damage.dice.die}`,
        category: 'other',
      });
    }

    if (damage.dice.modifier) {
      effects.push({
        id: makeEffectId(systemId, target, monster.id, action.name, 'flat', damageIndex),
        systemId,
        target,
        operation: 'add',
        value: damage.dice.modifier,
        stackPolicy: 'sum',
        source: { kind: 'custom', id: monster.id, label: `${monster.name}: ${action.name}` },
        label: `${action.name} damage bonus`,
        category: 'other',
      });
    }
  }

  return effects;
}

export interface MonsterCombatant {
  token: SceneToken;
  attackEffects: EffectInstance[];
  damageEffects: EffectInstance[];
  reach: number;
  armorClass: number;
}

/**
 * Build a combat-ready combatant from a monster. The returned token carries
 * average HP; attack/damage effects and reach come from the primary attack
 * action (empty effects when the monster has no attack — e.g. a Commoner with
 * only a club still has one, but a passive creature may not).
 */
export function buildMonsterCombatant(
  monster: Monster,
  options: { tokenId: string; position: SceneCoordinate; name?: string; size?: number }
): MonsterCombatant {
  const action = primaryAttackAction(monster);
  const hp = monsterAverageHitPoints(monster);

  return {
    token: {
      id: options.tokenId,
      name: options.name ?? monster.name,
      kind: 'monster',
      position: options.position,
      size: options.size ?? 1,
      refId: monster.id,
      hp: { current: hp, max: hp, temp: 0 },
    },
    attackEffects: action ? monsterAttackEffects(monster, action) : [],
    damageEffects: action ? monsterDamageEffects(monster, action) : [],
    reach: action ? actionReachCells(action) : 1,
    armorClass: monster.armorClass,
  };
}
