import { describe, expect, it } from 'vitest';
import { dnd5eClasses } from '../data/dnd/5e-2014/classes';
import * as dnd5e2014Spells from '../data/dnd/5e-2014/spells';
import { dnd5e2024Classes } from '../data/dnd/5e-2024/classes';
import * as dnd5e2024Spells from '../data/dnd/5e-2024/spells';
import { dnd35eClasses } from '../data/dnd/3.5e/classes';
import * as dnd35eSpells from '../data/dnd/3.5e/spells';
import { pf1eClasses } from '../data/pathfinder/1e/classes';
import * as pf1eSpells from '../data/pathfinder/1e/spells';
import { pf2eClasses } from '../data/pathfinder/2e/classes';
import * as pf2eSpells from '../data/pathfinder/2e/spells';
import type { Spell } from '../types/magic/spells';
import { resolveSpellIdAlias } from '../utils/spellCatalog';

type SystemKey = 'dnd-5e-2014' | 'dnd-5e-2024' | 'dnd-3.5e' | 'pf1e' | 'pf2e';
type ExpectedSpellIdentity = { level: number; school: Spell['school'] };

const e = (level: number, school: Spell['school']): ExpectedSpellIdentity => ({ level, school });

const systems: Array<{
  key: SystemKey;
  allSpells: Spell[];
  spellsById: Record<string, Spell>;
  spellIdAliases: Record<string, string>;
  classIds: Set<string>;
}> = [
  {
    key: 'dnd-5e-2014',
    allSpells: dnd5e2014Spells.allSpells,
    spellsById: dnd5e2014Spells.spellsById,
    spellIdAliases: dnd5e2014Spells.spellIdAliases,
    classIds: new Set(dnd5eClasses.map((entry) => entry.id)),
  },
  {
    key: 'dnd-5e-2024',
    allSpells: dnd5e2024Spells.allSpells,
    spellsById: dnd5e2024Spells.spellsById,
    spellIdAliases: dnd5e2024Spells.spellIdAliases,
    classIds: new Set(dnd5e2024Classes.map((entry) => entry.id)),
  },
  {
    key: 'dnd-3.5e',
    allSpells: dnd35eSpells.allSpells,
    spellsById: dnd35eSpells.spellsById,
    spellIdAliases: dnd35eSpells.spellIdAliases,
    classIds: new Set(dnd35eClasses.map((entry) => entry.id)),
  },
  {
    key: 'pf1e',
    allSpells: pf1eSpells.allSpells,
    spellsById: pf1eSpells.spellsById,
    spellIdAliases: pf1eSpells.spellIdAliases,
    classIds: new Set(Object.keys(pf1eClasses)),
  },
  {
    key: 'pf2e',
    allSpells: pf2eSpells.allSpells,
    spellsById: pf2eSpells.spellsById,
    spellIdAliases: pf2eSpells.spellIdAliases,
    classIds: new Set(Object.keys(pf2eClasses)),
  },
];

