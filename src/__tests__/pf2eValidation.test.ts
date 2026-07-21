import { SystemRegistry } from '../registry';
import { Pf2eSystemDef } from '../systems/pf2e/definition';
import { createDefaultPf2eData, type Pf2eDataModel } from '../systems/pf2e/data-model';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(Pf2eSystemDef);
  return registry;
}

function createDocument(
  system: Pf2eDataModel,
  systemId = 'pf2e'
): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-doc',
    name: 'PF2e Validation Test Character',
    systemId,
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function issueCodes(result: Awaited<ReturnType<SystemRegistry['validateDocument']>>) {
  return result.issues.map((issue) => issue.code);
}

describe('PF2e validation', () => {
  it('accepts a loader-backed level-1 wizard without mutating the document', async () => {
    const registry = createRegistry();
    const system: Pf2eDataModel = {
      ...createDefaultPf2eData(),
      level: 1,
      ancestryId: 'human',
      heritageId: 'skilled',
      backgroundId: 'pf2e-bg-acolyte',
      classId: 'wizard',
      selectedArchetypeIds: ['pf2e-rogue-archetype'],
      ancestryAbilityBoostSelections: ['int', 'con'],
      backgroundAbilityBoostSelections: ['wis', 'int'],
      baseAttributes: { str: 10, dex: 12, con: 14, int: 18, wis: 12, cha: 10 },
      spellcasting: {
        tradition: 'arcane',
        type: 'prepared',
        proficiency: { tier: 'trained', total: 0 },
        // Wizard progression grants two rank-1 slots at level 1.
        spellSlots: { 1: { max: 2, used: 0 } },
        spellsKnown: ['acid-splash-pf2e', 'burning-hands-pf2e'],
        preparedSpellsByRank: { 0: ['acid-splash-pf2e'], 1: ['burning-hands-pf2e'] },
        focusSpells: [],
        focusPoints: { current: 0, max: 0 },
      },
    };
    const document = createDocument(system);
    const serializedBeforeValidation = JSON.stringify(document);

    const result = await registry.validateDocument(document, { reason: 'creation' });

    expect(result.issues).toEqual([]);
    expect(JSON.stringify(document)).toBe(serializedBeforeValidation);
  });

  it('treats rank-10 spells and slots as legal for a high-level prepared caster', async () => {
    const registry = createRegistry();
    const system: Pf2eDataModel = {
      ...createDefaultPf2eData(),
      level: 20,
      classId: 'cleric',
      spellcasting: {
        tradition: 'divine',
        type: 'prepared',
        proficiency: { tier: 'legendary', total: 0 },
        // Rank 10 comes from a 10th-rank class feature, not the rank-1..9
        // class progression tables — it must not be flagged.
        spellSlots: { 10: { max: 1, used: 0 } },
        spellsKnown: [],
        preparedSpellsByRank: { 10: ['cataclysm-10-pf2e'] },
        focusSpells: [],
        focusPoints: { current: 1, max: 1 },
      },
    };

    const result = await registry.validateDocument(createDocument(system), { reason: 'edit' });

    expect(result.issues).toEqual([]);
  });

  it('reports unknown ids, bad ranks, bad slots, and spell mismatches through the registry', async () => {
    const registry = createRegistry();
    const system: Pf2eDataModel = {
      ...createDefaultPf2eData(),
      level: 25,
      ancestryId: 'tiefling',
      backgroundId: 'pf2e-bg-space-farmer',
      classId: 'gunslinger',
      selectedArchetypeIds: [
        'pf2e-witch-archetype',
        'pf2e-wizard-archetype',
        'pf2e-wizard-archetype',
      ],
      feats: [
        {
          id: 'homebrew-feat',
          name: 'Homebrew Feat',
          description: 'Not open content.',
          level: 1,
          type: 'general',
          source: "Advanced Player's Guide",
        },
      ],
      equipment: [
        {
          itemId: 'cursed-pack',
          name: 'Cursed Pack',
          bulk: -1,
          equipped: false,
        },
      ],
      spellcasting: {
        tradition: 'arcane',
        type: 'prepared',
        proficiency: { tier: 'trained', total: 0 },
        spellSlots: { 1: { max: 2, used: 3 } },
        spellsKnown: ['invented-spell', 'bless-pf2e'],
        preparedSpellsByRank: {
          0: ['burning-hands-pf2e'],
          1: ['burning-hands-pf2e', 'acid-splash-pf2e', 'bless-pf2e'],
          11: ['cataclysm-10-pf2e'],
        },
        focusSpells: ['manually-tracked-focus-spell'],
        focusPoints: { current: 5, max: 5 },
      },
    };

    const result = await registry.validateDocument(createDocument(system), { reason: 'ai-draft' });

    expect(issueCodes(result)).toEqual(
      expect.arrayContaining([
        'pf2e-invalid-level',
        'pf2e-unknown-ancestry',
        'pf2e-unknown-background',
        'pf2e-unknown-class',
        'pf2e-unknown-archetype',
        'pf2e-duplicate-archetype',
        'pf2e-unknown-spell',
        'pf2e-spell-tradition-mismatch',
        'pf2e-prepared-rank-below-spell-rank',
        'pf2e-invalid-prepared-rank',
        'pf2e-invalid-spell-slot',
        'pf2e-prepared-over-slot-capacity',
        'pf2e-invalid-focus-points',
        'pf2e-focus-spells-manual',
        'pf2e-invalid-bulk-entry',
        'pf2e-feat-source-not-open-content',
      ])
    );
    expect(result.issues[0]).toEqual(expect.objectContaining({ source: 'ai-draft' }));
    // The focus-spell surface is annotated as manual, never validated.
    const focusIssue = result.issues.find((issue) => issue.code === 'pf2e-focus-spells-manual');
    expect(focusIssue).toEqual(expect.objectContaining({ severity: 'info' }));
  });

  it('surfaces build-legality violations and consistency problems as warnings, never errors', async () => {
    const registry = createRegistry();
    const system: Pf2eDataModel = {
      ...createDefaultPf2eData(),
      level: 1,
      ancestryId: 'human',
      backgroundId: 'pf2e-bg-acolyte',
      classId: 'fighter',
      // Level-1 ability above the CRB creation cap of 18.
      baseAttributes: { str: 10, dex: 10, con: 10, int: 20, wis: 10, cha: 10 },
      // Proficiency total above the level + tier budget (1 + 2 = 3).
      skillProficiencies: { athletics: { tier: 'trained', total: 99 } },
      // Duplicate boost + one selection beyond the two human choice boosts.
      ancestryAbilityBoostSelections: ['str', 'str', 'dex'],
      // 'str' is not one of the Acolyte's restricted options (int/wis).
      backgroundAbilityBoostSelections: ['str', 'wis'],
      // 60 Bulk is over the 10 + Str(0) maximum.
      inventory: [{ itemId: 'anvil', name: 'Anvil', quantity: 1, bulk: 60 }],
    };

    const result = await registry.validateDocument(createDocument(system), { reason: 'import' });

    const legalityIssues = result.issues.filter((issue) => issue.code === 'pf2e-build-legality');
    expect(legalityIssues).toHaveLength(2);
    expect(legalityIssues.map((issue) => issue.details?.rule)).toEqual(
      expect.arrayContaining(['pf2e.L9.ability-score-cap', 'pf2e.L9.proficiency-budget'])
    );
    expect(legalityIssues.every((issue) => issue.severity === 'warning')).toBe(true);

    expect(issueCodes(result)).toEqual(
      expect.arrayContaining([
        'pf2e-invalid-ancestry-boost',
        'pf2e-ancestry-boost-overflow',
        'pf2e-invalid-background-boost',
        'pf2e-bulk-overloaded',
      ])
    );
    // Everything on this sheet is advisory: no error-severity issues at all.
    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
  });

  it('rejects only the system id when a foreign document is validated as pf2e', async () => {
    const registry = createRegistry();
    const document = createDocument(createDefaultPf2eData());
    // Force the registry to route to the pf2e validator with a mismatched id.
    const foreign = { ...document, systemId: 'pf2e' as const };
    Object.assign(foreign, { systemId: 'pf2e' });

    const result = await registry.validateDocument(foreign, { reason: 'sync', source: 'supabase' });

    expect(result.issues).toEqual([]);
  });
});
