import { describe, expect, it } from 'vitest';
import { SystemRegistry } from '../registry';
import { Mam3eSystemDef } from '../systems/mam3e/definition';
import { createDefaultMam3eData, type Mam3eDataModel } from '../systems/mam3e/data-model';
import type { Power } from '../types/mam/powers';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(Mam3eSystemDef);
  return registry;
}

function createDocument(
  system: Mam3eDataModel,
  systemId = 'mam3e'
): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'mam3e-validation-doc',
    name: 'Validation Test Hero',
    systemId,
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

/** Run the document through the engine so stored spent buckets/totals are the
 * real point-buy values, matching how documents are prepared at add time. */
function prepared(system: Mam3eDataModel): Mam3eDataModel {
  return Mam3eSystemDef.engine.prepareData(createDocument(system)).system;
}

function power(overrides: Partial<Power> & Pick<Power, 'id' | 'name'>): Power {
  return {
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'attack',
    action: 'standard',
    range: 'close',
    duration: 'instant',
    baseCost: 1,
    perRank: true,
    description: 'Test power',
    effects: [],
    ...overrides,
  };
}

/**
 * A PL-capped LEGAL PL 10 build sitting exactly at the caps:
 * - close attack (FGT 4 + Close Combat 6 = 10) + Damage rank 10 = 20 = 2 × PL
 * - Dodge (AGI 2) + Toughness (STA 2 + Protection 6 = 8) = 10 ≤ 20
 * - Parry (FGT 4) + Toughness 8 = 12 ≤ 20; Fort 2 + Will 2 = 4 ≤ 20
 * - 44 PP spent of the standard 150 PP (15 × PL) budget
 * - two complications (motivation + one more)
 */
function legalBuild(): Mam3eDataModel {
  return prepared({
    ...createDefaultMam3eData(),
    powerLevel: 10,
    abilities: { str: 0, sta: 2, agi: 2, dex: 2, fgt: 4, int: 0, awe: 2, pre: 0 },
    skills: { 'close-combat': { rank: 6, total: 0 } },
    powers: [
      power({ id: 'damage', name: 'Damage', rank: 10 }),
      power({
        id: 'protection',
        name: 'Protection',
        type: 'defense',
        range: 'personal',
        duration: 'sustained',
        rank: 6,
      }),
    ],
    advantages: [{ id: 'improved-initiative', name: 'Improved Initiative', rank: 2 }],
    complications: [
      {
        id: 'justice-motivation',
        name: 'Motivation: Justice',
        description: 'Rights wrongs.',
        source: "Hero's Handbook",
        category: 'motivation',
      },
      { name: 'Secret Identity', description: 'Nobody knows.' },
    ],
  });
}

function issueCodes(result: Awaited<ReturnType<SystemRegistry['validateDocument']>>) {
  return result.issues.map((issue) => issue.code);
}

