import { describe, expect, it } from 'vitest';
import type { Monster } from '../types/creatures/monsters';
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
