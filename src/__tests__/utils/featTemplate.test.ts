import { describe, expect, it } from 'vitest';
import { abilityScoreImprovement } from '../../data/dnd/5e-2024/feats/general';
import { skilled } from '../../data/dnd/5e-2024/feats/origin';
import { FeatDefinition } from '../../types/character-options/feats';
import {
  createDefaultDnd5e2024Data,
  Dnd5e2024DataModel,
} from '../../systems/dnd5e-2024/data-model';
import { CharacterDocument } from '../../types/core/document';
import {
  applyDnd5eFeatTemplate,
  getCurrentDnd5eFeatSelections,
  removeDnd5eFeatTemplate,
} from '../../utils/featTemplate';

// Neutral feat fixtures. Only Grappler, Ability Score Improvement, Magic Initiate
// (Cleric/Druid/Wizard), the four SRD fighting styles, the SRD epic boons, and
// the SRD origin feats ship as data; the feats below were removed as non-SRD
// (Player's Handbook) content. They are recreated here purely to exercise the
// feat-template engine: each keeps the mechanical fields and the id the engine
// keys on (resilient/observant/boon-of-skill have id-specific handling), but
// the descriptive prose is replaced with neutral placeholders.
const fixtureBenefits = ['Test fixture benefit.'];

const resilient: FeatDefinition = {
  id: 'resilient',
  name: 'Resilient',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'Test fixture: ability choice plus the matching saving throw.',
  benefits: fixtureBenefits,
};

const keen_mind: FeatDefinition = {
  id: 'keen-mind',
  name: 'Keen Mind',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'int', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { intelligence: 1 } },
  proficienciesGranted: { skills: ['one Intelligence skill of your choice'] },
  description: 'Test fixture: fixed ability plus a skill choice.',
  // The engine parses the "Ability Score Increase:" benefit to derive allowed
  // abilities, so that mechanical line is retained (rules text, not flavor).
  benefits: ['Ability Score Increase: Increase your Intelligence by 1, to a maximum of 20.'],
};

const observant: FeatDefinition = {
  id: 'observant',
  name: 'Observant',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'int', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { intelligence: 1 } },
  description: 'Test fixture: ability plus an id-specific skill choice.',
  benefits: [
    'Ability Score Increase: Increase your Intelligence or Wisdom by 1, to a maximum of 20.',
  ],
};

const weapon_master: FeatDefinition = {
  id: 'weapon-master',
  name: 'Weapon Master',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  proficienciesGranted: { weapons: ['four weapons of your choice'] },
  description: 'Test fixture: fixed ability plus a weapon choice.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
  ],
};

const linguist: FeatDefinition = {
  id: 'linguist',
  name: 'Linguist',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'ability', ability: 'int', value: 13 },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { intelligence: 1 } },
  proficienciesGranted: { languages: ['three languages of your choice'] },
  description: 'Test fixture: fixed ability plus a language choice.',
  benefits: fixtureBenefits,
};

const moderately_armored: FeatDefinition = {
  id: 'moderately-armored',
  name: 'Moderately Armored',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  prerequisites: [
    { type: 'level', value: 4 },
    { type: 'other', description: 'Light Armor Training' },
  ],
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  proficienciesGranted: { armor: ['medium armor', 'shields'] },
  description: 'Test fixture: fixed ability plus concrete armor grants.',
  benefits: [
    'Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.',
  ],
};

const crafter: FeatDefinition = {
  id: 'crafter',
  name: 'Crafter',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  proficienciesGranted: { tools: ['three artisan tools of your choice'] },
  description: 'Test fixture: artisan tool choices.',
  benefits: fixtureBenefits,
};

const musician: FeatDefinition = {
  id: 'musician',
  name: 'Musician',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  proficienciesGranted: { tools: ['three musical instruments of your choice'] },
  description: 'Test fixture: musical instrument choices.',
  benefits: fixtureBenefits,
};

