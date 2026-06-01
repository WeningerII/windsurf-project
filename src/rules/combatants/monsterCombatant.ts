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

/** A single damage clause: N dice of M faces + a flat modifier, of a type. */
interface DamageClause {
  count: number;
  faces: number;
  modifier: number;
  type: string;
}

/** A normalized attack: structured fields when present, else parsed from prose. */
interface NormalizedAttack {
  attackBonus: number;
  reachCells: number;
  damage: DamageClause[];
}

/** A normalized save-based action (breath weapon / AoE): DC + save + damage. */
interface NormalizedSaveAction {
  /** Ability the target saves with, lowercased (e.g. 'dex'). */
  saveAbility: string;
  saveDC: number;
  /** When true (5e default for "half as much"), a success halves damage. */
  halfOnSave: boolean;
  damage: DamageClause[];
}

/**
 * Parse the damage dice clauses out of a scoped string, e.g.
 * "(1d6 + 2) slashing damage plus (1d6) fire damage" → two clauses. Pure helper
 * shared by the attack and save-action parsers.
 */
function parseDamageClauses(scope: string): DamageClause[] {
  const damage: DamageClause[] = [];
  const damageRe = /\((\d+)d(\d+)(?:\s*([+-])\s*(\d+))?\)\s*([a-z]+)?\s*damage/gi;
  let match: RegExpExecArray | null;
  while ((match = damageRe.exec(scope)) !== null) {
    const [, count, faces, sign, mod, type] = match;
    const modifier = mod ? (sign === '-' ? -Number(mod) : Number(mod)) : 0;
    damage.push({
      count: Number(count),
      faces: Number(faces),
      modifier,
      type: (type ?? 'untyped').toLowerCase(),
    });
  }
  return damage;
}

/**
 * Parse an SRD-style action description into a to-hit attack, e.g.
 * "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2)
 * slashing damage." Many 5e-2024 statblocks carry these numbers ONLY in prose
 * (no structured fields), so this lets the engine use the values the statblock
 * already prints rather than inventing them.
 *
 * Scope: ATTACK-ROLL actions only. A "+N to hit" is REQUIRED. An action with a
 * damage clause but no to-hit (a breath weapon / save-or-suck such as "DC 15
 * Dexterity saving throw, taking 31 (7d8) fire damage") is a save-based effect,
 * not an attack, and is intentionally NOT returned here — it belongs to the
 * area/save resolver. Returns undefined for non-attacks (Multiattack references,
 * save-based actions, passive abilities).
 */
export function parseAttackFromDescription(description: string): NormalizedAttack | undefined {
  if (!description) return undefined;

  const toHit = /([+-]\d+)\s+to hit/i.exec(description);
  // No to-hit -> not an attack-roll action.
  if (!toHit) return undefined;

  // Damage lives after the "Hit:" marker in SRD prose. Scope parsing to it so a
  // " or " in the attack-type prefix ("Melee or Ranged Weapon Attack") is never
  // mistaken for an alternative damage mode.
  const hitIndex = description.search(/\bHit:\s*/i);
  const damageScope = hitIndex >= 0 ? description.slice(hitIndex) : description;
  // Versatile / two-handed wording ("... or 11 (1d10 + 4) ... if used with two
  // hands") lists an ALTERNATIVE damage; take only the primary mode (before the
  // first " or "). Additive damage uses "plus", which we keep, so multi-type
  // hits ("X slashing plus Y fire") still parse fully.
  const primaryScope = hitIndex >= 0 ? damageScope.split(/\bor\b/i)[0] : damageScope;

  const damage = parseDamageClauses(primaryScope);

  const reachMatch = /reach (\d+)\s*ft/i.exec(description);
  const rangeMatch = /range (\d+)\s*\/\s*\d+\s*ft/i.exec(description);
  const reachFeet = reachMatch
    ? Number(reachMatch[1])
    : rangeMatch
      ? Number(rangeMatch[1])
      : FEET_PER_CELL;

  return {
    attackBonus: Number(toHit[1]),
    reachCells: Math.max(1, Math.floor(reachFeet / FEET_PER_CELL)),
    damage,
  };
}

const SAVE_ABILITY_WORDS: Record<string, string> = {
  strength: 'str',
  dexterity: 'dex',
  constitution: 'con',
  intelligence: 'int',
  wisdom: 'wis',
  charisma: 'cha',
};