describe('M&M 3e validation', () => {
  it('accepts an at-cap legal build with no issues and without mutating the document', async () => {
    const registry = createRegistry();
    const document = createDocument(legalBuild());
    const serializedBeforeValidation = JSON.stringify(document);

    const result = await registry.validateDocument(document, { reason: 'creation' });

    expect(result.issues).toEqual([]);
    expect(JSON.stringify(document)).toBe(serializedBeforeValidation);
  });

  it('reports PL caps, budget, cost arithmetic, catalog, source, and complication issues — never as errors', async () => {
    const registry = createRegistry();
    const system: Mam3eDataModel = {
      ...createDefaultMam3eData(),
      powerLevel: 8,
      // Non-standard budget (PL 8 standard is 120) that the build overspends.
      powerPoints: {
        total: 90,
        // Stored buckets left at 0 → arithmetic mismatch vs the engine math.
        spent: { abilities: 0, powers: 0, advantages: 0, skills: 0, defenses: 0 },
      },
      abilities: { str: 0, sta: 10, agi: 10, dex: 0, fgt: 10, int: 0, awe: 0, pre: 0 },
      defenses: {
        ...createDefaultMam3eData().defenses,
        dodge: { rank: 4, total: 0 },
      },
      skills: {
        'close-combat': { rank: 4, total: 0 },
        stealth: { rank: -3, total: 0 },
      },
      powers: [
        // Closed-content citation on a catalog power.
        power({ id: 'damage', name: 'Damage', rank: 10, source: 'Gadget Guides' }),
        power({
          id: 'protection',
          name: 'Protection',
          type: 'defense',
          range: 'personal',
          duration: 'sustained',
          rank: 8,
        }),
        // Unknown effect id with an unknown extra.
        power({ id: 'chrono-lance', name: 'Chrono Lance', rank: 5, extras: ['made-up-extra'] }),
      ],
      advantages: [
        { id: 'invented-advantage', name: 'Invented Advantage' },
        // accurate-attack is ranked: false in the catalog.
        { id: 'accurate-attack', name: 'Accurate Attack', rank: 3 },
      ],
      complications: [],
    };
    const document = createDocument(system);
    const serializedBeforeValidation = JSON.stringify(document);

    const result = await registry.validateDocument(document, { reason: 'import' });

    expect(issueCodes(result)).toEqual(
      expect.arrayContaining([
        'mam3e-pl-cap-exceeded',
        'mam3e-points-over-budget',
        'mam3e-nonstandard-budget',
        'mam3e-spent-mismatch',
        'mam3e-negative-purchased-rank',
        'mam3e-unknown-power',
        'mam3e-unknown-power-modifier',
        'mam3e-closed-content-source',
        'mam3e-unknown-advantage',
        'mam3e-advantage-rank',
        'mam3e-complication-floor',
      ])
    );

    // Dodge+Toughness (14 + 18 = 32), Parry+Toughness (10 + 18 = 28), and
    // Close Attack+Effect (14 + 10 = 24) all exceed 2 × PL = 16.
    const plCapLabels = result.issues
      .filter((issue) => issue.code === 'mam3e-pl-cap-exceeded')
      .map((issue) => issue.details?.label);
    expect(plCapLabels).toEqual(
      expect.arrayContaining(['Dodge + Toughness', 'Parry + Toughness', 'Close Attack + Effect'])
    );

    // Warn/annotate, never block: no issue may be an error.
    expect(result.issues.every((issue) => issue.severity !== 'error')).toBe(true);
    expect(result.issues.every((issue) => issue.recoverable !== false)).toBe(true);
    expect(result.issues[0]).toEqual(expect.objectContaining({ source: 'import' }));
    expect(JSON.stringify(document)).toBe(serializedBeforeValidation);
  });

  it('accepts freeform power descriptors as an enumerated boundary — never an issue', async () => {
    const registry = createRegistry();
    const system = legalBuild();
    system.powers[0] = {
      ...system.powers[0],
      descriptors: ['quantum', 'ancestral banana', '☂ weird homebrew flavor'],
    };

    const result = await registry.validateDocument(createDocument(prepared(system)), {
      reason: 'edit',
    });

    expect(result.issues).toEqual([]);
  });

  it('treats pinned archetypes as reference-only and never validates their unbuilt content', async () => {
    const registry = createRegistry();
    // Empty default build with a pinned archetype full of powers/advantages
    // the character has NOT bought: nothing from the archetype may surface.
    const system = prepared({
      ...createDefaultMam3eData(),
      selectedArchetypeIds: ['mam3e-paragon'],
    });

    const result = await registry.validateDocument(createDocument(system), { reason: 'edit' });

    // Only the complication floor fires (empty build has none); the pinned
    // archetype triggers no unknown-power/advantage/PL/cost issues.
    expect(issueCodes(result)).toEqual(['mam3e-complication-floor']);
  });

  it('annotates an unknown pinned archetype id as info only', async () => {
    const registry = createRegistry();
    const system = legalBuild();
    system.selectedArchetypeIds = ['mam3e-paragon', 'not-an-archetype'];

    const result = await registry.validateDocument(createDocument(system), { reason: 'sync' });

    expect(result.issues).toEqual([
      expect.objectContaining({
        code: 'mam3e-unknown-archetype',
        severity: 'info',
        path: 'system.selectedArchetypeIds.1',
      }),
    ]);
  });

  it('downgrades a single complication to an info nudge', async () => {
    const registry = createRegistry();
    const system = legalBuild();
    system.complications = [system.complications[0]];

    const result = await registry.validateDocument(createDocument(system), { reason: 'edit' });

    expect(result.issues).toEqual([
      expect.objectContaining({ code: 'mam3e-complication-floor', severity: 'info' }),
    ]);
  });
});
