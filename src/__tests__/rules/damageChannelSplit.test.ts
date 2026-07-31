import { describe, it, expect } from 'vitest';

import {
  collectDamageChannels,
  splitDamageAcrossChannels,
  type DamageChannel,
} from '../../rules/resolver/damageChannelSplit';
import { resolveAttack } from '../../rules/resolver/attackResolution';
import { attackToDamageIntent } from '../../rules/resolver/sceneCombat';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import { createSeededRng } from '../../scene/seededRng';
import type { EffectInstance } from '../../rules/ir/types';
import type { DamageType } from '../../types/core/common';
import type { SceneDocument, SceneToken } from '../../types/core/scene';

/**
 * WORK_PLAN §3.2 decision B1 — the multi-channel damage split.
 *
 * The rule under test: largest-remainder distribution over channel proportions,
 * ties broken toward the larger weight and then toward declaration order. The
 * post-condition — parts sum EXACTLY to the whole — is the one that matters, so
 * it is checked as a property across a wide input space rather than only on the
 * hand-picked cases, and the module asserts it internally as well.
 */

const SID = 'dnd-5e-2014' as const;

/** Deterministic PRNG for the property sweep — seeded, so a failure reproduces. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TYPES: DamageType[] = ['slashing', 'fire', 'cold', 'acid', 'necrotic', 'thunder'];

const channelsOfWeights = (...weights: number[]): DamageChannel[] =>
  weights.map((weight, index) => ({ type: TYPES[index % TYPES.length], weight }));

const amounts = (parts: Array<{ amount: number }>): number[] => parts.map((part) => part.amount);

const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0);

describe('splitDamageAcrossChannels — the post-condition', () => {
  it('parts sum exactly to the whole, across many totals and weight vectors', () => {
    const random = mulberry32(20260731);
    let cases = 0;

    for (let trial = 0; trial < 4000; trial += 1) {
      const channelCount = 1 + Math.floor(random() * 6);
      const weights = Array.from({ length: channelCount }, () =>
        // Deliberately includes 0: a channel that rolled nothing must not be able
        // to collect a rounding unit off one that did.
        Math.floor(random() * 30)
      );
      const total = Math.floor(random() * 500);

      const parts = splitDamageAcrossChannels(total, channelsOfWeights(...weights));

      expect(parts).toHaveLength(channelCount);
      expect(sum(amounts(parts))).toBe(total);
      cases += 1;
    }

    expect(cases).toBe(4000);
  });

  it('holds for every total 0..120 against a fixed awkward weight vector', () => {
    // 7/11/3 shares almost nothing with base 10, so most totals land on a
    // three-way fractional split and exercise the leftover loop every time.
    const channels = channelsOfWeights(7, 11, 3);
    for (let total = 0; total <= 120; total += 1) {
      const parts = splitDamageAcrossChannels(total, channels);
      expect(sum(amounts(parts))).toBe(total);
      // Nothing negative, nothing exceeding the whole.
      for (const part of parts) {
        expect(part.amount).toBeGreaterThanOrEqual(0);
        expect(part.amount).toBeLessThanOrEqual(total);
      }
    }
  });

  it('preserves the sum for a negative total (healing shares the signed field)', () => {
    for (const total of [-1, -7, -13, -100]) {
      const parts = splitDamageAcrossChannels(total, channelsOfWeights(2, 1));
      expect(sum(amounts(parts))).toBe(total);
    }
  });

  it('never distributes a unit to a zero-weight channel', () => {
    // 7 over weights 1/1/0: the leftover must land on the two real channels.
    const parts = splitDamageAcrossChannels(7, channelsOfWeights(1, 1, 0));
    expect(amounts(parts)).toEqual([4, 3, 0]);
  });

  it('rejects a non-integer total rather than silently rounding', () => {
    expect(() => splitDamageAcrossChannels(7.5, channelsOfWeights(1, 1))).toThrow(
      /finite integer/
    );
    expect(() => splitDamageAcrossChannels(Number.NaN, channelsOfWeights(1, 1))).toThrow(
      /finite integer/
    );
  });
});

describe('splitDamageAcrossChannels — degenerate shapes', () => {
  it('a total of 0 gives every channel 0', () => {
    expect(amounts(splitDamageAcrossChannels(0, channelsOfWeights(3, 1, 1)))).toEqual([0, 0, 0]);
    expect(amounts(splitDamageAcrossChannels(0, channelsOfWeights(5)))).toEqual([0]);
  });

  it('a single channel takes the whole total, remainder rule or not', () => {
    expect(amounts(splitDamageAcrossChannels(13, channelsOfWeights(4)))).toEqual([13]);
    expect(amounts(splitDamageAcrossChannels(1, channelsOfWeights(999)))).toEqual([1]);
    expect(splitDamageAcrossChannels(13, [{ type: 'fire', weight: 4 }])).toEqual([
      { type: 'fire', amount: 13 },
    ]);
  });

  it('refuses to split a non-zero total across zero channels rather than destroying it', () => {
    // This case previously returned [] — sum 0 against a total of 10 — which is
    // the transform silently destroying damage while its own docstring promised
    // the parts always sum to the whole. The early return sat BEFORE the
    // post-condition, so the self-check could not see it. Every call site guards
    // on channels.length > 0, so nothing leaked in practice; the point is that
    // the guarantee now lives in the transform that advertises it.
    expect(() => splitDamageAcrossChannels(10, [])).toThrow(/zero channels/);
    expect(() => splitDamageAcrossChannels(-4, [])).toThrow(/zero channels/);

    // A zero total across zero channels is genuinely nothing to do, and is
    // still total-preserving: sum 0 === total 0.
    expect(splitDamageAcrossChannels(0, [])).toEqual([]);
  });

  it('all-zero weights fall back to an even split rather than dividing by zero', () => {
    const parts = splitDamageAcrossChannels(7, channelsOfWeights(0, 0, 0));
    expect(sum(amounts(parts))).toBe(7);
    expect(amounts(parts)).toEqual([3, 2, 2]);
  });
});

describe('splitDamageAcrossChannels — tie-breaking', () => {
  it('equal remainders break toward the LARGER weight', () => {
    // 6 over 3:1 -> exact shares 4.5 and 1.5. Identical remainders; the biggest
    // channel absorbs the leftover unit.
    expect(amounts(splitDamageAcrossChannels(6, channelsOfWeights(3, 1)))).toEqual([5, 1]);
  });

  it('the larger weight wins the tie regardless of where it is declared', () => {
    // The mirror image of the case above: same weights, opposite order. The unit
    // must follow the WEIGHT, not the position.
    expect(amounts(splitDamageAcrossChannels(6, channelsOfWeights(1, 3)))).toEqual([1, 5]);
  });

  it('equal remainders AND equal weights break toward the earlier declared channel', () => {
    // 3 over 1:1 -> 1.5 each. Nothing distinguishes the channels except order.
    expect(amounts(splitDamageAcrossChannels(3, channelsOfWeights(1, 1)))).toEqual([2, 1]);
    // 4 over 1:1:1 -> one leftover unit, to the first.
    expect(amounts(splitDamageAcrossChannels(4, channelsOfWeights(1, 1, 1)))).toEqual([2, 1, 1]);
    // 5 over 1:1:1 -> two leftover units, to the first two.
    expect(amounts(splitDamageAcrossChannels(5, channelsOfWeights(1, 1, 1)))).toEqual([2, 2, 1]);
  });

  it('a larger remainder beats a larger weight — remainder is the primary key', () => {
    // 10 over 5:2:3 -> exact 5, 2, 3, no leftover.
    expect(amounts(splitDamageAcrossChannels(10, channelsOfWeights(5, 2, 3)))).toEqual([5, 2, 3]);
    // 11 over 5:2:3 -> 5.5 / 2.2 / 3.3. The single leftover goes to the .5, which
    // here IS the biggest channel.
    expect(amounts(splitDamageAcrossChannels(11, channelsOfWeights(5, 2, 3)))).toEqual([6, 2, 3]);
    // 7 over 6:1:1 -> 5.25 / 0.875 / 0.875. The leftover goes to a SMALL channel,
    // because .875 beats .25 — the big channel does not simply hoover up slack.
    expect(amounts(splitDamageAcrossChannels(7, channelsOfWeights(6, 1, 1)))).toEqual([5, 1, 1]);
  });

  it('tie-breaking does not depend on object key enumeration', () => {
    // Same channels, built by two different routes: an array literal and a
    // reversed-then-reversed copy. Declaration order is the only key that may
    // matter, and it is identical here, so the outputs must be identical.
    const declared: DamageChannel[] = [
      { type: 'fire', weight: 4 },
      { type: 'cold', weight: 4 },
    ];
    const rebuilt = [...declared].reverse().reverse();
    expect(splitDamageAcrossChannels(9, declared)).toEqual(splitDamageAcrossChannels(9, rebuilt));
    expect(splitDamageAcrossChannels(9, declared)).toEqual([
      { type: 'fire', amount: 5 },
      { type: 'cold', amount: 4 },
    ]);
  });
});

describe('splitDamageAcrossChannels — determinism', () => {
  it('the same input twice yields identical output', () => {
    const channels = channelsOfWeights(7, 11, 3, 1);
    const first = splitDamageAcrossChannels(97, channels);
    const second = splitDamageAcrossChannels(97, channels);

    expect(second).toEqual(first);
    // Structural equality is not enough for a replay guarantee: the serialized
    // form is what a scene document actually stores.
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });

  it('is stable across many repeated evaluations of the same input', () => {
    const channels = channelsOfWeights(5, 5, 2, 2, 1);
    const expected = JSON.stringify(splitDamageAcrossChannels(43, channels));
    for (let repeat = 0; repeat < 50; repeat += 1) {
      expect(JSON.stringify(splitDamageAcrossChannels(43, channels))).toBe(expected);
    }
  });

  it('does not mutate the channels it was handed', () => {
    const channels: DamageChannel[] = [
      { type: 'fire', weight: 3 },
      { type: 'cold', weight: 1 },
    ];
    const before = JSON.stringify(channels);
    splitDamageAcrossChannels(6, channels);
    expect(JSON.stringify(channels)).toBe(before);
  });
});

describe('collectDamageChannels', () => {
  it('reads typed channels in first-seen order and merges every untyped one', () => {
    expect(
      collectDamageChannels({
        'damage.slashing': { total: 6 },
        damage: { total: 2 },
        'damage.fire': { total: 4 },
      })
    ).toEqual([
      { type: 'slashing', weight: 6 },
      { type: undefined, weight: 2 },
      { type: 'fire', weight: 4 },
    ]);
  });

  it('drops channels that resolved to nothing', () => {
    expect(
      collectDamageChannels({
        'damage.fire': { total: 0 },
        'damage.cold': { total: 5 },
        'damage.acid': { total: -3 },
      })
    ).toEqual([{ type: 'cold', weight: 5 }]);
  });
});

// ─── The reason the rule exists: mitigation per channel, on the grid ──────────

const flat = (target: string, value: number): EffectInstance => ({
  id: `${target}:${value}`,
  systemId: SID,
  target,
  operation: 'add',
  value,
  stackPolicy: 'sum',
  source: { kind: 'item', label: 'flame tongue' },
  label: target,
});

const die = (target: string, sides: number, id: string): EffectInstance => ({
  id,
  systemId: SID,
  target,
  operation: 'add-die',
  value: sides,
  stackPolicy: 'sum',
  source: { kind: 'item', label: 'flame tongue' },
  label: id,
});

function token(id: string, hp: number, damageProfile?: SceneToken['damageProfile']): SceneToken {
  return {
    id,
    name: id,
    kind: 'monster',
    position: { x: 1, y: 1 },
    size: 1,
    hp: { current: hp, max: hp, temp: 0 },
    ...(damageProfile ? { damageProfile } : {}),
  };
}

function sceneWith(...tokens: SceneToken[]): SceneDocument {
  let scene = createSceneDocument({ id: 'c', name: 'C', systemId: SID, seed: 'fixed-seed' });
  for (const placed of tokens) {
    const resolved = resolveSceneAction(
      scene,
      { type: 'place-token', token: placed },
      { eventId: `place-${placed.id}` }
    );
    scene = appendSceneEvent(scene, resolved.event!);
  }
  return scene;
}

function currentHp(scene: SceneDocument, id: string): number {
  return foldSceneEvents(scene).state.tokens[id].hp!.current;
}

/**
 * A flame tongue: 6 slashing + 4 fire, flat so the arithmetic is exact.
 *
 * Seed chosen to roll neither a natural 1 (which auto-misses regardless of the
 * target value) nor anything else that would make the test about the attack roll
 * instead of the split.
 */
