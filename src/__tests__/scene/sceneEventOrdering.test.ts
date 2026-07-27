/**
 * RFC 006's central guarantee is that *the same initial scene + the same event
 * log yields byte-identical folded state*. Before `compareSceneEvents`, the fold
 * ordered events with a bare `a.sequence - b.sequence`. `Array#sort` is stable,
 * so events that TIE on `sequence` resolved to array insertion order — a
 * property of how the array was assembled, not of the data. `sequence` is minted
 * from a LOCAL counter (`scene.events.length + 1`), so two devices appending
 * offline both mint N+1 and the merged log folds device-dependently.
 *
 * Two things are proven here, and the second is what makes the first safe:
 *
 *  1. A merged log with tied sequences folds byte-identically under EVERY
 *     permutation of its `events` array.
 *  2. Existing single-device logs — unique sequences, so the new tiebreaks never
 *     fire — order and fold EXACTLY as the old comparator ordered them. This is
 *     a real regression check against a literal reproduction of the pre-fix
 *     comparator, not an assumption.
 */
import { describe, expect, it } from 'vitest';
import type { SceneDocument, SceneEvent } from '../../types/core/scene';
import {
  appendSceneEvent,
  compareSceneEvents,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import { buildEncounterSceneEvents } from '../../scene/encounterBuilder';
import { createSeededRng } from '../../scene/seededRng';
import type { Monster } from '../../types/creatures/monsters';

const NOW = new Date('2026-05-01T12:00:00.000Z');

/**
 * The EXACT ordering the fold used before `compareSceneEvents`: a bare numeric
 * compare on `sequence`, run through the same stable `Array#sort`. Kept verbatim
 * so the "existing logs are unaffected" claim is checked against the old
 * behavior rather than against the new code's own opinion.
 */
function legacyOrder(events: readonly SceneEvent[]): SceneEvent[] {
  return events.slice().sort((a, b) => a.sequence - b.sequence);
}

function newOrder(events: readonly SceneEvent[]): SceneEvent[] {
  return events.slice().sort(compareSceneEvents);
}

function ids(events: readonly SceneEvent[]): string[] {
  return events.map((event) => event.id);
}

function withEvents(scene: SceneDocument, events: readonly SceneEvent[]): SceneDocument {
  return { ...scene, events: events.slice() };
}

/** Deterministic Fisher-Yates so a failure is reproducible from the seed. */
function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const rng = createSeededRng(seed);
  const out = items.slice();
  for (let index = out.length - 1; index > 0; index -= 1) {
    const swap = rng.nextInt(index + 1);
    [out[index], out[swap]] = [out[swap], out[index]];
  }
  return out;
}

function permutations<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [items.slice()];
  const out: T[][] = [];
  items.forEach((item, index) => {
    const rest = [...items.slice(0, index), ...items.slice(index + 1)];
    for (const tail of permutations(rest)) out.push([item, ...tail]);
  });
  return out;
}

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

/**
 * A log built the way production builds one: every event minted through
 * `resolveSceneAction` and appended in order, so sequences are 1..N and unique.
 * Exercises every fold target that can expose apply order — the `tokens` and
 * `markers` maps (key insertion order), `initiative`, and the `checkLog` /
 * `oracleLog` arrays.
 */
