import { describe, expect, it } from 'vitest';
import { acolyte } from '../../data/dnd/5e-2014/backgrounds/acolyte';
import { Background } from '../../types/character-options/backgrounds';
import { createDefaultDnd5eData, Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import { CharacterDocument } from '../../types/core/document';
import { applyDnd5eBackgroundTemplate } from '../../utils/backgroundTemplate';

// Neutral test fixtures. The only SRD 5.1 background is Acolyte (imported above);
// these generic backgrounds exist purely to exercise the template logic (skill
// source merging, the gaming-set choice token, a language choice, and feature
// swap/removal) without depending on non-open content.
const outlaw: Background = {
  id: 'outlaw',
  name: 'Outlaw',
  system: 'dnd-5e-2014',
  source: 'Test Fixture',
  skillProficiencies: ['deception', 'stealth'],
  toolProficiencies: ['thieves-tools', 'one-gaming-set'],
  equipment: ['pouch'],
  gold: 15,
  feature: {
    id: 'outlaw-contact',
    name: 'Outlaw Contact',
    source: 'Outlaw Background',
    description: 'Test fixture feature.',
  },
};

const envoy: Background = {
  id: 'envoy',
  name: 'Envoy',
  system: 'dnd-5e-2014',
  source: 'Test Fixture',
  skillProficiencies: ['history', 'persuasion'],
  toolProficiencies: ['one-gaming-set'],
  languageProficiencies: { count: 1, options: ['any'], label: 'One language of your choice' },
  equipment: ['purse'],
  gold: 25,
  feature: {
    id: 'envoy-position',
    name: 'Envoy Position',
    source: 'Envoy Background',
    description: 'Test fixture feature.',
  },
};

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
    const outlawDoc = applyDnd5eBackgroundTemplate(acolyteDoc, outlaw, acolyte);

    expect(outlawDoc.system.backgroundId).toBe('outlaw');
    expect(outlawDoc.system.skillProficiencies.insight).toBeUndefined();
    expect(outlawDoc.system.skillProficiencies.deception?.source).toEqual(['Outlaw']);
    expect(
      outlawDoc.system.features.some((feature) => feature.id === 'shelter-of-the-faithful')
    ).toBe(false);
    expect(outlawDoc.system.features.some((feature) => feature.id === 'outlaw-contact')).toBe(true);
    expect(outlawDoc.system.inventory.map((item) => item.itemId)).toEqual(acolyte.equipment);
  });

  it('preserves stronger existing skill proficiency levels while merging background sources', () => {
    const document = makeDoc({
      skillProficiencies: {
        deception: { level: 'expertise', source: ['class'] },
      },
    });

    const updated = applyDnd5eBackgroundTemplate(document, outlaw);

    expect(updated.system.skillProficiencies.deception).toEqual({
      level: 'expertise',
      source: ['class', 'Outlaw'],
    });
  });

  it('applies selected background languages and removes them cleanly on background change', () => {
    const envoyDoc = applyDnd5eBackgroundTemplate(makeDoc(), envoy, undefined, {
      toolSelections: ['dice-set'],
      languageSelections: ['Draconic'],
    });
    const outlawDoc = applyDnd5eBackgroundTemplate(envoyDoc, outlaw, envoy, {
      toolSelections: ['playing-card-set'],
    });

    expect(envoyDoc.system.backgroundId).toBe('envoy');
    expect(envoyDoc.system.backgroundLanguageSelections).toEqual(['Draconic']);
    expect(envoyDoc.system.backgroundToolSelections).toEqual(['dice-set']);
    expect(envoyDoc.system.languageProficiencies).toEqual(['Draconic']);
    expect(envoyDoc.system.toolProficiencies).toEqual(['dice-set']);
    expect(envoyDoc.system.templateState?.backgroundDerived).toEqual({
      tools: ['dice-set'],
      languages: ['Draconic'],
    });

    expect(outlawDoc.system.backgroundId).toBe('outlaw');
    expect(outlawDoc.system.backgroundLanguageSelections).toEqual([]);
    expect(outlawDoc.system.backgroundToolSelections).toEqual(['playing-card-set']);
    expect(outlawDoc.system.languageProficiencies).toEqual([]);
    expect(outlawDoc.system.toolProficiencies).toEqual(['thieves-tools', 'playing-card-set']);
    expect(outlawDoc.system.templateState?.backgroundDerived).toEqual({
      tools: ['thieves-tools', 'playing-card-set'],
      languages: [],
    });
  });

  it('removes background-derived languages and tools while preserving other sources', () => {
    const document = makeDoc({
      backgroundId: envoy.id,
      backgroundLanguageSelections: ['Draconic'],
      backgroundToolSelections: ['dice-set'],
      languageProficiencies: ['Common', 'Draconic'],
      toolProficiencies: ['thieves-tools', 'dice-set'],
      templateState: {
        ...createDefaultDnd5eData().templateState!,
        backgroundDerived: {
          tools: ['dice-set'],
          languages: ['Draconic'],
        },
      },
    });

    const cleared = applyDnd5eBackgroundTemplate(document, undefined, envoy);

    expect(cleared.system.backgroundId).toBeUndefined();
    expect(cleared.system.backgroundLanguageSelections).toEqual([]);
    expect(cleared.system.backgroundToolSelections).toEqual([]);
    expect(cleared.system.languageProficiencies).toEqual(['Common']);
    expect(cleared.system.toolProficiencies).toEqual(['thieves-tools']);
  });

  it('does not auto-apply unresolved choice-based proficiencies or overwrite existing gold', () => {
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
      ...outlaw,
      id: 'scholar',
      name: 'Scholar',
      skillProficiencies: ['insight', 'arcana'],
      toolProficiencies: ['calligraphers-supplies'],
      languageProficiencies: [
        'Elvish',
        'Dwarvish',
      ] as unknown as Background['languageProficiencies'],
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
      ...outlaw,
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
