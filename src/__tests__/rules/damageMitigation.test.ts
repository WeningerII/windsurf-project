import { describe, expect, it } from 'vitest';
import {
  applyDamageMitigation,
  mitigateDamage,
  resolveDamageMitigation,
  snapshotDamageProfile,
  type DamageProfile,
} from '../../rules/resolver/damageMitigation';
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
 * L8 typed-damage mitigation (`docs/WORK_PLAN.md` §3.2).
 *
 * The gap this closes was never missing data. `Monster` has declared
 * `damageResistances`, `damageImmunities` and `damageVulnerabilities` since the
 * type was written and the shipped catalogs populate them 395 times, but until
 * this landed the only references to those three fields outside `src/data/` and
 * the tests were their own declarations — nothing read them, so a fire elemental
 * took full fire damage on the grid.
 */

const FIRE_ELEMENTAL: DamageProfile = {
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['fire', 'poison'],
};

describe('resolveDamageMitigation', () => {
  it('classifies immunity, resistance, vulnerability and no match', () => {
    expect(resolveDamageMitigation(FIRE_ELEMENTAL, 'fire')).toBe('immune');
    expect(resolveDamageMitigation(FIRE_ELEMENTAL, 'slashing')).toBe('resistant');
    expect(resolveDamageMitigation({ vulnerabilities: ['cold'] }, 'cold')).toBe('vulnerable');
    expect(resolveDamageMitigation(FIRE_ELEMENTAL, 'radiant')).toBe('none');
  });

  it('lets immunity win over every other declaration', () => {
    const contradictory: DamageProfile = {
      immunities: ['fire'],
      resistances: ['fire'],
      vulnerabilities: ['fire'],
    };
    expect(resolveDamageMitigation(contradictory, 'fire')).toBe('immune');
  });

  it('nets resistance and vulnerability to no change, per the SRD ordering rule', () => {
    // The SRD does not state this case directly. It states that "resistance and
    // then vulnerability are applied after all other modifiers" — halve, then
    // double — which is the original amount. Derived, not invented.
    const both: DamageProfile = { resistances: ['cold'], vulnerabilities: ['cold'] };
    expect(resolveDamageMitigation(both, 'cold')).toBe('none');
    expect(mitigateDamage(9, both, 'cold').amount).toBe(9);
  });

  it('never mitigates untyped damage, which is what keeps historical events replaying identically', () => {
    expect(resolveDamageMitigation(FIRE_ELEMENTAL, undefined)).toBe('none');
    expect(mitigateDamage(10, FIRE_ELEMENTAL, undefined).amount).toBe(10);
  });

  it('treats an absent profile as taking everything at face value', () => {
    expect(resolveDamageMitigation(undefined, 'fire')).toBe('none');
  });
});

describe('applyDamageMitigation', () => {
  it('zeroes immune damage, halves resistant (rounding down), doubles vulnerable', () => {
    expect(applyDamageMitigation(7, 'immune')).toBe(0);
    expect(applyDamageMitigation(7, 'resistant')).toBe(3);
    expect(applyDamageMitigation(7, 'vulnerable')).toBe(14);
    expect(applyDamageMitigation(7, 'none')).toBe(7);
  });

  it('leaves HEALING untouched under every branch', () => {
    // A fire-immune creature is not immune to being healed. `SceneTokenDamage`
    // uses a signed amount where negative is healing, so this is the single most
    // likely place for a sign bug to hide.
    for (const branch of ['immune', 'resistant', 'vulnerable', 'none'] as const) {
      expect(applyDamageMitigation(-6, branch)).toBe(-6);
    }
  });

  it('leaves zero and non-finite amounts alone rather than inventing a number', () => {
    expect(applyDamageMitigation(0, 'vulnerable')).toBe(0);
    expect(applyDamageMitigation(Number.NaN, 'immune')).toBeNaN();
  });
});

