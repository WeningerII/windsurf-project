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
import { draftEncounter, partyXpBudget, xpBudgetPerCharacter } from '../../scene/encounterDraft';
import { resolveSceneCombatStats } from '../../scene/combatStats';
import {
  resolveSceneAttack,
  buildDaggerheartAdversaryCombatant,
  type ResolveCombatStats,
} from '../../rules';
import { isOpenContentCompliant } from '../../utils/openContentPolicy';
import { exportDocuments, importDocumentsWithReport } from '../../utils/documentStorage';
import { exportScenes, importScenesWithReport } from '../../utils/sceneStorage';
import { mergeDocuments } from '../../utils/syncEngine';
import { compute5eSpellSlots } from '../../utils/spellSlots';
import {
  addQuest,
  addSessionEntry,
  createQuest,
  createSessionEntry,
  setQuestStatus,
} from '../../utils/campaignStory';
import { handleAiRequest } from '../../ai/gatewayCore';
import { AI_GATEWAY_SCHEMA_VERSION, AI_GATEWAY_TASKS, type AiTask } from '../../ai/contracts';
import { loadDaggerheartAdversariesForSystem } from '../../utils/dataLoader';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { Campaign } from '../../types/core/campaign';
import type { Monster } from '../../types/creatures/monsters';
import type { GameSystemId } from '../../types/game-systems';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneEvent } from '../../types/core/scene';

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

