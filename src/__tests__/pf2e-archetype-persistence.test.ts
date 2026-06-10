import { afterEach, describe, expect, it } from 'vitest';
import { allPf2eArchetypes } from '../data/pathfinder/2e/archetypes';
import { createDefaultPf2eData, type Pf2eDataModel } from '../systems/pf2e/data-model';
import type { Archetype } from '../types/character-options/archetypes';
import type { CharacterDocument } from '../types/core/document';
import { clearDocumentStorage, loadDocuments, saveDocuments } from '../utils/documentStorage';
import { applyPf2eArchetypeTemplate, removePf2eArchetypeTemplate } from '../utils/pf2eTemplate';

const archetypeIds = ['pf2e-wizard-archetype', 'pf2e-ranger-archetype'];

function makeDocument(id: string, system: Pf2eDataModel): CharacterDocument<Pf2eDataModel> {
  return {
    id,
    name: id,
    systemId: 'pf2e',
    system,
    createdAt: new Date('2026-04-29T12:00:00.000Z'),
    updatedAt: new Date('2026-04-29T12:00:00.000Z'),
  };
}

function makeSystem(archetype: Archetype): Pf2eDataModel {
  return {
    ...createDefaultPf2eData(),
    classId: archetype.parentClassId,
  };
}

function reloadSingleDocument(): CharacterDocument<Pf2eDataModel> {
  const [document] = loadDocuments() as CharacterDocument<Pf2eDataModel>[];
  expect(document).toBeDefined();
  return document;
}

describe('PF2e archetype persistence', () => {
  afterEach(() => {
    clearDocumentStorage();
  });

  it.each(archetypeIds)(
    'round-trips %s selection and removal through document storage',
    (archetypeId) => {
      const archetype = allPf2eArchetypes.find((entry) => entry.id === archetypeId);
      expect(archetype, archetypeId).toBeDefined();

      const selectedDocument = applyPf2eArchetypeTemplate(
        makeDocument(archetypeId, makeSystem(archetype!)),
        archetype!
      );
      const featureIds = archetype!.features.map(
        (feature) =>
          `${archetype!.id}:${feature.level}:${feature.name.toLowerCase().replace(/\s+/g, '-')}`
      );

      saveDocuments([selectedDocument]);

      const rehydrated = reloadSingleDocument();
      expect(rehydrated.system.selectedArchetypeIds).toEqual([archetype!.id]);
      expect(rehydrated.system.features).toEqual(
        expect.arrayContaining(
          featureIds.map((id) =>
            expect.objectContaining({
              id,
              source: `Archetype: ${archetype!.name}`,
            })
          )
        )
      );

      const clearedDocument = removePf2eArchetypeTemplate(rehydrated, archetype!);
      saveDocuments([
        {
          ...clearedDocument,
          updatedAt: new Date('2026-04-29T12:05:00.000Z'),
        },
      ]);

      const rehydratedAfterRemoval = reloadSingleDocument();
      expect(rehydratedAfterRemoval.system.selectedArchetypeIds).toEqual([]);
      expect(
        rehydratedAfterRemoval.system.features.some((feature) => featureIds.includes(feature.id))
      ).toBe(false);
    }
  );

  it('keeps archetype application idempotent and preserves unrelated manual features on removal', () => {
    const archetype = allPf2eArchetypes.find((entry) => entry.id === 'pf2e-wizard-archetype');
    expect(archetype).toBeDefined();

    const manualFeature = {
      id: 'manual-archetype-note',
      name: 'Manual Archetype Note',
      source: 'manual',
      description: 'A player-authored reminder that is not owned by the archetype template.',
    };
    const document = makeDocument('pf2e-archetype-idempotent', {
      ...makeSystem(archetype!),
      features: [manualFeature],
    });
    const once = applyPf2eArchetypeTemplate(document, archetype!);
    const twice = applyPf2eArchetypeTemplate(once, archetype!);
    const archetypeFeatureIds = archetype!.features.map(
      (feature) =>
        `${archetype!.id}:${feature.level}:${feature.name.toLowerCase().replace(/\s+/g, '-')}`
    );

    expect(twice.system.selectedArchetypeIds).toEqual([archetype!.id]);
    expect(
      twice.system.features.filter((feature) => archetypeFeatureIds.includes(feature.id))
    ).toHaveLength(archetypeFeatureIds.length);

    const cleared = removePf2eArchetypeTemplate(twice, archetype!);

    expect(cleared.system.selectedArchetypeIds).toEqual([]);
    expect(cleared.system.features).toContainEqual(manualFeature);
    expect(
      cleared.system.features.some((feature) => archetypeFeatureIds.includes(feature.id))
    ).toBe(false);
  });
});