/**
 * Parse a save-based action (breath weapon / area effect) from SRD prose, e.g.
 * "Each creature in that area must make a DC 11 Dexterity saving throw, taking
 * 22 (5d8) fire damage on a failed save, or half as much on a successful one."
 *
 * Scope: requires a "DC N <Ability> saving throw" and at least one damage clause,
 * and must NOT be a to-hit attack (those are handled by the attack parser). This
 * is the complement of `parseAttackFromDescription`: between them every damaging
 * monster action resolves through either the attack or the area/save path.
 */
export function parseSaveActionFromDescription(
  description: string
): NormalizedSaveAction | undefined {
  if (!description) return undefined;
  // A to-hit attack is not a save-based area action — keep the two disjoint.
  if (/\bto hit\b/i.test(description)) return undefined;

  const save =
    /DC\s+(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving throw/i.exec(
      description
    );
  if (!save) return undefined;

  const damage = parseDamageClauses(description);
  if (damage.length === 0) return undefined;

  return {
    saveAbility: SAVE_ABILITY_WORDS[save[2].toLowerCase()] ?? save[2].toLowerCase(),
    saveDC: Number(save[1]),
    // "half as much" (the SRD default for AoE damage) → half on save; absent it
    // negates on a success.
    halfOnSave: /half as much/i.test(description),
    damage,
  };
}

/**
 * Normalize an action into a to-hit attack. Structured fields are authoritative
 * when present: an action with `attackBonus` IS an attack (damage may be empty —
 * a to-hit that only applies a condition, like a Web/grapple). Prose parsing is
 * the fallback for actions that have not been backfilled.
 */
export function normalizeAttack(action: Action): NormalizedAttack | undefined {
  if (action.attackBonus != null) {
    return {
      attackBonus: action.attackBonus,
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

/**
 * Normalize an action into a save-based area effect. Structured `savingThrow` +
 * `damage` are authoritative when present; otherwise the prose parser fills in.
 * Returns undefined for to-hit attacks and non-damaging actions.
 */
export function normalizeSaveAction(action: Action): NormalizedSaveAction | undefined {
  if (action.attackBonus != null) return undefined; // it's a to-hit attack
  if (action.savingThrow && (action.damage?.length ?? 0) > 0) {
    return {
      saveAbility: action.savingThrow.attribute.toLowerCase(),
      saveDC: action.savingThrow.dc,
      halfOnSave: /half/i.test(action.savingThrow.effect),
      damage: (action.damage ?? []).map((d) => ({
        count: d.dice.count,
        faces: dieFaces(d.dice.die),
        modifier: d.dice.modifier ?? 0,
        type: d.type,
      })),
    };
  }
  return parseSaveActionFromDescription(action.description);
}

/** Build damage effects (IR) for a save-based action's primary damage. */
export function saveActionDamageEffects(monster: Monster, action: Action): EffectInstance[] {
  const normalized = normalizeSaveAction(action);
  if (!normalized) return [];
  const systemId = monster.system as EffectInstance['systemId'];
  const effects: EffectInstance[] = [];
  for (const [index, clause] of normalized.damage.entries()) {
    const target = `damage.${clause.type}`;
    for (let dieIndex = 0; dieIndex < clause.count; dieIndex += 1) {
      effects.push({
        id: makeEffectId(systemId, target, monster.id, action.name, 'die', index, dieIndex),
        systemId,
        target,
        operation: 'add-die',
        value: clause.faces,
        stackPolicy: 'sum',
        source: { kind: 'custom', id: monster.id, label: `${monster.name}: ${action.name}` },
        label: `${action.name} d${clause.faces}`,
        category: 'other',
      });
    }
    if (clause.modifier) {
      effects.push({
        id: makeEffectId(systemId, target, monster.id, action.name, 'flat', index),
        systemId,
        target,
        operation: 'add',
        value: clause.modifier,
        stackPolicy: 'sum',
        source: { kind: 'custom', id: monster.id, label: `${monster.name}: ${action.name}` },
        label: `${action.name} damage bonus`,
        category: 'other',
      });
    }
  }
  return effects;
}

/** The monster's save-based actions (breath weapons / AoE), normalized. */
export interface MonsterSaveAction {
  name: string;
  saveAbility: string;
  saveDC: number;
  halfOnSave: boolean;
  damageEffects: EffectInstance[];
}

export function monsterSaveActions(monster: Monster): MonsterSaveAction[] {
  const result: MonsterSaveAction[] = [];
  for (const action of monster.actions ?? []) {
    const normalized = normalizeSaveAction(action);
    if (!normalized) continue;
    result.push({
      name: action.name,
      saveAbility: normalized.saveAbility,
      saveDC: normalized.saveDC,
      halfOnSave: normalized.halfOnSave,
      damageEffects: saveActionDamageEffects(monster, action),
    });
  }
  return result;
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