const flameTongue = () =>
  resolveAttack({
    attackEffects: [],
    damageEffects: [flat('damage.slashing', 6), flat('damage.fire', 4)],
    targetValue: 0,
    rng: createSeededRng('blade'),
  });

describe('multi-channel damage reaching the grid', () => {
  it('splits a two-channel hit into one typed entry per channel', () => {
    const resolution = flameTongue();
    expect(resolution.isHit).toBe(true);
    expect(resolution.damage).toBe(10);
    // No single type honestly describes this hit, so the scalar type stays absent…
    expect(resolution.damageType).toBeUndefined();
    // …and the breakdown carries it instead.
    expect(resolution.damageChannels).toEqual([
      { type: 'slashing', amount: 6 },
      { type: 'fire', amount: 4 },
    ]);

    const intent = attackToDamageIntent('hero', 'target', resolution, 'flame tongue');
    expect(intent).toBeDefined();
    expect(intent).toMatchObject({
      type: 'apply-damage',
      damages: [
        { tokenId: 'target', amount: 6, type: 'slashing' },
        { tokenId: 'target', amount: 4, type: 'fire' },
      ],
    });
  });

  it('mitigates each channel independently — resistance, immunity, vulnerability', () => {
    let scene = sceneWith(
      token('plain', 60),
      token('resistant', 60, { resistances: ['fire'] }),
      token('immune', 60, { immunities: ['fire'] }),
      token('vulnerable', 60, { vulnerabilities: ['fire'] })
    );

    for (const id of ['plain', 'resistant', 'immune', 'vulnerable']) {
      const intent = attackToDamageIntent('hero', id, flameTongue(), 'flame tongue')!;
      const resolved = resolveSceneAction(scene, intent, { eventId: `hit-${id}` });
      expect(resolved.issues.filter((issue) => issue.severity === 'error')).toHaveLength(0);
      scene = appendSceneEvent(scene, resolved.event!);
    }

    // The slashing 6 is untouched every time; only the fire 4 moves. Halved,
    // zeroed and doubled respectively — the existing L8 semantics, applied to a
    // channel instead of to the whole hit.
    expect(60 - currentHp(scene, 'plain')).toBe(10); // 6 + 4
    expect(60 - currentHp(scene, 'resistant')).toBe(8); // 6 + floor(4/2)
    expect(60 - currentHp(scene, 'immune')).toBe(6); // 6 + 0
    expect(60 - currentHp(scene, 'vulnerable')).toBe(14); // 6 + 4*2
  });

  it('records provenance per channel so the log explains its own numbers', () => {
    let scene = sceneWith(token('resistant', 60, { resistances: ['fire'] }));
    const intent = attackToDamageIntent('hero', 'resistant', flameTongue())!;
    scene = appendSceneEvent(
      scene,
      resolveSceneAction(scene, intent, { eventId: 'hit' }).event!
    );

    const damaged = scene.events.find((event) => event.type === 'token.damaged')!;
    const entries = (
      damaged.payload as {
        damages: Array<{ amount: number; type?: string; mitigation?: string; raw?: number }>;
      }
    ).damages;

    expect(entries).toHaveLength(2);
    // The untouched channel keeps the plain shape — no mitigation noise.
    expect(entries[0]).toEqual({ tokenId: 'resistant', amount: 6, type: 'slashing' });
    expect(entries[1]).toMatchObject({ amount: 2, type: 'fire', mitigation: 'resistant', raw: 4 });
  });

  it('a single-channel attack keeps the original one-entry shape exactly', () => {
    const resolution = resolveAttack({
      attackEffects: [],
      damageEffects: [flat('damage.fire', 10)],
      targetValue: 0,
      rng: createSeededRng('burn'),
    });
    expect(resolution.damageType).toBe('fire');
    expect(attackToDamageIntent('hero', 'orc', resolution)!.damages).toEqual([
      { tokenId: 'orc', amount: 10, type: 'fire' },
    ]);
  });

  it('an untyped attack still resolves untyped, and so stays unmitigated', () => {
    const resolution = resolveAttack({
      attackEffects: [],
      damageEffects: [flat('damage', 9)],
      targetValue: 0,
      rng: createSeededRng('club'),
    });
    expect(resolution.damageType).toBeUndefined();
    expect(resolution.damageChannels).toEqual([{ type: undefined, amount: 9 }]);
    expect(attackToDamageIntent('hero', 'orc', resolution)!.damages).toEqual([
      { tokenId: 'orc', amount: 9, type: undefined },
    ]);
  });

  it('keeps untyped damage separate from typed damage in a mixed hit', () => {
    // 5 typed fire + 5 untyped. A fire-immune target must still take the untyped
    // half: the untyped points are not fire, and mitigation has no claim on them.
    const mixed = () =>
      resolveAttack({
        attackEffects: [],
        damageEffects: [flat('damage.fire', 5), flat('damage', 5)],
        targetValue: 0,
        rng: createSeededRng('mixed'),
      });
    expect(mixed().damage).toBe(10);
    expect(mixed().damageChannels).toEqual([
      { type: 'fire', amount: 5 },
      { type: undefined, amount: 5 },
    ]);

    let scene = sceneWith(token('immune', 40, { immunities: ['fire'] }));
    scene = appendSceneEvent(
      scene,
      resolveSceneAction(scene, attackToDamageIntent('hero', 'immune', mixed())!, {
        eventId: 'mixed',
      }).event!
    );
    expect(40 - currentHp(scene, 'immune')).toBe(5);
  });

  it('the resolver split always sums to the damage it reports, across seeds and crits', () => {
    // Dice and crits are where the split earns its keep: a 5e crit re-adds the
    // dice to the scalar total AFTER the channels are known, so the parts have to
    // be re-derived proportionally and must still reconcile.
    for (let seed = 0; seed < 300; seed += 1) {
      const resolution = resolveAttack({
        attackEffects: [],
        damageEffects: [
          die('damage.slashing', 8, 'sword'),
          flat('damage.slashing', 3),
          die('damage.fire', 6, 'flame'),
          flat('damage', 1),
        ],
        targetValue: 0,
        rng: createSeededRng(`crit-sweep-${seed}`),
      });
      if (!resolution.isHit) continue;
      expect(sum(amounts(resolution.damageChannels!))).toBe(resolution.damage);

      // And the intent it produces distributes exactly that much HP, no more.
      const intent = attackToDamageIntent('hero', 'orc', resolution);
      if (!intent || intent.type !== 'apply-damage') continue;
      expect(sum(intent.damages.map((damage) => damage.amount))).toBe(resolution.damage);
    }
  });
});
