/**
 * M&M 3e combat adapter (road-to-launch phase 3, item 3).
 *
 * M&M has no hit points: attacks roll d20 vs Dodge/Parry, hits force a
 * Toughness save vs DC 15 + effect rank, and the save's shortfall drives a
 * CONDITION track (bruised/dazed/staggered/incapacitated). The long-dormant
 * native resolver (resolveMam3eAttack / applyToughnessDegrees) becomes
 * product-reachable through this adapter:
 *
 *  - scene tokens carry hp {1,1} as a pure up/down flag — the real combat
 *    state lives in token CONDITIONS (which scenes persist and replay);
 *  - incapacitation downs the token (apply-damage 1) so the existing
 *    liveness and combat-end machinery applies unchanged;
 *  - non-incapacitating outcomes emit set-token-conditions intents with the
 *    cumulative track ('bruised-2', 'dazed', 'staggered').
 *
 * The attack profile comes from the character's best attack power (highest
 * rank): effect rank sets the Toughness DC; close attacks roll FGT +
 * Close Combat skill vs Parry, ranged roll DEX + Ranged Combat vs Dodge.
 */

import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneCoordinate, SceneToken } from '../../types/core/scene';
import type { Mam3eDataModel } from '../../systems/mam3e/data-model';
import { makeEffectId, type EffectInstance } from '../index';

export interface Mam3eCombatant {
  token: SceneToken;
  attackEffects: EffectInstance[];
  /** Effect rank of the chosen attack power (Toughness DC = 15 + rank). */
  effectRank: number;
  /** True when the chosen attack is ranged (targets Dodge; else Parry). */
  ranged: boolean;
  dodge: number;
  parry: number;
  toughness: number;
  reach: number;
  speedCells: number;
}

export type BuildMam3eCombatantResult =
  | { supported: true; combatant: Mam3eCombatant }
  | { supported: false; reason: string };

export function buildMam3eCombatant(
  doc: CharacterDocument<SystemDataModel>,
  options: { tokenId: string; position: SceneCoordinate; name?: string }
): BuildMam3eCombatantResult {
  if (doc.systemId !== 'mam3e') {
    return { supported: false, reason: `Not an M&M 3e document: ${doc.systemId}` };
  }
  const system = doc.system as Mam3eDataModel;
  const attackPowers = (system.powers ?? []).filter(
    (power) => power.type === 'attack' && (power.rank ?? 0) > 0
  );
  if (!attackPowers.length) {
    return {
      supported: false,
      reason: 'No attack power (M&M combat needs at least one attack effect).',
    };
  }
  const power = attackPowers.reduce((best, candidate) =>
    (candidate.rank ?? 0) > (best.rank ?? 0) ? candidate : best
  );
  const ranged = power.range !== 'close';
  const abilityBonus = ranged ? (system.abilities?.dex ?? 0) : (system.abilities?.fgt ?? 0);
  const skillBonus = ranged
    ? (system.skills?.['ranged-combat']?.rank ?? 0)
    : (system.skills?.['close-combat']?.rank ?? 0);

  const attackEffects: EffectInstance[] = [
    {
      id: makeEffectId('mam3e', 'attack', doc.id, power.id),
      systemId: 'mam3e',
      target: 'attack',
      operation: 'add',
      value: abilityBonus + skillBonus,
      stackPolicy: 'sum',
      source: { kind: 'system', id: power.id, label: power.name },
      label: `${power.name} attack (${ranged ? 'DEX + Ranged Combat' : 'FGT + Close Combat'})`,
    },
  ];

  return {
    supported: true,
    combatant: {
      token: {
        id: options.tokenId,
        name: options.name ?? doc.name,
        kind: 'character',
        position: options.position,
        size: 1,
        refId: doc.id,
        // Up/down flag only — M&M combat state is the condition track.
        hp: { current: 1, max: 1, temp: 0 },
      },
      attackEffects,
      effectRank: power.rank ?? 1,
      ranged,
      dodge: system.defenses?.dodge?.total ?? 10,
      parry: system.defenses?.parry?.total ?? 10,
      toughness: system.defenses?.toughness?.total ?? 0,
      reach: ranged ? 12 : 1,
      speedCells: 6,
    },
  };
}

/**
 * Fold a resolver condition delta into a token's persisted condition list.
 * Bruises are cumulative ('bruised-N' replaces the previous count); boolean
 * conditions accumulate (a second Staggered is escalated to incapacitation by
 * the RESOLVER, not here).
 */
export function nextMam3eTokenConditions(
  existing: readonly string[],
  delta: { bruised: number; dazed: boolean; staggered: boolean; incapacitated: boolean }
): string[] {
  const bruiseMatch = existing.map((condition) => /^bruised-(\d+)$/.exec(condition)).find(Boolean);
  const bruises = (bruiseMatch ? Number(bruiseMatch[1]) : 0) + delta.bruised;
  const next = new Set(existing.filter((condition) => !/^bruised-\d+$/.test(condition)));
  if (bruises > 0) next.add(`bruised-${bruises}`);
  if (delta.dazed) next.add('dazed');
  if (delta.staggered) next.add('staggered');
  if (delta.incapacitated) next.add('incapacitated');
  return [...next];
}