const iconicSpellExpectations: Array<{
  name: string;
  systems: Partial<Record<SystemKey, ExpectedSpellIdentity>>;
}> = [
  {
    name: 'Fireball',
    systems: {
      'dnd-5e-2014': { level: 3, school: 'evocation' },
      'dnd-5e-2024': e(3, 'evocation'),
      'dnd-3.5e': e(3, 'evocation'),
      pf1e: e(3, 'evocation'),
      pf2e: e(3, 'evocation'),
    },
  },
  {
    name: 'Magic Missile',
    systems: {
      'dnd-5e-2014': e(1, 'evocation'),
      'dnd-5e-2024': e(1, 'evocation'),
      pf1e: e(1, 'evocation'),
      pf2e: e(1, 'evocation'),
    },
  },
  {
    name: 'Cure Wounds',
    systems: { 'dnd-5e-2014': e(1, 'evocation'), 'dnd-5e-2024': e(1, 'evocation') },
  },
  {
    name: 'Healing Word',
    systems: { 'dnd-5e-2014': e(1, 'evocation'), 'dnd-5e-2024': e(1, 'abjuration') },
  },
  {
    name: 'Bless',
    systems: {
      'dnd-5e-2014': e(1, 'enchantment'),
      'dnd-5e-2024': e(1, 'enchantment'),
      'dnd-3.5e': e(1, 'enchantment'),
      pf1e: e(1, 'enchantment'),
      pf2e: e(1, 'enchantment'),
    },
  },
  {
    name: 'Shield',
    systems: {
      'dnd-5e-2014': e(1, 'abjuration'),
      'dnd-5e-2024': e(1, 'abjuration'),
      pf1e: e(1, 'abjuration'),
      pf2e: e(0, 'abjuration'),
    },
  },
  {
    name: 'Mage Armor',
    systems: {
      pf2e: { level: 1, school: 'abjuration' },
      'dnd-5e-2014': e(1, 'abjuration'),
      'dnd-5e-2024': e(1, 'abjuration'),
      pf1e: e(1, 'conjuration'),
    },
  },
  {
    name: 'Alarm',
    systems: {
      pf2e: { level: 1, school: 'abjuration' },
      'dnd-5e-2014': e(1, 'abjuration'),
      'dnd-5e-2024': e(1, 'abjuration'),
      pf1e: e(1, 'abjuration'),
    },
  },
  {
    name: 'Charm Person',
    systems: {
      'dnd-5e-2014': e(1, 'enchantment'),
      'dnd-5e-2024': e(1, 'enchantment'),
      pf1e: e(1, 'enchantment'),
    },
  },
  {
    name: 'Burning Hands',
    systems: {
      'dnd-5e-2014': e(1, 'evocation'),
      'dnd-5e-2024': e(1, 'evocation'),
      pf1e: e(1, 'evocation'),
      pf2e: e(1, 'evocation'),
    },
  },
  {
    name: 'Detect Magic',
    systems: {
      pf2e: { level: 0, school: 'divination' },
      'dnd-5e-2014': e(1, 'divination'),
      'dnd-5e-2024': e(1, 'divination'),
      'dnd-3.5e': e(0, 'divination'),
      pf1e: e(0, 'divination'),
    },
  },
  {
    name: 'Dispel Magic',
    systems: {
      'dnd-5e-2014': e(3, 'abjuration'),
      'dnd-5e-2024': e(3, 'abjuration'),
      'dnd-3.5e': e(3, 'abjuration'),
      pf1e: e(3, 'abjuration'),
      pf2e: e(2, 'abjuration'),
    },
  },
  {
    name: 'Invisibility',
    systems: {
      'dnd-5e-2014': e(2, 'illusion'),
      'dnd-5e-2024': e(2, 'illusion'),
      pf1e: e(2, 'illusion'),
      pf2e: e(2, 'illusion'),
    },
  },
  {
    name: 'Fly',
    systems: {
      'dnd-5e-2014': e(3, 'transmutation'),
      'dnd-5e-2024': e(3, 'transmutation'),
      pf1e: e(3, 'transmutation'),
      pf2e: e(4, 'transmutation'),
    },
  },
  {
    name: 'Haste',
    systems: {
      'dnd-5e-2014': e(3, 'transmutation'),
      'dnd-5e-2024': e(3, 'transmutation'),
      'dnd-3.5e': e(3, 'transmutation'),
      pf1e: e(3, 'transmutation'),
      pf2e: e(3, 'transmutation'),
    },
  },
  {
    name: 'Lightning Bolt',
    systems: {
      'dnd-5e-2014': { level: 3, school: 'evocation' },
      'dnd-5e-2024': e(3, 'evocation'),
      'dnd-3.5e': e(3, 'evocation'),
      pf1e: e(3, 'evocation'),
      pf2e: e(3, 'evocation'),
    },
  },
  {
    name: 'Counterspell',
    systems: { 'dnd-5e-2014': e(3, 'abjuration'), 'dnd-5e-2024': e(3, 'abjuration') },
  },
  {
    name: 'Revivify',
    systems: { 'dnd-5e-2014': e(3, 'necromancy'), 'dnd-5e-2024': e(3, 'necromancy') },
  },
  {
    name: 'Raise Dead',
    systems: {
      pf1e: { level: 5, school: 'conjuration' },
      pf2e: { level: 6, school: 'necromancy' },
      'dnd-5e-2014': e(5, 'necromancy'),
      'dnd-5e-2024': e(5, 'necromancy'),
      'dnd-3.5e': e(5, 'conjuration'),
    },
  },
  {
    name: 'Wish',
    systems: {
      'dnd-5e-2014': e(9, 'conjuration'),
      'dnd-5e-2024': e(9, 'conjuration'),
      'dnd-3.5e': e(9, 'conjuration'),
      pf1e: e(9, 'evocation'),
      pf2e: e(9, 'divination'),
    },
  },
  {
    name: 'Meteor Swarm',
    systems: {
      'dnd-5e-2014': { level: 9, school: 'evocation' },
      'dnd-5e-2024': e(9, 'evocation'),
      'dnd-3.5e': e(9, 'evocation'),
      pf1e: e(8, 'evocation'),
      pf2e: e(9, 'evocation'),
    },
  },
  {
    name: 'Hold Person',
    systems: {
      'dnd-5e-2014': e(2, 'enchantment'),
      'dnd-5e-2024': e(2, 'enchantment'),
      'dnd-3.5e': e(2, 'enchantment'),
      pf1e: e(3, 'enchantment'),
    },
  },
  {
    name: 'Sleep',
    systems: {
      pf2e: { level: 1, school: 'enchantment' },
      'dnd-5e-2014': e(1, 'enchantment'),
      'dnd-5e-2024': e(1, 'enchantment'),
      pf1e: e(1, 'enchantment'),
    },
  },
  {
    name: 'Web',
    systems: {
      'dnd-5e-2014': e(2, 'conjuration'),
      'dnd-5e-2024': e(2, 'conjuration'),
      pf1e: e(2, 'conjuration'),
      pf2e: e(2, 'conjuration'),
    },
  },
  {
    name: 'Scorching Ray',
    systems: {
      'dnd-5e-2014': { level: 2, school: 'evocation' },
      'dnd-5e-2024': e(2, 'evocation'),
      pf1e: e(2, 'evocation'),
    },
  },
  {
    name: 'Cone of Cold',
    systems: {
      'dnd-5e-2014': { level: 5, school: 'evocation' },
      'dnd-5e-2024': e(5, 'evocation'),
      pf1e: e(5, 'evocation'),
      pf2e: e(5, 'evocation'),
    },
  },
  {
    name: 'Teleport',
    systems: {
      'dnd-5e-2014': e(7, 'conjuration'),
      'dnd-5e-2024': e(7, 'conjuration'),
      pf1e: e(5, 'conjuration'),
      pf2e: e(6, 'conjuration'),
    },
  },
  {
    name: 'Identify',
    systems: {
      'dnd-5e-2014': e(1, 'divination'),
      'dnd-5e-2024': e(1, 'divination'),
      pf1e: e(1, 'divination'),
    },
  },
  {
    name: 'Mage Hand',
    systems: {
      'dnd-5e-2014': e(0, 'conjuration'),
      'dnd-5e-2024': e(0, 'conjuration'),
      pf1e: e(0, 'transmutation'),
      pf2e: e(0, 'evocation'),
    },
  },
  {
    name: 'Light',
    systems: {
      'dnd-5e-2014': e(0, 'evocation'),
      'dnd-5e-2024': e(0, 'evocation'),
      'dnd-3.5e': e(0, 'evocation'),
      pf1e: e(0, 'evocation'),
      pf2e: e(0, 'evocation'),
    },
  },
  {
    name: 'Mending',
    systems: {
      pf2e: { level: 1, school: 'transmutation' },
      'dnd-5e-2014': e(0, 'transmutation'),
      'dnd-5e-2024': e(0, 'transmutation'),
      'dnd-3.5e': e(0, 'transmutation'),
      pf1e: e(0, 'transmutation'),
    },
  },
  {
    name: 'Guidance',
    systems: {
      'dnd-5e-2014': e(0, 'divination'),
      'dnd-5e-2024': e(0, 'divination'),
      'dnd-3.5e': e(0, 'divination'),
      pf1e: e(0, 'divination'),
      pf2e: e(0, 'divination'),
    },
  },
  {
    name: 'Resistance',
    systems: {
      'dnd-5e-2014': e(0, 'abjuration'),
      'dnd-5e-2024': e(0, 'abjuration'),
      'dnd-3.5e': e(0, 'abjuration'),
      pf1e: e(0, 'abjuration'),
    },
  },
  {
    name: 'Acid Splash',
    systems: {
      'dnd-5e-2014': e(0, 'conjuration'),
      'dnd-5e-2024': e(0, 'evocation'),
      'dnd-3.5e': e(0, 'conjuration'),
      pf1e: e(0, 'conjuration'),
      pf2e: e(0, 'evocation'),
    },
  },
  {
    name: 'Ray of Frost',
    systems: {
      'dnd-5e-2014': e(0, 'evocation'),
      'dnd-5e-2024': e(0, 'evocation'),
      'dnd-3.5e': e(0, 'evocation'),
      pf1e: e(0, 'evocation'),
      pf2e: e(0, 'evocation'),
    },
  },
  {
    name: 'Prestidigitation',
    systems: {
      pf2e: { level: 0, school: 'evocation' },
      'dnd-5e-2014': e(0, 'transmutation'),
      'dnd-5e-2024': e(0, 'transmutation'),
      'dnd-3.5e': e(0, 'evocation'),
      pf1e: e(0, 'transmutation'),
    },
  },
  {
    name: 'Protection from Evil and Good',
    systems: { 'dnd-5e-2014': e(1, 'abjuration'), 'dnd-5e-2024': e(1, 'abjuration') },
  },
  {
    name: 'Lesser Restoration',
    systems: { 'dnd-5e-2014': e(2, 'abjuration'), 'dnd-5e-2024': e(2, 'abjuration') },
  },
  {
    name: 'Spiritual Weapon',
    systems: {
      pf1e: { level: 2, school: 'evocation' },
      pf2e: { level: 2, school: 'evocation' },
      'dnd-5e-2014': e(2, 'evocation'),
      'dnd-5e-2024': e(2, 'evocation'),
      'dnd-3.5e': e(2, 'evocation'),
    },
  },
  {
    name: 'Beacon of Hope',
    systems: { 'dnd-5e-2014': e(3, 'abjuration'), 'dnd-5e-2024': e(3, 'abjuration') },
  },
  {
    name: 'Death Ward',
    systems: {
      pf1e: { level: 4, school: 'necromancy' },
      pf2e: { level: 5, school: 'abjuration' },
      'dnd-5e-2014': e(4, 'abjuration'),
      'dnd-5e-2024': e(4, 'abjuration'),
      'dnd-3.5e': e(4, 'necromancy'),
    },
  },
  {
    name: 'Guardian of Faith',
    systems: { 'dnd-5e-2014': e(4, 'conjuration'), 'dnd-5e-2024': e(4, 'conjuration') },
  },
  {
    name: 'Mass Cure Wounds',
    systems: { 'dnd-5e-2014': e(5, 'evocation'), 'dnd-5e-2024': e(5, 'abjuration') },
  },
  {
    name: 'Sanctuary',
    systems: {
      pf1e: { level: 1, school: 'abjuration' },
      'dnd-5e-2014': e(1, 'abjuration'),
      'dnd-5e-2024': e(1, 'abjuration'),
      'dnd-3.5e': e(1, 'abjuration'),
      pf2e: e(1, 'abjuration'),
    },
  },
  {
    name: 'Zone of Truth',
    systems: {
      pf1e: { level: 2, school: 'enchantment' },
      pf2e: { level: 3, school: 'enchantment' },
      'dnd-5e-2014': e(2, 'enchantment'),
      'dnd-5e-2024': e(2, 'enchantment'),
      'dnd-3.5e': e(2, 'enchantment'),
    },
  },
  {
    name: 'Freedom of Movement',
    systems: {
      pf1e: { level: 4, school: 'abjuration' },
      'dnd-5e-2014': e(4, 'abjuration'),
      'dnd-5e-2024': e(4, 'abjuration'),
      'dnd-3.5e': e(4, 'abjuration'),
      pf2e: e(4, 'abjuration'),
    },
  },
  {
    name: 'Commune',
    systems: {
      pf1e: { level: 5, school: 'divination' },
      'dnd-5e-2014': e(5, 'divination'),
      'dnd-5e-2024': e(5, 'divination'),
      'dnd-3.5e': e(5, 'divination'),
    },
  },
  {
    name: 'Flame Strike',
    systems: {
      pf1e: { level: 4, school: 'evocation' },
      pf2e: { level: 5, school: 'evocation' },
      'dnd-5e-2014': e(5, 'evocation'),
      'dnd-5e-2024': e(5, 'evocation'),
      'dnd-3.5e': e(4, 'evocation'),
    },
  },
  {
    name: 'Banishment',
    systems: {
      pf1e: { level: 6, school: 'abjuration' },
      'dnd-5e-2014': e(4, 'abjuration'),
      'dnd-5e-2024': e(4, 'abjuration'),
      'dnd-3.5e': e(6, 'abjuration'),
      pf2e: e(5, 'abjuration'),
    },
  },
  {
    name: 'Scrying',
    systems: {
      pf2e: { level: 6, school: 'divination' },
      'dnd-5e-2014': e(5, 'divination'),
      'dnd-5e-2024': e(5, 'divination'),
      'dnd-3.5e': e(4, 'divination'),
      pf1e: e(4, 'divination'),
    },
  },
];

