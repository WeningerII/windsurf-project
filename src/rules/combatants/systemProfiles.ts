/**
 * Per-system combat profiles for the d20-family character combatant adapter.
 *
 * Each supported system contributes ONE profile describing how its sheet maps
 * onto the shared "attack vs AC, reduce HP" combat shape: base attack bonus,
 * which equipped items are combat-active, rider/condition effects, weapon
 * capabilities (versatile / off-hand), and attack economy (5e Extra Attack vs
 * legacy iteratives). The builder in characterCombatant.ts stays free of
 * `systemId === ...` branching: it asks the profile.
 *
 * Mirrors the established rules-layer pattern of per-system vocabulary modules
 * (conditions/dnd5eRiders.ts, resolver/pf2eDegree.ts, ...). Adding a system to
 * the d20 family means adding a profile here — nothing else in the builder
 * changes.
 */

import type { GameSystemId } from '../../types/game-systems';
import type { EquippedItem, Feat, Feature } from '../../types/core/character';
import { abilityMod, profBonus } from '../../utils/math';
import { pf2eMultipleAttackPenalty } from '../../utils/derivedCombatMath';
import { collectDnd5eRiderEffects } from '../conditions/dnd5eRiders';
import { collectPf2eRiderEffects } from '../conditions/pf2eRiders';
import { collectD20LegacyConditionEffects } from '../conditions/d20LegacyConditions';
import { collectD20LegacyRiderEffects } from '../conditions/d20LegacyRiders';
import type { EffectInstance } from '../ir/types';

/** Sheet fields the adapter reads, normalized across the d20 family. */
export interface NormalizedSheet {
  level: number;
  abilities: Record<string, number>;
  armorClass: number;
  hp: { current: number; max: number; temp: number };
  baseAttackBonus: number;
  equipment: EquippedItem[];
  feats: Feat[];
  features: Feature[];
}

/** Everything a profile may need to assemble rider/condition effects. */
export interface RiderContext {
  activeToggles: string[];
  featureIds: Set<string>;
  featIds: Set<string>;
  level: number;
  baseAttackBonus: number;
  classLevel: (classId: string) => number;
  conditionIds: string[];
}

export interface AttackEconomy {
  attacksPerRound: number;
  iterativePenaltyStep?: number;
}

export interface D20SystemProfile {
  /** Base attack bonus before equipment/feat effects (ability half included). */
  baseAttackBonus(sheet: NormalizedSheet, system: Record<string, unknown>): number;
  /** Which equipped items are "active" for combat, per the system's convention. */
  isActiveWeapon(item: EquippedItem): boolean;
  /** System riders + persisted-condition effects, in the system's canonical order. */
  collectRiderEffects(ctx: RiderContext): EffectInstance[];
  /** 5e-family: Versatile weapons roll the larger die when wielded two-handed. */
  supportsVersatile: boolean;
  /** 5e-family: off-hand light weapon grants a bonus attack (Two-Weapon Fighting). */
  supportsOffHand: boolean;
  /**
   * PF2e-family: a striking rune (striking/greater/major) sets the equipped
   * weapon's damage-dice count to 2/3/4. Other d20 systems have no such rune.
   */
  supportsStrikingRunes: boolean;
  /** Attack action economy: Extra Attack features vs BAB-driven iteratives. */
  attackEconomy(sheet: NormalizedSheet): AttackEconomy;
}

export function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/**
 * Finesse-agnostic ability half of the attack roll: the better of STR/DEX (a
 * DEX rogue is not crippled, a STR fighter loses nothing) until equipped-weapon
 * data drives the choice.
 */
function bestAttackAbility(sheet: NormalizedSheet): number {
  return Math.max(abilityMod(sheet.abilities.str ?? 10), abilityMod(sheet.abilities.dex ?? 10));
}

/** Highest martial/relevant weapon-proficiency total for PF2e (level + tier). */
function pf2eWeaponProficiency(system: Record<string, unknown>): number {
  const profs = system.weaponProficiencies;
  if (!profs || typeof profs !== 'object') return 0;
  let best = 0;
  for (const prof of Object.values(profs as Record<string, { total?: unknown }>)) {
    best = Math.max(best, num(prof?.total));
  }
  return best;
}

/**
 * 5e Extra Attack: each granted 'extra-attack*' class feature adds one attack
 * to the Attack action (fighter 5/11/20 reach 2/3/4; other martials 2 at 5).
 */
function extraAttackCount(features: Feature[]): number {
  return features.filter((feature) => /^extra-attack(-\d+)?$/.test(feature.id)).length;
}

const featureAttackEconomy = (sheet: NormalizedSheet): AttackEconomy => ({
  attacksPerRound: 1 + extraAttackCount(sheet.features),
});

