import { describe, expect, it } from 'vitest';
import { pf2eBackgrounds } from '../../data/pathfinder/2e/backgrounds';
import { dwarf } from '../../data/pathfinder/2e/ancestries/dwarf';
import { elf } from '../../data/pathfinder/2e/ancestries/elf';
import { human } from '../../data/pathfinder/2e/ancestries/human';
import { fighter } from '../../data/pathfinder/2e/classes/fighter';
import { wizard } from '../../data/pathfinder/2e/classes/wizard';
import { createDefaultPf2eData, Pf2eDataModel } from '../../systems/pf2e/data-model';
import { CharacterDocument } from '../../types/core/document';
import {
  applyPf2eAncestryTemplate,
  applyPf2eBackgroundTemplate,
  applyPf2eClassTemplate,
} from '../../utils/pf2eTemplate';

function makeDoc(overrides: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-template-doc',
    name: 'Template Hero',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...overrides },
    createdAt: new Date('2026-03-05T00:00:00.000Z'),
    updatedAt: new Date('2026-03-05T00:00:00.000Z'),
  };
}

describe('PF2e templates', () => {
  it('applies wizard class proficiencies, features, and spellcasting', () => {
    const updated = applyPf2eClassTemplate(makeDoc(), wizard, 3);

    expect(updated.system.classId).toBe('wizard');
    expect(updated.system.keyAbility).toBe('int');
    expect(updated.system.saveProficiencies).toMatchObject({
      fortitude: { tier: 'trained' },
      reflex: { tier: 'trained' },
      will: { tier: 'expert' },
    });
    expect(updated.system.perceptionProficiency.tier).toBe('trained');
    expect(updated.system.skillProficiencies.arcana).toEqual({
      tier: 'trained',
      total: 0,
      source: ['Wizard'],
    });
    expect(updated.system.features.map((feature) => feature.id)).toEqual([
      'arcane-school',
      'arcane-bond',
      'arcane-thesis',
    ]);
    expect(updated.system.spellcasting).toMatchObject({
      tradition: 'arcane',
      type: 'prepared',
      focusPoints: { current: 1, max: 1 },
    });
  });

  it('prunes old class features and spellcasting on class change', () => {
    const wizardDoc = applyPf2eClassTemplate(makeDoc(), wizard, 3);
    const fighterDoc = applyPf2eClassTemplate(wizardDoc, fighter, 3, wizard);

    expect(fighterDoc.system.classId).toBe('fighter');
    expect(fighterDoc.system.spellcasting).toBeUndefined();
    expect(fighterDoc.system.skillProficiencies.arcana).toBeUndefined();
    expect(fighterDoc.system.features.some((feature) => feature.source.startsWith('Wizard'))).toBe(
      false
    );
    expect(fighterDoc.system.features.map((feature) => feature.id)).toEqual([
      'attack-of-opportunity',
      'shield-block',
      'fighter-feat-2',
      'bravery',
    ]);
  });

  it('preserves prepared spell selections when reapplying a prepared PF2e class', () => {
    const updated = applyPf2eClassTemplate(
      makeDoc({
        classId: 'wizard',
        spellcasting: {
          tradition: 'arcane',
          type: 'prepared',
          proficiency: { tier: 'trained', total: 0 },
          spellSlots: { 1: { max: 3, used: 0 }, 2: { max: 2, used: 0 } },
          spellsKnown: ['magic-missile', 'shield'],
          alwaysPreparedSpellIds: ['mage-armor'],
          preparedSpellsByRank: { 1: ['magic-missile'], 2: ['shield'] },
          focusPoints: { current: 1, max: 1 },
        },
      }),
      wizard,
      3
    );

    expect(updated.system.spellcasting).toMatchObject({
      type: 'prepared',
      alwaysPreparedSpellIds: ['mage-armor'],
      preparedSpellsByRank: {
        1: ['magic-missile'],
        2: ['shield'],
      },
    });
  });

  it('swaps ancestry and heritage fixed boosts, languages, and features cleanly', () => {
    const ironclad = dwarf.subraces?.find((heritage) => heritage.id === 'ironclad');
    const highElf = elf.subraces?.find((heritage) => heritage.id === 'high-elf');

    if (!ironclad || !highElf) {
      throw new Error('Expected test heritages to exist.');
    }

    const dwarfDoc = applyPf2eAncestryTemplate(makeDoc(), dwarf, ironclad);
    const elfDoc = applyPf2eAncestryTemplate(dwarfDoc, elf, highElf, {
      ancestry: dwarf,
      heritage: ironclad,
    });

    expect(dwarfDoc.system.baseAttributes).toMatchObject({
      con: 14,
      wis: 12,
      cha: 8,
    });
    expect(elfDoc.system.baseAttributes).toMatchObject({
      dex: 12,
      int: 14,
      con: 8,
    });
    expect(elfDoc.system.languages).toEqual(['Common', 'Elven']);
    expect(elfDoc.system.ancestryHP).toBe(6);
    expect(elfDoc.system.speed).toBe(30);
    expect(elfDoc.system.features.some((feature) => feature.source === 'Dwarf')).toBe(false);
    expect(elfDoc.system.features.some((feature) => feature.id === 'low-light-vision')).toBe(true);
  });

  it('applies and reconfigures ancestry choice boosts without stacking stale values', () => {
    const humanDoc = applyPf2eAncestryTemplate(makeDoc(), human, undefined, undefined, [
      'dex',
      'wis',
    ]);
    const updatedHumanDoc = applyPf2eAncestryTemplate(
      humanDoc,
      human,
      undefined,
      { ancestry: human },
      ['str', 'cha']
    );

    expect(humanDoc.system.ancestryAbilityBoostSelections).toEqual(['dex', 'wis']);
    expect(humanDoc.system.baseAttributes).toMatchObject({
      dex: 12,
      wis: 12,
    });
    expect(updatedHumanDoc.system.ancestryAbilityBoostSelections).toEqual(['str', 'cha']);
    expect(updatedHumanDoc.system.baseAttributes).toMatchObject({
      str: 12,
      dex: 10,
      wis: 10,
      cha: 12,
    });
  });

  it('merges and removes deterministic background training and feats by source', () => {
    const acolyte = pf2eBackgrounds.find((background) => background.id === 'pf2e-bg-acolyte');
    const criminal = pf2eBackgrounds.find((background) => background.id === 'pf2e-bg-criminal');

    if (!acolyte || !criminal) {
      throw new Error('Expected test backgrounds to exist.');
    }

    const doc = makeDoc({
      skillProficiencies: {
        religion: { tier: 'expert', total: 0, source: ['manual'] },
      },
    });

    const acolyteDoc = applyPf2eBackgroundTemplate(doc, acolyte);
    expect(acolyteDoc.system.skillProficiencies.religion).toEqual({
      tier: 'expert',
      total: 0,
      source: ['manual', 'Acolyte'],
    });
    expect(acolyteDoc.system.loreProficiencies['scribing-lore']).toEqual({
      tier: 'trained',
      total: 0,
      source: ['Acolyte'],
    });
    expect(acolyteDoc.system.feats.some((feat) => feat.id === 'student-of-the-canon')).toBe(true);

    const criminalDoc = applyPf2eBackgroundTemplate(acolyteDoc, criminal, acolyte);
    expect(criminalDoc.system.skillProficiencies.religion).toEqual({
      tier: 'expert',
      total: 0,
      source: ['manual'],
    });
    expect(criminalDoc.system.loreProficiencies['scribing-lore']).toBeUndefined();
    expect(criminalDoc.system.loreProficiencies['underworld-lore']).toEqual({
      tier: 'trained',
      total: 0,
      source: ['Criminal'],
    });
    expect(criminalDoc.system.feats.some((feat) => feat.id === 'student-of-the-canon')).toBe(false);
    expect(criminalDoc.system.feats.some((feat) => feat.id === 'experienced-smuggler')).toBe(true);
  });

  it('applies background ability boosts and choice-based training selections', () => {
    const scholar = pf2eBackgrounds.find((background) => background.id === 'pf2e-bg-scholar');
    const guard = pf2eBackgrounds.find((background) => background.id === 'pf2e-bg-guard');

    if (!scholar || !guard) {
      throw new Error('Expected choice-based test backgrounds to exist.');
    }

    const doc = makeDoc({
      skillProficiencies: {
        religion: { tier: 'expert', total: 0, source: ['manual'] },
      },
    });

    const scholarDoc = applyPf2eBackgroundTemplate(doc, scholar, undefined, {
      abilityBoostSelections: ['wis', 'cha'],
      skillTrainingSelection: 'religion',
    });

    expect(scholarDoc.system.backgroundAbilityBoostSelections).toEqual(['wis', 'cha']);
    expect(scholarDoc.system.backgroundSkillTrainingSelection).toBe('religion');
    expect(scholarDoc.system.baseAttributes).toMatchObject({
      wis: 12,
      cha: 12,
    });
    expect(scholarDoc.system.skillProficiencies.religion).toEqual({
      tier: 'expert',
      total: 0,
      source: ['manual', 'Scholar'],
    });
    expect(scholarDoc.system.loreProficiencies['academia-lore']).toEqual({
      tier: 'trained',
      total: 0,
      source: ['Scholar'],
    });

    const guardDoc = applyPf2eBackgroundTemplate(scholarDoc, guard, scholar, {
      abilityBoostSelections: ['str', 'wis'],
      loreTrainingSelection: 'warfare-lore',
    });

    expect(guardDoc.system.backgroundAbilityBoostSelections).toEqual(['str', 'wis']);
    expect(guardDoc.system.backgroundSkillTrainingSelection).toBe('intimidation');
    expect(guardDoc.system.backgroundLoreTrainingSelection).toBe('warfare-lore');
    expect(guardDoc.system.baseAttributes).toMatchObject({
      str: 12,
      wis: 12,
      cha: 10,
    });
    expect(guardDoc.system.skillProficiencies.religion).toEqual({
      tier: 'expert',
      total: 0,
      source: ['manual'],
    });
    expect(guardDoc.system.skillProficiencies.intimidation).toEqual({
      tier: 'trained',
      total: 0,
      source: ['Guard'],
    });
    expect(guardDoc.system.loreProficiencies['academia-lore']).toBeUndefined();
    expect(guardDoc.system.loreProficiencies['warfare-lore']).toEqual({
      tier: 'trained',
      total: 0,
      source: ['Guard'],
    });
  });
});