function findByName(spells: Spell[], name: string): Spell | undefined {
  return spells.find((spell) => spell.name.toLowerCase() === name.toLowerCase());
}

describe('cross-system spell catalog invariants', () => {
  it('resolves every alias to an existing canonical spell', () => {
    systems.forEach(({ key, spellsById, spellIdAliases }) => {
      Object.entries(spellIdAliases).forEach(([alias, target]) => {
        const resolvedTarget = resolveSpellIdAlias(target, spellIdAliases);
        expect(spellsById[resolvedTarget], `${key} alias ${alias} -> ${target}`).toBeTruthy();
      });
    });
  });

  it('has no duplicate canonical ids within a system', () => {
    systems.forEach(({ key, allSpells }) => {
      const ids = allSpells.map((spell) => spell.id);
      expect(new Set(ids).size, `${key} duplicate ids`).toBe(ids.length);
    });
  });

  it('keeps every spell class reference backed by the system class registry', () => {
    systems.forEach(({ key, allSpells, classIds }) => {
      const missing = allSpells.flatMap((spell) =>
        spell.classes
          .filter((classId) => !classIds.has(classId))
          .map((classId) => `${spell.id}:${classId}`)
      );
      expect(missing, `${key} missing class registry entries`).toEqual([]);
    });
  });

  it('keeps curated iconic spell identity stable where each system ships the spell', () => {
    expect(iconicSpellExpectations).toHaveLength(50);

    iconicSpellExpectations.forEach(({ name, systems: expectedSystems }) => {
      systems.forEach(({ key, allSpells }) => {
        const spell = findByName(allSpells, name);
        const expected = expectedSystems[key];

        if (!spell) {
          expect(expected, `${key} unexpectedly lacks ${name}`).toBeUndefined();
          return;
        }

        expect(expected, `${key} ${name} needs an explicit fixture expectation`).toBeTruthy();
        expect({ level: spell.level, school: spell.school }, `${key} ${name} level/school`).toEqual(
          expected
        );
      });
    });
  });
});
