/**
 * Acceptance tests for the make-me-a-game join flow.
 *
 * Two gates the plan sets for this item are proved here:
 *  1. a FULL seeded end-to-end replay in CI, for all seven systems, from
 *     recorded fixtures with NO provider key and NO adapter — through the real
 *     gateway core, not a stub of it; and
 *  2. a WHOLE-FLOW cost/attempt cap that actually fails the flow when exceeded
 *     (asserted in both directions: green under budget, closed over budget).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import {
  makeMeAGame,
  type MakeGameResult,
  type MakeGameStepOutcome,
} from '../../ai/makeMeAGameFlow';
import { createFlowBudget, type FlowBudgetLimits } from '../../ai/flowBudget';
import { createRecordedGateway, type RecordedGatewayTurn } from '../../ai/recordedGateway';
import { buildDocumentFromPlanIds } from '../../creation/draftDocument';
import { systemRegistry } from '../../registry';
import { registerAllSystems } from '../../systems';
import { foldSceneEvents } from '../../scene/runtime';
import type { SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import { MAKE_GAME_FIXTURES, type RecordedGameFixture } from './makeMeAGameFixtures';

beforeAll(() => {
  registerAllSystems();
});

const SEED = 'make-me-a-game:acceptance';
const FIXED_NOW = () => new Date('2026-07-24T00:00:00.000Z');
/** Keeps the drafting prompt bounded; every fixture id sits inside this slice. */
const POOL_LIMIT = 8;

/** The recorded transcript for a fixture, in the order the flow will call. */
function transcriptFor(fixture: RecordedGameFixture): RecordedGatewayTurn[] {
  const turns: RecordedGatewayTurn[] = fixture.party.map((member) => ({
    task: 'character-draft' as const,
    output: member.output,
  }));
  if (fixture.encounter) {
    turns.push({ task: 'encounter-draft', output: fixture.encounter.output });
  }
  return turns;
}

function paramsFor(fixture: RecordedGameFixture) {
  return {
    systemId: fixture.systemId,
    seed: SEED,
    sceneName: 'Opening Scene',
    party: fixture.party.map((member) => ({ prompt: member.prompt })),
    // The encounter is ALWAYS requested, for every system. Systems without a
    // budget model must decline it with a real reason — the flow must never
    // quietly borrow another system's tables.
    encounter: {
      prompt: fixture.encounter?.prompt ?? 'whatever fits this table',
      difficulty: fixture.encounter?.difficulty ?? ('low' as const),
    },
  };
}

async function runFixture(
  fixture: RecordedGameFixture,
  options: { budget?: FlowBudgetLimits; transcript?: RecordedGatewayTurn[] } = {}
): Promise<{ result: MakeGameResult; consumed: number; remaining: number }> {
  const gateway = createRecordedGateway(options.transcript ?? transcriptFor(fixture));
  const result = await makeMeAGame(paramsFor(fixture), {
    call: gateway.call,
    now: FIXED_NOW,
    poolLimit: POOL_LIMIT,
    ...(options.budget ? { budget: createFlowBudget(options.budget) } : {}),
  });
  return { result, consumed: gateway.consumed(), remaining: gateway.remaining() };
}

function step(result: MakeGameResult, id: MakeGameStepOutcome['step']): MakeGameStepOutcome {
  const found = result.steps.find((entry) => entry.step === id);
  if (!found) throw new Error(`No '${id}' step outcome was recorded.`);
  return found;
}

