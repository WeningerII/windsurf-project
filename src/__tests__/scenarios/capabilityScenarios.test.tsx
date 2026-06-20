/**
 * Capability acceptance scenarios (/loop QA pass). Each `it` is a realistic
 * cross-capability journey with binary pass/fail assertions, run deterministically
 * under vitest (seeded RNG, no network — AI uses fixtures). The union covers every
 * major capability; granular + UI behavior is covered by the rest of the suite.
 * See /tmp/scenarios-windsurf-project.md for the rubric and capability map.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import {
  appendSceneEvent,
  applySceneIntents,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import { summarizeSceneForLog } from '../../scene/sceneRecap';
import { createSeededRng } from '../../scene/seededRng';
import { generateNpc } from '../../scene/npcGenerator';
import { buildPlacedToken } from '../../scene/tokenPlacement';
import { validateEncounterSpec } from '../../scene/encounterSpec';
import { partyXpBudget, xpBudgetPerCharacter } from '../../scene/encounterDraft';
import { resolveSceneCombatStats } from '../../scene/combatStats';
import { resolveSceneAttack, type ResolveCombatStats } from '../../rules';
import { isOpenContentCompliant } from '../../utils/openContentPolicy';
import { exportDocuments, importDocumentsWithReport } from '../../utils/documentStorage';
import { exportScenes, importScenesWithReport } from '../../utils/sceneStorage';
import { addSessionEntry, createSessionEntry } from '../../utils/campaignStory';
import { handleAiRequest } from '../../ai/gatewayCore';
import { AI_GATEWAY_SCHEMA_VERSION, AI_GATEWAY_TASKS, type AiTask } from '../../ai/contracts';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { Campaign } from '../../types/core/campaign';
import type { Monster } from '../../types/creatures/monsters';
import type { GameSystemId } from '../../types/game-systems';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

const NOW = new Date('2026-06-20T12:00:00.000Z');

beforeAll(() => {
  if (!systemRegistry.get('dnd-5e-2024')) registerAllSystems();
});

function monster(overrides: Partial<Monster> = {}): Monster {
  return {
    id: 'goblin',
    name: 'Goblin',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    size: 'small',
    type: 'humanoid',
    alignment: 'neutral evil',
    challengeRating: 0.25,
    experiencePoints: 50,
    armorClass: 12,
    hitPoints: { count: 2, die: 'd6', modifier: 0, notation: '2d6' },
    speed: { walk: 30 },
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    senses: [],
    languages: [],
    actions: [{ name: 'Scimitar', description: 'Melee Weapon Attack: +4 to hit. Hit: 5 damage.' }],
    ...overrides,
  } as Monster;
}

// Deterministic guaranteed-hit attacker (mirrors the SceneManager combat fixture).
const BRUTE = monster({
  id: 'brute',
  name: 'Vicious Brute',
  challengeRating: 1,
  experiencePoints: 200,
  armorClass: 13,
  hitPoints: { count: 6, die: 'd8', modifier: 12, notation: '6d8+12' },
  abilities: { str: 18, dex: 10, con: 14, int: 6, wis: 8, cha: 6 },
  actions: [
    {
      name: 'Overhead Smash',
      description:
        'Melee Weapon Attack: +98 to hit, reach 5 ft., one target. Hit: 99 (1d4 + 98) bludgeoning damage.',
    },
  ],
});
const VICTIM = monster({ id: 'goblin', name: 'Goblin' });

function makeCampaign(): Campaign {
  return {
    id: 'camp-1',
    name: 'Saltmarsh',
    systemId: 'dnd-5e-2024',
    characterIds: [],
    notes: '',
    quests: [],
    sessionLog: [],
    createdAt: NOW,
    updatedAt: NOW,
  };
}

/** A monotonic event-id factory for deterministic scenarios. */
function counter(prefix: string): () => string {
  let n = 0;
  return () => `${prefix}-${++n}`;
}

