/**
 * 5e damage-assembly riders (road-to-launch phase 4): Rage, Great Weapon
 * Master, and Sneak Attack as toggleable, feature-gated effects.
 *
 * These are CONDITIONAL riders, not always-on bonuses — Rage applies only
 * while raging, GWM only when the wielder opts into -5/+10, Sneak Attack only
 * when its positioning conditions hold. The character persists active toggle
 * ids in `activeToggles`; this compiler maps (owned feature/feat) × (active
 * toggle) onto resolver effects, so sheet rolls and scene combat assemble the
 * SAME damage through the shared resolver.
 *
 * Honest boundaries ride along as notes: Rage's melee-only scope and Sneak
 * Attack's once-per-turn rule are flagged, never silently widened.
 *
 * EDITION ROUTING (2014 vs 2024). Both 5e editions share this compiler, so the
 * caller stamps which edition it is via `systemId` — the same shape
 * `d20LegacyRiders` uses to keep 3.5e and PF1e apart. It is NOT decoration:
 *
 * - Rage / Sneak Attack / Divine Smite are class features whose SRD 5.1 numbers
 *   the 2024 engine inherits, so they compile for both editions.
 * - Great Weapon Master and Sharpshooter are 2014-ONLY here. SRD 5.2's feat
 *   chapter is 17 feats — Ability Score Improvement, Grappler, the six origin
 *   feats, four Fighting Style feats and seven epic boons (see the encoded
 *   corpus under `src/data/dnd/5e-2024/feats/`, whose provenance comments spell
 *   out what SRD 5.2 does and does not open). Neither GWM nor Sharpshooter is
 *   among them: the 2024 versions of those feats are Player's Handbook content,
 *   not open content, so this repo has no cited SRD 5.2 text to compile. The
 *   2014 -5/+10 trade is therefore refused for 2024 characters rather than
 *   silently imposed — applying another edition's math is the bug this gate
 *   exists to prevent, and inventing 2024 numbers from memory would be worse.
 */

import { makeEffectId, type EffectInstance } from '../ir/types';
import { breakpoints } from '../../utils/scaling';

/** The two 5e editions that share this rider compiler. */
export type Dnd5eSystemId = 'dnd-5e-2014' | 'dnd-5e-2024';

/**
 * Narrow a document's (string-typed) system id to the 5e edition whose riders
 * apply. Only the two 5e sheets reach this compiler; anything else falls back
 * to the 2014 vocabulary this module was originally written against.
 */
export function dnd5eEditionOf(systemId: string): Dnd5eSystemId {
  return systemId === 'dnd-5e-2024' ? 'dnd-5e-2024' : 'dnd-5e-2014';
}

/**
 * Whether the -5 attack / +10 damage trade is open-content RAW for this
 * edition. SRD 5.1 carries it; SRD 5.2 does not carry these feats at all.
 */
function hasFlatFivePenaltyTenDamageFeats(systemId: Dnd5eSystemId): boolean {
  return systemId === 'dnd-5e-2014';
}

export interface Dnd5eRiderInputs {
  /** Which 5e edition's rider set applies (see the header's EDITION ROUTING). */
  systemId: Dnd5eSystemId;
  /** Active toggle ids persisted on the character (e.g. ['rage']). */
  activeToggles: readonly string[];
  /** Owned feature ids (class features). */
  featureIds: ReadonlySet<string>;
  /** Owned feat ids. */
  featIds: ReadonlySet<string>;
  /** Barbarian class level (Rage damage scales +2/+3/+4 at 1/9/16). */
  barbarianLevel: number;
  /** Rogue class level (Sneak Attack dice = ceil(level / 2)d6). */
  rogueLevel: number;
}

/** SRD: Rage damage bonus by barbarian level (+2, then +3 at 9th, +4 at 16th). */
const RAGE_DAMAGE_BREAKPOINTS = [
  [9, 3],
  [16, 4],
] as const;
export function rageDamageBonus(barbarianLevel: number): number {
  return breakpoints(barbarianLevel, RAGE_DAMAGE_BREAKPOINTS, 2);
}

/** SRD: Sneak Attack dice by rogue level. */
export function sneakAttackDice(rogueLevel: number): number {
  return Math.max(1, Math.ceil(rogueLevel / 2));
}

export const DND5E_TOGGLE_IDS = [
  'rage',
  'great-weapon-master',
  'sharpshooter',
  'sneak-attack',
  'divine-smite',
] as const;

/**
 * Which toggles this character can use at all (feature/feat- and
 * edition-gated). The sheet offers chips only for these — a 2024 character is
 * never offered the 2014 -5/+10 trade, even holding a like-named feat.
 */
export function availableDnd5eToggles(
  inputs: Pick<Dnd5eRiderInputs, 'systemId' | 'featureIds' | 'featIds'>
): string[] {
  const available: string[] = [];
  const tradeoffFeats = hasFlatFivePenaltyTenDamageFeats(inputs.systemId);
  if (inputs.featureIds.has('rage')) available.push('rage');
  if (
    tradeoffFeats &&
    (inputs.featIds.has('great-weapon-master') || inputs.featureIds.has('great-weapon-master'))
  ) {
    available.push('great-weapon-master');
  }
  if (
    tradeoffFeats &&
    (inputs.featIds.has('sharpshooter') || inputs.featureIds.has('sharpshooter'))
  ) {
    available.push('sharpshooter');
  }
  if (inputs.featureIds.has('sneak-attack')) available.push('sneak-attack');
  if (inputs.featureIds.has('divine-smite')) available.push('divine-smite');
  return available;
}

