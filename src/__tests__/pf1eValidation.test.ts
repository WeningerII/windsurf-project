import { SystemRegistry } from '../registry';
import { Pf1eSystemDef } from '../systems/pf1e/definition';
import { createDefaultPf1eData, type Pf1eClassLevel } from '../systems/pf1e/data-model';
import type { Pf1eDataModel } from '../systems/pf1e/data-model';
import type { CharacterDocument } from '../types/core/document';
import { exportDocuments, importDocumentsWithReport } from '../utils/documentStorage';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(Pf1eSystemDef);
  return registry;
}

function createDocument(
  system: Pf1eDataModel,
  systemId = 'pf1e'
): CharacterDocument<Pf1eDataModel> {
  return {
    id: `${systemId}-validation-doc`,
    name: 'PF1e Validation Test Character',
    systemId,
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function classLevel(
  overrides: Partial<Pf1eClassLevel> & Pick<Pf1eClassLevel, 'classId' | 'level'>
): Pf1eClassLevel {
  return {
    hitDieRolls: [],
    bab: 'half',
    fortSave: 'poor',
    refSave: 'poor',
    willSave: 'good',
    skillPointsPerLevel: 2,
    favoredClassBonus: 'hp',
    ...overrides,
  };
}

function issueCodes(result: Awaited<ReturnType<SystemRegistry['validateDocument']>>) {
  return result.issues.map((issue) => issue.code);
}

describe('PF1e validation', () => {
  it('accepts a loader-backed wizard/lore-master build without mutating the document', async () => {
    const registry = createRegistry();
    const system: Pf1eDataModel = {
      ...createDefaultPf1eData(),
      level: 6,
      speciesId: 'human',
      classLevels: [
        classLevel({ classId: 'wizard', level: 5 }),
        classLevel({ classId: 'lore-master', level: 1 }),
      ],
      skillRanks: { spellcraft: 6, knowledge: 6 },
      feats: [
        {
          id: 'alertness-pf1e',
          name: 'Alertness',
          description: '+2 on Perception and Sense Motive checks.',
          source: 'CRB',
        },
      ],
      traits: [
        {
          id: 'indomitable-faith',
          name: 'Indomitable Faith',
          type: 'faith',
          source: 'Core Rulebook',
          description: '+1 trait bonus on Will saves.',
        },
      ],
      equipment: [{ itemId: 'dagger', name: 'Dagger', equipped: true }],
      inventory: [
        { itemId: 'cloak-of-resistance', name: 'Cloak of Resistance', quantity: 1, weight: 1 },
      ],
      spellsKnown: ['pf1e-acid-splash', 'pf1e-animate-rope'],
      preparedSpellsByLevel: { 0: ['pf1e-acid-splash'], 1: ['pf1e-animate-rope'] },
    };
    const document = createDocument(system);
    const serializedBeforeValidation = JSON.stringify(document);

    const result = await registry.validateDocument(document, { reason: 'creation' });

    expect(result.issues).toEqual([]);
    expect(JSON.stringify(document)).toBe(serializedBeforeValidation);
  });

  it('reports unknown ids, invalid bounds, and non-open sources as recoverable warnings', async () => {
    const registry = createRegistry();
    const system: Pf1eDataModel = {
      ...createDefaultPf1eData(),
      level: 25,
      speciesId: 'tiefling',
      classLevels: [
        classLevel({ classId: 'antipaladin', level: 3 }),
        classLevel({ classId: 'assassin', level: 11 }),
        classLevel({ classId: 'assassin', level: 2 }),
      ],
      baseAttributes: { str: 0, dex: 10.5, con: 10, int: 10, wis: 10, cha: 10 },
      feats: [
        {
          id: 'invented-feat',
          name: 'Invented Feat',
          description: 'Not loader-backed.',
          source: 'Splatbook Weekly',
        },
      ],
      traits: [
        {
          id: 'invented-trait',
          name: 'Invented Trait',
          type: 'campaign',
          source: 'Homebrew Digest',
          description: 'Not loader-backed.',
        },
      ],
      equipment: [{ itemId: 'vorpal-chainsaw', name: 'Vorpal Chainsaw', equipped: true }],
      spellsKnown: ['power-word-awesome'],
    };

    const result = await registry.validateDocument(createDocument(system), { reason: 'import' });

    expect(issueCodes(result)).toEqual(
      expect.arrayContaining([
        'pf1e-invalid-level',
        'pf1e-unknown-class',
        'pf1e-duplicate-class',
        'pf1e-prestige-level-cap',
        'pf1e-prestige-without-base-class',
        'pf1e-unknown-race',
        'pf1e-invalid-ability-score',
        'pf1e-unknown-feat',
        'pf1e-unknown-trait',
        'pf1e-non-open-source',
        'pf1e-unknown-item',
        'pf1e-unknown-spell',
      ])
    );
    // Annotate, never block: everything is a recoverable warning.
    expect(result.issues.every((issue) => issue.severity === 'warning')).toBe(true);
    expect(result.issues.every((issue) => issue.recoverable === true)).toBe(true);
    expect(result.issues[0]).toEqual(expect.objectContaining({ source: 'import' }));
  });

  it('consumes build-legality violations as warning-severity issues with their rule ids', async () => {
    const registry = createRegistry();
    const system: Pf1eDataModel = {
      ...createDefaultPf1eData(),
      level: 2,
      classLevels: [classLevel({ classId: 'fighter', level: 3, bab: 'full', fortSave: 'good' })],
      // PF1e flat cap: max ranks per skill = character level (CRB, Skills).
      skillRanks: { stealth: 5 },
    };

    const result = await registry.validateDocument(createDocument(system), { reason: 'edit' });

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'pf1e.L9.skill-max-ranks',
          severity: 'warning',
          path: 'system.skillRanks',
          details: expect.objectContaining({ value: 5, limit: 2 }),
        }),
        expect.objectContaining({
          code: 'pf1e.L9.class-level-sum',
          severity: 'warning',
          path: 'system.classLevels',
          details: expect.objectContaining({ value: 3, limit: 2 }),
        }),
      ])
    );
    // The exceed direction belongs to legality alone — no duplicate annotation.
    expect(issueCodes(result)).not.toContain('pf1e-class-total-shortfall');
  });

  it('respects raw levelsByClass for prepared spells and only flags below-minimum levels', async () => {
    const registry = createRegistry();
    // Animal Messenger is level 1 in the aggregate, but level 2 on the druid
    // list (levelsByClass.druid = 2) — preparing it at 1 as a druid is below
    // the class-list minimum, while 2 (native) and 3+ (metamagic slot, an
    // accepted manual boundary) are not flagged.
    const system: Pf1eDataModel = {
      ...createDefaultPf1eData(),
      level: 4,
      classLevels: [classLevel({ classId: 'druid', level: 4, fortSave: 'good', willSave: 'good' })],
      preparedSpellsByLevel: {
        1: ['pf1e-animal-messenger'],
        2: ['pf1e-animal-messenger'],
        3: ['pf1e-animal-messenger'],
      },
    };

    const result = await registry.validateDocument(createDocument(system));

    const belowLevelIssues = result.issues.filter(
      (issue) => issue.code === 'pf1e-prepared-spell-below-level'
    );
    expect(belowLevelIssues).toEqual([
      expect.objectContaining({
        path: 'system.preparedSpellsByLevel.1.0',
        details: expect.objectContaining({ preparedLevel: 1, minLevel: 2 }),
      }),
    ]);
  });

  it('treats Vancian slot assignment and spontaneous conversion as manual boundaries, never issues', async () => {
    const registry = createRegistry();
    const system: Pf1eDataModel = {
      ...createDefaultPf1eData(),
      level: 3,
      classLevels: [
        classLevel({ classId: 'cleric', level: 3, fortSave: 'good', willSave: 'good' }),
      ],
      // More prepared spells than slots, manual slot edits, and a spontaneous
      // conversion reference: all accepted manual territory.
      spellsPerDay: { 1: { total: 2, used: 2, manualBonus: 1 } },
      preparedSpellsByLevel: { 1: ['pf1e-animate-rope', 'pf1e-animate-rope', 'pf1e-animate-rope'] },
      manualSpellcastingExtras: { spontaneousConversionReference: 'cure' },
    };

    const result = await registry.validateDocument(createDocument(system));

    expect(result.issues).toEqual([]);
  });

  it('preserves a PF1e document through an export/import round trip, including validation results', async () => {
    const registry = createRegistry();
    const system: Pf1eDataModel = {
      ...createDefaultPf1eData(),
      level: 5,
      speciesId: 'elf',
      classLevels: [classLevel({ classId: 'wizard', level: 5, hitDieRolls: [6, 4, 3, 5, 2] })],
      skillRanks: { spellcraft: 5, knowledge: 5 },
      arcaneSpecialtySchool: 'evocation',
      spellsPerDay: { 1: { total: 4, used: 1, manualBonus: 1 }, 2: { total: 2, used: 0 } },
      spellsKnown: ['pf1e-acid-splash', 'pf1e-animate-rope'],
      preparedSpellsByLevel: { 1: ['pf1e-animate-rope'] },
      manualSpellcastingExtras: { spontaneousConversionReference: 'both' },
      feats: [
        {
          id: 'alertness-pf1e',
          name: 'Alertness',
          description: '+2 on Perception and Sense Motive checks.',
          source: 'CRB',
        },
      ],
      traits: [
        {
          id: 'indomitable-faith',
          name: 'Indomitable Faith',
          type: 'faith',
          source: 'Core Rulebook',
          description: '+1 trait bonus on Will saves.',
        },
      ],
      equipment: [{ itemId: 'dagger', name: 'Dagger', equipped: true }],
      inventory: [
        { itemId: 'cloak-of-resistance', name: 'Cloak of Resistance', quantity: 1, weight: 1 },
      ],
      conditions: [{ id: 'shaken', name: 'Shaken' }],
      activeToggles: ['power-attack'],
    };
    const original = createDocument(system);

    const { documents: imported, droppedCount } = importDocumentsWithReport(
      exportDocuments([original])
    );

    expect(droppedCount).toBe(0);
    expect(imported).toHaveLength(1);
    const roundTripped = imported[0] as CharacterDocument<Pf1eDataModel>;

    // The envelope and the full PF1e system payload survive untouched —
    // including the Vancian manual-boundary fields.
    expect(roundTripped.id).toBe(original.id);
    expect(roundTripped.name).toBe(original.name);
    expect(roundTripped.systemId).toBe('pf1e');
    expect(roundTripped.system).toEqual(original.system);
    expect(roundTripped.createdAt).toEqual(original.createdAt);
    expect(roundTripped.updatedAt).toEqual(original.updatedAt);

    // Validation is deterministic across the round trip.
    const originalResult = await registry.validateDocument(original, { reason: 'import' });
    const roundTrippedResult = await registry.validateDocument(roundTripped, { reason: 'import' });
    expect(roundTrippedResult).toEqual(originalResult);
    expect(originalResult.issues).toEqual([]);
  });
});
