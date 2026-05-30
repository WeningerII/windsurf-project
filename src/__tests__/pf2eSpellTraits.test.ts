import { describe, expect, it } from 'vitest';
import { allSpells as pf2eSpells } from '../data/pathfinder/2e/spells';
import type { Spell } from '../types/magic/spells';

const PF2E_SCHOOL_TRAITS = new Set([
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
]);

const PF2E_DERIVED_TRAITS = new Set(['cantrip', 'attack', 'concentrate', 'manipulate', 'focus']);

const PF2E_TRADITIONS = new Set(['arcane', 'divine', 'occult', 'primal']);

describe('PF2e spell traits completeness', () => {
  it('populates traits on every spell', () => {
    const missing = pf2eSpells.filter((spell) => !Array.isArray(spell.traits));
    expect(missing).toEqual([]);
  });

  it('marks every level-0 spell with the cantrip trait', () => {
    const cantrips = pf2eSpells.filter((spell) => spell.level === 0);
    expect(cantrips.length).toBeGreaterThan(0);
    const missingCantripTrait = cantrips.filter((spell) => !spell.traits?.includes('cantrip'));
    expect(missingCantripTrait.map((spell) => spell.id)).toEqual([]);
  });

  it('never marks a non-cantrip with the cantrip trait', () => {
    const misclassified = pf2eSpells.filter(
      (spell) => spell.level !== 0 && spell.traits?.includes('cantrip')
    );
    expect(misclassified.map((spell) => spell.id)).toEqual([]);
  });

  it('keeps every focus spell paired with at least one tradition', () => {
    const focusSpells = pf2eSpells.filter((spell) => spell.traits?.includes('focus'));
    const missingTradition = focusSpells.filter(
      (spell) => !Array.isArray(spell.traditions) || spell.traditions.length === 0
    );
    expect(missingTradition.map((spell) => spell.id)).toEqual([]);
  });

  it('only uses traits from the canonical vocabulary', () => {
    const allowed = new Set<string>([
      ...PF2E_SCHOOL_TRAITS,
      ...PF2E_DERIVED_TRAITS,
      ...PF2E_TRADITIONS,
    ]);

    const violations: Array<{ id: string; trait: string }> = [];
    for (const spell of pf2eSpells) {
      for (const trait of spell.traits ?? []) {
        if (!allowed.has(trait)) {
          violations.push({ id: spell.id, trait });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('contains no duplicate traits within a single spell', () => {
    const offenders: Array<{ id: string; duplicate: string }> = [];
    for (const spell of pf2eSpells) {
      const traits = spell.traits ?? [];
      const seen = new Set<string>();
      for (const trait of traits) {
        if (seen.has(trait)) {
          offenders.push({ id: spell.id, duplicate: trait });
        } else {
          seen.add(trait);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('keeps every spell.school value present in the traits list', () => {
    const offenders: Array<Pick<Spell, 'id' | 'school'>> = [];
    for (const spell of pf2eSpells) {
      if (!spell.traits?.includes(spell.school)) {
        offenders.push({ id: spell.id, school: spell.school });
      }
    }
    expect(offenders).toEqual([]);
  });

  it('keeps attack-roll spells tagged with the attack trait', () => {
    const offenders = pf2eSpells.filter(
      (spell) => spell.attackRoll && !spell.traits?.includes('attack')
    );
    expect(offenders.map((spell) => spell.id)).toEqual([]);
  });

  it('keeps verbal-component spells tagged with the concentrate trait', () => {
    const offenders = pf2eSpells.filter(
      (spell) => spell.components.verbal && !spell.traits?.includes('concentrate')
    );
    expect(offenders.map((spell) => spell.id)).toEqual([]);
  });

  it('keeps somatic/material-component spells tagged with the manipulate trait', () => {
    const offenders = pf2eSpells.filter(
      (spell) =>
        (spell.components.somatic || spell.components.material) &&
        !spell.traits?.includes('manipulate')
    );
    expect(offenders.map((spell) => spell.id)).toEqual([]);
  });
});