describe('makeMeAGame — seeded end-to-end replay, all seven systems, no API key', () => {
  it('covers every registered system exactly once', () => {
    const covered = MAKE_GAME_FIXTURES.map((fixture) => fixture.systemId).sort();
    const registered = systemRegistry
      .getAll()
      .map((definition) => definition.id)
      .filter((id): id is GameSystemId => id !== 'd20-legacy')
      .sort();
    expect(covered).toEqual(registered);
  });

  it.each(MAKE_GAME_FIXTURES.map((fixture) => [fixture.systemId, fixture] as const))(
    'builds a validated party + scene for %s from recorded fixtures',
    async (_systemId, fixture) => {
      const { result, remaining } = await runFixture(fixture);

      expect(result.errors).toEqual([]);
      expect(result.ok).toBe(true);
      // The whole transcript was consumed: no step silently skipped a call.
      expect(remaining).toBe(0);

      // --- party: drafted, validated by THIS system's validator, applied
      // through THIS system's own guided-creation plan.
      expect(step(result, 'party').status).toBe('applied');
      expect(result.party).toHaveLength(fixture.party.length);
      for (const member of result.party) {
        expect(member.document.systemId).toBe(fixture.systemId);
        const { issues } = await systemRegistry.validateDocument(member.document, {
          reason: 'ai-draft',
        });
        expect(issues.filter((issue) => issue.severity === 'error')).toEqual([]);
      }

      // --- encounter: applied where the system has a cited budget model,
      // honestly declined (with a real reason) where it does not.
      const encounterStep = step(result, 'encounter');
      if (fixture.encounter) {
        expect(encounterStep.status).toBe('applied');
        expect(result.encounter).toBeDefined();
        expect(result.encounter?.totalXp).toBeGreaterThan(0);
        expect(result.encounter?.totalXp).toBeLessThanOrEqual(result.encounter?.budget ?? 0);
      } else {
        expect(encounterStep.status).toBe('skipped');
        expect(encounterStep.reason).toMatch(fixture.encounterSkipMatch as RegExp);
        expect(result.encounter).toBeUndefined();
      }

      // --- scene: every token arrived through the intent → validate → event
      // path, and the log folds clean.
      expect(step(result, 'scene').status).toBe('applied');
      const scene = result.scene;
      expect(scene).toBeDefined();
      if (!scene) return;
      const folded = foldSceneEvents(scene);
      expect(folded.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
      const tokens = Object.values(folded.state.tokens);
      const characterTokens = tokens.filter((token) => token.kind === 'character');
      expect(characterTokens).toHaveLength(result.party.length);
      const monsterTokens = tokens.filter((token) => token.kind === 'monster');
      expect(monsterTokens.length).toBe(fixture.encounter ? monsterTokens.length : 0);
      if (fixture.encounter) {
        expect(monsterTokens.length).toBeGreaterThan(0);
        // Initiative covers everyone on the grid, so the table is playable.
        expect(folded.state.initiative).toHaveLength(tokens.length);
      }
    },
    60_000
  );

  it('replays byte-identically for the same seed + transcript (dnd-3.5e)', async () => {
    const fixture = MAKE_GAME_FIXTURES.find((entry) => entry.systemId === 'dnd-3.5e');
    expect(fixture).toBeDefined();
    if (!fixture) return;

    const first = await runFixture(fixture);
    const second = await runFixture(fixture);

    const fold = (result: MakeGameResult) =>
      JSON.stringify(foldSceneEvents(result.scene as NonNullable<MakeGameResult['scene']>).state);
    expect(fold(second.result)).toBe(fold(first.result));
    expect(JSON.stringify(second.result.scene?.events)).toBe(
      JSON.stringify(first.result.scene?.events)
    );
    expect(second.result.party.map((member) => member.document.id)).toEqual(
      first.result.party.map((member) => member.document.id)
    );
    expect(JSON.stringify(second.result.encounter)).toBe(JSON.stringify(first.result.encounter));
  }, 60_000);

  it('reports ids a system’s creation plan cannot apply instead of hiding them', async () => {
    // Daggerheart offers real class/ancestry/community pools but declares no
    // loader-driven creation steps yet: the ids are legal and must be surfaced
    // as unapplied, not silently swallowed.
    const fixture = MAKE_GAME_FIXTURES.find((entry) => entry.systemId === 'daggerheart');
    expect(fixture).toBeDefined();
    if (!fixture) return;
    const { result } = await runFixture(fixture);
    expect(result.party[0]?.unroutedIds).toEqual(['daggerheart-guardian', 'clank', 'highborne']);
    // A d20 system with real choice steps routes the same shape of draft.
    const pf2e = MAKE_GAME_FIXTURES.find((entry) => entry.systemId === 'pf2e');
    if (!pf2e) return;
    const routed = await runFixture(pf2e);
    expect(routed.result.party[0]?.unroutedIds).toEqual([]);
  }, 60_000);
});

describe('makeMeAGame — the deterministic gates decide, not the model', () => {
  it('rejects an invented monster id and repairs through the encounter-spec gate', async () => {
    const fixture = MAKE_GAME_FIXTURES.find((entry) => entry.systemId === 'dnd-5e-2024');
    expect(fixture).toBeDefined();
    if (!fixture?.encounter) return;

    const transcript: RecordedGatewayTurn[] = [
      ...fixture.party.map((member) => ({
        task: 'character-draft' as const,
        output: member.output,
      })),
      // First recorded answer names a creature that is not in the catalog.
      {
        task: 'encounter-draft',
        output: { selections: [{ monsterId: 'tarrasque-of-the-nine-hells', count: 1 }] },
      },
      { task: 'encounter-draft', output: fixture.encounter.output },
    ];

    const { result } = await runFixture(fixture, { transcript });
    expect(result.ok).toBe(true);
    expect(result.encounter?.selections).toEqual([{ monsterId: 'awakened-shrub-2024', count: 2 }]);
    const folded = foldSceneEvents(result.scene as NonNullable<MakeGameResult['scene']>);
    expect(
      Object.values(folded.state.tokens).some((token) =>
        token.refId?.includes('tarrasque-of-the-nine-hells')
      )
    ).toBe(false);
  }, 60_000);

  it('fails the encounter closed when the gate never accepts (over budget, twice)', async () => {
    const fixture = MAKE_GAME_FIXTURES.find((entry) => entry.systemId === 'dnd-5e-2024');
    expect(fixture).toBeDefined();
    if (!fixture) return;
    // 20 awakened shrubs is 200 XP against a 100 XP low budget for two level-1s.
    const overBudget = { selections: [{ monsterId: 'awakened-shrub-2024', count: 20 }] };
    const transcript: RecordedGatewayTurn[] = [
      ...fixture.party.map((member) => ({
        task: 'character-draft' as const,
        output: member.output,
      })),
      { task: 'encounter-draft', output: overBudget },
      { task: 'encounter-draft', output: overBudget },
    ];

    const { result } = await runFixture(fixture, { transcript });
    expect(step(result, 'encounter').status).toBe('failed');
    expect(result.encounter).toBeUndefined();
    expect(result.ok).toBe(false);
    // The party and the scene still exist — a rejected fight is not a broken run.
    expect(result.party).toHaveLength(2);
    const folded = foldSceneEvents(result.scene as NonNullable<MakeGameResult['scene']>);
    expect(Object.values(folded.state.tokens).every((token) => token.kind === 'character')).toBe(
      true
    );
  }, 60_000);
});

describe('makeMeAGame — whole-flow cost cap', () => {
  const fixture = () => {
    const found = MAKE_GAME_FIXTURES.find((entry) => entry.systemId === 'pf2e');
    if (!found) throw new Error('pf2e fixture missing');
    return found;
  };

  it('stays inside the cap on a healthy run and reports the spend', async () => {
    const { result } = await runFixture(fixture(), { budget: { maxUnits: 14, maxCalls: 14 } });
    expect(result.ok).toBe(true);
    // 2 character drafts + 1 encounter draft, all text tasks at 1 unit each.
    expect(result.budget.callsAttempted).toBe(3);
    expect(result.budget.callsDelivered).toBe(3);
    expect(result.budget.unitsSpent).toBe(3);
    expect(result.budget.callsDenied).toBe(0);
    expect(result.budget.exceeded).toBe(false);
  }, 60_000);

  it('FAILS the flow when the aggregate unit cap is exceeded mid-flow', async () => {
    // One unit buys the first party member's draft and nothing after it.
    const { result } = await runFixture(fixture(), { budget: { maxUnits: 1, maxCalls: 99 } });

    expect(result.budget.exceeded).toBe(true);
    expect(result.budget.callsDenied).toBeGreaterThan(0);
    expect(result.budget.callsDelivered).toBeLessThan(result.budget.callsAttempted);
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/used up its AI budget/i);
    // The cap bit before the encounter ever reached the provider.
    expect(result.encounter).toBeUndefined();
    // Under-budget work already validated is kept, not thrown away.
    expect(result.party).toHaveLength(1);
  }, 60_000);

  it('FAILS the flow when the aggregate attempt cap is exceeded', async () => {
    const { result } = await runFixture(fixture(), { budget: { maxUnits: 999, maxCalls: 1 } });
    expect(result.budget.exceeded).toBe(true);
    expect(result.budget.callsDelivered).toBe(1);
    expect(result.errors.join(' ')).toMatch(/used up its AI budget/i);
    expect(result.ok).toBe(false);
  }, 60_000);

  it('a zero cap denies every call and the flow degrades to manual', async () => {
    const { result } = await runFixture(fixture(), { budget: { maxUnits: 0, maxCalls: 0 } });
    expect(result.budget.callsDelivered).toBe(0);
    expect(result.party).toHaveLength(0);
    expect(step(result, 'party').status).toBe('failed');
    expect(result.ok).toBe(false);
  }, 60_000);
});

