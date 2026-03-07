import { describe, expect, it } from 'vitest';
import { wizard } from '../../data/dnd/5e-2014/classes/wizard';
import { fighter } from '../../data/dnd/5e-2014/classes/fighter';
import { cleric } from '../../data/dnd/5e-2014/classes/cleric';
import { paladin } from '../../data/dnd/5e-2014/classes/paladin';
import { bard } from '../../data/dnd/5e-2014/classes/bard';
import { rogue } from '../../data/dnd/5e-2014/classes/rogue';
import { wizard as wizard2024 } from '../../data/dnd/5e-2024/classes/wizard';
import { cleric as cleric2024 } from '../../data/dnd/5e-2024/classes/cleric';
import { createDefaultDnd5eData, Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import {
  createDefaultDnd5e2024Data,
  Dnd5e2024DataModel,
} from '../../systems/dnd5e-2024/data-model';
import { CharacterDocument } from '../../types/core/document';
import {
  applyDnd5eClassTemplate,
  applyDnd5eSubclassTemplate,
  removeDnd5eClassTemplate,
} from '../../utils/classTemplate';

function makeDoc(overrides: Partial<Dnd5eDataModel> = {}): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'class-template-doc',
    name: 'Template Hero',
    systemId: 'dnd-5e-2014',
    system: { ...createDefaultDnd5eData(), ...overrides },
    createdAt: new Date('2026-03-01T00:00:00.000Z'),
    updatedAt: new Date('2026-03-01T00:00:00.000Z'),
  };
}

function make2024Doc(
  overrides: Partial<Dnd5e2024DataModel> = {}
): CharacterDocument<Dnd5e2024DataModel> {
  return {
    id: 'class-template-doc-2024',
    name: 'Template Hero 2024',
    systemId: 'dnd-5e-2024',
    system: { ...createDefaultDnd5e2024Data(), ...overrides },
    createdAt: new Date('2026-03-01T00:00:00.000Z'),
    updatedAt: new Date('2026-03-01T00:00:00.000Z'),
  };
}

