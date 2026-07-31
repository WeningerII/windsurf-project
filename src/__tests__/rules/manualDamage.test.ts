import { describe, it, expect } from 'vitest';

import {
  DAMAGE_TYPES,
  buildManualDamageIntent,
  isDamageType,
  manualDamageFromText,
  parseDamageType,
  parseManualDamage,
  previewManualDamage,
} from '../../rules/resolver/manualDamage';
import { attackToDamageIntent } from '../../rules/resolver/sceneCombat';
import type { AttackResolution } from '../../rules/resolver/attackResolution';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import type {
  SceneActionIntent,
  SceneDocument,
  SceneToken,
  SceneTokenDamage,
} from '../../types/core/scene';

/**
 * The L8 INPUT SURFACE: a human saying "10 fire".
 *
 * Two things are under test, and the second is the one that matters. The first
 * is the parse/validate layer — can a GM express a typed, possibly multi-channel
 * amount, and does bad input fail loudly rather than degrade to untyped. The
 * second is the JOIN: the manual path must produce the byte-identical event the
 * resolved-attack path produces for the same damage, because two mitigation
 * implementations that can disagree is the defect, not the feature. That is
 * asserted directly (`agrees with the resolved-attack bridge`) rather than
 * argued for in a comment.
 *
 * RFC 006 is asserted too: the mitigated number must already be IN the event, so
 * re-folding an untouched log reproduces the same state.
 */

const FIRE_RESISTANT = { resistances: ['fire' as const] };
const FIRE_IMMUNE = { immunities: ['fire' as const] };
const FIRE_VULNERABLE = { vulnerabilities: ['fire' as const] };

function sceneWith(...tokens: Array<Partial<SceneToken> & { id: string }>): SceneDocument {
  const scene = createSceneDocument({
    id: 'scene-1',
    name: 'Test',
    systemId: 'dnd-5e-2014',
    grid: { type: 'square', width: 10, height: 10, cellSize: 5 },
  });
  return tokens.reduce<SceneDocument>(
    (doc, token, index) =>
      apply(
        doc,
        {
          type: 'place-token',
          token: {
            name: token.id,
            kind: 'monster',
            position: { x: index, y: 0 },
            size: 1,
            hp: { current: 20, max: 20, temp: 0 },
            ...token,
          },
        },
        `evt-place-${index}`
      ),
    scene
  );
}

/** Resolve an intent into an event and append it, failing loudly on issues. */
function apply(scene: SceneDocument, intent: SceneActionIntent, eventId: string): SceneDocument {
  const result = resolveSceneAction(scene, intent, {
    eventId,
    createdAt: new Date('2026-01-01T00:00:01Z'),
  });
  if (!result.event) throw new Error(JSON.stringify(result.issues));
  return appendSceneEvent(scene, result.event);
}

function lastDamages(scene: SceneDocument): SceneTokenDamage[] {
  const event = scene.events.at(-1);
  if (event?.type !== 'token.damaged') {
    throw new Error(`expected a token.damaged event, got ${event?.type ?? 'none'}`);
  }
  return event.payload.damages;
}

function hpOf(scene: SceneDocument, tokenId: string): number {
  const { state } = foldSceneEvents(scene);
  return state.tokens[tokenId]?.hp?.current ?? -1;
}