describe('makeMeAGame — key-less / AI-off degradation', () => {
  it('fails closed with the manual-tools message when nothing is recorded and no key exists', async () => {
    const fixture = MAKE_GAME_FIXTURES.find((entry) => entry.systemId === 'pf1e');
    expect(fixture).toBeDefined();
    if (!fixture) return;
    // Empty transcript => no fixture, no adapter => the gateway core's real
    // key-less branch.
    const { result } = await runFixture(fixture, { transcript: [] });

    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/No AI provider is configured/i);
    expect(result.party).toEqual([]);
    expect(result.scene).toBeUndefined();
    // One attempt per party member; a gateway failure is never retried.
    expect(result.budget.callsAttempted).toBe(2);
  }, 60_000);

  it('deterministic creation through the same path still works with no AI at all', async () => {
    // The applier the flow uses is the wizard's own replay: it must build a
    // valid document with no gateway involved whatsoever.
    for (const systemId of ['pf1e', 'daggerheart', 'mam3e'] as GameSystemId[]) {
      const definition = systemRegistry.get(systemId);
      const plan = await systemRegistry.getCreationPlan<SystemDataModel>(systemId);
      expect(definition).toBeDefined();
      expect(plan).toBeDefined();
      if (!definition || !plan) continue;
      const { document } = await buildDocumentFromPlanIds(
        plan,
        definition.createDefaultData,
        'Manual Hero',
        []
      );
      const { issues } = await systemRegistry.validateDocument(document, { reason: 'creation' });
      expect(issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    }
  }, 60_000);
});
