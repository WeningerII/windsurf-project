/**
 * Metadata Accuracy Guard Test
 *
 * Verifies that every metadata count is derived from the actual data arrays.
 * If this test fails, someone added data without the metadata updating —
 * which should be impossible with computed metadata, but guards against
 * regressions if someone reverts to hardcoded values.
 */

import { dnd5eMetadata } from '../data/dnd/5e-2014/metadata';
import { dnd5eSpells, dnd5eSpellsByLevel, dnd5eSpellsBySchool } from '../data/dnd/5e-2014/spells/index';
import { dnd5eClasses } from '../data/dnd/5e-2014/classes/index';
import { dnd5eSpecies } from '../data/dnd/5e-2014/species/index';
import { dnd5eBackgrounds } from '../data/dnd/5e-2014/backgrounds/index';
import { dnd5eMonsters } from '../data/dnd/5e-2014/monsters/index';
import { dnd5eWeapons, dnd5eArmor, dnd5eShields, dnd5eAdventuringGear, dnd5eMagicItems } from '../data/dnd/5e-2014/equipment/index';

import { dnd5e2024Metadata } from '../data/dnd/5e-2024/metadata';
import { dnd5e2024AllSpells } from '../data/dnd/5e-2024/spells/index';
import { dnd5e2024Classes } from '../data/dnd/5e-2024/classes/index';
import { dnd5e2024Species } from '../data/dnd/5e-2024/species/index';
import { dnd5e2024Backgrounds } from '../data/dnd/5e-2024/backgrounds/index';
import { dnd5e2024Monsters } from '../data/dnd/5e-2024/monsters/index';
import { dnd5e2024Weapons, dnd5e2024Armor, dnd5e2024Gear, dnd5e2024MagicItems } from '../data/dnd/5e-2024/equipment/index';

import { dnd35eMetadata } from '../data/dnd/3.5e/metadata';
import { dnd35eSpells } from '../data/dnd/3.5e/spells/index';
import { dnd35eClasses } from '../data/dnd/3.5e/classes/index';
import { dnd35ePrestigeClasses } from '../data/dnd/3.5e/prestige-classes/index';
import { dnd35eRaces } from '../data/dnd/3.5e/races/index';
import { dnd35eFeats } from '../data/dnd/3.5e/feats/index';
import { dnd35eEquipment } from '../data/dnd/3.5e/equipment/index';

import { pf1eMetadata } from '../data/pathfinder/1e/metadata';
import { pf1eSpells } from '../data/pathfinder/1e/spells/index';
import { pf1eClasses } from '../data/pathfinder/1e/classes/index';
import { pf1ePrestigeClasses } from '../data/pathfinder/1e/prestige-classes/index';
import { pf1eRaces } from '../data/pathfinder/1e/races/index';
import { pf1eFeats } from '../data/pathfinder/1e/feats/index';
import { pf1eTraits } from '../data/pathfinder/1e/traits/core-traits';

import { pf2eMetadata } from '../data/pathfinder/2e/metadata';
import { pf2eSpells } from '../data/pathfinder/2e/spells/index';
import { pf2eClasses } from '../data/pathfinder/2e/classes/index';
import { pf2eAncestries } from '../data/pathfinder/2e/ancestries/index';
import { allPf2eArchetypes } from '../data/pathfinder/2e/archetypes/index';

import { mm3eMetadata } from '../data/mutants-and-masterminds/3e/metadata';
import { allPowers } from '../data/mutants-and-masterminds/3e/powers/index';
import { powerModifiers } from '../data/mutants-and-masterminds/3e/modifiers/index';
import { mam3eAdvantages } from '../data/mutants-and-masterminds/3e/advantages/index';
import { skills } from '../data/mutants-and-masterminds/3e/skills/index';
import { complications } from '../data/mutants-and-masterminds/3e/complications/index';
import { mm3eArchetypes } from '../data/mutants-and-masterminds/3e/archetypes/index';

describe('D&D 5e-2014 metadata counts', () => {
  it('spells count matches array length', () => {
    expect(dnd5eMetadata.stats.spells.count).toBe(dnd5eSpells.length);
  });
  it('classes count matches array length', () => {
    expect(dnd5eMetadata.stats.classes.count).toBe(dnd5eClasses.length);
  });
  it('species count matches array length', () => {
    expect(dnd5eMetadata.stats.species.count).toBe(dnd5eSpecies.length);
  });
  it('backgrounds count matches array length', () => {
    expect(dnd5eMetadata.stats.backgrounds.count).toBe(dnd5eBackgrounds.length);
  });
  it('monsters count matches array length', () => {
    expect(dnd5eMetadata.stats.monsters.count).toBe(dnd5eMonsters.length);
  });
  it('spell byLevel counts sum to total', () => {
    const sum = Object.values(dnd5eSpellsByLevel).reduce((s, arr) => s + arr.length, 0);
    expect(dnd5eMetadata.stats.spells.count).toBe(sum);
  });
  it('spell bySchool counts sum to total', () => {
    const sum = Object.values(dnd5eSpellsBySchool).reduce((s, arr) => s + arr.length, 0);
    expect(dnd5eMetadata.stats.spells.count).toBe(sum);
  });
});

