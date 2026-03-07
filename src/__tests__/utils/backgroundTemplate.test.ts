import { describe, expect, it } from 'vitest';
import { acolyte } from '../../data/dnd/5e-2014/backgrounds/acolyte';
import { criminal } from '../../data/dnd/5e-2014/backgrounds/criminal';
import { Background } from '../../types/character-options/backgrounds';
import { createDefaultDnd5eData, Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import { CharacterDocument } from '../../types/core/document';
import { applyDnd5eBackgroundTemplate } from '../../utils/backgroundTemplate';

function makeDoc(overrides: Partial<Dnd5eDataModel> = {}): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'background-template-doc',
    name: 'Background Hero',
    systemId: 'dnd-5e-2014',
    system: { ...createDefaultDnd5eData(), ...overrides },
    createdAt: new Date('2026-03-01T00:00:00.000Z'),
    updatedAt: new Date('2026-03-01T00:00:00.000Z'),
  };
}

describe('applyDnd5eBackgroundTemplate', () => {
  it('applies skills, feature, inventory, and starting gold for an initial background', () => {
    const updated = applyDnd5eBackgroundTemplate(makeDoc(), acolyte);

    expect(updated.system.backgroundId).toBe('acolyte');
    expect(updated.system.skillProficiencies.insight).toEqual({
      level: 'proficient',
      source: ['Acolyte'],
    });
    expect(updated.system.skillProficiencies.religion).toEqual({
      level: 'proficient',
      source: ['Acolyte'],
    });
    expect(
      updated.system.features.some((feature) => feature.id === 'shelter-of-the-faithful')
    ).toBe(true);
    expect(updated.system.inventory.map((item) => item.itemId)).toEqual(acolyte.equipment);
    expect(updated.system.currency.gold).toBe(15);
  });

  it('replaces background skill sources and feature on background change without duplicating inventory', () => {
    const acolyteDoc = applyDnd5eBackgroundTemplate(makeDoc(), acolyte);
    const criminalDoc = applyDnd5eBackgroundTemplate(acolyteDoc, criminal, acolyte);

    expect(criminalDoc.system.backgroundId).toBe('criminal');
    expect(criminalDoc.system.skillProficiencies.insight).toBeUndefined();
    expect(criminalDoc.system.skillProficiencies.deception?.source).toEqual(['Criminal']);
    expect(
      criminalDoc.system.features.some((feature) => feature.id === 'shelter-of-the-faithful')
    ).toBe(false);
    expect(criminalDoc.system.features.some((feature) => feature.id === 'criminal-contact')).toBe(
      true
    );
    expect(criminalDoc.system.inventory.map((item) => item.itemId)).toEqual(acolyte.equipment);
  });

  it('preserves stronger existing skill proficiency levels while merging background sources', () => {
    const document = makeDoc({
      skillProficiencies: {
        deception: { level: 'expertise', source: ['class'] },
      },
    });

    const updated = applyDnd5eBackgroundTemplate(document, criminal);

    expect(updated.system.skillProficiencies.deception).toEqual({
      level: 'expertise',
      source: ['class', 'Criminal'],
    });
  });

  it('skips choice-based proficiencies and does not overwrite existing gold or duplicate features', () => {
    const customBackground: Background = {
      ...acolyte,
      id: 'choice-background',
      name: 'Choice Background',
      skillProficiencies: {
        count: 1,
        options: ['arcana', 'history'],
        label: 'Choose one skill',
      },
      toolProficiencies: {
        count: 1,
        options: ['calligraphers-supplies'],
        label: 'Choose one tool',
      },
      languageProficiencies: {
        count: 1,
        options: ['Elvish'],
        label: 'Choose one language',
      },
      equipment: ['pouch'],
      feature: {
        ...acolyte.feature,
        source: 'Choice Background',
      },
    };
    const document = makeDoc({
      currency: { copper: 0, silver: 0, electrum: 0, gold: 7, platinum: 0 },
      features: [structuredClone(customBackground.feature)],
      inventory: [{ itemId: 'pouch', quantity: 1 }],
    });

    const updated = applyDnd5eBackgroundTemplate(document, customBackground);

    expect(updated.system.skillProficiencies).toEqual({});
    expect(updated.system.toolProficiencies).toEqual([]);
    expect(updated.system.languageProficiencies).toEqual([]);
    expect(updated.system.features).toEqual([customBackground.feature]);
    expect(updated.system.currency.gold).toBe(7);
    expect(updated.system.inventory).toEqual([{ itemId: 'pouch', quantity: 1 }]);
  });

  it('handles missing optional arrays and removes only the old background source on change', () => {
    const scholar: Background = {
      ...criminal,
      id: 'scholar',
      name: 'Scholar',
      skillProficiencies: ['insight', 'arcana'],
      toolProficiencies: ['calligraphers-supplies'],
      languageProficiencies: ['Elvish', 'Dwarvish'] as unknown as Background['languageProficiencies'],
      feature: {
        id: 'researcher',
        name: 'Researcher',
        source: 'Scholar Background',
        description: 'You know where to find lore.',
      },
    };
    const document = makeDoc({
      backgroundId: acolyte.id,
      features: undefined as unknown as Dnd5eDataModel['features'],
      toolProficiencies: undefined as unknown as Dnd5eDataModel['toolProficiencies'],
      languageProficiencies: undefined as unknown as Dnd5eDataModel['languageProficiencies'],
      skillProficiencies: {
        insight: { level: 'expertise', source: ['class', 'Acolyte'] },
      },
    });

    const updated = applyDnd5eBackgroundTemplate(document, scholar, acolyte);

    expect(updated.system.skillProficiencies.insight).toEqual({
      level: 'expertise',
      source: ['class', 'Scholar'],
    });
    expect(updated.system.skillProficiencies.arcana).toEqual({
      level: 'proficient',
      source: ['Scholar'],
    });
    expect(updated.system.toolProficiencies).toEqual(['calligraphers-supplies']);
    expect(updated.system.languageProficiencies).toEqual(['Elvish', 'Dwarvish']);
    expect(updated.system.features).toEqual([scholar.feature]);
  });

  it('upgrades weaker skill proficiencies and removes old features matched by source as well as id', () => {
    const scholar: Background = {
      ...criminal,
      id: 'scholar-2',
      name: 'Scholar',
      skillProficiencies: ['arcana'],
      feature: {
        id: 'researcher-2',
        name: 'Researcher',
        source: 'Scholar Background',
        description: 'You know where to find lore.',
      },
    };
    const document = makeDoc({
      backgroundId: acolyte.id,
      skillProficiencies: {
        arcana: { level: 'half' } as Dnd5eDataModel['skillProficiencies'][string],
      },
      features: [
        {
          id: 'legacy-note',
          name: 'Legacy Note',
          source: acolyte.feature.source,
          description: 'Old background marker.',
        },
      ],
    });

    const updated = applyDnd5eBackgroundTemplate(document, scholar, acolyte);

    expect(updated.system.skillProficiencies.arcana).toEqual({
      level: 'proficient',
      source: ['Scholar'],
    });
    expect(updated.system.features).toEqual([scholar.feature]);
  });
});
