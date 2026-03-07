import { describe, expect, it } from 'vitest';
import { elf } from '../../data/dnd/5e-2014/species/elf';
import { human } from '../../data/dnd/5e-2014/species/human';
import { halfOrc } from '../../data/dnd/5e-2014/species/half-orc';
import { Species } from '../../types/character-options/species';
import { createDefaultDnd5eData, Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import { CharacterDocument } from '../../types/core/document';
import { applyDnd5eSpeciesTemplate } from '../../utils/speciesTemplate';

function makeDoc(overrides: Partial<Dnd5eDataModel> = {}): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'species-template-doc',
    name: 'Species Hero',
    systemId: 'dnd-5e-2014',
    system: { ...createDefaultDnd5eData(), ...overrides },
    createdAt: new Date('2026-03-01T00:00:00.000Z'),
    updatedAt: new Date('2026-03-01T00:00:00.000Z'),
  };
}

describe('applyDnd5eSpeciesTemplate', () => {
  it('swaps fixed ASIs and species features cleanly on species change', () => {
    const elfDoc = applyDnd5eSpeciesTemplate(makeDoc(), elf);
    const humanDoc = applyDnd5eSpeciesTemplate(elfDoc, human, elf);

    expect(elfDoc.system.baseAttributes.dex).toBe(12);
    expect(humanDoc.system.baseAttributes).toMatchObject({
      str: 11,
      dex: 11,
      con: 11,
      int: 11,
      wis: 11,
      cha: 11,
    });
    expect(humanDoc.system.features.some((feature) => feature.source === 'Elf')).toBe(false);
    expect(humanDoc.system.features.some((feature) => feature.id === 'human-versatility')).toBe(
      true
    );
  });

  it('merges species skill sources without clobbering existing proficiencies', () => {
    const doc = makeDoc({
      skillProficiencies: {
        perception: { level: 'proficient', source: ['class'] },
      },
    });

    const elfDoc = applyDnd5eSpeciesTemplate(doc, elf);
    expect(elfDoc.system.skillProficiencies.perception).toEqual({
      level: 'proficient',
      source: ['class', 'Elf'],
    });

    const humanDoc = applyDnd5eSpeciesTemplate(elfDoc, human, elf);
    expect(humanDoc.system.skillProficiencies.perception).toEqual({
      level: 'proficient',
      source: ['class'],
    });
  });

  it('does not downgrade stronger proficiencies when a species grants the same skill', () => {
    const doc = makeDoc({
      skillProficiencies: {
        intimidation: { level: 'expertise', source: ['class'] },
      },
    });

    const updated = applyDnd5eSpeciesTemplate(doc, halfOrc);

    expect(updated.system.skillProficiencies.intimidation.level).toBe('expertise');
    expect(updated.system.skillProficiencies.intimidation.source).toEqual(['class', 'Half-Orc']);
  });

  it('applies fallback defaults for custom species traits, languages, and ability score bonuses', () => {
    const customSpecies: Species = {
      ...human,
      id: 'mystery-species',
      name: 'Mystery Species',
      speed: 25,
      abilityScoreIncrease: [
        {
          type: 'fixed',
          attributes: { str: 2, dex: 'bad-data' as unknown as number },
        },
        {
          type: 'choice',
          choice: {
            count: 1,
            options: ['wis'],
            label: 'Choose one ability',
          },
        },
        {
          type: 'fixed',
        },
      ],
      languages: {
        automatic: ['Draconic'],
      },
      traits: [
        {
          id: 'mystery-trait',
          name: 'Mystery Trait',
          description: 'A custom trait without an explicit source.',
        } as Species['traits'][number],
      ],
    };
    const doc = makeDoc({
      baseAttributes: {
        ...createDefaultDnd5eData().baseAttributes,
        str: undefined as unknown as number,
      },
      languageProficiencies: undefined as unknown as Dnd5eDataModel['languageProficiencies'],
      features: undefined as unknown as Dnd5eDataModel['features'],
    });

    const updated = applyDnd5eSpeciesTemplate(doc, customSpecies);

    expect(updated.system.baseAttributes.str).toBe(12);
    expect(updated.system.baseAttributes.dex).toBe(10);
    expect(updated.system.languageProficiencies).toEqual(['Draconic']);
    expect(updated.system.features).toEqual([
      {
        id: 'mystery-trait',
        name: 'Mystery Trait',
        source: 'Mystery Species',
        description: 'A custom trait without an explicit source.',
      },
    ]);
  });

  it('handles species changes when old languages and features are absent but shared skill sources remain', () => {
    const doc = makeDoc({
      speciesId: elf.id,
      baseAttributes: {
        ...createDefaultDnd5eData().baseAttributes,
        dex: undefined as unknown as number,
      },
      languageProficiencies: undefined as unknown as Dnd5eDataModel['languageProficiencies'],
      features: undefined as unknown as Dnd5eDataModel['features'],
      skillProficiencies: {
        perception: { level: 'proficient', source: ['Elf', 'class'] },
        arcana: { level: 'proficient', source: ['class'] },
      },
    });

    const updated = applyDnd5eSpeciesTemplate(doc, human, elf);

    expect(updated.system.baseAttributes.dex).toBe(11);
    expect(updated.system.skillProficiencies.perception).toEqual({
      level: 'proficient',
      source: ['class'],
    });
    expect(updated.system.skillProficiencies.arcana).toEqual({
      level: 'proficient',
      source: ['class'],
    });
    expect(updated.system.languageProficiencies).toEqual(['Common']);
    expect(updated.system.features.map((feature) => feature.id)).toEqual(['human-versatility']);
  });

  it('upgrades weaker proficiencies and fills in missing skill source arrays for species traits', () => {
    const doc = makeDoc({
      skillProficiencies: {
        intimidation: { level: 'half' } as Dnd5eDataModel['skillProficiencies'][string],
      },
    });

    const updated = applyDnd5eSpeciesTemplate(doc, halfOrc);

    expect(updated.system.skillProficiencies.intimidation).toEqual({
      level: 'proficient',
      source: ['Half-Orc'],
    });
  });

  it('leaves language proficiencies untouched when a species has no automatic languages', () => {
    const silentSpecies: Species = {
      ...human,
      id: 'silent-species',
      name: 'Silent Species',
      languages: {} as Species['languages'],
      abilityScoreIncrease: [],
      traits: [],
    };

    const updated = applyDnd5eSpeciesTemplate(
      makeDoc({ languageProficiencies: ['Common', 'Elvish'] }),
      silentSpecies
    );

    expect(updated.system.languageProficiencies).toEqual(['Common', 'Elvish']);
  });
});