/** A minimal but schema-valid 5e document (valid default system data). */
function makeDoc(id: string, name: string, updatedAt: Date): CharacterDocument<SystemDataModel> {
  return {
    id,
    name,
    systemId: 'dnd-5e-2024',
    system: systemRegistry.get('dnd-5e-2024')!.createDefaultData(),
    createdAt: NOW,
    updatedAt,
  };
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
      'strategy-hints': {
        round: 1,
        side: 'hostile',
        combatants: [
          { tokenId: 'orc', name: 'Orc', faction: 'hostile', hpFraction: 1 },
          { tokenId: 'wizard', name: 'Wizard', faction: 'party', hpFraction: 0.4 },
        ],
      },
      'analyze-map': {
        image: { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
        imageWidth: 700,
        imageHeight: 700,
        gridWidth: 10,
        gridHeight: 10,
      },
    };
    const fixtures: Record<AiTask, unknown> = {
      'encounter-draft': { selections: [{ monsterId: 'goblin', count: 2 }] },
      'scene-narration': { narrative: 'The crypt fell silent.' },
      'identify-creature': { monsterId: 'goblin', confidence: 0.8 },
      'illustrate-scene': { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
      'strategy-hints': { hints: [{ actorId: 'orc', targetId: 'wizard', bias: 60 }] },
      'analyze-map': {
        pixelsPerCell: 70,
        offsetX: 0,
        offsetY: 0,
        regions: [{ kind: 'hazard', label: 'Lava', x: 1, y: 1, width: 2, height: 2 }],
      },
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

  it('S9: cloud-sync merge unions distinct docs and resolves conflicts last-writer-wins', () => {
    const early = new Date('2026-06-01T00:00:00.000Z');
    const late = new Date('2026-06-10T00:00:00.000Z');
    const merged = mergeDocuments(
      [makeDoc('A', 'Astra (local, newer)', late), makeDoc('B', 'Borin', early)],
      [makeDoc('A', 'Astra (remote, older)', early), makeDoc('C', 'Cyra', early)]
    );
    expect(merged.map((doc) => doc.id).sort()).toEqual(['A', 'B', 'C']);
    expect(merged.find((doc) => doc.id === 'A')!.name).toBe('Astra (local, newer)');
  });

  it('S10: the deterministic drafter produces an on-budget, seed-stable composition', () => {
    const monsters = [
      monster(),
      monster({ id: 'ogre', name: 'Ogre', challengeRating: 2, experiencePoints: 450 }),
    ];
    const params = {
      monsters,
      partyLevels: [3, 3, 3, 3],
      difficulty: 'moderate' as const,
      seed: 'draft-seed',
      systemId: 'dnd-5e-2024',
    };
    const first = draftEncounter(params);
    expect(first.reason).toBeUndefined();
    expect(first.selections.length).toBeGreaterThan(0);
    expect(first.totalXp).toBeLessThanOrEqual(first.budget);
    // Same seed → byte-identical composition.
    expect(draftEncounter(params).selections).toEqual(first.selections);
  });

  it('S11: Daggerheart creatures resolve to the duality combat model and place into a scene', async () => {
    const adversaries = await loadDaggerheartAdversariesForSystem('daggerheart');
    expect(adversaries.length).toBeGreaterThan(0);

    const built = buildDaggerheartAdversaryCombatant(adversaries[0], {
      tokenId: 'dh-1',
      position: { x: 1, y: 1 },
    });
    if (!built.supported) throw new Error(`Daggerheart adversary not supported: ${built.reason}`);
    expect(built.combatant.token.hp).toBeDefined();

    const stats = resolveSceneCombatStats(built.combatant.token, {
      monstersById: new Map(),
      documentsById: new Map(),
      daggerheartWeaponsById: new Map(),
      daggerheartAdversariesById: new Map(adversaries.map((adv) => [adv.id, adv])),
    });
    // The Daggerheart variant is wired (2d12 vs Evasion, threshold-marked HP).
    expect(stats?.daggerheart).toBeDefined();

    let scene = createSceneDocument({
      id: 'scene-dh',
      name: 'Duality',
      systemId: 'daggerheart',
      grid: { width: 6, height: 6 },
      seed: 'dh-seed',
      now: NOW,
    });
    const placed = applySceneIntents(
      scene,
      [{ type: 'place-token', token: built.combatant.token }],
      { eventIdFactory: counter('s11'), now: () => NOW }
    );
    expect(placed.rejected).toEqual([]);
    placed.events.forEach((event) => {
      scene = appendSceneEvent(scene, event);
    });
    expect(foldSceneEvents(scene).state.tokens['dh-1']).toBeDefined();
  });

  it('S12: 5e caster spell slots match the SRD full-caster table', () => {
    const slots = compute5eSpellSlots([{ classId: 'wizard', level: 5 }]);
    expect(slots[1].max).toBe(4);
    expect(slots[2].max).toBe(3);
    expect(slots[3].max).toBe(2);
    expect(slots[4].max).toBe(0);
  });

  it('S13: campaign quests transition active → completed', () => {
    let campaign = makeCampaign();
    campaign = addQuest(campaign, createQuest('q1', 'Recover the relic', 'It is lost.', NOW));
    expect(campaign.quests).toHaveLength(1);
    expect(campaign.quests[0].status).toBe('active');

    campaign = setQuestStatus(campaign, 'q1', 'completed', NOW);
    expect(campaign.quests[0].status).toBe('completed');
  });

  it('S14: an NPC can be re-sided after placement via an event-sourced allegiance change', () => {
    let scene = createSceneDocument({
      id: 'scene-s14',
      name: 'Turn',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      seed: 's14-seed',
      now: NOW,
    });
    const npc = buildPlacedToken({
      position: { x: 1, y: 1 },
      statblock: monster(),
      nameInput: '',
      tokenKind: 'npc',
      tokenAllegiance: 'hostile',
      idFactory: () => 'npc-1',
    });
    const placed = applySceneIntents(
      scene,
      [
        { type: 'place-token', token: npc! },
        { type: 'set-token-allegiance', tokenId: 'npc-1', allegiance: 'party' },
      ],
      { eventIdFactory: counter('s14'), now: () => NOW }
    );
    expect(placed.rejected).toEqual([]);
    placed.events.forEach((event) => {
      scene = appendSceneEvent(scene, event);
    });
    expect(foldSceneEvents(scene).state.tokens['npc-1'].allegiance).toBe('party');
  });

  it('S15: a partial scene import keeps valid records and reports the dropped count', () => {
    const valid = createSceneDocument({
      id: 'ok-scene',
      name: 'Valid',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    const payload = JSON.parse(exportScenes([valid])) as { scenes: unknown[] };
    payload.scenes.push({ id: 'junk', not: 'a scene' });

    const result = importScenesWithReport(JSON.stringify(payload));
    expect(result.droppedCount).toBe(1);
    expect(result.scenes).toHaveLength(1);
    expect(result.scenes[0].id).toBe('ok-scene');
  });

  it('S16: a partial document import keeps valid records and reports the dropped count', () => {
    const payload = JSON.parse(exportDocuments([makeDoc('ok-doc', 'Astra', NOW)])) as {
      documents: unknown[];
    };
    payload.documents.push({ garbage: true });

    const result = importDocumentsWithReport(JSON.stringify(payload));
    expect(result.droppedCount).toBe(1);
    expect(result.documents).toHaveLength(1);
    expect(result.documents[0].id).toBe('ok-doc');
  });

  it('S17: the scene runtime rejects illegal actions with issues instead of mutating', () => {
    const scene = createSceneDocument({
      id: 'scene-s17',
      name: 'Guarded',
      systemId: 'dnd-5e-2024',
      grid: { width: 4, height: 4 },
      now: NOW,
    });

    const ghostMove = resolveSceneAction(
      scene,
      { type: 'move-token', tokenId: 'ghost', position: { x: 1, y: 1 } },
      { eventId: 'e1', createdAt: NOW }
    );
    expect(ghostMove.event).toBeUndefined();
    expect(ghostMove.issues.some((issue) => issue.severity === 'error')).toBe(true);

    const offGrid = buildPlacedToken({
      position: { x: 99, y: 99 },
      statblock: monster(),
      nameInput: '',
      tokenKind: 'npc',
      tokenAllegiance: 'hostile',
      idFactory: () => 'oob',
    });
    const placeOffGrid = resolveSceneAction(
      scene,
      { type: 'place-token', token: offGrid! },
      { eventId: 'e2', createdAt: NOW }
    );
    expect(placeOffGrid.event).toBeUndefined();
    expect(placeOffGrid.issues.some((issue) => issue.severity === 'error')).toBe(true);
  });

  it('S18: the AI gateway rejects adversarial input (bad payload, non-image, invalid output)', async () => {
    const malformedPayload = await handleAiRequest(
      {
        schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
        task: 'encounter-draft',
        // missing required `candidates`
        payload: { systemId: 'dnd-5e-2024', partyLevels: [3], difficulty: 'moderate', prompt: 'x' },
      },
      {}
    );
    expect(malformedPayload).toMatchObject({ ok: false, code: 'invalid-request' });

    const nonImage = await handleAiRequest(
      {
        schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
        task: 'identify-creature',
        payload: {
          systemId: 'dnd-5e-2024',
          candidates: [{ id: 'goblin', name: 'Goblin' }],
          image: { dataUrl: 'data:text/plain;base64,AAAA', mediaType: 'text/plain' },
        },
      },
      {}
    );
    expect(nonImage).toMatchObject({ ok: false, code: 'invalid-request' });

    const invalidFixture = await handleAiRequest(
      {
        schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
        task: 'encounter-draft',
        payload: {
          systemId: 'dnd-5e-2024',
          partyLevels: [3],
          difficulty: 'moderate',
          prompt: 'goblins',
          candidates: [{ id: 'goblin', name: 'Goblin' }],
        },
      },
      // count 0 is not a positive integer → output validation rejects it.
      { fixtures: { 'encounter-draft': { selections: [{ monsterId: 'goblin', count: 0 }] } } }
    );
    expect(invalidFixture).toMatchObject({ ok: false, code: 'invalid-provider-output' });
  });

  it('S19: the encounter-spec gate reports coded issues for each illegal spec', () => {
    const monsters = [monster()];
    const base = { systemId: 'dnd-5e-2024', difficulty: 'moderate' as const };

    expect(
      validateEncounterSpec(
        { ...base, partyLevels: [3], selections: [{ monsterId: 'nope', count: 1 }] },
        { monsters }
      ).issues.some((issue) => issue.code === 'unknown-monster')
    ).toBe(true);

    expect(
      validateEncounterSpec(
        { ...base, partyLevels: [3], selections: [] },
        { monsters }
      ).issues.some((issue) => issue.code === 'empty-spec')
    ).toBe(true);

    expect(
      validateEncounterSpec(
        { ...base, partyLevels: [], selections: [{ monsterId: 'goblin', count: 1 }] },
        { monsters }
      ).issues.some((issue) => issue.code === 'no-party')
    ).toBe(true);

    expect(
      validateEncounterSpec(
        { ...base, partyLevels: [3], selections: [{ monsterId: 'pf', count: 1 }] },
        { monsters: [monster({ id: 'pf', system: 'pf2e' })] }
      ).issues.some((issue) => issue.code === 'system-mismatch')
    ).toBe(true);
  });

  it('S20: folding a corrupt persisted event surfaces issues without throwing (replay safety)', () => {
    const scene = createSceneDocument({
      id: 'scene-s20',
      name: 'Corrupt',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    const corrupt = {
      id: 'bad',
      type: 'nonsense.event',
      sequence: 1,
      createdAt: NOW,
      payload: {},
    } as unknown as SceneEvent;
    const corruptScene = { ...scene, events: [...scene.events, corrupt] };

    expect(() => foldSceneEvents(corruptScene)).not.toThrow();
    expect(foldSceneEvents(corruptScene).issues.length).toBeGreaterThan(0);
  });
});
