import { describe, expect, it } from 'vitest';

import { buildD20LegacyContributionLedger } from '../../systems/d20-legacy/contributionLedger';
import { buildDnd5eContributionLedger } from '../../systems/dnd5e/shared/contributionLedger';
import { buildPf2eContributionLedger } from '../../systems/pf2e/contributionLedger';
import { buildMam3eContributionLedger } from '../../systems/mam3e/contributionLedger';
import { buildDaggerheartContributionLedger } from '../../systems/daggerheart/contributionLedger';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { createDefaultPf1eData } from '../../systems/pf1e/data-model';
import { createDefaultPf2eData } from '../../systems/pf2e/data-model';
import { createDefaultMam3eData } from '../../systems/mam3e/data-model';
import { createDefaultDaggerheartData } from '../../systems/daggerheart/data-model';
import { effectToLedgerEntry } from '../../rules/ir/ledgerView';
import type { ContributionLedgerEntry } from '../../types/core/contributionLedger';
import type { CharacterDocument } from '../../types/core/document';

/**
 * RFC 003 CONSOLIDATION GATE: a contribution ledger is a PROJECTION of the
 * resolver, not a parallel computation.
 *
 * Phase 3 of RFC 003 asks for the per-system `contributionLedger.ts` builders to
 * be `toContributionLedger(resolveEffects(collectEffects(doc)))`. This test pins
 * the observable consequence of that, per system: every emitted row is
 * structurally an `effectToLedgerEntry` projection — same field set, same
 * ordering guarantees — with a single, DECLARED exception list for the two
 * values the IR's `EffectValue` (`number | string | number[] | null`) provably
 * cannot carry:
 *
 *   - 5e proficiency lists  → `string[]`
 *   - Daggerheart unarmored-defense override → an object
 *
 * If a builder grows a new hand-assembled row shape, it lands here as a failure
 * rather than as a silently diverging second code path.
 */

const DATE = new Date('2026-05-01T00:00:00.000Z');

function doc(systemId: string, system: any): CharacterDocument<any> {
  return {
    id: 'ledger-projection',
    name: 'Ledger Projection',
    systemId,
    system,
    createdAt: DATE,
    updatedAt: DATE,
  };
}

const GEAR = [
  {
    itemId: 'plus-two-plate',
    customName: '+2 Plate',
    equipped: true,
    slot: 'chest',
    armorClass: 18,
    armorType: 'heavy',
    acBonus: 2,
  },
  {
    itemId: 'shield',
    customName: 'Shield',
    equipped: true,
    slot: 'offHand',
    shieldBonus: 2,
    acBonus: 1,
    raised: true,
  },
  { itemId: 'ring', customName: 'Ring of Protection', equipped: true, acBonus: 1 },
];

const FEATS = [
  {
    id: 'defensive-duelist',
    name: 'Defensive Duelist',
    modifiers: [{ target: 'ac', operation: 'add', value: 1 }],
  },
];

/**
 * The exact field set `effectToLedgerEntry` emits. A row that carries a key
 * outside this set (or is missing one) cannot be a resolver projection.
 */
const PROJECTION_KEYS = [
  'id',
  'systemId',
  'target',
  'source',
  'label',
  'operation',
  'value',
  'category',
  'manualBoundary',
  'details',
].sort();

function isProjectionShaped(entry: ContributionLedgerEntry): boolean {
  return JSON.stringify(Object.keys(entry).sort()) === JSON.stringify(PROJECTION_KEYS);
}

/** Round-tripping a row through the IR must not change it. */
function roundTrips(entry: ContributionLedgerEntry): boolean {
  const asEffect = {
    ...entry,
    stackPolicy: 'sum' as const,
    source: { ...entry.source },
  };
  return JSON.stringify(effectToLedgerEntry(asEffect as any)) === JSON.stringify(entry);
}