describe('D&D 5e-2024 metadata counts', () => {
  it('spells count matches array length', () => {
    expect(dnd5e2024Metadata.stats.spells.count).toBe(dnd5e2024AllSpells.length);
  });
  it('classes count matches array length', () => {
    expect(dnd5e2024Metadata.stats.classes.count).toBe(dnd5e2024Classes.length);
  });
  it('species count matches array length', () => {
    expect(dnd5e2024Metadata.stats.species.count).toBe(dnd5e2024Species.length);
  });
  it('backgrounds count matches array length', () => {
    expect(dnd5e2024Metadata.stats.backgrounds.count).toBe(dnd5e2024Backgrounds.length);
  });
  it('monsters count matches array length', () => {
    expect(dnd5e2024Metadata.stats.monsters.count).toBe(dnd5e2024Monsters.length);
  });
  it('equipment weapons count matches', () => {
    expect(dnd5e2024Metadata.stats.equipment.weapons).toBe(dnd5e2024Weapons.length);
  });
});

describe('D&D 3.5e metadata counts', () => {
  it('spells count matches array length', () => {
    expect(dnd35eMetadata.stats.spells.count).toBe(dnd35eSpells.length);
  });
  it('classes count matches array length', () => {
    expect(dnd35eMetadata.stats.classes.count).toBe(dnd35eClasses.length);
  });
  it('prestige classes count matches array length', () => {
    expect(dnd35eMetadata.stats.prestigeClasses.count).toBe(dnd35ePrestigeClasses.length);
  });
  it('races count matches array length', () => {
    expect(dnd35eMetadata.stats.races.count).toBe(dnd35eRaces.length);
  });
  it('feats count matches sum of sub-arrays', () => {
    const sum = Object.values(dnd35eFeats).reduce((s, arr) => s + arr.length, 0);
    expect(dnd35eMetadata.stats.feats.count).toBe(sum);
  });
  it('equipment weapons count matches', () => {
    expect(dnd35eMetadata.stats.equipment.weapons).toBe(dnd35eEquipment.weapons.length);
  });
});

describe('Pathfinder 1e metadata counts', () => {
  it('spells count matches array length', () => {
    expect(pf1eMetadata.stats.spells.count).toBe(pf1eSpells.length);
  });
  it('base classes count matches object keys', () => {
    expect(pf1eMetadata.stats.classes.baseClasses).toBe(Object.keys(pf1eClasses).length);
  });
  it('prestige classes count matches array length', () => {
    expect(pf1eMetadata.stats.classes.prestigeClasses).toBe(pf1ePrestigeClasses.length);
  });
  it('races count matches object keys', () => {
    expect(pf1eMetadata.stats.races.count).toBe(Object.keys(pf1eRaces).length);
  });
  it('feats count matches sum of sub-arrays', () => {
    const sum = Object.values(pf1eFeats).reduce((s, arr) => s + arr.length, 0);
    expect(pf1eMetadata.stats.feats.count).toBe(sum);
  });
  it('traits count matches array length', () => {
    expect(pf1eMetadata.stats.traits.count).toBe(pf1eTraits.length);
  });
});

describe('Pathfinder 2e metadata counts', () => {
  it('spells count matches array length', () => {
    expect(pf2eMetadata.stats.spells.count).toBe(pf2eSpells.length);
  });
  it('classes count matches object keys', () => {
    expect(pf2eMetadata.stats.classes.count).toBe(Object.keys(pf2eClasses).length);
  });
  it('ancestries count matches object keys', () => {
    expect(pf2eMetadata.stats.ancestries.count).toBe(Object.keys(pf2eAncestries).length);
  });
  it('archetypes count matches array length', () => {
    expect(pf2eMetadata.stats.archetypes.count).toBe(allPf2eArchetypes.length);
  });
});

describe('M&M 3e metadata counts', () => {
  it('powers count matches array length', () => {
    expect(mm3eMetadata.stats.powers.count).toBe(allPowers.length);
  });
  it('power modifiers extras count matches', () => {
    expect(mm3eMetadata.stats.powerModifiers.extras).toBe(powerModifiers.extras.length);
  });
  it('power modifiers flaws count matches', () => {
    expect(mm3eMetadata.stats.powerModifiers.flaws).toBe(powerModifiers.flaws.length);
  });
  it('advantages count matches deduped array', () => {
    expect(mm3eMetadata.stats.advantages.count).toBe(mam3eAdvantages.length);
  });
  it('skills count matches array length', () => {
    expect(mm3eMetadata.stats.skills.count).toBe(skills.length);
  });
  it('complications count matches array length', () => {
    expect(mm3eMetadata.stats.complications.count).toBe(complications.length);
  });
  it('archetypes count matches object keys', () => {
    expect(mm3eMetadata.stats.archetypes.count).toBe(Object.keys(mm3eArchetypes).length);
  });
});