describe('applyDnd5eClassTemplate', () => {
  it('seeds hit die rolls and canonical spellcasting for spellcasters', () => {
    const updated = applyDnd5eClassTemplate(makeDoc(), wizard, 3);

    expect(updated.createdAt).toBeInstanceOf(Date);
    expect(updated.system.classLevels[0]).toMatchObject({
      classId: 'wizard',
      level: 3,
      hitDieRolls: [6, 4, 4],
    });
    expect(updated.system.spellcasting).toEqual({
      classes: [{ classId: 'wizard', ability: 'int', spellcastingLevel: 3 }],
      spellsKnown: [],
      spellsPrepared: [],
      spellSlots: {
        1: { max: 0, used: 0 },
        2: { max: 0, used: 0 },
        3: { max: 0, used: 0 },
        4: { max: 0, used: 0 },
        5: { max: 0, used: 0 },
        6: { max: 0, used: 0 },
        7: { max: 0, used: 0 },
        8: { max: 0, used: 0 },
        9: { max: 0, used: 0 },
      },
    });
  });

  it('prunes higher-level class features when leveling down', () => {
    const levelFive = applyDnd5eClassTemplate(makeDoc(), fighter, 5);
    expect(levelFive.system.features.map((feature) => feature.id)).toContain('extra-attack');

    const levelTwo = applyDnd5eClassTemplate(levelFive, fighter, 2);
    const featureIds = levelTwo.system.features.map((feature) => feature.id);

    expect(featureIds).toContain('action-surge');
    expect(featureIds).not.toContain('ability-score-improvement-4');
    expect(featureIds).not.toContain('extra-attack');
  });

  it('replaces old class features and stale spellcasting entries on class change', () => {
    const wizardDoc = applyDnd5eClassTemplate(makeDoc(), wizard, 4);
    const clericDoc = applyDnd5eClassTemplate(wizardDoc, cleric, 2);
    const featureIds = clericDoc.system.features.map((feature) => feature.id);

    expect(clericDoc.system.classLevels[0]).toMatchObject({
      classId: 'cleric',
      level: 2,
      hitDieRolls: [8, 5],
    });
    expect(featureIds).toContain('channel-divinity');
    expect(featureIds).not.toContain('arcane-recovery');
    expect(featureIds).not.toContain('arcane-tradition');
    expect(clericDoc.system.spellcasting?.classes).toEqual([
      { classId: 'cleric', ability: 'wis', spellcastingLevel: 2 },
    ]);
  });

  it('clears spellcasting when switching to a non-spellcasting class', () => {
    const wizardDoc = applyDnd5eClassTemplate(makeDoc(), wizard, 2);
    const fighterDoc = applyDnd5eClassTemplate(wizardDoc, fighter, 2);

    expect(fighterDoc.system.spellcasting).toBeUndefined();
  });

  it('adds and updates multiclass rows without clobbering the starting class', () => {
    const fighterDoc = applyDnd5eClassTemplate(
      makeDoc({
        baseAttributes: { str: 14, dex: 10, con: 10, int: 14, wis: 10, cha: 10 },
      }),
      fighter,
      2
    );
    const multiclassDoc = applyDnd5eClassTemplate(fighterDoc, wizard, 3, { mode: 'add' });
    const updatedWizardDoc = applyDnd5eClassTemplate(multiclassDoc, wizard, 4, {
      mode: 'replace',
      targetClassId: 'wizard',
    });

    expect(multiclassDoc.system.classLevels).toMatchObject([
      { classId: 'fighter', level: 2, hitDieRolls: [10, 6] },
      { classId: 'wizard', level: 3, hitDieRolls: [6, 4, 4] },
    ]);
    expect(multiclassDoc.system.level).toBe(5);
    expect(multiclassDoc.system.savingThrowProficiencies).toEqual(['str', 'con']);
    expect(multiclassDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(['action-surge', 'arcane-recovery', 'spellcasting-wizard'])
    );
    expect(multiclassDoc.system.spellcasting?.classes).toEqual([
      { classId: 'wizard', ability: 'int', spellcastingLevel: 3 },
    ]);
    expect(updatedWizardDoc.system.classLevels).toMatchObject([
      { classId: 'fighter', level: 2, hitDieRolls: [10, 6] },
      { classId: 'wizard', level: 4, hitDieRolls: [6, 4, 4, 4] },
    ]);
    expect(updatedWizardDoc.system.level).toBe(6);
  });

  it('removes a class row and rebuilds derived spellcasting state', () => {
    const multiclassDoc = applyDnd5eClassTemplate(
      applyDnd5eClassTemplate(
        makeDoc({
          baseAttributes: { str: 14, dex: 10, con: 10, int: 14, wis: 10, cha: 10 },
        }),
        fighter,
        2
      ),
      wizard,
      3,
      { mode: 'add' }
    );
    const strippedDoc = removeDnd5eClassTemplate(multiclassDoc, 'wizard');

    expect(strippedDoc.system.classLevels).toMatchObject([{ classId: 'fighter', level: 2 }]);
    expect(strippedDoc.system.level).toBe(2);
    expect(strippedDoc.system.features.some((feature) => feature.id === 'arcane-recovery')).toBe(
      false
    );
    expect(strippedDoc.system.spellcasting).toBeUndefined();
  });

  it('enforces 5e multiclass prerequisites when adding a new class', () => {
    const fighterDoc = applyDnd5eClassTemplate(
      makeDoc({
        baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      }),
      fighter,
      2
    );

    expect(() =>
      applyDnd5eClassTemplate(fighterDoc, paladin, 1, {
        mode: 'add',
      })
    ).toThrow('Multiclass prerequisites not met for: Paladin');
  });

  it('accepts fighter multiclassing when only the dexterity prerequisite is met', () => {
    const wizardDoc = applyDnd5eClassTemplate(
      makeDoc({
        baseAttributes: { str: 10, dex: 13, con: 10, int: 14, wis: 10, cha: 10 },
      }),
      wizard,
      2
    );

    const multiclassDoc = applyDnd5eClassTemplate(wizardDoc, fighter, 1, { mode: 'add' });

    expect(multiclassDoc.system.classLevels).toMatchObject([
      { classId: 'wizard', level: 2 },
      { classId: 'fighter', level: 1 },
    ]);
    expect(multiclassDoc.system.armorProficiencies).toEqual(['light', 'medium', 'shields']);
    expect(multiclassDoc.system.weaponProficiencies).toEqual(
      expect.arrayContaining(['simple', 'martial'])
    );
  });

  it('supports bypassing multiclass prerequisites when explicitly disabled', () => {
    const fighterDoc = applyDnd5eClassTemplate(
      makeDoc({
        baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      }),
      fighter,
      2
    );

    const multiclassDoc = applyDnd5eClassTemplate(fighterDoc, paladin, 1, {
      mode: 'add',
      enforceMulticlassRequirements: false,
    });

    expect(multiclassDoc.system.classLevels).toMatchObject([
      { classId: 'fighter', level: 2 },
      { classId: 'paladin', level: 1 },
    ]);
  });

  it('applies subclass features at the matching class levels and preserves the choice on level changes', () => {
    const wizardDoc = applyDnd5eClassTemplate(makeDoc(), wizard, 10);
    const evokerDoc = applyDnd5eSubclassTemplate(wizardDoc, 'wizard', 'evocation');
    const evokerFeatures = evokerDoc.system.features.map((feature) => feature.id);

    expect(evokerDoc.system.classLevels[0]).toMatchObject({
      classId: 'wizard',
      subclassId: 'evocation',
      level: 10,
    });
    expect(evokerFeatures).toEqual(
      expect.arrayContaining([
        'evocation-savant',
        'sculpt-spells',
        'potent-cantrip',
        'empowered-evocation',
      ])
    );
    expect(evokerFeatures).not.toContain('overchannel');

    const levelOneDoc = applyDnd5eClassTemplate(evokerDoc, wizard, 1);
    expect(levelOneDoc.system.classLevels[0].subclassId).toBe('evocation');
    expect(levelOneDoc.system.features.map((feature) => feature.id)).not.toEqual(
      expect.arrayContaining(['evocation-savant', 'sculpt-spells'])
    );

    const levelTwoDoc = applyDnd5eClassTemplate(levelOneDoc, wizard, 2);
    expect(levelTwoDoc.system.classLevels[0].subclassId).toBe('evocation');
    expect(levelTwoDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(['evocation-savant', 'sculpt-spells'])
    );
  });

  it('clears subclass selections and subclass features when a class row is replaced', () => {
    const championDoc = applyDnd5eSubclassTemplate(
      applyDnd5eClassTemplate(makeDoc(), fighter, 7),
      'fighter',
      'champion'
    );
    const wizardDoc = applyDnd5eClassTemplate(championDoc, wizard, 7, {
      mode: 'replace',
      targetClassId: 'fighter',
    });

    expect(wizardDoc.system.classLevels[0]).toMatchObject({
      classId: 'wizard',
      level: 7,
    });
    expect(wizardDoc.system.classLevels[0].subclassId).toBeUndefined();
    expect(wizardDoc.system.features.map((feature) => feature.id)).not.toContain(
      'improved-critical'
    );
    expect(wizardDoc.system.features.map((feature) => feature.id)).toContain('arcane-tradition');
  });

  it('preserves manual proficiencies while removing multiclass-derived proficiencies', () => {
    const wizardDoc = applyDnd5eClassTemplate(
      makeDoc({
        baseAttributes: { str: 10, dex: 14, con: 10, int: 14, wis: 10, cha: 10 },
        armorProficiencies: ['custom-armor-training'],
        weaponProficiencies: ['longbow'],
        toolProficiencies: ['smith-tools'],
      }),
      wizard,
      2
    );
    const baseWeaponProficiencies = [...wizardDoc.system.weaponProficiencies];
    const multiclassDoc = applyDnd5eClassTemplate(wizardDoc, rogue, 1, { mode: 'add' });
    const strippedDoc = removeDnd5eClassTemplate(multiclassDoc, 'rogue');

    expect(multiclassDoc.system.armorProficiencies).toEqual(['custom-armor-training', 'light']);
    expect(multiclassDoc.system.weaponProficiencies).toEqual(baseWeaponProficiencies);
    expect(multiclassDoc.system.toolProficiencies).toEqual(['smith-tools', 'thieves-tools']);

    expect(strippedDoc.system.armorProficiencies).toEqual(['custom-armor-training']);
    expect(strippedDoc.system.weaponProficiencies).toEqual(baseWeaponProficiencies);
    expect(strippedDoc.system.toolProficiencies).toEqual(['smith-tools']);
  });

  it('throws when replacing a missing class row', () => {
    const fighterDoc = applyDnd5eClassTemplate(makeDoc(), fighter, 2);

    expect(() =>
      applyDnd5eClassTemplate(fighterDoc, wizard, 1, {
        mode: 'replace',
        targetClassId: 'wizard',
      })
    ).toThrow('Cannot replace missing class entry "wizard"');
  });

  it('throws when replacing a class row with a class already present elsewhere', () => {
    const multiclassDoc = applyDnd5eClassTemplate(
      applyDnd5eClassTemplate(
        applyDnd5eClassTemplate(
          makeDoc({
            baseAttributes: { str: 14, dex: 10, con: 10, int: 14, wis: 10, cha: 14 },
          }),
          fighter,
          2
        ),
        wizard,
        3,
        { mode: 'add' }
      ),
      bard,
      1,
      { mode: 'add' }
    );

    expect(() =>
      applyDnd5eClassTemplate(multiclassDoc, bard, 2, {
        mode: 'replace',
        targetClassId: 'wizard',
      })
    ).toThrow('Bard is already present in this multiclass build');
  });

  it('rejects multiclass templates that exceed total level 20', () => {
    const fighterDoc = applyDnd5eClassTemplate(
      makeDoc({
        baseAttributes: { str: 14, dex: 10, con: 10, int: 14, wis: 10, cha: 10 },
      }),
      fighter,
      18
    );

    expect(() =>
      applyDnd5eClassTemplate(fighterDoc, wizard, 3, {
        mode: 'add',
      })
    ).toThrow('Total character level cannot exceed 20 (received 21)');
  });

  it('rejects corrupted duplicate class rows before syncing the template', () => {
    const corruptDoc = makeDoc({
      classLevels: [
        { classId: 'fighter', level: 2, hitDieRolls: [10, 6] },
        { classId: 'fighter', level: 1, hitDieRolls: [10] },
      ],
    });

    expect(() => applyDnd5eClassTemplate(corruptDoc, fighter, 3)).toThrow(
      'Duplicate classes are not allowed in the multiclass template'
    );
  });

  it('rejects subclass choices before the class reaches its unlock level in 2024 data', () => {
    const clericDoc = applyDnd5eClassTemplate(make2024Doc(), cleric2024, 2);

    expect(() => applyDnd5eSubclassTemplate(clericDoc, 'cleric', 'life-domain')).toThrow(
      'Cleric subclasses unlock at level 3'
    );
  });

  it('uses the 2024 subclass catalog when applying a subclass choice', () => {
    const wizardDoc = applyDnd5eClassTemplate(make2024Doc(), wizard2024, 2);
    const evokerDoc = applyDnd5eSubclassTemplate(wizardDoc, 'wizard', 'evocation');

    expect(evokerDoc.system.classLevels[0]).toMatchObject({
      classId: 'wizard',
      subclassId: 'evocation',
      level: 2,
    });
    expect(evokerDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(['evocation-savant', 'sculpt-spells'])
    );
  });
});