function buildSingleDeviceScene(): SceneDocument {
  let scene = createSceneDocument({
    id: 'ordering-single-device',
    name: 'Single Device',
    systemId: 'dnd-5e-2024',
    grid: { width: 10, height: 10 },
    seed: 'ordering-seed',
    now: NOW,
  });

  let counter = 0;
  const append = (intent: Parameters<typeof resolveSceneAction>[1]): void => {
    counter += 1;
    const result = resolveSceneAction(scene, intent, {
      eventId: `single-device-event-${counter}`,
      createdAt: NOW,
    });
    expect(result.issues, `intent ${counter} (${intent.type})`).toEqual([]);
    scene = appendSceneEvent(scene, result.event!);
  };

  append({
    type: 'place-token',
    token: {
      id: 'hero',
      name: 'Astra',
      kind: 'character',
      position: { x: 1, y: 1 },
      size: 1,
      hp: { current: 22, max: 22, temp: 0 },
    },
  });
  append({
    type: 'place-token',
    token: {
      id: 'brute',
      name: 'Brute',
      kind: 'npc',
      position: { x: 5, y: 5 },
      size: 1,
      hp: { current: 15, max: 15, temp: 0 },
    },
  });
  append({ type: 'move-token', tokenId: 'hero', position: { x: 2, y: 2 } });
  append({
    type: 'add-marker',
    marker: {
      id: 'fire',
      kind: 'hazard',
      label: 'Fire',
      position: { x: 4, y: 4 },
      width: 2,
      height: 2,
    },
  });
  append({ type: 'apply-damage', damages: [{ tokenId: 'brute', amount: 6 }] });
  append({ type: 'set-token-conditions', tokenId: 'brute', conditions: ['prone'] });
  append({ type: 'set-token-allegiance', tokenId: 'brute', allegiance: 'hostile' });
  append({
    type: 'set-initiative',
    entries: [
      { tokenId: 'hero', value: 18 },
      { tokenId: 'brute', value: 11 },
    ],
    activeTokenId: 'hero',
  });
  append({ type: 'advance-turn' });
  append({ type: 'roll-check', label: 'Perception', modifier: 3, dc: 12 });
  append({ type: 'roll-check', label: 'Stealth', modifier: 1 });
  append({ type: 'consult-oracle', odds: 'even', question: 'Do reinforcements arrive?' });
  append({ type: 'remove-marker', markerId: 'fire' });

  return scene;
}

/** The same shape, but grown through the encounter builder (uuid-ish event ids). */
function buildEncounterScene(): SceneDocument {
  const scene = createSceneDocument({
    id: 'ordering-encounter',
    name: 'Encounter',
    systemId: 'dnd-5e-2024',
    grid: { width: 8, height: 8 },
    seed: 'encounter-ordering-seed',
    now: NOW,
  });
  let index = 0;
  const built = buildEncounterSceneEvents({
    scene,
    monsters: [goblin],
    selections: [{ monsterId: 'goblin', count: 3 }],
    createdAt: NOW,
    seed: 'encounter-ordering',
    eventIdFactory: () => {
      index += 1;
      return `b1a7c${index}0e-0000-4000-8000-00000000000${index}`;
    },
  });
  expect(built.issues).toEqual([]);
  return built.events.reduce(appendSceneEvent, scene);
}