describe('contribution ledgers are resolver projections (RFC 003 Phase 3)', () => {
  it('d20-legacy (3.5e and PF1e): every row is a projection', () => {
    for (const [systemId, make] of [
      ['dnd-3.5e', createDefaultDnd35eData],
      ['pf1e', createDefaultPf1eData],
    ] as const) {
      const system: any = {
        ...make(),
        baseAttributes: { str: 18, dex: 14, con: 16, int: 8, wis: 12, cha: 10 },
        classLevels: [
          {
            classId: 'fighter',
            level: 6,
            hitDieRolls: [],
            bab: 'full',
            fortSave: 'good',
            refSave: 'poor',
            willSave: 'poor',
          },
        ],
        skillRanks: { tumble: 6, bluff: 5 },
        equipment: GEAR,
        feats: FEATS,
      };
      const { entries } = buildD20LegacyContributionLedger(doc(systemId, system) as any, systemId);

      expect(entries.length).toBeGreaterThan(0);
      expect(entries.every(isProjectionShaped)).toBe(true);
      expect(entries.every(roundTrips)).toBe(true);
    }
  });

  it('pf2e and mam3e: every row is a projection', () => {
    const pf2e = buildPf2eContributionLedger(
      doc('pf2e', {
        ...createDefaultPf2eData(),
        level: 7,
        equipment: GEAR,
        feats: FEATS,
        conditions: [{ id: 'clumsy', name: 'clumsy', value: 2 }],
      }) as any
    );
    expect(pf2e.entries.length).toBeGreaterThan(0);
    expect(pf2e.entries.every(isProjectionShaped)).toBe(true);

    const mam3e = buildMam3eContributionLedger(
      doc('mam3e', {
        ...createDefaultMam3eData(),
        powers: [
          {
            id: 'blast',
            name: 'Blast',
            baseCost: 2,
            perRank: true,
            rank: 8,
            extras: ['area-burst'],
          },
        ],
      }) as any
    );
    expect(mam3e.entries.length).toBeGreaterThan(0);
    expect(mam3e.entries.every(isProjectionShaped)).toBe(true);
  });

  it('5e: every row is a projection except the DECLARED string[] proficiency lists', async () => {
    const { entries } = await buildDnd5eContributionLedger(
      doc('dnd-5e-2014', {
        ...createDefaultDnd5eData(),
        baseAttributes: { str: 10, dex: 16, con: 14, int: 10, wis: 16, cha: 10 },
        classLevels: [{ classId: 'cleric', level: 5, hitDieRolls: [] }],
        equipment: GEAR,
        feats: FEATS,
        spellcasting: {
          classes: [{ classId: 'cleric', ability: 'wis', spellcastingLevel: 5 }],
          spellSlots: {},
          knownSpellIds: [],
          preparedSpellIds: [],
        },
        templateState: {
          classDerivedProficiencies: {
            armor: ['light', 'medium'],
            weapons: ['simple'],
            tools: [],
            savingThrows: ['wis'],
          },
          backgroundDerived: { tools: ['herbalism-kit'], languages: ['celestial'] },
          featDerivedAutomation: {
            abilityScores: { wis: 1 },
            armor: [],
            weapons: [],
            tools: [],
            languages: [],
            savingThrows: [],
          },
        },
      }) as any,
      'dnd-5e-2014'
    );

    const nonProjection = entries.filter((entry) => !isProjectionShaped(entry));
    expect(entries.length).toBeGreaterThan(0);
    // The ONLY hand-built rows are the list-valued proficiency grants.
    expect(nonProjection.every((entry) => Array.isArray(entry.value))).toBe(true);
    expect(nonProjection.every((entry) => entry.category === 'proficiency')).toBe(true);
    // Everything numeric/string-valued IS a projection.
    expect(entries.filter((entry) => !Array.isArray(entry.value)).every(isProjectionShaped)).toBe(
      true
    );
  });

  it('daggerheart: every row is a projection except the DECLARED object-valued override', () => {
    const { entries } = buildDaggerheartContributionLedger(
      doc('daggerheart', {
        ...createDefaultDaggerheartData(),
        level: 3,
        armorId: '',
        attributes: {
          agility: 3,
          strength: 2,
          finesse: 1,
          instinct: 2,
          presence: 0,
          knowledge: 1,
        },
        domainCards: [
          {
            id: 'valor-bare-bones',
            name: 'Bare Bones',
            domain: 'valor',
            level: 1,
            location: 'loadout',
            description: '',
          },
          {
            id: 'bone-untouchable',
            name: 'Untouchable',
            domain: 'bone',
            level: 3,
            location: 'loadout',
            description: '',
          },
        ],
      }) as any
    );

    const nonProjection = entries.filter((entry) => !isProjectionShaped(entry));
    expect(entries.length).toBeGreaterThan(0);
    // The ONLY hand-built row is the object-valued unarmored-defense override.
    expect(nonProjection.every((entry) => entry.target === 'unarmoredDefense')).toBe(true);
    expect(nonProjection.every((entry) => typeof entry.value === 'object')).toBe(true);
  });
});
