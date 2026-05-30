import {
  buildDnd5e2024DocumentFromDraft,
  createDnd5e2024CreationDraft,
} from '../systems/dnd5e-2024/creationDraft';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

describe('D&D 5e 2024 creation draft applicator', () => {
  it('builds a normal validated CharacterDocument through existing templates', async () => {
    const draft = createDnd5e2024CreationDraft({
      id: 'draft-5e-2024',
      name: 'Shield Fighter Draft',
      now: TEST_DATE,
      data: {
        characterName: 'Avery',
        classId: 'fighter',
        classLevel: 3,
        subclassId: 'champion',
        speciesId: 'human',
        backgroundId: 'soldier-2024',
        abilityScores: {
          str: 15,
          dex: 14,
          con: 13,
          int: 10,
          wis: 12,
          cha: 8,
        },
      },
    });

    const result = await buildDnd5e2024DocumentFromDraft(draft, {
      documentId: 'doc-from-draft',
      now: TEST_DATE,
    });

    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(result.completion?.draft).toEqual(
      expect.objectContaining({
        id: 'draft-5e-2024',
        status: 'completed',
        finalDocumentId: 'doc-from-draft',
      })
    );
    expect(result.document).toEqual(
      expect.objectContaining({
        id: 'doc-from-draft',
        name: 'Avery',
        systemId: 'dnd-5e-2024',
        version: 1,
      })
    );
    expect(result.document.system.classLevels).toEqual([
      expect.objectContaining({ classId: 'fighter', subclassId: 'champion', level: 3 }),
    ]);
    expect(result.document.system.speciesId).toBe('human');
    expect(result.document.system.backgroundId).toBe('soldier-2024');
    expect(result.document.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(['fighting-style', 'second-wind', 'improved-critical'])
    );
  });

  it('returns machine-readable issues and withholds completion for invalid ids', async () => {
    const draft = createDnd5e2024CreationDraft({
      id: 'bad-draft',
      now: TEST_DATE,
      data: {
        classId: 'gunslinger',
        speciesId: 'space-elf',
        backgroundId: 'moon-miner',
      },
    });

    const result = await buildDnd5e2024DocumentFromDraft(draft, {
      documentId: 'bad-doc',
      now: TEST_DATE,
    });

    expect(result.completion).toBeUndefined();
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'creation-draft-unknown-class',
          path: 'data.classId',
          source: 'creation-draft',
        }),
        expect.objectContaining({
          code: 'creation-draft-unknown-species',
          path: 'data.speciesId',
          source: 'creation-draft',
        }),
        expect.objectContaining({
          code: 'creation-draft-unknown-background',
          path: 'data.backgroundId',
          source: 'creation-draft',
        }),
      ])
    );
  });
});