describe('snapshotDamageProfile', () => {
  it('returns undefined when the creature declares nothing', () => {
    expect(snapshotDamageProfile({})).toBeUndefined();
    expect(snapshotDamageProfile({ damageResistances: [] })).toBeUndefined();
  });

  it('copies the arrays instead of aliasing the SRD catalog into the scene', () => {
    const statblock = { damageImmunities: ['fire' as const] };
    const profile = snapshotDamageProfile(statblock);
    profile?.immunities?.push('cold');
    expect(statblock.damageImmunities).toEqual(['fire']);
  });
});

/**
 * The integration half. These assert the property the whole design exists to
 * protect: mitigation is resolved when the event is BUILT, never in the fold, so
 * RFC 006's byte-identical replay still holds.
 */
describe('typed damage through the scene runtime', () => {
  function sceneWithToken(token: Partial<SceneToken>): SceneDocument {
    const scene = createSceneDocument({
      id: 'scene-1',
      name: 'Test',
      systemId: 'dnd-5e-2014',
      grid: { type: 'square', width: 10, height: 10, cellSize: 5 },
    });
    return apply(
      scene,
      {
        type: 'place-token',
        token: {
          id: 'tok-1',
          name: 'Elemental',
          kind: 'monster',
          position: { x: 0, y: 0 },
          size: 1,
          hp: { current: 20, max: 20, temp: 0 },
          ...token,
        },
      },
      'evt-place'
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

  function damage(scene: SceneDocument, amount: number, type?: 'fire' | 'slashing'): SceneDocument {
    return apply(
      scene,
      { type: 'apply-damage', damages: [{ tokenId: 'tok-1', amount, ...(type ? { type } : {}) }] },
      'evt-dmg'
    );
  }

  /** The single damage entry on the scene's last event, narrowed by event type. */
  function lastDamage(scene: SceneDocument): SceneTokenDamage {
    const event = scene.events.at(-1);
    if (event?.type !== 'token.damaged') {
      throw new Error(`expected a token.damaged event, got ${event?.type ?? 'none'}`);
    }
    return event.payload.damages[0];
  }

  it('bakes the mitigated amount into the event, not into the fold', () => {
    const scene = sceneWithToken({ damageProfile: FIRE_ELEMENTAL });
    const next = damage(scene, 10, 'fire');

    const applied = lastDamage(next);

    // The EVENT carries the resolved number plus its provenance...
    expect(applied).toMatchObject({ amount: 0, raw: 10, type: 'fire', mitigation: 'immune' });

    // ...and the fold simply applies it. Immune → no HP lost.
    expect(foldSceneEvents(next).state.tokens['tok-1'].hp).toMatchObject({ current: 20 });
  });

  it('halves resistant damage and leaves an unmatched type at full', () => {
    const scene = sceneWithToken({ damageProfile: FIRE_ELEMENTAL });

    expect(foldSceneEvents(damage(scene, 9, 'slashing')).state.tokens['tok-1'].hp).toMatchObject(
      { current: 16 } // 9 halved to 4
    );
  });

  it('replays a pre-existing untyped event to the identical number', () => {
    // The regression that would matter most: every event recorded before damage
    // types existed is untyped, and must be unaffected by the token now carrying
    // a profile that would otherwise zero it.
    const scene = sceneWithToken({ damageProfile: FIRE_ELEMENTAL });
    const next = damage(scene, 10);

    const applied = lastDamage(next);
    expect(applied).toEqual({ tokenId: 'tok-1', amount: 10 });
    expect(applied).not.toHaveProperty('mitigation');

    expect(foldSceneEvents(next).state.tokens['tok-1'].hp).toMatchObject({ current: 10 });
  });

  it('leaves a token with no profile taking every type at face value', () => {
    const scene = sceneWithToken({});
    expect(foldSceneEvents(damage(scene, 10, 'fire')).state.tokens['tok-1'].hp).toMatchObject({
      current: 10,
    });
  });
});
