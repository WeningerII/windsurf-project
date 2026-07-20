/**
 * Provenance verification for `buildD20LegacyContributionLedger` (D&D 3.5e +
 * Pathfinder 1e). The ledger is a NON-persisted explanation projection, so these
 * tests pin two properties:
 *
 *   1. Value parity — the BAB rows sum to the engine-computed
 *      `data.baseAttackBonus`, and each save's rows sum to the engine-computed
 *      `data.saves.<save>.total`. Ground truth comes from running the REAL
 *      engines (`Dnd35eEngine` / `Pf1eEngine`), not re-derived constants.
 *   2. System-agnostic synergy gating — 3.5e emits skill-synergy rows whose
 *      per-target sums equal `dnd35eSkillSynergyTotal`; PF1e emits NONE (it has
 *      no synergy subsystem).
 */
import { describe, expect, it } from 'vitest';
import { buildD20LegacyContributionLedger } from '../systems/d20-legacy/contributionLedger';
import { Dnd35eEngine } from '../systems/dnd35e/engine';
import { Pf1eEngine } from '../systems/pf1e/engine';
import {
  createDefaultDnd35eData,
  type Dnd35eClassLevel,
  type Dnd35eDataModel,
} from '../systems/dnd35e/data-model';
import {
  createDefaultPf1eData,
  type Pf1eClassLevel,
  type Pf1eDataModel,
} from '../systems/pf1e/data-model';
import type { CharacterDocument } from '../types/core/document';
import type { ContributionLedgerEntry } from '../types/core/contributionLedger';
import { dnd35eSkillSynergyTotal } from '../utils/derivedCombatMath';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function cl35(over: Partial<Dnd35eClassLevel>): Dnd35eClassLevel {
  return {
    classId: 'fighter',
    level: 1,
    hitDieRolls: [],
    bab: 'full',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'poor',
    skillPointsPerLevel: 2,
    ...over,
  };
}