/** Codes only — messages are prose and shouldn't be pinned. */
function codes(issues: { code: string }[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('damage type vocabulary', () => {
  it('is closed, complete, and stably ordered', () => {
    // The Record-keyed table is what the compiler checks; this pins that the
    // list a picker renders actually reaches the runtime.
    expect(DAMAGE_TYPES).toHaveLength(15);
    expect(DAMAGE_TYPES).toContain('fire');
    // Both spellings survive: 5e's lightning/thunder and 3.5e's
    // electricity/sonic are distinct union members that distinct statblocks
    // declare, which is exactly why no alias collapses them.
    expect(DAMAGE_TYPES).toContain('lightning');
    expect(DAMAGE_TYPES).toContain('electricity');
    expect(DAMAGE_TYPES).toContain('thunder');
    expect(DAMAGE_TYPES).toContain('sonic');
  });

  it('normalizes case and surrounding whitespace, and nothing else', () => {
    expect(parseDamageType('fire')).toBe('fire');
    expect(parseDamageType('  FIRE  ')).toBe('fire');
    expect(parseDamageType('Slashing')).toBe('slashing');
  });

  it('refuses near-misses instead of guessing', () => {
    // "elec" could mean either `electricity` or `lightning`, and picking one
    // would silently fail to match every statblock written for the other system.
    expect(parseDamageType('elec')).toBeUndefined();
    expect(parseDamageType('electric')).toBeUndefined();
    expect(parseDamageType('frost')).toBeUndefined();
    expect(parseDamageType('fire!')).toBeUndefined();
    expect(parseDamageType('')).toBeUndefined();
  });

  it('cannot be fooled by inherited object keys', () => {
    expect(isDamageType('constructor')).toBe(false);
    expect(isDamageType('toString')).toBe(false);
    expect(isDamageType('__proto__')).toBe(false);
  });
});

describe('parsing a human damage entry', () => {
  it('reads a bare amount as untyped', () => {
    expect(parseManualDamage('10')).toEqual({ channels: [{ amount: 10 }], issues: [] });
  });

  it('reads "10 fire"', () => {
    expect(parseManualDamage('10 fire').channels).toEqual([{ amount: 10, type: 'fire' }]);
  });

  it('reads multiple channels with either separator', () => {
    expect(parseManualDamage('6 slashing + 4 fire').channels).toEqual([
      { amount: 6, type: 'slashing' },
      { amount: 4, type: 'fire' },
    ]);
    expect(parseManualDamage('4 fire, 6 cold').channels).toEqual([
      { amount: 4, type: 'fire' },
      { amount: 6, type: 'cold' },
    ]);
  });

  it('reads a negative amount as healing and tolerates a leading plus', () => {
    expect(parseManualDamage('-5').channels).toEqual([{ amount: -5 }]);
    expect(parseManualDamage('+5').channels).toEqual([{ amount: 5 }]);
  });

  it('tolerates a trailing "damage"/"dmg"', () => {
    expect(parseManualDamage('10 fire damage').channels).toEqual([{ amount: 10, type: 'fire' }]);
    expect(parseManualDamage('10 dmg').channels).toEqual([{ amount: 10 }]);
  });

  it('is case- and whitespace-insensitive', () => {
    expect(parseManualDamage('  10   FIRE  ').channels).toEqual([{ amount: 10, type: 'fire' }]);
  });

  /**
   * THE SAFETY PROPERTY. An unreadable type must not degrade to untyped: untyped
   * damage is never mitigated, so "10 frost" quietly becoming untyped 10 would
   * bypass the target's cold resistance with nothing in the log to show for it.
   */
  it('rejects an unknown type rather than silently dropping it', () => {
    const parsed = parseManualDamage('10 frost');
    expect(codes(parsed.issues)).toEqual(['scene-manual-damage-type-unknown']);
    expect(parsed.channels).toEqual([]);
    expect(parsed.issues[0].message).toContain('cold');
  });

  it('discards every channel when any one of them fails', () => {
    // Applying the readable half would deal damage the GM did not ask for.
    const parsed = parseManualDamage('6 slashing + 4 frost');
    expect(parsed.channels).toEqual([]);
    expect(parsed.issues).toHaveLength(1);
  });

  it('reports every problem at once', () => {
    expect(codes(parseManualDamage('frost + 4 sonicboom').issues)).toEqual([
      'scene-manual-damage-term-invalid',
      'scene-manual-damage-type-unknown',
    ]);
  });

  it('rejects empty, malformed, and dice input', () => {
    expect(codes(parseManualDamage('').issues)).toEqual(['scene-manual-damage-empty']);
    expect(codes(parseManualDamage('   ').issues)).toEqual(['scene-manual-damage-empty']);
    expect(codes(parseManualDamage('10 fire +').issues)).toEqual([
      'scene-manual-damage-term-empty',
    ]);
    // Dice would need an RNG draw outside buildEventFromIntent, where every
    // other roll in the runtime lives. The human enters the rolled number.
    expect(codes(parseManualDamage('2d6 fire').issues)).toEqual([
      'scene-manual-damage-term-invalid',
    ]);
    expect(codes(parseManualDamage('lots').issues)).toEqual(['scene-manual-damage-term-invalid']);
    expect(codes(parseManualDamage('1.5 fire').issues)).toEqual([
      'scene-manual-damage-term-invalid',
    ]);
  });
});

describe('building a manual damage intent', () => {
  it('emits one entry per target per channel', () => {
    const result = buildManualDamageIntent({
      tokenIds: ['a', 'b'],
      channels: [
        { amount: 6, type: 'slashing' },
        { amount: 4, type: 'fire' },
      ],
      cause: 'Flaming trap',
    });

    expect(result.issues).toEqual([]);
    expect(result.intent).toEqual({
      type: 'apply-damage',
      actorId: undefined,
      cause: 'Flaming trap',
      damages: [
        { tokenId: 'a', amount: 6, type: 'slashing' },
        { tokenId: 'a', amount: 4, type: 'fire' },
        { tokenId: 'b', amount: 6, type: 'slashing' },
        { tokenId: 'b', amount: 4, type: 'fire' },
      ],
    });
  });

  it('omits the type key entirely for untyped damage', () => {
    const result = buildManualDamageIntent({ tokenIds: ['a'], channels: [{ amount: 7 }] });
    const damages = result.intent?.type === 'apply-damage' ? result.intent.damages : [];
    // Byte-identical to the hand-written entries every historical event holds.
    expect(JSON.stringify(damages)).toBe(JSON.stringify([{ tokenId: 'a', amount: 7 }]));
    expect(Object.keys(damages[0])).toEqual(['tokenId', 'amount']);
  });

  it('merges channels that share a type, as the resolver does', () => {
    const result = buildManualDamageIntent({
      tokenIds: ['a'],
      channels: [
        { amount: 3, type: 'fire' },
        { amount: 4, type: 'fire' },
      ],
    });
    expect(result.channels).toEqual([{ type: 'fire', amount: 7 }]);
  });

  it('collapses a duplicated target so it is not hit twice', () => {
    const result = buildManualDamageIntent({
      tokenIds: ['a', 'a', 'b'],
      channels: [{ amount: 5 }],
    });
    const damages = result.intent?.type === 'apply-damage' ? result.intent.damages : [];
    expect(damages.map((damage) => damage.tokenId)).toEqual(['a', 'b']);
  });

  it('drops channels that resolved to zero', () => {
    const result = buildManualDamageIntent({
      tokenIds: ['a'],
      channels: [
        { amount: 0, type: 'fire' },
        { amount: 5, type: 'cold' },
      ],
    });
    expect(result.channels).toEqual([{ type: 'cold', amount: 5 }]);
  });

  it('rejects the inputs a human gets wrong, without throwing', () => {
    expect(
      codes(buildManualDamageIntent({ tokenIds: [], channels: [{ amount: 5 }] }).issues)
    ).toEqual(['scene-manual-damage-target-required']);
    expect(codes(buildManualDamageIntent({ tokenIds: ['a'], channels: [] }).issues)).toEqual([
      'scene-manual-damage-empty',
    ]);
    expect(
      codes(buildManualDamageIntent({ tokenIds: ['a'], channels: [{ amount: 1.5 }] }).issues)
    ).toEqual(['scene-manual-damage-amount-invalid']);
    expect(
      codes(buildManualDamageIntent({ tokenIds: ['a'], channels: [{ amount: Number.NaN }] }).issues)
    ).toEqual(['scene-manual-damage-amount-invalid']);
    expect(
      codes(buildManualDamageIntent({ tokenIds: ['a'], channels: [{ amount: 0 }] }).issues)
    ).toEqual(['scene-manual-damage-amount-required']);
  });

  it('refuses to mix damage and healing in one entry', () => {
    const result = buildManualDamageIntent({
      tokenIds: ['a'],
      channels: [{ amount: 6, type: 'fire' }, { amount: -4 }],
    });
    expect(codes(result.issues)).toContain('scene-manual-damage-mixed-sign');
    expect(result.intent).toBeUndefined();
  });

  it('refuses to type healing', () => {
    // A fire-immune creature is not immune to being healed; mitigation ignores
    // negative amounts, so a typed heal would be a lie recorded in the log.
    const result = buildManualDamageIntent({
      tokenIds: ['a'],
      channels: [{ amount: -5, type: 'fire' }],
    });
    expect(codes(result.issues)).toEqual(['scene-manual-damage-healing-typed']);
  });

  it('carries untyped healing through unchanged', () => {
    const result = buildManualDamageIntent({ tokenIds: ['a'], channels: [{ amount: -5 }] });
    expect(result.channels).toEqual([{ type: undefined, amount: -5 }]);
  });
});

describe('a total apportioned across weighted channels', () => {
  it("uses the resolver's own largest-remainder rule", () => {
    // 10 over weights 3:1 → exact shares 7.5 / 2.5, equal remainders, so the
    // larger weight takes the leftover unit. Identical to what a resolved
    // multi-channel attack would do with the same numbers.
    const result = buildManualDamageIntent({
      tokenIds: ['a'],
      total: 10,
      channels: [
        { amount: 3, type: 'fire' },
        { amount: 1, type: 'cold' },
      ],
    });
    expect(result.channels).toEqual([
      { type: 'fire', amount: 8 },
      { type: 'cold', amount: 2 },
    ]);
  });

  it('always apportions the whole total, never more or less', () => {
    for (let total = 0; total <= 60; total += 1) {
      const result = buildManualDamageIntent({
        tokenIds: ['a'],
        total,
        channels: [{ amount: 7, type: 'fire' }, { amount: 11, type: 'cold' }, { amount: 3 }],
      });
      const sum = result.channels.reduce((acc, channel) => acc + channel.amount, 0);
      expect(sum).toBe(total);
    }
  });

  it('splits evenly when no channel carries a weight', () => {
    const result = buildManualDamageIntent({
      tokenIds: ['a'],
      total: 10,
      channels: [
        { amount: 0, type: 'fire' },
        { amount: 0, type: 'cold' },
      ],
    });
    expect(result.channels).toEqual([
      { type: 'fire', amount: 5 },
      { type: 'cold', amount: 5 },
    ]);
  });

  it('rejects negative weights and a non-integer total', () => {
    expect(
      codes(
        buildManualDamageIntent({
          tokenIds: ['a'],
          total: 10,
          channels: [{ amount: -3, type: 'fire' }, { amount: 1 }],
        }).issues
      )
    ).toEqual(['scene-manual-damage-weight-invalid']);
    expect(
      codes(
        buildManualDamageIntent({ tokenIds: ['a'], total: 1.5, channels: [{ amount: 1 }] }).issues
      )
    ).toEqual(['scene-manual-damage-amount-invalid']);
  });
});

describe('text straight through to an intent', () => {
  it('turns "6 slashing + 4 fire" into an intent', () => {
    const result = manualDamageFromText('6 slashing + 4 fire', { tokenIds: ['a'] });
    expect(result.channels).toEqual([
      { type: 'slashing', amount: 6 },
      { type: 'fire', amount: 4 },
    ]);
  });

  it('reads text amounts as weights when a total is supplied', () => {
    const result = manualDamageFromText('2 fire + 1 cold', { tokenIds: ['a'], total: 22 });
    expect(result.channels).toEqual([
      { type: 'fire', amount: 15 },
      { type: 'cold', amount: 7 },
    ]);
  });

  it('surfaces parse issues without building anything', () => {
    const result = manualDamageFromText('10 frost', { tokenIds: ['a'] });
    expect(result.intent).toBeUndefined();
    expect(codes(result.issues)).toEqual(['scene-manual-damage-type-unknown']);
  });
});

/**
 * The join. Everything above is input handling; this is the part that makes the
 * 394 shipped resistance declarations fire for damage a human typed.
 */
describe('manual damage through the scene runtime', () => {
  it("mitigates typed damage against the target's snapshotted profile", () => {
    const scene = sceneWith({ id: 'tok-1', damageProfile: FIRE_RESISTANT });
    const { intent } = manualDamageFromText('10 fire', { tokenIds: ['tok-1'] });
    const next = apply(scene, intent!, 'evt-dmg');

    expect(lastDamages(next)).toEqual([
      { tokenId: 'tok-1', amount: 5, type: 'fire', mitigation: 'resistant', raw: 10 },
    ]);
    expect(hpOf(next, 'tok-1')).toBe(15);
  });

  it('covers immunity and vulnerability from the same entry', () => {
    const immune = sceneWith({ id: 'tok-1', damageProfile: FIRE_IMMUNE });
    const vulnerable = sceneWith({ id: 'tok-1', damageProfile: FIRE_VULNERABLE });
    const build = (doc: SceneDocument) =>
      apply(doc, manualDamageFromText('10 fire', { tokenIds: ['tok-1'] }).intent!, 'evt-dmg');

    expect(hpOf(build(immune), 'tok-1')).toBe(20);
    expect(hpOf(build(vulnerable), 'tok-1')).toBe(0);
  });

  it('leaves untyped manual damage unmitigated, exactly as before', () => {
    const scene = sceneWith({ id: 'tok-1', damageProfile: FIRE_RESISTANT });
    const next = apply(
      scene,
      manualDamageFromText('10', { tokenIds: ['tok-1'] }).intent!,
      'evt-dmg'
    );

    // No mitigation/raw keys at all: the entry is shaped like every historical one.
    expect(JSON.stringify(lastDamages(next))).toBe(
      JSON.stringify([{ tokenId: 'tok-1', amount: 10 }])
    );
    expect(hpOf(next, 'tok-1')).toBe(10);
  });

  it('mitigates each channel of a multi-channel entry independently', () => {
    const scene = sceneWith({ id: 'tok-1', damageProfile: FIRE_RESISTANT });
    const next = apply(
      scene,
      manualDamageFromText('6 slashing + 4 fire', { tokenIds: ['tok-1'] }).intent!,
      'evt-dmg'
    );

    expect(lastDamages(next)).toEqual([
      { tokenId: 'tok-1', amount: 6, type: 'slashing' },
      { tokenId: 'tok-1', amount: 2, type: 'fire', mitigation: 'resistant', raw: 4 },
    ]);
    // Slashing untouched, fire halved: 20 - 6 - 2.
    expect(hpOf(next, 'tok-1')).toBe(12);
  });

  it('mitigates per target, not per entry', () => {
    const scene = sceneWith(
      { id: 'resistant', damageProfile: FIRE_RESISTANT },
      { id: 'immune', damageProfile: FIRE_IMMUNE },
      { id: 'plain' }
    );
    const next = apply(
      scene,
      manualDamageFromText('10 fire', { tokenIds: ['resistant', 'immune', 'plain'] }).intent!,
      'evt-dmg'
    );

    expect(lastDamages(next).map((damage) => damage.amount)).toEqual([5, 0, 10]);
    expect(hpOf(next, 'resistant')).toBe(15);
    expect(hpOf(next, 'immune')).toBe(20);
    expect(hpOf(next, 'plain')).toBe(10);
  });

  it('heals without mitigating', () => {
    const scene = sceneWith({
      id: 'tok-1',
      damageProfile: FIRE_RESISTANT,
      hp: { current: 4, max: 20, temp: 0 },
    });
    const next = apply(
      scene,
      manualDamageFromText('-6', { tokenIds: ['tok-1'] }).intent!,
      'evt-heal'
    );
    expect(hpOf(next, 'tok-1')).toBe(10);
  });

  /**
   * THE INVARIANT. Mitigation is resolved when the event is BUILT, never in the
   * fold, so a recorded log replays to the same numbers forever — even if the
   * token's profile were edited afterwards.
   */
  it('bakes the mitigated number into the event, so replay is byte-identical', () => {
    const scene = sceneWith({ id: 'tok-1', damageProfile: FIRE_RESISTANT });
    const next = apply(
      scene,
      manualDamageFromText('10 fire', { tokenIds: ['tok-1'] }).intent!,
      'evt-dmg'
    );

    // The number lives on the event...
    expect(lastDamages(next)[0].amount).toBe(5);

    // ...so re-folding is a pure replay of what was recorded.
    const first = foldSceneEvents(next).state;
    const second = foldSceneEvents(next).state;
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));

    // And a log whose token no longer declares the resistance still replays to 5,
    // because nothing on the fold path consults the profile.
    const rewritten: SceneDocument = {
      ...next,
      initialState: {
        ...next.initialState,
        tokens: Object.fromEntries(
          Object.entries(next.initialState.tokens).map(([id, token]) => [
            id,
            { ...token, damageProfile: undefined },
          ])
        ),
      },
    };
    expect(foldSceneEvents(rewritten).state.tokens['tok-1']?.hp?.current).toBe(15);
  });

  /**
   * THE AGREEMENT. Same damage, two entry points, identical event payload —
   * structurally, because both build their entries with the same helper and
   * neither computes mitigation itself.
   */
  it('agrees with the resolved-attack bridge on the identical damage', () => {
    const scene = sceneWith({ id: 'tok-1', damageProfile: FIRE_RESISTANT });

    const resolution = {
      isHit: true,
      damage: 10,
      damageType: 'fire',
      damageChannels: [{ type: 'fire', amount: 10 }],
      damageDiceTerms: [],
      damageBonus: 0,
      ledger: [],
      attackRoll: 15,
      attackTotal: 20,
      isCriticalHit: false,
      isCriticalMiss: false,
    } as unknown as AttackResolution;

    const resolved = apply(scene, attackToDamageIntent('who', 'tok-1', resolution)!, 'evt-a');
    const manual = apply(
      scene,
      manualDamageFromText('10 fire', { tokenIds: ['tok-1'] }).intent!,
      'evt-b'
    );

    expect(lastDamages(manual)).toEqual(lastDamages(resolved));
    expect(hpOf(manual, 'tok-1')).toBe(hpOf(resolved, 'tok-1'));
  });
});

