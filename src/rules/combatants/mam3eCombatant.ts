/**
 * Adapter: Mutants & Masterminds 3e CharacterDocument → combat-ready data.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * M&M has NO hit points: an attack that beats the target's active defense forces
 * a Toughness save whose shortfall drives a condition track (Bruised → Dazed →
 * Staggered → Incapacitated). This adapter produces what resolveMam3eAttack needs
 * from the sheet — a close attack bonus, the target's Parry/Dodge and Toughness,
 * and the attacker's effect rank.
 *
 * Defenses and Toughness are read faithfully from the sheet. The effect rank
 * (attack severity) uses Strength as a close-combat baseline — powers refine it,
 * the same honest-baseline stance the other adapters take for weapons.
 */

import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneCoordinate, SceneToken } from '../../types/core/scene';
import type { Power } from '../../types/mam/powers';
import { getPowerRank } from '../../systems/mam3e/powerMath';
import { makeEffectId, type EffectInstance } from '../ir/types';

export interface Mam3eCombatant {
  /** No hit points — M&M tracks harm as conditions, set via apply-conditions. */
  token: SceneToken;
  attackEffects: EffectInstance[];
  /** Close (Parry) defense — the value an attacker's roll must meet to hit. */
  parry: number;
  /** Ranged (Dodge) defense. */
  dodge: number;
  /** Toughness save bonus. */
  toughness: number;
  /** Effect rank of the attack (sets the Toughness DC = 15 + rank). */
  effectRank: number;
  reach: number;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** Build a combat-ready combatant from an M&M 3e character sheet. */
export function buildMam3eCombatant(
  document: CharacterDocument<SystemDataModel>,
  options: { tokenId?: string; position: SceneCoordinate; reach?: number }
): Mam3eCombatant {
  const system = document.system as Record<string, unknown>;
  const abilities = (system.abilities as Record<string, number>) ?? {};
  const skills = (system.skills as Record<string, { rank?: number }>) ?? {};
  const defenses = (system.defenses as Record<string, { total?: number }>) ?? {};
  const powers = (system.powers as Power[] | undefined) ?? [];
  const id = document.id;

  const closeAttack = num(abilities.fgt) + num(skills['close-combat']?.rank);

  // Effect rank (attack severity → Toughness DC = 15 + rank). Strength is the
  // unarmed/close-combat baseline; a close-range Damage power refines it upward
  // when the hero leads with a power rather than a punch.
  const bestClosePowerRank = powers
    .filter((power) => power.type === 'attack' && power.range === 'close')
    .reduce((max, power) => Math.max(max, getPowerRank(power)), 0);
  const effectRank = Math.max(num(abilities.str), bestClosePowerRank);

  const attackEffects: EffectInstance[] = [
    {
      id: makeEffectId('mam3e', 'attack', id),
      systemId: 'mam3e',
      target: 'attack',
      operation: 'add',
      value: closeAttack,
      stackPolicy: 'sum',
      source: { kind: 'custom', id, label: `${document.name} attack` },
      label: 'M&M close attack',
      category: 'other',
    },
  ];

  return {
    token: {
      id: options.tokenId ?? id,
      name: document.name,
      kind: 'character',
      position: options.position,
      size: 1,
      refId: id,
      conditions: { bruised: 0, dazed: false, staggered: false, incapacitated: false },
    },
    attackEffects,
    parry: num(defenses.parry?.total, 10),
    dodge: num(defenses.dodge?.total, 10),
    toughness: num(defenses.toughness?.total),
    effectRank,
    reach: options.reach ?? 1,
  };
}
