import { SystemRegistry } from '../registry';
import { Dnd5e2024SystemDef } from '../systems/dnd5e-2024/definition';
import {
  createDefaultDnd5e2024Data,
  type Dnd5e2024DataModel,
} from '../systems/dnd5e-2024/data-model';
import { Dnd5eSystemDef } from '../systems/dnd5e/definition';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import type { Feat, SpellSlots } from '../types/core/character';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(Dnd5eSystemDef);
  registry.register(Dnd5e2024SystemDef);
  return registry;
}

function createDocument<T extends SystemDataModel>(
  systemId: string,
  system: T
): CharacterDocument<T> {
  return {
    id: `${systemId}-doc`,
    name: 'Validation Test Character',
    systemId,
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function createEmptySpellSlots(): SpellSlots {
  return {
    1: { max: 0, used: 0 },
    2: { max: 0, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  };
}

function issueCodes(result: Awaited<ReturnType<SystemRegistry['validateDocument']>>) {
  return result.issues.map((issue) => issue.code);
}

describe('D&D 5e validation', () => {
  it('accepts loader-backed 2024 character references without mutating the document', async () => {
    const registry = createRegistry();
    const system: Dnd5e2024DataModel = {
      ...createDefaultDnd5e2024Data(),
      level: 3,
      speciesId: 'human',
      backgroundId: 'soldier-2024',
      classLevels: [{ classId: 'fighter', subclassId: 'champion', level: 3, hitDieRolls: [6, 7] }],
    };
    const document = createDocument('dnd-5e-2024', system);
    const serializedBeforeValidation = JSON.stringify(document);

    const result = await registry.validateDocument(document, { reason: 'creation' });

    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(JSON.stringify(document)).toBe(serializedBeforeValidation);
  });

  it('reports invalid 2024 ids, levels, spell references, and slots through the registry', async () => {
    const registry = createRegistry();
    const impossibleFeat: Feat = {
      id: 'invented-feat',
      name: 'Invented Feat',
      source: 'Test',
      description: 'Not loader-backed.',
    };
    const system: Dnd5e2024DataModel = {
      ...createDefaultDnd5e2024Data(),
      level: 21,
      speciesId: 'plasmoid',
      backgroundId: 'space-farmer',
      classLevels: [{ classId: 'gunslinger', level: 21, hitDieRolls: [0, 3, 4] }],
      baseAttributes: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 42,
      },
      feats: [impossibleFeat],
      spellcasting: {
        classes: [{ classId: 'fighter', ability: 'str', spellcastingLevel: -1 }],
        spellsKnown: ['invented-spell'],
        spellsPrepared: ['magic-missile'],
        alwaysPreparedSpellIds: ['invented-always-prepared-spell'],
        spellSlots: {
          ...createEmptySpellSlots(),
          1: { max: 1, used: 2 },
        },
      },
    };

    const result = await registry.validateDocument(createDocument('dnd-5e-2024', system), {
      reason: 'ai-draft',
    });

    expect(issueCodes(result)).toEqual(
      expect.arrayContaining([
        'dnd5e-invalid-level',
        'dnd5e-unknown-class',
        'dnd5e-invalid-class-level',
        'dnd5e-invalid-hit-die-roll',
        'dnd5e-unknown-species',
        'dnd5e-unknown-background',
        'dnd5e-unknown-feat',
        'dnd5e-invalid-ability-score',
        'dnd5e-invalid-spellcasting-level',
        'dnd5e-unknown-spell',
        'dnd5e-prepared-spell-not-tracked',
        'dnd5e-invalid-spell-slot',
      ])
    );
    expect(result.issues[0]).toEqual(expect.objectContaining({ source: 'ai-draft' }));
  });

  it('accepts loader-backed 2014 feature-option selections', async () => {
    const registry = createRegistry();
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      level: 2,
      classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [6] }],
      speciesId: 'human',
      backgroundId: 'soldier',
      featureOptionSelections: [{ group: 'fighting-styles', id: 'defense' }],
    };

    const result = await registry.validateDocument(createDocument('dnd-5e-2014', system), {
      reason: 'creation',
    });

    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
  });

  it('reports unknown 2014 feature options and keeps 2024 feature options as unsupported warnings', async () => {
    const registry = createRegistry();
    const dnd2014System: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      level: 2,
      classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [6] }],
      featureOptionSelections: [{ group: 'fighting-styles', id: 'invented-style' }],
    };
    const dnd2024System: Dnd5e2024DataModel = {
      ...createDefaultDnd5e2024Data(),
      level: 2,
      classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [6] }],
      featureOptionSelections: [{ group: 'fighting-styles', id: 'defense' }],
    };

    const dnd2014Result = await registry.validateDocument(
      createDocument('dnd-5e-2014', dnd2014System)
    );
    const dnd2024Result = await registry.validateDocument(
      createDocument('dnd-5e-2024', dnd2024System)
    );

    expect(issueCodes(dnd2014Result)).toContain('dnd5e-unknown-feature-option');
    expect(dnd2024Result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'dnd5e-feature-options-unsupported',
          severity: 'warning',
        }),
      ])
    );
  });
});
