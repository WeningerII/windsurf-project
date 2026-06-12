/**
 * Daggerheart adversary combat adapter: SRD adversary stat blocks become
 * scene combatants under the system's own model (duality dice vs the
 * defender, threshold-marked HP), mirroring the character-side adapter in
 * daggerheartCombatant.ts.
 *
 * Mapping notes:
 *  - Attacks against an adversary roll vs its DIFFICULTY (the scene bridge's
 *    armorClass slot, exactly as character Evasion rides there).
 *  - Threshold encodings keep the SRD semantics: absent thresholds (Minions)
 *    become "never reached" bounds so any damage marks exactly 1 HP; an
 *    absent severe ('8/None' oozes) caps marking at 2.
 *  - The adversary's own attack folds its flat modifier plus the rare dice
 *    modifier ('+2d4') as an attack-side add-die — the resolver rolls it.
 *  - Damage notation ('1d12+2 phy', '2 phy') parses to dice + flat; an
 *    unparseable notation is an honest `unsupported`, never a guess.
 */

import type { DaggerheartAdversary } from '../../types/daggerheart';
import type { SceneCoordinate, SceneToken } from '../../types/core/scene';
import { makeEffectId, type EffectInstance } from '../ir/types';

/** Daggerheart range bands → grid cells (mirrors daggerheartCombatant). */
const RANGE_CELLS: Record<string, number> = {
  Melee: 1,
  'Very Close': 3,
  Close: 6,
  Far: 12,
  'Very Far': 24,
};

export interface DaggerheartAdversaryCombatant {
  token: SceneToken;
  attackEffects: EffectInstance[];
  damageEffects: EffectInstance[];
  /** Attacks against the adversary must meet or beat this (Difficulty). */
  difficulty: number;
  thresholds: { major: number; severe: number };
  reach: number;
  speedCells: number;
}

export type BuildDaggerheartAdversaryResult =
  | { supported: true; combatant: DaggerheartAdversaryCombatant }
  | { supported: false; reason: string };

export function buildDaggerheartAdversaryCombatant(
  adversary: DaggerheartAdversary,
  options: { tokenId: string; position: SceneCoordinate; name?: string }
): BuildDaggerheartAdversaryResult {
  // '1d12+2 phy' / '4d12+8 mag' / '2 phy' (flat, common on Minions) /
  // '1d8+4 phy/mag' (the one type-choice block: dice are unambiguous).
  const damageMatch = /^(?:(\d+)d(\d+))?\s*(?:\+?\s*(\d+))?\s*(?:phy|mag|phy\/mag)?$/.exec(
    adversary.attack.damage.trim()
  );
  const diceCount = damageMatch?.[1] ? Number(damageMatch[1]) : 0;
  const die = damageMatch?.[2] ? Number(damageMatch[2]) : 0;
  const flat = damageMatch?.[3] ? Number(damageMatch[3]) : 0;
  if (!damageMatch || (diceCount === 0 && flat === 0)) {
    return {
      supported: false,
      reason: `Unparseable adversary damage '${adversary.attack.damage}'.`,
    };
  }

  const attackEffects: EffectInstance[] = [
    {
      id: makeEffectId('daggerheart', 'adversary-attack', adversary.id),
      systemId: 'daggerheart',
      target: 'attack',
      operation: 'add',
      value: adversary.attackModifier,
      stackPolicy: 'sum',
      source: { kind: 'system', id: adversary.id, label: adversary.name },
      label: `${adversary.attack.name} (${adversary.attackModifier >= 0 ? '+' : ''}${adversary.attackModifier})`,
    },
  ];
  if (adversary.attackBonusDice) {
    for (let index = 0; index < adversary.attackBonusDice.count; index += 1) {
      attackEffects.push({
        id: makeEffectId('daggerheart', 'adversary-attack', adversary.id, 'die', index),
        systemId: 'daggerheart',
        target: 'attack',
        operation: 'add-die',
        value: adversary.attackBonusDice.die,
        stackPolicy: 'sum',
        source: { kind: 'system', id: adversary.id, label: adversary.name },
        label: `${adversary.attack.name} +d${adversary.attackBonusDice.die}`,
      });
    }
  }

  const damageEffects: EffectInstance[] = [];
  for (let index = 0; index < diceCount; index += 1) {
    damageEffects.push({
      id: makeEffectId('daggerheart', 'adversary-damage', adversary.id, 'die', index),
      systemId: 'daggerheart',
      target: 'damage',
      operation: 'add-die',
      value: die,
      stackPolicy: 'sum',
      source: { kind: 'system', id: adversary.id, label: adversary.name },
      label: `${adversary.attack.name} d${die}`,
    });
  }
  if (flat) {
    damageEffects.push({
      id: makeEffectId('daggerheart', 'adversary-damage', adversary.id, 'flat'),
      systemId: 'daggerheart',
      target: 'damage',
      operation: 'add',
      value: flat,
      stackPolicy: 'sum',
      source: { kind: 'system', id: adversary.id, label: adversary.name },
      label: `${adversary.attack.name} +${flat}`,
    });
  }

  // SRD threshold semantics via "never reached" bounds: a Minion (no
  // thresholds) marks exactly 1 HP on any damage; a missing severe caps at 2.
  const NEVER = Number.MAX_SAFE_INTEGER;
  const thresholds = {
    major: adversary.thresholds?.major ?? NEVER,
    severe: adversary.thresholds?.severe ?? NEVER,
  };

  return {
    supported: true,
    combatant: {
      token: {
        id: options.tokenId,
        name: options.name ?? adversary.name,
        kind: 'monster',
        position: options.position,
        size: 1,
        refId: adversary.id,
        // Adversary HP is a slot track, exactly like character HP.
        hp: { current: adversary.hitPoints, max: adversary.hitPoints, temp: 0 },
      },
      attackEffects,
      damageEffects,
      difficulty: adversary.difficulty,
      thresholds,
      reach: RANGE_CELLS[adversary.attack.range] ?? 1,
      speedCells: 6,
    },
  };
}