/** Compile the active, feature-gated riders into resolver effects. */
export function collectDnd5eRiderEffects(inputs: Dnd5eRiderInputs): EffectInstance[] {
  const SYSTEM_ID = inputs.systemId;
  const tradeoffFeats = hasFlatFivePenaltyTenDamageFeats(SYSTEM_ID);
  const active = new Set(inputs.activeToggles);
  const effects: EffectInstance[] = [];

  if (active.has('rage') && inputs.featureIds.has('rage')) {
    effects.push({
      id: makeEffectId(SYSTEM_ID, 'rider', 'rage', 'damage'),
      systemId: SYSTEM_ID,
      target: 'damage',
      operation: 'add',
      value: rageDamageBonus(inputs.barbarianLevel),
      stackPolicy: 'sum',
      source: { kind: 'feature', id: 'rage', label: 'Rage' },
      label: `Rage damage (+${rageDamageBonus(inputs.barbarianLevel)})`,
      manualBoundary: {
        kind: 'partial',
        note: 'SRD: applies to melee weapon attacks using Strength only.',
      },
    });
  }

  // 2014 only — SRD 5.2 does not open Great Weapon Master (see EDITION ROUTING).
  if (
    tradeoffFeats &&
    active.has('great-weapon-master') &&
    (inputs.featIds.has('great-weapon-master') || inputs.featureIds.has('great-weapon-master'))
  ) {
    effects.push(
      {
        id: makeEffectId(SYSTEM_ID, 'rider', 'gwm', 'attack'),
        systemId: SYSTEM_ID,
        target: 'attack',
        operation: 'add',
        value: -5,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'great-weapon-master', label: 'Great Weapon Master' },
        label: 'Great Weapon Master (-5 attack)',
      },
      {
        id: makeEffectId(SYSTEM_ID, 'rider', 'gwm', 'damage'),
        systemId: SYSTEM_ID,
        target: 'damage',
        operation: 'add',
        value: 10,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'great-weapon-master', label: 'Great Weapon Master' },
        label: 'Great Weapon Master (+10 damage)',
        manualBoundary: {
          kind: 'partial',
          note: 'SRD: heavy melee weapons only.',
        },
      }
    );
  }

  // 2014 only — SRD 5.2 does not open Sharpshooter (see EDITION ROUTING).
  if (
    tradeoffFeats &&
    active.has('sharpshooter') &&
    (inputs.featIds.has('sharpshooter') || inputs.featureIds.has('sharpshooter'))
  ) {
    effects.push(
      {
        id: makeEffectId(SYSTEM_ID, 'rider', 'sharpshooter', 'attack'),
        systemId: SYSTEM_ID,
        target: 'attack',
        operation: 'add',
        value: -5,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'sharpshooter', label: 'Sharpshooter' },
        label: 'Sharpshooter (-5 attack)',
      },
      {
        id: makeEffectId(SYSTEM_ID, 'rider', 'sharpshooter', 'damage'),
        systemId: SYSTEM_ID,
        target: 'damage',
        operation: 'add',
        value: 10,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'sharpshooter', label: 'Sharpshooter' },
        label: 'Sharpshooter (+10 damage)',
        manualBoundary: {
          kind: 'partial',
          note: 'SRD: ranged weapons the wielder is proficient with only.',
        },
      }
    );
  }

  if (active.has('sneak-attack') && inputs.featureIds.has('sneak-attack')) {
    const dice = sneakAttackDice(inputs.rogueLevel);
    for (let index = 0; index < dice; index += 1) {
      effects.push({
        id: makeEffectId(SYSTEM_ID, 'rider', 'sneak-attack', 'die', index),
        systemId: SYSTEM_ID,
        target: 'damage',
        operation: 'add-die',
        value: 6,
        stackPolicy: 'sum',
        source: { kind: 'feature', id: 'sneak-attack', label: 'Sneak Attack' },
        label: `Sneak Attack d6 (${index + 1}/${dice})`,
        manualBoundary: {
          kind: 'partial',
          note: 'SRD: once per turn, and only with advantage or an adjacent ally; the toggle asserts eligibility.',
        },
      });
    }
  }

  if (active.has('divine-smite') && inputs.featureIds.has('divine-smite')) {
    // Base smite: 2d8 (1st-level slot). Slot level/undead scaling is a manual
    // call — the toggle asserts the player is spending the base slot.
    for (let index = 0; index < 2; index += 1) {
      effects.push({
        id: makeEffectId(SYSTEM_ID, 'rider', 'divine-smite', 'die', index),
        systemId: SYSTEM_ID,
        target: 'damage',
        operation: 'add-die',
        value: 8,
        stackPolicy: 'sum',
        source: { kind: 'feature', id: 'divine-smite', label: 'Divine Smite' },
        label: `Divine Smite d8 (${index + 1}/2)`,
        manualBoundary: {
          kind: 'partial',
          note: 'SRD: expends a 1st-level spell slot (+1d8 per higher slot level, +1d8 vs undead/fiends) — slot spend and scaling are manual.',
        },
      });
    }
  }

  return effects;
}
