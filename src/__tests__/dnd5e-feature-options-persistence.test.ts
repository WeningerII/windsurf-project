import { afterEach, describe, expect, it } from 'vitest';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import type { Dnd5eFeatureOptionGroup } from '../types/character-options/feature-options';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import {
  applyDnd5eFeatureOptionSelection,
  loadDnd5e2014FeatureOptions,
  removeDnd5eFeatureOptionSelection,
} from '../systems/dnd5e/shared/dnd5eFeatureOptions';
import { clearDocumentStorage, loadDocuments, saveDocuments } from '../utils/documentStorage';

type FeatureOptionRoundtripCase = {
  classId: string;
  group: Dnd5eFeatureOptionGroup;
  label: string;
  level: number;
  optionId: string;
};

const optionCases: FeatureOptionRoundtripCase[] = [
  {
    label: 'Fighting Style: Defense',
    classId: 'fighter',
    level: 2,
    group: 'fighting-styles',
    optionId: 'defense',
  },
  {
    label: 'Eldritch Invocation: Agonizing Blast',
    classId: 'warlock',
    level: 2,
    group: 'invocations',
    optionId: 'agonizing-blast',
  },
  {
    label: 'Metamagic: Quickened Spell',
    classId: 'sorcerer',
    level: 3,
    group: 'metamagic',
    optionId: 'quickened-spell',
  },
];

function makeDocument(id: string, system: Dnd5eDataModel): CharacterDocument<SystemDataModel> {
  return {
    id,
    name: id,
    systemId: 'dnd-5e-2014',
    system,
    createdAt: new Date('2026-04-29T12:00:00.000Z'),
    updatedAt: new Date('2026-04-29T12:00:00.000Z'),
  };
}

function makeSystem({ classId, level }: FeatureOptionRoundtripCase): Dnd5eDataModel {
  return {
    ...createDefaultDnd5eData(),
    level,
    classLevels: [
      {
        classId,
        level,
        hitDieRolls: Array.from({ length: level }, () => 6),
      },
    ],
  };
}

function reloadSingleDocument(): CharacterDocument<Dnd5eDataModel> {
  const [document] = loadDocuments() as CharacterDocument<Dnd5eDataModel>[];
  expect(document).toBeDefined();
  return document;
}

describe('D&D 5e feature-option persistence', () => {
  afterEach(() => {
    clearDocumentStorage();
  });

  it.each(optionCases)(
    'round-trips %s selection and removal through document storage',
    async (optionCase) => {
      const options = await loadDnd5e2014FeatureOptions();
      const option = options.find(
        (entry) => entry.group === optionCase.group && entry.id === optionCase.optionId
      );
      expect(option, optionCase.label).toBeDefined();

      const selectedSystem = applyDnd5eFeatureOptionSelection(makeSystem(optionCase), option!);
      const selectedDocument = makeDocument(
        `${optionCase.group}-${optionCase.optionId}`,
        selectedSystem
      );

      saveDocuments([selectedDocument]);

      const rehydrated = reloadSingleDocument();
      expect(rehydrated.system.featureOptionSelections).toEqual([
        { id: optionCase.optionId, group: optionCase.group },
      ]);
      expect(rehydrated.system.features).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: `feature-option:${optionCase.group}:${optionCase.optionId}`,
            name: option!.name,
          }),
        ])
      );

      const clearedSystem = removeDnd5eFeatureOptionSelection(rehydrated.system, {
        id: optionCase.optionId,
        group: optionCase.group,
      });
      saveDocuments([
        {
          ...rehydrated,
          system: clearedSystem,
          updatedAt: new Date('2026-04-29T12:05:00.000Z'),
        },
      ]);

      const rehydratedAfterRemoval = reloadSingleDocument();
      expect(rehydratedAfterRemoval.system.featureOptionSelections).toEqual([]);
      expect(
        rehydratedAfterRemoval.system.features.some(
          (feature) => feature.id === `feature-option:${optionCase.group}:${optionCase.optionId}`
        )
      ).toBe(false);
    }
  );
});
