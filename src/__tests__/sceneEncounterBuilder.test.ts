import { describe, expect, it } from 'vitest';
import type { Monster } from '../types/creatures/monsters';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import {
  buildEncounterSceneEvents,
  summarizeEncounterParty,
  summarizeEncounterPlan,
} from '../scene/encounterBuilder';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../scene/runtime';
import { createSeededRng } from '../scene/seededRng';

const NOW = new Date('2026-05-01T12:00:00.000Z');

const goblin: Monster = {
  id: 'goblin',
  name: 'Goblin',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2.1',
  size: 'small',
  type: 'humanoid',
  alignment: 'neutral evil',
  challengeRating: 0.25,
  experiencePoints: 50,
  armorClass: 15,
  hitPoints: { count: 2, die: 'd6', modifier: 0, notation: '2d6' },
  speed: { walk: 30 },
  abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
  senses: ['darkvision 60 ft.'],
  languages: ['Common', 'Goblin'],
  actions: [{ name: 'Scimitar', description: 'Melee Weapon Attack.' }],
};

const ogre: Monster = {
  ...goblin,
  id: 'ogre',
  name: 'Ogre',
  size: 'large',
  challengeRating: 2,
  experiencePoints: 450,
  abilities: { str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7 },
};

describe('encounterBuilder', () => {
  it('summarizes queued monsters and party levels without mutating scenes', () => {
    const plan = summarizeEncounterPlan({
      monsters: [goblin, ogre],
      selections: [
        { monsterId: 'goblin', count: 2 },
        { monsterId: 'ogre', count: 1 },
      ],
      systemId: 'dnd-5e-2024',
    });
    const party = summarizeEncounterParty([
      {
        id: 'hero-1',
        name: 'Astra',
        systemId: 'dnd-5e-2024',
        system: { level: 3 },
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: 'hero-2',
        name: 'Borin',
        systemId: 'dnd-5e-2024',
        system: { level: 4 },
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: 'unknown-level',
        name: 'Manual NPC',
        systemId: 'dnd-5e-2024',
        system: {},
        createdAt: NOW,
        updatedAt: NOW,
      },
    ]);

    expect(plan).toMatchObject({
      issues: [],
      totalCount: 3,
      totalXp: 550,
      entries: [
        { monsterId: 'goblin', count: 2, totalXp: 100 },
        { monsterId: 'ogre', count: 1, totalXp: 450 },
      ],
    });
    expect(party).toEqual({
      members: [
        { id: 'hero-1', name: 'Astra', level: 3 },
        { id: 'hero-2', name: 'Borin', level: 4 },
      ],
      totalLevel: 7,
      averageLevel: 3.5,
    });
  });

  it('creates event-backed monster tokens with deterministic initiative', () => {
    const scene = createSceneDocument({
      id: 'scene-1',
      name: 'Road Ambush',
      systemId: 'dnd-5e-2024',
      grid: { width: 4, height: 4 },
      seed: 'ambush-seed',
      now: NOW,
    });

    const first = buildEncounterSceneEvents({
      scene,
      monsters: [goblin, ogre],
      selections: [
        { monsterId: 'goblin', count: 2 },
        { monsterId: 'ogre', count: 1 },
      ],
      createdAt: NOW,
      seed: 'encounter-seed',
      eventIdFactory: makeEventIdFactory(),
    });
    const second = buildEncounterSceneEvents({
      scene,
      monsters: [goblin, ogre],
      selections: [
        { monsterId: 'goblin', count: 2 },
        { monsterId: 'ogre', count: 1 },
      ],
      createdAt: NOW,
      seed: 'encounter-seed',
      eventIdFactory: makeEventIdFactory(),
    });

    expect(first.issues).toEqual([]);
    expect(first.totalXp).toBe(550);
    expect(first.events.map((event) => event.type)).toEqual([
      'token.added',
      'token.added',
      'token.added',
      'initiative.set',
    ]);
    expect(first.events).toEqual(second.events);

    const finalScene = first.events.reduce(appendSceneEvent, scene);
    const { state, issues } = foldSceneEvents(finalScene);
    expect(issues).toEqual([]);
    expect(Object.keys(state.tokens)).toHaveLength(3);
    expect(state.tokens['ogre-1']).toMatchObject({
      name: 'Ogre',
      kind: 'monster',
      refId: 'ogre',
      size: 2,
    });
    expect(state.initiative).toHaveLength(3);
    expect(state.activeTokenId).toBe(state.initiative[0].tokenId);
  });

  it('rejects unknown or mismatched monster ids without emitting partial events', () => {
    const scene = createSceneDocument({
      id: 'scene-1',
      name: 'Road Ambush',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });

    const result = buildEncounterSceneEvents({
      scene,
      monsters: [{ ...goblin, id: 'legacy-goblin', system: 'dnd-5e-2014' }],
      selections: [
        { monsterId: 'missing', count: 1 },
        { monsterId: 'legacy-goblin', count: 1 },
      ],
    });

    expect(result.events).toEqual([]);
    expect(result.issues.map((issue) => issue.code)).toEqual([
      'encounter-monster-unknown',
      'encounter-monster-system-mismatch',
    ]);
  });

  it('REGRESSION (05-M7): a pre-existing character token rolls seeded d20+DEX, not a flat 10', () => {
    let scene = createSceneDocument({
      id: 'scene-1',
      name: 'Road Ambush',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      seed: 'ambush-seed',
      now: NOW,
    });
    const hero = resolveSceneAction(
      scene,
      {
        type: 'place-token',
        token: {
          id: 'hero-token',
          name: 'Astra',
          kind: 'character',
          position: { x: 0, y: 0 },
          size: 1,
          refId: 'hero-doc',
        },
      },
      { eventId: 'hero-event', createdAt: NOW }
    );
    scene = appendSceneEvent(scene, hero.event!);

    const heroDoc: CharacterDocument<SystemDataModel> = {
      id: 'hero-doc',
      name: 'Astra',
      systemId: 'dnd-5e-2024',
      system: { level: 3, baseAttributes: { str: 10, dex: 18 } } as SystemDataModel,
      createdAt: NOW,
      updatedAt: NOW,
    };

    const build = () =>
      buildEncounterSceneEvents({
        scene,
        monsters: [goblin],
        selections: [{ monsterId: 'goblin', count: 1 }],
        documents: [heroDoc],
        createdAt: NOW,
        seed: 'encounter-seed',
        eventIdFactory: makeEventIdFactory(),
      });

    const result = build();
    expect(result.issues).toEqual([]);
    const initiativeEvent = result.events.find((event) => event.type === 'initiative.set');
    expect(initiativeEvent).toBeDefined();
    const entries =
      initiativeEvent!.type === 'initiative.set' ? initiativeEvent!.payload.entries : [];
    const heroEntry = entries.find((entry) => entry.tokenId === 'hero-token')!;

    // The character rolls from the same documented per-token sub-stream the
    // monsters use: d20 from `${seed}:${tokenId}:initiative`, plus DEX 18 (+4).
    const expected = createSeededRng('encounter-seed:hero-token:initiative').rollDie(20) + 4;
    expect(heroEntry.value).toBe(expected);
    expect(heroEntry.value).toBeGreaterThanOrEqual(5); // 1 + 4
    expect(heroEntry.value).toBeLessThanOrEqual(24); // 20 + 4

    // Deterministic: rebuilding with the same seed replays identical events.
    expect(build().events).toEqual(result.events);
  });

  it('05-M7: keeps an existing initiative entry and falls back to 10 only when stats are unresolvable', () => {
    let scene = createSceneDocument({
      id: 'scene-1',
      name: 'Road Ambush',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      now: NOW,
    });
    // Token with a refId that resolves to a document (would roll) but whose
    // initiative was already set manually -> the existing value is kept.
    const rolled = resolveSceneAction(
      scene,
      {
        type: 'place-token',
        token: {
          id: 'set-token',
          name: 'Set',
          kind: 'character',
          position: { x: 0, y: 0 },
          size: 1,
          refId: 'hero-doc',
        },
      },
      { eventId: 'e1', createdAt: NOW }
    );
    scene = appendSceneEvent(scene, rolled.event!);
    // Token with no refId/document -> last-resort flat 10.
    const plain = resolveSceneAction(
      scene,
      {
        type: 'place-token',
        token: { id: 'plain-token', name: 'Plain', kind: 'npc', position: { x: 1, y: 0 }, size: 1 },
      },
      { eventId: 'e2', createdAt: NOW }
    );
    scene = appendSceneEvent(scene, plain.event!);
    const manualOrder = resolveSceneAction(
      scene,
      {
        type: 'set-initiative',
        entries: [{ tokenId: 'set-token', value: 17 }],
        activeTokenId: 'set-token',
      },
      { eventId: 'e3', createdAt: NOW }
    );
    scene = appendSceneEvent(scene, manualOrder.event!);

    const heroDoc: CharacterDocument<SystemDataModel> = {
      id: 'hero-doc',
      name: 'Astra',
      systemId: 'dnd-5e-2024',
      system: { level: 3, baseAttributes: { str: 10, dex: 18 } } as SystemDataModel,
      createdAt: NOW,
      updatedAt: NOW,
    };

    const result = buildEncounterSceneEvents({
      scene,
      monsters: [goblin],
      selections: [{ monsterId: 'goblin', count: 1 }],
      documents: [heroDoc],
      createdAt: NOW,
      seed: 'encounter-seed',
      eventIdFactory: makeEventIdFactory(),
    });

    const initiativeEvent = result.events.find((event) => event.type === 'initiative.set')!;
    const entries =
      initiativeEvent.type === 'initiative.set' ? initiativeEvent.payload.entries : [];
    expect(entries.find((entry) => entry.tokenId === 'set-token')?.value).toBe(17);
    expect(entries.find((entry) => entry.tokenId === 'plain-token')?.value).toBe(10);
  });

  it('REGRESSION (L-M6): initiative ties break by codepoint order, not locale order', () => {
    let scene = createSceneDocument({
      id: 'scene-1',
      name: 'Tie Break',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      now: NOW,
    });
    // Two stat-less tokens both fall back to 10 — a guaranteed tie. The ids are
    // chosen so codepoint order ('Zeta' < 'alpha': 'Z' 0x5A < 'a' 0x61) differs
    // from typical locale collation (which would put 'alpha' first), so this
    // fails loudly if production ever reverts to localeCompare.
    for (const [index, id] of ['alpha-token', 'Zeta-token'].entries()) {
      const placed = resolveSceneAction(
        scene,
        {
          type: 'place-token',
          token: { id, name: id, kind: 'npc', position: { x: index, y: 0 }, size: 1 },
        },
        { eventId: `place-${id}`, createdAt: NOW }
      );
      scene = appendSceneEvent(scene, placed.event!);
    }

    const result = buildEncounterSceneEvents({
      scene,
      monsters: [goblin],
      selections: [{ monsterId: 'goblin', count: 1 }],
      createdAt: NOW,
      seed: 'tie-seed',
      eventIdFactory: makeEventIdFactory(),
    });

    const initiativeEvent = result.events.find((event) => event.type === 'initiative.set')!;
    const entries =
      initiativeEvent.type === 'initiative.set' ? initiativeEvent.payload.entries : [];
    const tiedAtTen = entries.filter((entry) => entry.value === 10).map((entry) => entry.tokenId);
    expect(tiedAtTen).toEqual(['Zeta-token', 'alpha-token']);
  });

  it('avoids existing occupied cells when placing generated tokens', () => {
    let scene = createSceneDocument({
      id: 'scene-1',
      name: 'Road Ambush',
      systemId: 'dnd-5e-2024',
      grid: { width: 3, height: 2 },
      now: NOW,
    });
    const hero = resolveSceneAction(
      scene,
      {
        type: 'place-token',
        token: {
          id: 'hero',
          name: 'Hero',
          kind: 'character',
          position: { x: 0, y: 0 },
          size: 1,
        },
      },
      { eventId: 'hero-event', createdAt: NOW }
    );
    scene = appendSceneEvent(scene, hero.event!);

    const result = buildEncounterSceneEvents({
      scene,
      monsters: [goblin],
      selections: [{ monsterId: 'goblin', count: 1 }],
      createdAt: NOW,
      eventIdFactory: makeEventIdFactory(),
    });

    const tokenEvent = result.events.find((event) => event.type === 'token.added');
    expect(tokenEvent).toMatchObject({
      payload: {
        token: {
          position: { x: 1, y: 0 },
        },
      },
    });
  });
});

