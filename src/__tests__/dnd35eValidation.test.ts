import { SystemRegistry } from '../registry';
import {
  createDefaultDnd35eData,
  type Dnd35eClassLevel,
  type Dnd35eDataModel,
} from '../systems/dnd35e/data-model';
import { Dnd35eSystemDef } from '../systems/dnd35e/definition';
import type { CharacterDocument } from '../types/core/document';
import { exportDocuments, importDocuments } from '../utils/documentStorage';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(Dnd35eSystemDef);
  return registry;
}

function createDocument(system: Dnd35eDataModel): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'dnd-3.5e-doc',
    name: 'Validation Test Character',
    systemId: 'dnd-3.5e',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function classLevel(overrides: Partial<Dnd35eClassLevel> & { classId: string }): Dnd35eClassLevel {
  return {
    level: 1,
    hitDieRolls: [],
    bab: 'half',
    fortSave: 'poor',
    refSave: 'poor',
    willSave: 'good',
    skillPointsPerLevel: 2,
    ...overrides,
  };
}

function createValidWizard(): Dnd35eDataModel {
  return {
    ...createDefaultDnd35eData(),
    level: 5,
    classLevels: [classLevel({ classId: 'wizard', level: 5, hitDieRolls: [4, 3, 2, 4, 1] })],
    speciesId: 'elf',
    baseAttributes: { str: 8, dex: 14, con: 12, int: 17, wis: 12, cha: 10 },
    classSkills: ['concentration', 'spellcraft'],
    // Class skills cap at level + 3 = 8; cross-class (spot) at floor(8 / 2) = 4.
    skillRanks: { concentration: 8, spellcraft: 7.5, spot: 4 },
    feats: [
      {
        id: 'alertness-35e',
        name: 'Alertness',
        description: '+2 bonus on Listen and Spot checks.',
        source: 'SRD 3.5',
      },
    ],
    arcaneSpecialtySchool: 'evocation',
    // 'dispel-magic-druid-35e' is a catalog alias for 'dispel-magic-35e' —
    // both must resolve.
    spellsKnown: ['dispel-magic-35e', 'dispel-magic-druid-35e'],
    preparedSpellsByLevel: { 3: ['dispel-magic-35e'] },
    spellsPerDay: {
      0: { total: 4, used: 1 },
      1: { total: 3, used: 0 },
      2: { total: 2, used: 0 },
      3: { total: 1, used: 0 },
    },
    // Accepted manual boundaries: sparse prepared-slot assignment and the
    // spontaneous-conversion reference are never validation issues.
    manualSpellcastingExtras: { spontaneousConversionReference: 'cure' },
  };
}

function issueCodes(result: Awaited<ReturnType<SystemRegistry['validateDocument']>>) {
  return result.issues.map((issue) => issue.code);
}

describe('D&D 3.5e validation', () => {
  it('accepts a loader-backed wizard build without mutating the document', async () => {
    const registry = createRegistry();
    const document = createDocument(createValidWizard());
    const serializedBeforeValidation = JSON.stringify(document);

    const result = await registry.validateDocument(document, { reason: 'creation' });

    expect(result.issues).toEqual([]);
    expect(JSON.stringify(document)).toBe(serializedBeforeValidation);
  });

  it('keeps default data free of error-severity issues', async () => {
    const registry = createRegistry();

    const result = await registry.validateDocument(createDocument(createDefaultDnd35eData()));

    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(issueCodes(result)).toContain('dnd35e-no-class-levels');
  });

  it('reports invalid ids, levels, scores, ranks, spells, and provenance through the registry', async () => {
    const registry = createRegistry();
    const system: Dnd35eDataModel = {
      ...createDefaultDnd35eData(),
      level: 22,
      classLevels: [
        classLevel({ classId: 'ninja-35e', level: 0, hitDieRolls: [0] }),
        classLevel({ classId: 'assassin-35e', level: 12, hitDieRolls: [7] }),
      ],
      speciesId: 'warforged',
      baseAttributes: { str: 0, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      classSkills: [],
      skillRanks: { hide: 40, 'move-silently': -1, spot: 2.25 },
      feats: [
        {
          id: 'monkey-grip-35e',
          name: 'Monkey Grip',
          description: 'Wield larger weapons.',
          source: 'Complete Warrior',
        },
      ],
      arcaneSpecialtySchool: 'chronomancy',
      spellsKnown: ['wish-for-more-wishes-35e'],
      spellsPerDay: { 1: { total: 1, used: 2 } },
    };

    const result = await registry.validateDocument(createDocument(system), { reason: 'ai-draft' });

    expect(issueCodes(result)).toEqual(
      expect.arrayContaining([
        'dnd35e-invalid-level',
        'dnd35e-unknown-class',
        'dnd35e-invalid-class-level',
        'dnd35e-invalid-hit-die-roll',
        'dnd35e-hit-die-roll-out-of-range',
        'dnd35e-prestige-level-cap',
        'dnd35e-prestige-without-base-class',
        'dnd35e-unknown-species',
        'dnd35e-invalid-ability-score',
        'dnd35e-invalid-skill-ranks',
        'dnd35e-unknown-feat',
        'dnd35e-closed-content-source',
        'dnd35e-unknown-specialty-school',
        'dnd35e-unknown-spell',
        'dnd35e-invalid-spells-per-day',
        'dnd35e-build-legality',
      ])
    );
    expect(result.issues[0]).toEqual(expect.objectContaining({ source: 'ai-draft' }));
  });

  it('surfaces the rules-layer build-legality caps as warnings', async () => {
    const registry = createRegistry();
    const system: Dnd35eDataModel = {
      ...createDefaultDnd35eData(),
      level: 5,
      classLevels: [
        classLevel({
          classId: 'fighter',
          level: 3,
          hitDieRolls: [10, 6],
          bab: 'full',
          fortSave: 'good',
        }),
        classLevel({
          classId: 'rogue',
          level: 3,
          hitDieRolls: [6, 4],
          bab: 'three-quarter',
          refSave: 'good',
        }),
      ],
      classSkills: ['climb'],
      // Class-skill cap at level 5 is 8; 9 ranks breaks SRD 3.5 max ranks.
      skillRanks: { climb: 9 },
    };

    const result = await registry.validateDocument(createDocument(system), { reason: 'edit' });

    const legalityIssues = result.issues.filter((issue) => issue.code === 'dnd35e-build-legality');
    expect(legalityIssues.map((issue) => issue.details?.rule).sort()).toEqual([
      'dnd35e.L9.class-level-sum',
      'dnd35e.L9.skill-max-ranks',
    ]);
    legalityIssues.forEach((issue) => {
      expect(issue.severity).toBe('warning');
    });
    // Legality caps annotate; they are never error-severity blockers.
    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
  });

  it('leaves the export/import round-trip unaffected', async () => {
    const registry = createRegistry();
    const document = createDocument(createValidWizard());

    const beforeExport = await registry.validateDocument(document, { reason: 'edit' });
    const imported = importDocuments(exportDocuments([document]));

    expect(imported).toHaveLength(1);
    expect(imported[0].system).toEqual(document.system);
    expect(imported[0].id).toBe(document.id);
    expect(imported[0].systemId).toBe('dnd-3.5e');

    const afterImport = await registry.validateDocument(
      imported[0] as CharacterDocument<Dnd35eDataModel>,
      { reason: 'import' }
    );
    expect(issueCodes(afterImport)).toEqual(issueCodes(beforeExport));
    expect(afterImport.issues).toEqual([]);
  });
});
