/**
 * Adapter: Daggerheart CharacterDocument → combat-ready data.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * Daggerheart doesn't use attack-vs-AC-reduce-HP: an attack that beats the
 * target's Evasion deals damage compared to the target's thresholds to MARK 1-3
 * HP slots (resolver/daggerheartResolution). This adapter produces what that
 * resolver needs from the sheet — Evasion (the AC analogue), the Major/Severe
 * thresholds, and HP slots — plus attack/damage effects.
 *
 * Evasion, thresholds, and HP slots are read faithfully from the sheet. The
 * attack bonus and damage use the character's best trait + a baseline weapon die
 * (refined when weapon-definition lookup lands) — the same honest-baseline stance
 * buildCharacterCombatant takes for d20 weapons, so a Daggerheart PC can fight
 * with real defenses and the distinctive HP-slot mechanic without invented gear.
 */

import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneCoordinate, SceneToken } from '../../types/core/scene';
import { makeEffectId, type EffectInstance } from '../ir/types';
import type { DaggerheartThresholds } from '../resolver/daggerheartResolution';

const TRAITS = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'] as const;

export interface DaggerheartCombatant {
  token: SceneToken;
  attackEffects: EffectInstance[];
  damageEffects: EffectInstance[];
  reach: number;
  /** Evasion — the total an attacker must meet to hit (the AC analogue). */
  evasion: number;
  thresholds: DaggerheartThresholds;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** Build a combat-ready combatant from a Daggerheart character sheet. */
export function buildDaggerheartCombatant(
  document: CharacterDocument<SystemDataModel>,
  options: { tokenId?: string; position: SceneCoordinate; weaponDie?: number; reach?: number }
): DaggerheartCombatant {
  const system = document.system as Record<string, unknown>;
  const attributes = (system.attributes as Record<string, number>) ?? {};
  const bestTrait = Math.max(0, ...TRAITS.map((trait) => num(attributes[trait])));

  const evasion = num(system.evasion, 10);
  const thresholds: DaggerheartThresholds = {
    major: num(system.majorThreshold, 1),
    severe: num(system.severeThreshold, Number.MAX_SAFE_INTEGER),
  };
  const hp = (system.hitPoints as { current?: number; max?: number }) ?? {};
  const id = document.id;

  const attackEffects: EffectInstance[] = [
    {
      id: makeEffectId('daggerheart', 'attack', id),
      systemId: 'daggerheart',
      target: 'attack',
      operation: 'add',
      value: bestTrait,
      stackPolicy: 'sum',
      source: { kind: 'custom', id, label: `${document.name} attack` },
      label: 'Daggerheart attack (best trait)',
      category: 'other',
    },
  ];

  const weaponDie = options.weaponDie ?? 8;
  const damageEffects: EffectInstance[] = [
    {
      id: makeEffectId('daggerheart', 'damage', id, 'die'),
      systemId: 'daggerheart',
      target: 'damage',
      operation: 'add-die',
      value: weaponDie,
      stackPolicy: 'sum',
      source: { kind: 'custom', id, label: `${document.name} weapon` },
      label: `1d${weaponDie}`,
      category: 'other',
    },
    {
      id: makeEffectId('daggerheart', 'damage', id, 'trait'),
      systemId: 'daggerheart',
      target: 'damage',
      operation: 'add',
      value: bestTrait,
      stackPolicy: 'sum',
      source: { kind: 'custom', id, label: `${document.name} damage` },
      label: 'Daggerheart damage (best trait)',
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
      hp: { current: num(hp.current, 6), max: num(hp.max, 6), temp: 0 },
    },
    attackEffects,
    damageEffects,
    reach: options.reach ?? 1,
    evasion,
    thresholds,
  };
}
