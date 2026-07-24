/**
 * W5 differential: the shared 5e engine's condition-driven disadvantage now
 * flows through the resolver fold (`resolveCharacterEffects` with the `conditions`
 * input) instead of reading `conditionImposesDisadvantage` directly.
 *
 * This test pins that the fold is BYTE-IDENTICAL to the previous bespoke read:
 *   - baseline oracle  = `conditionImposesDisadvantage(ids, rollTargets)` — the
 *     original decision function, still the reference implementation;
 *   - resolver fold    = `resolveCharacterEffects({ conditions: collect… })`,
 *     read as a per-target `rollMode`;
 *   - engine output    = `rollCheck(...)`, whose formula reflects the roll mode
 *     (`2d20kl1` = disadvantage, plain `1d20` = normal) with the d20 mocked.
 * All three must agree for every (conditions × check) case, across BOTH editions.
 */
import { Dnd5eEngine } from '../systems/dnd5e/engine';
import { Dnd5e2024Engine } from '../systems/dnd5e-2024/engine';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import {
  collectDnd5eConditionEffects,
  conditionImposesDisadvantage,
} from '../rules/conditions/dnd5eConditions';
import { resolveCharacterEffects } from '../rules';
import type { GameSystemId } from '../types/game-systems';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

function doc(systemId: GameSystemId, conditionIds: string[]): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'dnd5e-condition-fold',
    name: 'Condition Fold Fixture',
    systemId,
    system: {
      ...createDefaultDnd5eData(),
      // Exhaustion 0 so conditions are the ONLY disadvantage source under test.
      exhaustionLevel: 0,
      conditions: conditionIds.map((id) => ({ id, name: id })),
    },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

/** The exact roll-target set the engine derives per check kind. */
function rollTargetsFor(checkId: string): string[] {
  if (checkId.startsWith('save-')) {
    const attr = checkId.slice(5);
    return ['save', `save.${attr}`];
  }
  // Everything else in this matrix is an ability check.
  return ['ability-check'];
}

/** The resolver fold's decision, read as a per-target roll mode. */
function foldImposesDisadvantage(
  systemId: GameSystemId,
  conditionIds: string[],
  targets: string[]
): boolean {
  const folded = resolveCharacterEffects(systemId, {
    conditions: collectDnd5eConditionEffects(conditionIds),
  }).result;
  return targets.some((target) => folded.byTarget[target]?.rollMode === 'disadvantage');
}

// (conditions, checkId, expected-disadvantage) — the documented baseline.
const CASES: Array<[string[], string, boolean]> = [
  [[], 'str', false],
  [['poisoned'], 'str', true],
  [['poisoned'], 'acrobatics', true],
  [['restrained'], 'save-dex', true],
  [['restrained'], 'save-con', false], // restrained only hits save.dex
  [['frightened'], 'str', false], // note-only (situational), never a roll mode
  [['blinded'], 'str', false], // blinded affects attacks, not ability checks
  [['poisoned', 'restrained'], 'save-dex', true],
];

describe('W5 5e condition fold — resolver equals the prior bespoke read', () => {
  beforeEach(() => {
    // Mock the d20 low so a disadvantage roll (2d20kl1) is observable in the
    // formula string and a normal roll stays 1d20.
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe.each([
    ['2014', 'dnd-5e-2014' as GameSystemId, () => new Dnd5eEngine()],
    ['2024', 'dnd-5e-2024' as GameSystemId, () => new Dnd5e2024Engine()],
  ])('edition %s', (_label, systemId, makeEngine) => {
    it.each(CASES)(
      'conditions=%j check=%s → the fold, the oracle, and rollCheck agree',
      async (conditionIds, checkId, expectedDisadvantage) => {
        const targets = rollTargetsFor(checkId);

        // 1. Baseline oracle (the original decision function).
        const oracle = conditionImposesDisadvantage(conditionIds, targets);
        expect(oracle).toBe(expectedDisadvantage);

        // 2. Resolver fold produces the SAME rollMode:'disadvantage' decision.
        const fold = foldImposesDisadvantage(systemId, conditionIds, targets);
        expect(fold).toBe(oracle);

        // 3. The engine's rollCheck output reflects it byte-for-byte.
        const engine = makeEngine();
        const result = await engine.rollCheck(doc(systemId, conditionIds), checkId);
        const engineDisadvantage = result.formula.includes('2d20kl1');
        expect(engineDisadvantage).toBe(oracle);
      }
    );
  });
});