describe('preview', () => {
  it('projects exactly what the event will record', () => {
    const scene = sceneWith({ id: 'resistant', damageProfile: FIRE_RESISTANT }, { id: 'plain' });
    const { state } = foldSceneEvents(scene);
    const { intent, channels } = manualDamageFromText('6 slashing + 4 fire', {
      tokenIds: ['resistant', 'plain'],
    });

    const preview = previewManualDamage(state, ['resistant', 'plain'], channels);
    expect(preview).toEqual([
      {
        tokenId: 'resistant',
        tokenName: 'resistant',
        channels: [
          { type: 'slashing', raw: 6, amount: 6, mitigation: 'none' },
          { type: 'fire', raw: 4, amount: 2, mitigation: 'resistant' },
        ],
        total: 8,
      },
      {
        tokenId: 'plain',
        tokenName: 'plain',
        channels: [
          { type: 'slashing', raw: 6, amount: 6, mitigation: 'none' },
          { type: 'fire', raw: 4, amount: 4, mitigation: 'none' },
        ],
        total: 10,
      },
    ]);

    // The preview is advisory, but it must not be able to drift from the event.
    const applied = apply(scene, intent!, 'evt-dmg');
    expect(lastDamages(applied).map((damage) => damage.amount)).toEqual(
      preview.flatMap((target) => target.channels.map((channel) => channel.amount))
    );
  });

  it('reports an unknown token without throwing', () => {
    const { state } = foldSceneEvents(sceneWith({ id: 'tok-1' }));
    expect(previewManualDamage(state, ['ghost'], [{ type: 'fire', amount: 10 }])).toEqual([
      {
        tokenId: 'ghost',
        tokenName: undefined,
        channels: [{ type: 'fire', raw: 10, amount: 10, mitigation: 'none' }],
        total: 10,
      },
    ]);
  });
});