function makeEventIdFactory(): () => string {
  let index = 0;
  return () => {
    index += 1;
    return `event-${index}`;
  };
}

describe('spawn zones (map-aware placement)', () => {
  it('places every monster inside the zone rectangle', () => {
    const scene = createSceneDocument({
      id: 'zone-scene',
      name: 'Zoned',
      systemId: 'dnd-5e-2024',
      grid: { width: 10, height: 10 },
      seed: 'zone-seed',
    });
    const zone = { position: { x: 6, y: 6 }, width: 3, height: 3 };
    const result = buildEncounterSceneEvents({
      scene,
      monsters: [goblin],
      selections: [{ monsterId: 'goblin', count: 4 }],
      zone,
      createdAt: NOW,
      eventIdFactory: makeEventIdFactory(),
    });
    expect(result.issues).toHaveLength(0);
    const placements = result.events
      .filter((event) => event.type === 'token.added')
      .map(
        (event) =>
          (event.payload as { token: { position: { x: number; y: number } } }).token.position
      );
    expect(placements).toHaveLength(4);
    for (const position of placements) {
      expect(position.x).toBeGreaterThanOrEqual(6);
      expect(position.x).toBeLessThan(9);
      expect(position.y).toBeGreaterThanOrEqual(6);
      expect(position.y).toBeLessThan(9);
    }
  });

  it('reports encounter-zone-full instead of spilling outside the zone', () => {
    const scene = createSceneDocument({
      id: 'zone-full',
      name: 'Tight',
      systemId: 'dnd-5e-2024',
      grid: { width: 10, height: 10 },
      seed: 'zone-seed',
    });
    const result = buildEncounterSceneEvents({
      scene,
      monsters: [goblin],
      selections: [{ monsterId: 'goblin', count: 5 }],
      zone: { position: { x: 0, y: 0 }, width: 2, height: 2 },
      createdAt: NOW,
      eventIdFactory: makeEventIdFactory(),
    });
    expect(result.events).toHaveLength(0);
    expect(result.issues.some((issue) => issue.code === 'encounter-zone-full')).toBe(true);
  });

  it('a zone fully off-grid is an explicit issue, and a large monster respects zone bounds', () => {
    const scene = createSceneDocument({
      id: 'zone-edge',
      name: 'Edge',
      systemId: 'dnd-5e-2024',
      grid: { width: 10, height: 10 },
      seed: 'zone-seed',
    });
    const offGrid = buildEncounterSceneEvents({
      scene,
      monsters: [goblin],
      selections: [{ monsterId: 'goblin', count: 1 }],
      zone: { position: { x: 20, y: 20 }, width: 3, height: 3 },
      createdAt: NOW,
      eventIdFactory: makeEventIdFactory(),
    });
    expect(offGrid.issues.some((issue) => issue.code === 'encounter-zone-outside-grid')).toBe(true);

    // A 2x2 ogre cannot fit a 3x3 zone twice without overlap.
    const ogres = buildEncounterSceneEvents({
      scene,
      monsters: [ogre],
      selections: [{ monsterId: 'ogre', count: 2 }],
      zone: { position: { x: 0, y: 0 }, width: 3, height: 3 },
      createdAt: NOW,
      eventIdFactory: makeEventIdFactory(),
    });
    expect(ogres.events).toHaveLength(0);
    expect(ogres.issues.some((issue) => issue.code === 'encounter-zone-full')).toBe(true);
  });
});