function doc35(over: Partial<Dnd35eDataModel>): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'dnd35e-ledger',
    name: '3.5e Character',
    systemId: 'dnd-3.5e',
    system: { ...createDefaultDnd35eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function cl1(over: Partial<Pf1eClassLevel>): Pf1eClassLevel {
  return {
    classId: 'fighter',
    level: 1,
    hitDieRolls: [],
    bab: 'full',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'poor',
    skillPointsPerLevel: 2,
    favoredClassBonus: 'hp',
    ...over,
  };
}

function doc1(over: Partial<Pf1eDataModel>): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'pf1e-ledger',
    name: 'PF1e Character',
    systemId: 'pf1e',
    system: { ...createDefaultPf1eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

const dnd35Engine = new Dnd35eEngine();
const pf1eEngine = new Pf1eEngine();

const sumValues = (entries: ContributionLedgerEntry[]): number =>
  entries.reduce((total, entry) => total + (typeof entry.value === 'number' ? entry.value : 0), 0);

const forTarget = (entries: ContributionLedgerEntry[], target: string): ContributionLedgerEntry[] =>
  entries.filter((entry) => entry.target === target);

const scores = { str: 16, dex: 12, con: 14, int: 10, wis: 10, cha: 10 };

describe('buildD20LegacyContributionLedger — D&D 3.5e', () => {
  it('BAB rows are one per class level and sum to the engine BAB', () => {
    const prepared = dnd35Engine.prepareData(
      doc35({
        baseAttributes: scores,
        classLevels: [
          cl35({ classId: 'fighter', level: 5, bab: 'full' }),
          cl35({ classId: 'wizard', level: 4, bab: 'half' }),
        ],
      })
    );
    const { entries } = buildD20LegacyContributionLedger(prepared, 'dnd-3.5e');
    const babRows = forTarget(entries, 'baseAttackBonus');

    expect(prepared.system.baseAttackBonus).toBe(7); // 5 + floor(4/2)
    expect(babRows).toHaveLength(2);
    expect(sumValues(babRows)).toBe(prepared.system.baseAttackBonus);
    expect(babRows.map((row) => [row.source.id, row.value])).toEqual([
      ['fighter', 5],
      ['wizard', 2],
    ]);
    babRows.forEach((row) => {
      expect(row.source.kind).toBe('class');
      expect(row.operation).toBe('add');
    });
  });

  it('save rows decompose base progression + ability + misc and sum to each total', () => {
    const prepared = dnd35Engine.prepareData(
      doc35({
        baseAttributes: scores, // con +2, dex +1, wis +0
        classLevels: [cl35({ level: 6, fortSave: 'good', refSave: 'poor', willSave: 'poor' })],
        saves: {
          fortitude: { base: 0, ability: 0, misc: 1, total: 0 },
          reflex: { base: 0, ability: 0, misc: 0, total: 0 },
          will: { base: 0, ability: 0, misc: 0, total: 0 },
        },
      })
    );
    const { entries } = buildD20LegacyContributionLedger(prepared, 'dnd-3.5e');

    // Fortitude: good base at L6 = 5, CON mod +2, misc +1 → 8.
    const fortRows = forTarget(entries, 'saves.fortitude');
    expect(prepared.system.saves.fortitude.total).toBe(8);
    expect(sumValues(fortRows)).toBe(prepared.system.saves.fortitude.total);
    expect(fortRows.some((row) => row.source.id === 'fortitude-misc' && row.value === 1)).toBe(
      true
    );
    expect(fortRows.some((row) => row.source.kind === 'class' && row.value === 5)).toBe(true);

    // Reflex: poor base at L6 = 2, DEX mod +1, no misc → 3.
    const refRows = forTarget(entries, 'saves.reflex');
    expect(prepared.system.saves.reflex.total).toBe(3);
    expect(sumValues(refRows)).toBe(prepared.system.saves.reflex.total);

    // Will: poor base at L6 = 2, WIS mod +0 → 2 (the +0 ability row is skipped).
    const willRows = forTarget(entries, 'saves.will');
    expect(prepared.system.saves.will.total).toBe(2);
    expect(sumValues(willRows)).toBe(prepared.system.saves.will.total);
    expect(willRows.every((row) => row.value !== 0)).toBe(true);
  });

  it('emits 3.5e skill-synergy rows whose per-target sums match the engine helper', () => {
    const skillRanks = { tumble: 5, jump: 5, bluff: 8, 'handle-animal': 3 };
    const prepared = dnd35Engine.prepareData(
      doc35({ baseAttributes: scores, classLevels: [cl35({ level: 3 })], skillRanks })
    );
    const { entries } = buildD20LegacyContributionLedger(prepared, 'dnd-3.5e');
    const synergyRows = entries.filter((entry) => entry.target.startsWith('skills.'));

    // tumble(5)→balance,jump ; jump(5)→tumble ; bluff(8)→diplomacy,intimidate,
    // sleight-of-hand ; handle-animal(3<5)→nothing.
    expect(synergyRows.length).toBeGreaterThan(0);
    synergyRows.forEach((row) => {
      expect(row.value).toBe(2);
      expect(row.category).toBe('other');
    });

    // Every synergy target's rows sum to the engine's forward-table total, so the
    // ledger's inverse source→target map cannot drift from the engine.
    for (const targetSkill of [
      'balance',
      'jump',
      'tumble',
      'diplomacy',
      'intimidate',
      'sleight-of-hand',
      'ride',
    ]) {
      const rowsForSkill = forTarget(synergyRows, `skills.${targetSkill}`);
      expect(sumValues(rowsForSkill)).toBe(dnd35eSkillSynergyTotal(targetSkill, skillRanks));
    }

    // handle-animal below 5 ranks grants nothing.
    expect(forTarget(synergyRows, 'skills.ride')).toHaveLength(0);
  });
});

describe('buildD20LegacyContributionLedger — Pathfinder 1e', () => {
  it('BAB and save rows sum to the engine values', () => {
    const prepared = pf1eEngine.prepareData(
      doc1({
        baseAttributes: scores,
        classLevels: [
          cl1({
            classId: 'cleric',
            level: 6,
            bab: 'three-quarter',
            fortSave: 'good',
            willSave: 'good',
          }),
        ],
      })
    );
    const { entries } = buildD20LegacyContributionLedger(prepared, 'pf1e');

    const babRows = forTarget(entries, 'baseAttackBonus');
    expect(prepared.system.baseAttackBonus).toBe(4); // floor(6*3/4)
    expect(sumValues(babRows)).toBe(prepared.system.baseAttackBonus);

    for (const save of ['fortitude', 'reflex', 'will'] as const) {
      const rows = forTarget(entries, `saves.${save}`);
      expect(sumValues(rows)).toBe(prepared.system.saves[save].total);
    }
  });

  it('emits NO skill-synergy rows (PF1e has no synergy subsystem)', () => {
    const prepared = pf1eEngine.prepareData(
      doc1({
        baseAttributes: scores,
        classLevels: [cl1({ level: 3 })],
        // Ranks that WOULD trigger synergy under 3.5e must be inert here.
        skillRanks: { acrobatics: 6, bluff: 8, 'handle-animal': 6 },
      })
    );
    const { entries } = buildD20LegacyContributionLedger(prepared, 'pf1e');

    expect(entries.some((entry) => entry.target.startsWith('skills.'))).toBe(false);
    expect(entries.some((entry) => entry.source.id?.startsWith('skill-synergy'))).toBe(false);
  });
});
