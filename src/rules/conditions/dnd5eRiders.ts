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
 */

import { makeEffectId, type EffectInstance } from '../ir/types';

const SYSTEM_ID = 'dnd-5e-2014';

export interface Dnd5eRiderInputs {
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

/** SRD: Rage damage bonus by barbarian level. */
export function rageDamageBonus(barbarianLevel: number): number {
  if (barbarianLevel >= 16) return 4;
  if (barbarianLevel >= 9) return 3;
  return 2;
}

/** SRD: Sneak Attack dice by rogue level. */
export function sneakAttackDice(rogueLevel: number): number {
  return Math.max(1, Math.ceil(rogueLevel / 2));
}

export const DND5E_TOGGLE_IDS = ['rage', 'great-weapon-master', 'sneak-attack'] as const;

/**
 * Which toggles this character can use at all (feature/feat-gated). The sheet
 * offers chips only for these.
 */
export function availableDnd5eToggles(
  inputs: Pick<Dnd5eRiderInputs, 'featureIds' | 'featIds'>
): string[] {
  const available: string[] = [];
  if (inputs.featureIds.has('rage')) available.push('rage');
  if (inputs.featIds.has('great-weapon-master') || inputs.featureIds.has('great-weapon-master')) {
    available.push('great-weapon-master');
  }
  if (inputs.featureIds.has('sneak-attack')) available.push('sneak-attack');
  return available;
}

/** Compile the active, feature-gated riders into resolver effects. */
export function collectDnd5eRiderEffects(inputs: Dnd5eRiderInputs): EffectInstance[] {
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

  if (
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

  return effects;
}