describe('compareSceneEvents — replay order is intrinsic to the data', () => {
  it('orders by sequence, then createdAt, then id (codepoint), and is a strict total order', () => {
    const base = { type: 'turn.advanced', payload: {} } as const;
    const event = (id: string, sequence: number, ms: number): SceneEvent =>
      ({ ...base, id, sequence, createdAt: new Date(ms) }) as SceneEvent;

    // sequence dominates
    expect(compareSceneEvents(event('z', 1, 999), event('a', 2, 0))).toBeLessThan(0);
    // then createdAt
    expect(compareSceneEvents(event('z', 1, 10), event('a', 1, 20))).toBeLessThan(0);
    // then id, by codepoint — 'Z' (0x5A) sorts before 'a' (0x61), which locale
    // collation would reverse. Locale-dependent order is exactly the bug.
    expect(compareSceneEvents(event('Zeta', 1, 10), event('alpha', 1, 10))).toBeLessThan(0);
    // reflexive / antisymmetric
    expect(compareSceneEvents(event('a', 1, 10), event('a', 1, 10))).toBe(0);
    expect(compareSceneEvents(event('a', 1, 10), event('b', 1, 10))).toBeLessThan(0);
    expect(compareSceneEvents(event('b', 1, 10), event('a', 1, 10))).toBeGreaterThan(0);
  });

  it('never throws on corrupt events (it runs before the fold safety net)', () => {
    const corrupt = [
      { id: 'ok', sequence: 1, createdAt: NOW, type: 'turn.advanced', payload: {} },
      // A JSON round-trip that was never revived: createdAt is a string.
      { id: 'str', sequence: 1, createdAt: NOW.toISOString(), type: 'turn.advanced', payload: {} },
      { id: 'nan', sequence: Number.NaN, createdAt: NOW, type: 'turn.advanced', payload: {} },
      { id: 42, sequence: undefined, createdAt: undefined, type: 'turn.advanced', payload: {} },
      undefined,
    ] as unknown as SceneEvent[];

    expect(() => corrupt.slice().sort(compareSceneEvents)).not.toThrow();
    const scene = createSceneDocument({
      id: 'ordering-corrupt',
      name: 'Corrupt',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    expect(() => foldSceneEvents(withEvents(scene, corrupt))).not.toThrow();
  });
});

describe('REGRESSION: existing single-device logs fold identically before and after', () => {
  const fixtures: Array<[string, SceneDocument]> = [
    ['hand-built (resolveSceneAction)', buildSingleDeviceScene()],
    ['encounter builder', buildEncounterScene()],
  ];

  it.each(fixtures)('%s: sequences are unique, so no tiebreak can fire', (_name, scene) => {
    const sequences = scene.events.map((event) => event.sequence);
    expect(sequences.length).toBeGreaterThan(3);
    expect(new Set(sequences).size).toBe(sequences.length);
    expect(sequences).toEqual([...sequences].sort((a, b) => a - b));
  });

  it.each(fixtures)(
    '%s: the new comparator produces the SAME order as the old one, for every arrangement',
    (_name, scene) => {
      // The fold is a pure function of the ORDERED event list, so identical
      // order under both comparators is identical folded state by construction.
      // Checked over many arrangements because the old comparator's result
      // depended on the incoming array order (stable sort + ties); if any
      // arrangement diverged, this log would fold differently than it used to.
      for (let trial = 0; trial < 200; trial += 1) {
        const arrangement = seededShuffle(scene.events, `order-trial-${trial}`);
        expect(ids(newOrder(arrangement)), `trial ${trial}`).toEqual(ids(legacyOrder(arrangement)));
      }
      // And the order the log is stored in is the order both comparators agree on.
      expect(ids(newOrder(scene.events))).toEqual(ids(scene.events));
    }
  );

  it.each(fixtures)('%s: folds byte-identically from any array arrangement', (_name, scene) => {
    const baseline = JSON.stringify(foldSceneEvents(scene).state);
    for (let trial = 0; trial < 200; trial += 1) {
      const shuffled = withEvents(scene, seededShuffle(scene.events, `fold-trial-${trial}`));
      const folded = foldSceneEvents(shuffled);
      expect(JSON.stringify(folded.state), `trial ${trial}`).toBe(baseline);
      expect(folded.issues).toEqual([]);
    }
  });

  it('pins the folded state of the single-device fixture (behavior, not self-consistency)', () => {
    const { state, issues } = foldSceneEvents(buildSingleDeviceScene());
    expect(issues).toEqual([]);
    // Map key order is part of "byte-identical": tokens are keyed in apply order.
    expect(Object.keys(state.tokens)).toEqual(['hero', 'brute']);
    expect(state.tokens.hero.position).toEqual({ x: 2, y: 2 });
    expect(state.tokens.brute.hp).toEqual({ current: 9, max: 15, temp: 0 });
    expect(state.tokens.brute.conditions).toEqual(['prone']);
    expect(state.tokens.brute.allegiance).toBe('hostile');
    expect(state.markers).toEqual({});
    expect(state.initiative.map((entry) => entry.tokenId)).toEqual(['hero', 'brute']);
    expect(state.checkLog.map((entry) => entry.label)).toEqual(['Perception', 'Stealth']);
    expect(state.oracleLog).toHaveLength(1);
  });
});

describe('CRITICAL: a merged (two-device) log folds byte-identically from any arrangement', () => {
  /**
   * Two devices, both offline, both holding the same 1-event scene. Each mints
   * `sequence: 2` from its own local counter. The events land in the merged
   * array in whatever order the merge produced.
   */
  function buildMergedScene(): { scene: SceneDocument; tiedIds: string[] } {
    let base = createSceneDocument({
      id: 'ordering-merged',
      name: 'Merged',
      systemId: 'dnd-5e-2024',
      grid: { width: 10, height: 10 },
      seed: 'merged-seed',
      now: NOW,
    });
    const seed = resolveSceneAction(
      base,
      {
        type: 'place-token',
        token: { id: 'anchor', name: 'Anchor', kind: 'npc', position: { x: 0, y: 0 }, size: 1 },
      },
      { eventId: '00000000-0000-4000-8000-000000000001', createdAt: NOW }
    );
    base = appendSceneEvent(base, seed.event!);

    const offline = (
      intent: Parameters<typeof resolveSceneAction>[1],
      eventId: string,
      createdAt: Date
    ): SceneEvent => {
      // `sequence: 2` for BOTH: each device computes `scene.events.length + 1`
      // against the same pre-merge log.
      const result = resolveSceneAction(base, intent, { eventId, sequence: 2, createdAt });
      expect(result.issues).toEqual([]);
      return result.event!;
    };

    // Pair 1: same sequence AND the same instant -> only the id can break it.
    const deviceA = offline(
      {
        type: 'place-token',
        token: { id: 'alpha', name: 'Alpha', kind: 'npc', position: { x: 3, y: 3 }, size: 1 },
      },
      'ffffffff-0000-4000-8000-00000000000a',
      NOW
    );
    const deviceB = offline(
      {
        type: 'place-token',
        token: { id: 'bravo', name: 'Bravo', kind: 'npc', position: { x: 6, y: 6 }, size: 1 },
      },
      '11111111-0000-4000-8000-00000000000b',
      NOW
    );
    // Pair 2: same sequence, different instants -> createdAt breaks it, and the
    // later-typed check must land second in `checkLog`.
    const deviceC = offline(
      { type: 'roll-check', label: 'Late', modifier: 0 },
      'aaaaaaaa-0000-4000-8000-00000000000c',
      new Date(NOW.getTime() + 5_000)
    );
    const deviceD = offline(
      { type: 'roll-check', label: 'Early', modifier: 0 },
      'bbbbbbbb-0000-4000-8000-00000000000d',
      new Date(NOW.getTime() + 1_000)
    );

    return {
      scene: withEvents(base, [...base.events, deviceA, deviceB, deviceC, deviceD]),
      tiedIds: [deviceA.id, deviceB.id, deviceC.id, deviceD.id],
    };
  }

  it('the tie is real: sequences collide, so a bare sequence sort is insertion-order dependent', () => {
    const { scene, tiedIds } = buildMergedScene();
    const tied = scene.events.filter((event) => tiedIds.includes(event.id));
    expect(tied).toHaveLength(4);
    expect(new Set(tied.map((event) => event.sequence))).toEqual(new Set([2]));

    // The old comparator, given two different arrangements of the SAME data,
    // yields two different orders. That is the bug, demonstrated.
    const forward = scene.events;
    const reversed = scene.events.slice().reverse();
    expect(ids(legacyOrder(forward))).not.toEqual(ids(legacyOrder(reversed)));
    // The new one does not.
    expect(ids(newOrder(forward))).toEqual(ids(newOrder(reversed)));
  });

  it('folds byte-identically across ALL permutations of the merged event array', () => {
    const { scene } = buildMergedScene();
    const arrangements = permutations(scene.events);
    expect(arrangements).toHaveLength(120); // 5! — exhaustive, not sampled.

    const baseline = JSON.stringify(foldSceneEvents(scene).state);
    for (const [index, arrangement] of arrangements.entries()) {
      const folded = foldSceneEvents(withEvents(scene, arrangement));
      expect(JSON.stringify(folded.state), `permutation ${index}`).toBe(baseline);
    }

    // And the tiebreaks actually decided something observable: token map key
    // order (id tiebreak) and checkLog order (createdAt tiebreak).
    const { state } = foldSceneEvents(scene);
    expect(Object.keys(state.tokens)).toEqual(['anchor', 'bravo', 'alpha']);
    expect(state.checkLog.map((entry) => entry.label)).toEqual(['Early', 'Late']);
  });

  it('reports duplicate sequences as a WARNING and keeps every event', () => {
    const { scene, tiedIds } = buildMergedScene();
    const { state, issues } = foldSceneEvents(scene);

    const duplicates = issues.filter((issue) => issue.code === 'scene-event-sequence-duplicate');
    expect(duplicates).toHaveLength(4);
    // Severity is load-bearing: `foldSceneEvents` SKIPS events whose validation
    // produced an 'error', so reporting a merge collision as an error would
    // delete history to describe it.
    expect(duplicates.every((issue) => issue.severity === 'warning')).toBe(true);
    expect(issues.some((issue) => issue.severity === 'error')).toBe(false);
    expect(new Set(duplicates.map((issue) => issue.eventId))).toEqual(new Set(tiedIds));

    // Nothing was dropped.
    expect(Object.keys(state.tokens).sort()).toEqual(['alpha', 'anchor', 'bravo']);
    expect(state.checkLog).toHaveLength(2);

    // The warning set is itself arrangement-independent.
    const shuffled = foldSceneEvents(withEvents(scene, seededShuffle(scene.events, 'warn')));
    expect(JSON.stringify(shuffled.issues)).toBe(JSON.stringify(issues));
  });

  it('does not renumber sequence — history stays append-only', () => {
    const { scene } = buildMergedScene();
    const before = scene.events.map((event) => ({ id: event.id, sequence: event.sequence }));
    foldSceneEvents(scene);
    expect(scene.events.map((event) => ({ id: event.id, sequence: event.sequence }))).toEqual(
      before
    );
    expect(scene.events.filter((event) => event.sequence === 2)).toHaveLength(4);
  });

  it('a single-device log emits no duplicate-sequence warning', () => {
    expect(foldSceneEvents(buildSingleDeviceScene()).issues).toEqual([]);
    expect(foldSceneEvents(buildEncounterScene()).issues).toEqual([]);
  });
});

describe('encounterBuilder mints every event id from the required factory', () => {
  it('uses the injected factory — there is no count-derived fallback left', () => {
    const scene = createSceneDocument({
      id: 'builder-ids',
      name: 'Builder',
      systemId: 'dnd-5e-2024',
      grid: { width: 8, height: 8 },
      seed: 'builder-seed',
      now: NOW,
    });
    const minted: string[] = [];
    const result = buildEncounterSceneEvents({
      scene,
      monsters: [goblin],
      selections: [{ monsterId: 'goblin', count: 3 }],
      createdAt: NOW,
      seed: 'builder',
      eventIdFactory: () => {
        const id = `factory-${minted.length + 1}`;
        minted.push(id);
        return id;
      },
    });

    expect(result.issues).toEqual([]);
    expect(result.events.length).toBeGreaterThan(0);
    expect(ids(result.events)).toEqual(minted);
    expect(
      result.events.every((event) => event.id.startsWith('factory-')),
      'no id came from a count-derived fallback'
    ).toBe(true);
    expect(new Set(ids(result.events)).size).toBe(result.events.length);
  });
});
