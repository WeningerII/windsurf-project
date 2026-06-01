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

/** A normalized attack: structured fields when present, else parsed from prose. */
interface NormalizedAttack {
  attackBonus: number;
  reachCells: number;
  damage: Array<{ count: number; faces: number; modifier: number; type: string }>;
}

/**
 * Parse an SRD-style action description into attack/damage numbers, e.g.
 * "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2)
 * slashing damage." Many 5e-2024 statblocks carry these numbers ONLY in prose
 * (no structured fields), so this lets the engine use the values the statblock
 * already prints rather than inventing them. Returns undefined when the text has
 * no recognizable attack.
 */
export function parseAttackFromDescription(description: string): NormalizedAttack | undefined {
  if (!description) return undefined;

  const toHit = /([+-]\d+)\s+to hit/i.exec(description);
  // Damage clauses: "(1d6 + 2) slashing damage", "1 (1d4 - 1) slashing damage".
  const damage: NormalizedAttack['damage'] = [];
  const damageRe = /\((\d+)d(\d+)(?:\s*([+-])\s*(\d+))?\)\s*([a-z]+)?\s*damage/gi;
  let match: RegExpExecArray | null;
  while ((match = damageRe.exec(description)) !== null) {
    const [, count, faces, sign, mod, type] = match;
    const modifier = mod ? (sign === '-' ? -Number(mod) : Number(mod)) : 0;
    damage.push({
      count: Number(count),
      faces: Number(faces),
      modifier,
      type: (type ?? 'untyped').toLowerCase(),
    });
  }

  // Require at least an attack bonus or a damage clause to count as an attack.
  if (!toHit && damage.length === 0) return undefined;

  const reachMatch = /reach (\d+)\s*ft/i.exec(description);
  const rangeMatch = /range (\d+)\s*\/\s*\d+\s*ft/i.exec(description);
  const reachFeet = reachMatch
    ? Number(reachMatch[1])
    : rangeMatch
      ? Number(rangeMatch[1])
      : FEET_PER_CELL;

  return {
    attackBonus: toHit ? Number(toHit[1]) : 0,
    reachCells: Math.max(1, Math.floor(reachFeet / FEET_PER_CELL)),
    damage,
  };
}

/** Normalize an action: structured fields take precedence, prose fills gaps. */
export function normalizeAttack(action: Action): NormalizedAttack | undefined {
  const hasStructured = action.attackBonus != null && (action.damage?.length ?? 0) > 0;
  if (hasStructured) {
    return {
      attackBonus: action.attackBonus ?? 0,
      reachCells: actionReachCells(action),
      damage: (action.damage ?? []).map((d) => ({
        count: d.dice.count,
        faces: dieFaces(d.dice.die),
        modifier: d.dice.modifier ?? 0,
        type: d.type,
      })),
    };
  }
  return parseAttackFromDescription(action.description);
}

/** Reach (in grid cells) of a structured action; melee defaults to 1 cell. */
function actionReachCells(action: Action): number {
  if (action.range) {
    return Math.max(1, Math.floor(action.range.normal / FEET_PER_CELL));
  }
  if (action.reach) {
    return Math.max(1, Math.floor(action.reach / FEET_PER_CELL));
  }
  return 1;
}

/**
 * Pick the monster's primary attack action: the first action that normalizes to
 * an attack (structured fields OR a parseable description).
 */
export function primaryAttackAction(monster: Monster): Action | undefined {
  return monster.actions.find((action) => normalizeAttack(action) !== undefined);
}

/** Build attack-roll effects for a monster's primary attack. */
export function monsterAttackEffects(monster: Monster, action: Action): EffectInstance[] {
  const normalized = normalizeAttack(action);
  const bonus = normalized?.attackBonus ?? 0;
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
 * it later. Uses structured fields when present, else the parsed description.
 */
export function monsterDamageEffects(monster: Monster, action: Action): EffectInstance[] {
  const effects: EffectInstance[] = [];
  const systemId = monster.system as EffectInstance['systemId'];
  const normalized = normalizeAttack(action);
  if (!normalized) return effects;

  for (const [damageIndex, damage] of normalized.damage.entries()) {
    const target = `damage.${damage.type}`;
    const count = Number.isFinite(damage.faces) ? damage.count : 0;

    for (let dieIndex = 0; dieIndex < count; dieIndex += 1) {
      effects.push({
        id: makeEffectId(systemId, target, monster.id, action.name, 'die', damageIndex, dieIndex),
        systemId,
        target,
        operation: 'add-die',
        value: damage.faces,
        stackPolicy: 'sum',
        source: { kind: 'custom', id: monster.id, label: `${monster.name}: ${action.name}` },
        label: `${action.name} d${damage.faces}`,
        category: 'other',
      });
    }

    if (damage.modifier) {
      effects.push({
        id: makeEffectId(systemId, target, monster.id, action.name, 'flat', damageIndex),
        systemId,
        target,
        operation: 'add',
        value: damage.modifier,
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
    reach: action ? (normalizeAttack(action)?.reachCells ?? 1) : 1,
    armorClass: monster.armorClass,
  };
}
