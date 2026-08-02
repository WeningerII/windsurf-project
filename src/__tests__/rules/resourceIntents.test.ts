/**
 * The RFC 005 intent resolver — the deterministic decision layer a UI stepper
 * and an AI-DM proposal both reach.
 *
 * The pool primitive clamps in BOTH directions, which is right for a stepper and
 * wrong for a proposal: a clamped over-spend is indistinguishable from a spend
 * that happened, so an AI-DM could narrate a slot the caster does not have.
 * These pin the asymmetry the resolver adds on top — refuse what would create
 * resources from nothing, clamp what cannot.
 */
import { resolveResourceIntent } from '../../rules/resources/resolveResourceIntent';
import type { ResourceIntent, ResourcePoolList } from '../../rules/resources/types';

function list(spent: number, max: number): ResourcePoolList {
  return {
    systemId: 'test-system',
    pools: [{ id: 'test:pool', kind: 'test', label: 'Test Pool', pool: { max, spent } }],
  };
}

describe('resolveResourceIntent', () => {
  it('refuses an unknown pool id and names the system', () => {
    const outcome = resolveResourceIntent(list(0, 3), { poolId: 'test:missing', verb: 'spend' });

    expect(outcome).toEqual({
      ok: false,
      code: 'unknown-pool',
      reason: "test-system has no resource pool 'test:missing'",
    });
  });

  it('spends the whole remainder but refuses one past it', () => {
    const pools = list(1, 3);

    const toTheLimit = resolveResourceIntent(pools, {
      poolId: 'test:pool',
      verb: 'spend',
      amount: 2,
    });
    const pastIt = resolveResourceIntent(pools, {
      poolId: 'test:pool',
      verb: 'spend',
      amount: 3,
    });

    expect(toTheLimit).toEqual({
      ok: true,
      poolId: 'test:pool',
      pool: { max: 3, spent: 3 },
      delta: 2,
    });
    expect(pastIt).toMatchObject({ ok: false, code: 'insufficient' });
    // The refusal must quote the real numbers — an AI-DM re-proposing needs to
    // know how much it CAN spend.
    expect(pastIt).toMatchObject({ reason: 'Test Pool: 2 remaining, 3 requested' });
  });

  it('refuses a fractional amount instead of truncating it', () => {
    // clampCount would turn 1.5 into 1 and report success. A caller that meant
    // 1.5 has a bug this layer must surface, not launder.
    const outcome = resolveResourceIntent(list(0, 3), {
      poolId: 'test:pool',
      verb: 'spend',
      amount: 1.5,
    });

    expect(outcome).toMatchObject({ ok: false, code: 'invalid-amount' });
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'refuses the non-positive-integer amount %p',
    (amount) => {
      const outcome = resolveResourceIntent(list(1, 3), {
        poolId: 'test:pool',
        verb: 'spend',
        amount,
      });

      expect(outcome).toMatchObject({ ok: false, code: 'invalid-amount' });
    }
  );

  it('clamps an over-restore and reports what actually moved', () => {
    // The other direction is NOT refused: "recover 1d4 Stress" with 1 marked is
    // a legal move. `delta` is the only place the real effect is knowable.
    const outcome = resolveResourceIntent(list(1, 3), {
      poolId: 'test:pool',
      verb: 'restore',
      amount: 3,
    });

    expect(outcome).toEqual({
      ok: true,
      poolId: 'test:pool',
      pool: { max: 3, spent: 0 },
      delta: 1,
    });
  });

  it('resets to full and reports the whole prior spend as the delta', () => {
    const outcome = resolveResourceIntent(list(2, 3), { poolId: 'test:pool', verb: 'reset' });

    expect(outcome).toEqual({
      ok: true,
      poolId: 'test:pool',
      pool: { max: 3, spent: 0 },
      delta: 2,
    });
  });

  it('signals depletion on consume only, never on spend', () => {
    const emptying = list(2, 3);

    const consumed = resolveResourceIntent(emptying, { poolId: 'test:pool', verb: 'consume' });
    const spent = resolveResourceIntent(emptying, { poolId: 'test:pool', verb: 'spend' });

    expect(consumed).toEqual({
      ok: true,
      poolId: 'test:pool',
      pool: { max: 3, spent: 3 },
      delta: 1,
      depleted: true,
    });
    // RFC 005 keeps `depleted` OFF spend so the common case — a spell slot,
    // refilled on rest — never carries a signal it must ignore.
    expect(spent).not.toHaveProperty('depleted');
  });

  it('refuses a verb outside RFC 005 instead of falling off the switch', () => {
    // The typed union makes this unreachable from TS, but the caller this seam
    // exists for is UNTYPED: an AI-DM proposal is model-generated JSON, so
    // `verb` is an arbitrary string until this layer rules on it. Without a
    // default branch the resolver returns `undefined` and the registry throws
    // `Cannot read properties of undefined (reading 'ok')` one frame up.
    const outcome = resolveResourceIntent(list(0, 3), {
      poolId: 'test:pool',
      verb: 'heal',
    } as unknown as ResourceIntent);

    expect(outcome).toEqual({
      ok: false,
      code: 'unsupported-verb',
      reason: "Unsupported resource verb 'heal'",
    });
  });

  it('reports a consume that leaves charges as not depleted', () => {
    const outcome = resolveResourceIntent(list(0, 3), {
      poolId: 'test:pool',
      verb: 'consume',
      amount: 2,
    });

    expect(outcome).toMatchObject({ depleted: false, delta: 2 });
  });
});