const boonOfSkill: FeatDefinition = {
  id: 'boon-of-skill',
  name: 'Boon of Skill',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  prerequisites: [{ type: 'level', value: 19 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'Test fixture: ability plus an id-specific all-skills grant.',
  benefits: fixtureBenefits,
};

function makeDoc(
  overrides: Partial<Dnd5e2024DataModel> = {}
): CharacterDocument<Dnd5e2024DataModel> {
  return {
    id: 'feat-template-doc',
    name: 'Feat Hero',
    systemId: 'dnd-5e-2024',
    system: { ...createDefaultDnd5e2024Data(), ...overrides },
    createdAt: new Date('2026-03-07T00:00:00.000Z'),
    updatedAt: new Date('2026-03-07T00:00:00.000Z'),
  };
}

describe('featTemplate', () => {
  it('clones catalog modifiers instead of aliasing them onto the character', () => {
    // Regression: buildAutomatedFeat used to assign `modifiers: feat.modifiers`
    // directly, so an in-place mutation on the character document would have
    // corrupted the shared catalog definition for every later character.
    const modifierFeat: FeatDefinition = {
      id: 'modifier-fixture',
      name: 'Modifier Fixture',
      system: 'dnd-5e-2024',
      source: 'Test Fixture',
      description: 'Test fixture: carries a flat modifier.',
      benefits: fixtureBenefits,
      modifiers: [{ value: 1, type: 'untyped', source: 'modifier-fixture' }],
    };

    const updated = applyDnd5eFeatTemplate(makeDoc(), modifierFeat);
    const applied = updated.system.feats[0];

    expect(applied.modifiers).toEqual(modifierFeat.modifiers);
    expect(applied.modifiers).not.toBe(modifierFeat.modifiers);
    expect(applied.modifiers?.[0]).not.toBe(modifierFeat.modifiers?.[0]);
  });

  it('applies resilient ability choices and derives the matching saving throw proficiency', () => {
    const updated = applyDnd5eFeatTemplate(makeDoc(), resilient, {
      'ability-scores': ['wis'],
    });

    expect(updated.system.baseAttributes.wis).toBe(11);
    expect(updated.system.savingThrowProficiencies).toContain('wis');
    expect(updated.system.feats[0].automation).toMatchObject({
      abilityScores: { wis: 1 },
      savingThrows: ['wis'],
    });
    expect(getCurrentDnd5eFeatSelections(resilient, updated.system.feats[0])).toEqual({
      'ability-scores': ['wis'],
    });
  });

  it('rejects ability score improvement selections that exceed the feat cap', () => {
    const doc = makeDoc({
      baseAttributes: { str: 19, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    });

    expect(() =>
      applyDnd5eFeatTemplate(doc, abilityScoreImprovement, {
        'ability-scores': ['str', 'str'],
      })
    ).toThrow('Str cannot exceed 20');
  });

  it('removes feat-derived skill sources without clobbering non-feat proficiencies', () => {
    const doc = makeDoc({
      baseAttributes: { str: 10, dex: 10, con: 10, int: 13, wis: 10, cha: 10 },
      skillProficiencies: {
        arcana: { level: 'proficient', source: ['background:scholar'] },
      },
    });
    const withFeat = applyDnd5eFeatTemplate(doc, keen_mind, {
      'ability-scores': ['int'],
      skills: ['arcana'],
    });
    const removed = removeDnd5eFeatTemplate(withFeat, keen_mind.id);

    expect(withFeat.system.baseAttributes.int).toBe(14);
    expect(withFeat.system.skillProficiencies.arcana.source).toEqual(
      expect.arrayContaining(['background:scholar', 'feat:keen-mind'])
    );
    expect(removed.system.baseAttributes.int).toBe(13);
    expect(removed.system.skillProficiencies.arcana).toEqual({
      level: 'proficient',
      source: ['background:scholar'],
    });
  });

  it('supports mixed skill and tool selections for skilled', () => {
    const updated = applyDnd5eFeatTemplate(makeDoc(), skilled, {
      'skill-or-tool': ['acrobatics', 'bagpipes', 'thieves-tools'],
    });

    expect(updated.system.skillProficiencies.acrobatics).toEqual({
      level: 'proficient',
      source: ['feat:skilled'],
    });
    expect(updated.system.toolProficiencies).toEqual(
      expect.arrayContaining(['bagpipes', 'thieves-tools'])
    );
    expect(getCurrentDnd5eFeatSelections(skilled, updated.system.feats[0])).toEqual({
      'skill-or-tool': ['acrobatics', 'bagpipes', 'thieves-tools'],
    });
  });

  it('applies selectable artisan tool proficiencies for crafter', () => {
    const updated = applyDnd5eFeatTemplate(makeDoc(), crafter, {
      tools: ['smiths-tools', 'tinkers-tools', 'woodcarvers-tools'],
    });

    expect(updated.system.toolProficiencies).toEqual(
      expect.arrayContaining(['smiths-tools', 'tinkers-tools', 'woodcarvers-tools'])
    );
    expect(getCurrentDnd5eFeatSelections(crafter, updated.system.feats[0])).toEqual({
      tools: ['smiths-tools', 'tinkers-tools', 'woodcarvers-tools'],
    });
  });

  it('applies selectable weapon and language proficiencies', () => {
    const withWeaponMaster = applyDnd5eFeatTemplate(makeDoc(), weapon_master, {
      'ability-scores': ['dex'],
      weapons: ['dagger', 'longbow', 'maul', 'warhammer'],
    });
    const withLinguist = applyDnd5eFeatTemplate(withWeaponMaster, linguist, {
      'ability-scores': ['int'],
      languages: ['Draconic', 'Elvish', 'Undercommon'],
    });

    expect(withLinguist.system.baseAttributes.dex).toBe(11);
    expect(withLinguist.system.baseAttributes.int).toBe(11);
    expect(withLinguist.system.weaponProficiencies).toEqual(
      expect.arrayContaining(['dagger', 'longbow', 'maul', 'warhammer'])
    );
    expect(withLinguist.system.languageProficiencies).toEqual(
      expect.arrayContaining(['Draconic', 'Elvish', 'Undercommon'])
    );
  });

  it('applies observant skill choices without downgrading stronger existing proficiency levels', () => {
    const doc = makeDoc({
      skillProficiencies: {
        perception: { level: 'expertise', source: ['class:rogue'] },
      },
    });
    const updated = applyDnd5eFeatTemplate(doc, observant, {
      'ability-scores': ['wis'],
      skills: ['perception'],
    });

    expect(updated.system.baseAttributes.wis).toBe(11);
    expect(updated.system.skillProficiencies.perception).toEqual({
      level: 'expertise',
      source: ['class:rogue', 'feat:observant'],
    });
    expect(getCurrentDnd5eFeatSelections(observant, updated.system.feats[0])).toEqual({
      'ability-scores': ['wis'],
      skills: ['perception'],
    });
  });

  it('applies musical instrument selections and concrete armor training grants', () => {
    const withMusician = applyDnd5eFeatTemplate(makeDoc(), musician, {
      tools: ['flute', 'lute', 'viol'],
    });
    const withArmorTraining = applyDnd5eFeatTemplate(withMusician, moderately_armored, {
      'ability-scores': ['dex'],
    });

    expect(withArmorTraining.system.toolProficiencies).toEqual(
      expect.arrayContaining(['flute', 'lute', 'viol'])
    );
    expect(withArmorTraining.system.armorProficiencies).toEqual(
      expect.arrayContaining(['medium', 'shields'])
    );
    expect(withArmorTraining.system.baseAttributes.dex).toBe(11);
  });

  it('applies boon of skill to every 5e skill', () => {
    const updated = applyDnd5eFeatTemplate(makeDoc(), boonOfSkill, {
      'ability-scores': ['cha'],
    });

    expect(Object.keys(updated.system.skillProficiencies)).toHaveLength(18);
    expect(updated.system.skillProficiencies.stealth).toEqual({
      level: 'proficient',
      source: ['feat:boon-of-skill'],
    });
    expect(updated.system.baseAttributes.cha).toBe(11);
  });

  it('throws when the same feat is selected twice and leaves unrelated removals untouched', () => {
    const withFeat = applyDnd5eFeatTemplate(makeDoc(), resilient);

    expect(() => applyDnd5eFeatTemplate(withFeat, resilient)).toThrow(
      'Resilient is already selected'
    );

    const removedMissingFeat = removeDnd5eFeatTemplate(withFeat, 'missing-feat');
    expect(removedMissingFeat).not.toBe(withFeat);
    expect(removedMissingFeat.system.feats).toEqual(withFeat.system.feats);
    expect(removedMissingFeat.system.baseAttributes).toEqual(withFeat.system.baseAttributes);
  });
});
