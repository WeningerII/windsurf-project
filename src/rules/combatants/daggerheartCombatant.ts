/**
 * Daggerheart combat adapter (road-to-launch phase 3, item 2).
 *
 * Daggerheart deliberately does NOT use the d20 attack-vs-AC / HP-pool model
 * (`buildCharacterCombatant` returns `unsupported` for it). This adapter
 * speaks the system's own language and feeds the scene bridge:
 *   - attacks roll the 2d12 duality dice vs Evasion (resolveDaggerheartAttack);
 *   - damage compares to Major/Severe thresholds and MARKS 1-3 HP slots
 *     (daggerheartHpMarked) — marked HP is exactly the scene `apply-damage`
 *     amount, since Daggerheart token HP is the character's slot track.
 *
 * Weapons are catalog references on the document (`weapons.primaryId`), so the
 * caller preloads the weapon list (mirroring the scene monster preload) and
 * passes a lookup. The attack trait uses the EFFECTIVE attribute (passive
 * domain-card bonuses included), and damage dice count equals proficiency
 * (Daggerheart SRD: proficiency = number of damage dice).
 */

import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneCoordinate, SceneToken } from '../../types/core/scene';
import type { DaggerheartWeapon } from '../../types/daggerheart';
import type { DaggerheartDataModel } from '../../systems/daggerheart/data-model';
import {
  getDaggerheartDerivedStats,
  getDaggerheartEffectiveAttribute,
  getDaggerheartProficiency,
} from '../../utils/daggerheartDerived';
import { makeEffectId, type EffectInstance } from '../index';

/** Daggerheart range bands → grid cells (5 ft. per cell, SRD distances). */
const RANGE_CELLS: Record<string, number> = {
  melee: 1,
  'very-close': 3,
  close: 6,
  far: 12,
  'very-far': 24,
};

export interface DaggerheartCombatant {
  token: SceneToken;
  attackEffects: EffectInstance[];
  damageEffects: EffectInstance[];
  /** The value attacks against this combatant must meet or beat. */
  evasion: number;
  thresholds: { major: number; severe: number };
  reach: number;
  speedCells: number;
}

export type BuildDaggerheartCombatantResult =
  | { supported: true; combatant: DaggerheartCombatant }
  | { supported: false; reason: string };

export function buildDaggerheartCombatant(
  doc: CharacterDocument<SystemDataModel>,
  weaponsById: ReadonlyMap<string, DaggerheartWeapon>,
  options: { tokenId: string; position: SceneCoordinate; name?: string }
): BuildDaggerheartCombatantResult {
  if (doc.systemId !== 'daggerheart') {
    return { supported: false, reason: `Not a Daggerheart document: ${doc.systemId}` };
  }
  const system = doc.system as DaggerheartDataModel;
  const weapon = weaponsById.get(system.weapons?.primaryId ?? '');
  if (!weapon) {
    return {
      supported: false,
      reason: 'No equipped primary weapon (Daggerheart combat needs a weapon profile).',
    };
  }

  const damageMatch = /^d(\d+)(?:\s*\+\s*(\d+))?$/.exec(weapon.damage.trim());
  if (!damageMatch) {
    return { supported: false, reason: `Unparseable weapon damage '${weapon.damage}'.` };
  }
  const die = Number(damageMatch[1]);
  const flat = damageMatch[2] ? Number(damageMatch[2]) : 0;
  const derived = getDaggerheartDerivedStats(system);
  const proficiency = getDaggerheartProficiency(system.level ?? 1);
  const traitValue = getDaggerheartEffectiveAttribute(
    system,
    weapon.trait === 'spellcast' ? 'knowledge' : weapon.trait
  );

  const attackEffects: EffectInstance[] = [
    {
      id: makeEffectId('daggerheart', 'attack', doc.id, weapon.id),
      systemId: 'daggerheart',
      target: 'attack',
      operation: 'add',
      value: traitValue,
      stackPolicy: 'sum',
      source: { kind: 'system', id: weapon.trait, label: `${weapon.trait} trait` },
      label: `${weapon.name} attack (${weapon.trait})`,
    },
  ];
  // Numeric weapon features compile (SRD: Reliable "+1 to attack rolls");
  // prose-only features stay prose - never guessed into numbers.
  const attackFeature = /([+-]\d+)\s*to attack rolls/i.exec(weapon.feature ?? '');
  if (attackFeature) {
    attackEffects.push({
      id: makeEffectId('daggerheart', 'attack', doc.id, weapon.id, 'feature'),
      systemId: 'daggerheart',
      target: 'attack',
      operation: 'add',
      value: Number(attackFeature[1]),
      stackPolicy: 'sum',
      source: { kind: 'item', id: weapon.id, label: weapon.name },
      label: weapon.feature ?? 'weapon feature',
    });
  }
  const damageEffects: EffectInstance[] = [];
  for (let index = 0; index < proficiency; index += 1) {
    damageEffects.push({
      id: makeEffectId('daggerheart', 'damage', doc.id, weapon.id, 'die', index),
      systemId: 'daggerheart',
      target: 'damage',
      operation: 'add-die',
      value: die,
      stackPolicy: 'sum',
      source: { kind: 'item', id: weapon.id, label: weapon.name },
      label: `${weapon.name} d${die}`,
    });
  }
  if (flat) {
    damageEffects.push({
      id: makeEffectId('daggerheart', 'damage', doc.id, weapon.id, 'flat'),
      systemId: 'daggerheart',
      target: 'damage',
      operation: 'add',
      value: flat,
      stackPolicy: 'sum',
      source: { kind: 'item', id: weapon.id, label: weapon.name },
      label: `${weapon.name} +${flat}`,
    });
  }

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
        // Daggerheart token HP IS the slot track: marked HP = damage amount.
        hp: {
          current: system.hitPoints?.current ?? system.hitPoints?.max ?? 6,
          max: system.hitPoints?.max ?? 6,
          temp: 0,
        },
      },
      attackEffects,
      damageEffects,
      // EFFECTIVE defenses: armor bases, passive item/domain bonuses, and
      // unarmored overrides included (same math the sheet displays).
      evasion: derived.evasion,
      thresholds: {
        major: derived.majorThreshold,
        severe: derived.severeThreshold,
      },
      reach: RANGE_CELLS[weapon.range] ?? 1,
      speedCells: 6,
    },
  };
}