describe('Capability scenarios', () => {
  it('S1: runs a deterministic, replayable solo fight (scene runtime + placement + initiative + combat)', () => {
    const id = counter('s1');
    let scene = createSceneDocument({
      id: 'scene-s1',
      name: 'Ambush',
      systemId: 'dnd-5e-2024',
      grid: { width: 8, height: 8 },
      seed: 's1-seed',
      now: NOW,
    });

    const bruteToken = buildPlacedToken({
      position: { x: 1, y: 1 },
      statblock: BRUTE,
      nameInput: '',
      tokenKind: 'npc',
      tokenAllegiance: 'hostile',
      idFactory: () => 'brute-tok',
    });
    const victimToken = buildPlacedToken({
      position: { x: 2, y: 1 },
      statblock: VICTIM,
      nameInput: '',
      tokenKind: 'npc',
      tokenAllegiance: 'party',
      idFactory: () => 'victim-tok',
    });
    expect(bruteToken && victimToken).toBeTruthy();

    const placed = applySceneIntents(
      scene,
      [
        { type: 'place-token', token: bruteToken! },
        { type: 'place-token', token: victimToken! },
        {
          type: 'set-initiative',
          entries: [
            { tokenId: 'brute-tok', value: 20 },
            { tokenId: 'victim-tok', value: 5 },
          ],
          activeTokenId: 'brute-tok',
        },
      ],
      { eventIdFactory: id, now: () => NOW }
    );
    expect(placed.rejected).toEqual([]);
    placed.events.forEach((event) => {
      scene = appendSceneEvent(scene, event);
    });

    const setup = foldSceneEvents(scene).state;
    expect(Object.keys(setup.tokens)).toHaveLength(2);
    expect(setup.initiative).toHaveLength(2);
    const victimMax = setup.tokens['victim-tok'].hp!.max;

    const resolveStats: ResolveCombatStats = (token) =>
      resolveSceneCombatStats(token, {
        monstersById: new Map([
          [BRUTE.id, BRUTE],
          [VICTIM.id, VICTIM],
        ]),
        documentsById: new Map(),
        daggerheartWeaponsById: new Map(),
        daggerheartAdversariesById: new Map(),
      });

    const outcome = resolveSceneAttack({
      state: setup,
      attackerId: 'brute-tok',
      targetId: 'victim-tok',
      resolveStats,
      seed: 's1-seed:attack:0',
      cause: 'attack',
    });
    expect(outcome.hit).toBe(true);
    expect(outcome.intent).toBeDefined();

    const applied = resolveSceneAction(scene, outcome.intent!, { eventId: id(), createdAt: NOW });
    expect(applied.event).toBeDefined();
    scene = appendSceneEvent(scene, applied.event!);

    const after = foldSceneEvents(scene).state;
    expect(after.tokens['victim-tok'].hp!.current).toBeLessThan(victimMax);

    // Replayable: folding the same event log again yields identical state.
    const replay = foldSceneEvents(scene).state;
    expect(replay.tokens['victim-tok'].hp!.current).toBe(after.tokens['victim-tok'].hp!.current);
  });

  it('S2: solo narrative tools fold into a deterministic recap that logs to a campaign', () => {
    const id = counter('s2');
    let scene = createSceneDocument({
      id: 'scene-s2',
      name: 'The Crypt',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      seed: 's2-seed',
      now: NOW,
    });

    const out = applySceneIntents(
      scene,
      [
        { type: 'consult-oracle', odds: 'even', question: 'Is it trapped?' },
        { type: 'roll-check', label: 'Perception', modifier: 3, dc: 15 },
      ],
      { eventIdFactory: id, now: () => NOW }
    );
    expect(out.rejected).toEqual([]);
    out.events.forEach((event) => {
      scene = appendSceneEvent(scene, event);
    });

    const state = foldSceneEvents(scene).state;
    expect(state.oracleLog).toHaveLength(1);
    expect(state.checkLog).toHaveLength(1);

    const recap = summarizeSceneForLog(state);
    expect(recap).toMatch(/Perception/);
    expect(recap).toMatch(/Is it trapped\?/);

    let campaign = makeCampaign();
    campaign = addSessionEntry(campaign, createSessionEntry('entry-1', scene.name, recap, NOW));
    expect(campaign.sessionLog).toHaveLength(1);
    expect(campaign.sessionLog[0].body).toContain('Perception');
  });

  it('S3: encounter budgets match the SRD per-character table and the gate flags over-budget', () => {
    // SRD 5.2.1 XP Budget per Character (low/moderate/high).
    expect(xpBudgetPerCharacter(1, 'low')).toBe(50);
    expect(xpBudgetPerCharacter(5, 'moderate')).toBe(750);
    expect(xpBudgetPerCharacter(5, 'high')).toBe(1100);
    expect(partyXpBudget([5, 5, 5, 5], 'moderate')).toBe(3000);

    const monsters = [monster()]; // goblin, 50 XP, SRD 5.2
    const onBudget = validateEncounterSpec(
      {
        systemId: 'dnd-5e-2024',
        difficulty: 'low',
        partyLevels: [1],
        selections: [{ monsterId: 'goblin', count: 1 }],
      },
      { monsters }
    );
    expect(onBudget.valid).toBe(true);

    const overBudget = validateEncounterSpec(
      {
        systemId: 'dnd-5e-2024',
        difficulty: 'low',
        partyLevels: [1],
        selections: [{ monsterId: 'goblin', count: 2 }],
      },
      { monsters }
    );
    expect(overBudget.valid).toBe(false);
    expect(overBudget.issues.some((issue) => issue.code === 'over-budget')).toBe(true);
  });

  it('S4: NPC generation is deterministic under a seed and yields a placeable statblock token', () => {
    const monsters = [monster(), monster({ id: 'ogre', name: 'Ogre', challengeRating: 2 })];
    const first = generateNpc(monsters, createSeededRng('npc:seed'));
    const again = generateNpc(monsters, createSeededRng('npc:seed'));
    expect(first).not.toBeNull();
    expect({ id: first!.monster.id, name: first!.name }).toEqual({
      id: again!.monster.id,
      name: again!.name,
    });

    const token = buildPlacedToken({
      position: { x: 0, y: 0 },
      statblock: first!.monster,
      nameInput: first!.name,
      tokenKind: 'npc',
      tokenAllegiance: 'hostile',
      idFactory: () => 'npc-tok',
    });
    expect(token).toMatchObject({ kind: 'npc', refId: first!.monster.id, allegiance: 'hostile' });
    expect(token!.hp).toBeDefined();
  });

  it('S5: every registered system computes default sheet state without error', () => {
    const systems = systemRegistry.getAll();
    expect(systems.length).toBeGreaterThanOrEqual(7);
    for (const def of systems) {
      const doc: CharacterDocument<SystemDataModel> = {
        id: `s5-${def.id}`,
        name: 'Probe',
        systemId: def.id as GameSystemId,
        system: def.createDefaultData(),
        createdAt: NOW,
        updatedAt: NOW,
      };
      const prepared = def.engine.prepareData(doc);
      expect(prepared).toBeDefined();
      expect(prepared.systemId).toBe(def.id);
    }
  });

  it('S6: documents and scenes survive an export/import round-trip; bad JSON is rejected', () => {
    const data = systemRegistry.get('dnd-5e-2024')!.createDefaultData();
    const doc: CharacterDocument<SystemDataModel> = {
      id: 'doc-1',
      name: 'Astra',
      systemId: 'dnd-5e-2024',
      system: data,
      createdAt: NOW,
      updatedAt: NOW,
    };
    const docRoundTrip = importDocumentsWithReport(exportDocuments([doc]));
    expect(docRoundTrip.droppedCount).toBe(0);
    expect(docRoundTrip.documents).toHaveLength(1);
    expect(docRoundTrip.documents[0]).toMatchObject({ name: 'Astra', systemId: 'dnd-5e-2024' });

    const scene = createSceneDocument({
      id: 'scene-rt',
      name: 'Round Trip',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    const sceneRoundTrip = importScenesWithReport(exportScenes([scene]));
    expect(sceneRoundTrip.droppedCount).toBe(0);
    expect(sceneRoundTrip.scenes).toHaveLength(1);
    expect(sceneRoundTrip.scenes[0]).toMatchObject({ id: 'scene-rt', name: 'Round Trip' });

    expect(() => importDocumentsWithReport('not valid json')).toThrow();
  });

  it('S7: the open-content policy admits the SRD source and rejects closed sources per system', () => {
    const allowedSource: Record<GameSystemId, string> = {
      'dnd-5e-2024': 'SRD 5.2',
      'dnd-5e-2014': 'SRD 5.1',
      'dnd-3.5e': 'SRD 3.5',
      pf1e: 'Core Rulebook',
      pf2e: 'Core Rulebook',
      mam3e: "Hero's Handbook",
      daggerheart: 'SRD 1.0',
    };
    for (const [systemId, source] of Object.entries(allowedSource) as [GameSystemId, string][]) {
      expect(isOpenContentCompliant(systemId, 'monsters', { source })).toBe(true);
      expect(isOpenContentCompliant(systemId, 'monsters', { source: 'Closed Sourcebook' })).toBe(
        false
      );
    }
  });

  it('S8: the AI gateway validates every task via fixtures and degrades without a provider', async () => {
    const payloads: Record<AiTask, unknown> = {
      'encounter-draft': {
        systemId: 'dnd-5e-2024',
        partyLevels: [3],
        difficulty: 'moderate',
        prompt: 'goblins',
        candidates: [{ id: 'goblin', name: 'Goblin' }],
      },
      'scene-narration': { facts: 'Combat: defeated the ogre.' },
      'identify-creature': {
        systemId: 'dnd-5e-2024',
        candidates: [{ id: 'goblin', name: 'Goblin' }],
        image: { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
      },
      'illustrate-scene': { prompt: 'a torchlit crypt' },
    };
    const fixtures: Record<AiTask, unknown> = {
      'encounter-draft': { selections: [{ monsterId: 'goblin', count: 2 }] },
      'scene-narration': { narrative: 'The crypt fell silent.' },
      'identify-creature': { monsterId: 'goblin', confidence: 0.8 },
      'illustrate-scene': { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
    };

    for (const task of AI_GATEWAY_TASKS) {
      const res = await handleAiRequest(
        { schemaVersion: AI_GATEWAY_SCHEMA_VERSION, task, payload: payloads[task] },
        { fixtures: { [task]: fixtures[task] } }
      );
      expect(res.ok, `task ${task} should validate from its fixture`).toBe(true);
      if (res.ok) expect(res.usage.source).toBe('fixture');
    }

    const degraded = await handleAiRequest(
      {
        schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
        task: 'scene-narration',
        payload: payloads['scene-narration'],
      },
      {}
    );
    expect(degraded).toMatchObject({ ok: false, code: 'provider-not-configured' });

    const unsupported = await handleAiRequest(
      { schemaVersion: AI_GATEWAY_SCHEMA_VERSION, task: 'mind-control', payload: {} },
      {}
    );
    expect(unsupported).toMatchObject({ ok: false, code: 'unsupported-task' });
  });
});