/** Shared by both 5e editions (the 2024 engine extends the 2014 base). */
const dnd5eProfile: D20SystemProfile = {
  baseAttackBonus: (sheet) => profBonus(sheet.level) + bestAttackAbility(sheet),
  // 5e marks worn items by slot; an explicit `equipped` flag also counts.
  isActiveWeapon: (item) =>
    item.slot === 'mainHand' || (item as unknown as { equipped?: boolean }).equipped === true,
  collectRiderEffects: (ctx) =>
    collectDnd5eRiderEffects({
      activeToggles: ctx.activeToggles,
      featureIds: ctx.featureIds,
      featIds: ctx.featIds,
      barbarianLevel: ctx.classLevel('barbarian'),
      rogueLevel: ctx.classLevel('rogue'),
    }),
  supportsVersatile: true,
  supportsOffHand: true,
  supportsStrikingRunes: false,
  attackEconomy: featureAttackEconomy,
};

const pf2eProfile: D20SystemProfile = {
  baseAttackBonus: (sheet, system) => pf2eWeaponProficiency(system) + bestAttackAbility(sheet),
  isActiveWeapon: (item) => (item as unknown as { equipped?: boolean }).equipped === true,
  // PF2e riders mirror the 5e set with CRB numbers (Rage +2, Sneak Attack
  // 1d6/2d6@5/3d6@11/4d6@17), gated the same way.
  collectRiderEffects: (ctx) =>
    collectPf2eRiderEffects({
      activeToggles: ctx.activeToggles,
      featureIds: ctx.featureIds,
      level: ctx.level,
    }),
  supportsVersatile: false,
  supportsOffHand: false,
  supportsStrikingRunes: true,
  // PF2e three-action economy: a full offensive turn spends all three actions
  // Striking (up to three Strikes). Every Strike after the first takes the
  // Multiple Attack Penalty — a cumulative −5 (register-linked
  // pf2eMultipleAttackPenalty; the step is |MAP(2nd attack)| = 5), which the
  // tactical executor applies as iterativePenaltyStep × attackIndex → 0/−5/−10.
  //
  // Agile's reduced −4 / −8 MAP is deliberately NOT automated here: no equipped
  // weapon carries an `agile` trait in the current equipment data, so lowering
  // the step would be fake automation. When weapon-trait data lands, an agile
  // main weapon can drive the reduced step; until then the boundary stays honest
  // at the CRB non-agile default.
  attackEconomy: (): AttackEconomy => ({
    attacksPerRound: 3,
    iterativePenaltyStep: Math.abs(pf2eMultipleAttackPenalty(2, false)),
  }),
};

/** 3.5e / PF1e share the legacy-d20 shape; the systemId picks rider numbers. */
const legacyD20Profile = (systemId: 'dnd-3.5e' | 'pf1e'): D20SystemProfile => ({
  baseAttackBonus: (sheet, system) => num(system.baseAttackBonus) + bestAttackAbility(sheet),
  isActiveWeapon: (item) => (item as unknown as { equipped?: boolean }).equipped === true,
  // PF1e Power Attack's formula-fixed trade compiles (-[1+BAB/4] attack /
  // +2x damage); 3.5e's choose-N trade stays manual. Persisted sheet
  // conditions (shaken/sickened/...) fight along via the shared catalog.
  collectRiderEffects: (ctx) => [
    ...collectD20LegacyRiderEffects({
      systemId,
      activeToggles: ctx.activeToggles,
      featIds: ctx.featIds,
      baseAttackBonus: ctx.baseAttackBonus,
    }),
    ...collectD20LegacyConditionEffects(systemId, ctx.conditionIds),
  ],
  supportsVersatile: false,
  supportsOffHand: false,
  supportsStrikingRunes: false,
  // Iteratives from BAB (extra attack at +6/+11/+16, each at a cumulative -5
  // on a full attack — SRD: Base Attack Bonus / Full Attack).
  attackEconomy: (sheet) => ({
    attacksPerRound: 1 + Math.min(3, Math.floor(Math.max(0, sheet.baseAttackBonus - 1) / 5)),
    iterativePenaltyStep: 5,
  }),
});

/**
 * The d20 "attack vs AC, reduce HP" family. M&M 3e (Toughness saves, no hit
 * points) and Daggerheart (damage thresholds + Armor Score) are intentionally
 * absent: they use fundamentally different damage models and get dedicated
 * adapters instead of being faked into this shape.
 */
export const D20_PROFILES: Partial<Record<GameSystemId, D20SystemProfile>> = {
  'dnd-5e-2014': dnd5eProfile,
  'dnd-5e-2024': dnd5eProfile,
  'dnd-3.5e': legacyD20Profile('dnd-3.5e'),
  pf1e: legacyD20Profile('pf1e'),
  pf2e: pf2eProfile,
};
