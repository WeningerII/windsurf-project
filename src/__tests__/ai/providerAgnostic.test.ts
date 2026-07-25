/**
 * Provider-agnosticism guarantees (lane p5, D-AI).
 *
 * The gateway's provider is configuration, not a hardcoded dependency. These
 * tests pin the properties that must hold *whichever* provider is configured,
 * by running the SAME gateway core against two differently-identified adapters
 * and asserting the outcome is decided by the gateway, never by the provider:
 *
 *  - key-less degradation is a property of the seam, not of one provider;
 *  - the session cost cap and the whole-flow cap both survive a provider swap
 *    (a swap must not buy extra budget);
 *  - RFC 002 holds for every provider — output is a draft, re-validated by the
 *    deterministic validator, and a lying adapter is rejected regardless of id;
 *  - no provider path privileges any of the seven systems.
 *
 * No network, no SDK, no key: the adapters here are plain objects satisfying
 * `AiProviderAdapter`, which is exactly what a real adapter is to the core.
 */
import { describe, expect, it } from 'vitest';
import {
  AI_GATEWAY_SCHEMA_VERSION,
  type AiResponse,
  type AiTask,
  type AiTokenUsage,
} from '../../ai/contracts';
import {
  handleAiRequest,
  type AiProviderAdapter,
  type SessionBudget,
  type SessionBudgetVerdict,
} from '../../ai/gatewayCore';
import { createFlowBudget, type AnyTaskGatewayCall } from '../../ai/flowBudget';
import type { GameSystemId } from '../../types/game-systems';

const ALL_SEVEN: readonly GameSystemId[] = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

function encounterRequest(systemId: GameSystemId = 'pf2e') {
  return {
    schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
    task: 'encounter-draft' as const,
    payload: {
      systemId,
      partyLevels: [3, 3],
      difficulty: 'moderate',
      prompt: 'goblins',
      candidates: [{ id: 'goblin', name: 'Goblin' }],
    },
  };
}

/**
 * A canned adapter standing in for one configured provider. `id`/`model` are the
 * only things that differ between "providers" as far as the core is concerned —
 * which is the point: swapping them must change provenance and nothing else.
 */
function cannedAdapter(
  id: string,
  model: string,
  output: unknown = { selections: [{ monsterId: 'goblin', count: 1 }] },
  tokens?: AiTokenUsage
): AiProviderAdapter & { calls: () => number } {
  let calls = 0;
  return {
    id,
    model,
    calls: () => calls,
    generate: (_task, _payload, reportUsage) => {
      calls += 1;
      if (tokens) reportUsage?.(tokens);
      return Promise.resolve(output);
    },
  };
}

/** A session budget with the gateway's charge-then-check semantics. */
function sessionBudget(maxUnits: number): SessionBudget & { spent: () => number } {
  let spent = 0;
  return {
    spent: () => spent,
    charge: (_key: string, units: number): SessionBudgetVerdict => {
      spent += units;
      return { ok: spent <= maxUnits, remainingUnits: Math.max(0, maxUnits - spent), resetAt: 0 };
    },
  };
}

describe('provider-agnosticism — the seam decides, not the provider', () => {
  it('key-less degradation: no adapter configured => provider-not-configured, for any provider', async () => {
    // This is the shape the registry produces for EVERY real provider when its
    // key is absent (see gatewayHardening.registry.test.mts): `adapter:
    // undefined`. The core's answer must not depend on which provider was
    // selected, because at this point no provider exists at all.
    const res = await handleAiRequest(encounterRequest(), {});
    expect(res).toMatchObject({
      ok: false,
      code: 'provider-not-configured',
      task: 'encounter-draft',
    });
    // And the failure is typed and returned — never thrown — so callers degrade
    // to the deterministic manual tools rather than crashing.
    expect(res.ok).toBe(false);
  });

  it('stamps provenance from whichever provider served, and nothing else changes', async () => {
    const a = cannedAdapter('google', 'gemini-test');
    const b = cannedAdapter('anthropic', 'claude-test');

    const viaA = await handleAiRequest(encounterRequest(), { adapter: a });
    const viaB = await handleAiRequest(encounterRequest(), { adapter: b });

    expect(viaA).toMatchObject({
      ok: true,
      data: { selections: [{ monsterId: 'goblin', count: 1 }] },
      usage: { source: 'provider', provider: 'google', model: 'gemini-test' },
    });
    expect(viaB).toMatchObject({
      ok: true,
      data: { selections: [{ monsterId: 'goblin', count: 1 }] },
      usage: { source: 'provider', provider: 'anthropic', model: 'claude-test' },
    });
    // Same validated payload from both: the provider changes provenance only.
    expect((viaA as { data: unknown }).data).toEqual((viaB as { data: unknown }).data);
  });

  it('re-validates output for every provider — a lying adapter is rejected regardless of id', async () => {
    // RFC 002: the model proposes, the deterministic validator decides. An
    // adapter that returns a creature id nobody offered, or a malformed
    // envelope, is refused whichever provider it claims to be.
    for (const id of ['google', 'anthropic', 'some-future-provider']) {
      const liar = cannedAdapter(id, 'any-model', { selections: 'not-an-array' });
      const res = await handleAiRequest(encounterRequest(), { adapter: liar });
      expect(res).toMatchObject({ ok: false, code: 'invalid-provider-output' });
    }
  });

  it('reports token usage through the seam when a provider supplies it, and omits it otherwise', async () => {
    const reporting = cannedAdapter('anthropic', 'claude-test', undefined, {
      inputTokens: 120,
      outputTokens: 34,
      totalTokens: 154,
    });
    const silent = cannedAdapter('google', 'gemini-test');

    const withTokens = await handleAiRequest(encounterRequest(), { adapter: reporting });
    const withoutTokens = await handleAiRequest(encounterRequest(), { adapter: silent });

    expect(withTokens).toMatchObject({
      ok: true,
      usage: { tokens: { inputTokens: 120, outputTokens: 34, totalTokens: 154 } },
    });
    expect((withoutTokens as { usage: { tokens?: unknown } }).usage.tokens).toBeUndefined();
  });

  it('drops junk token figures rather than surfacing them', async () => {
    const junk = cannedAdapter('anthropic', 'claude-test', undefined, {
      inputTokens: Number.NaN,
      outputTokens: -5,
    });
    const res = await handleAiRequest(encounterRequest(), { adapter: junk });
    expect((res as { usage: { tokens?: unknown } }).usage.tokens).toBeUndefined();
  });
});

describe('provider-agnosticism — cost caps survive a provider swap', () => {
  it('charges the session cap identically for both providers, and a swap buys no extra budget', async () => {
    // Cap of 2 units; encounter-draft costs 1 unit. Two calls fit, the third
    // trips — and switching provider mid-stream does NOT reset the meter.
    const budget = sessionBudget(2);
    const a = cannedAdapter('google', 'gemini-test');
    const b = cannedAdapter('anthropic', 'claude-test');
    const ctx = (adapter: AiProviderAdapter) => ({
      adapter,
      sessionBudget: budget,
      sessionKey: 'user-1',
    });

    expect((await handleAiRequest(encounterRequest(), ctx(a))).ok).toBe(true);
    expect((await handleAiRequest(encounterRequest(), ctx(b))).ok).toBe(true);

    // Third call, on the *other* provider again: the cap is already used up.
    const third = await handleAiRequest(encounterRequest(), ctx(a));
    expect(third).toMatchObject({ ok: false, code: 'budget-exceeded', task: 'encounter-draft' });
    // The denial happened BEFORE the provider call: neither adapter ran a third time.
    expect(a.calls() + b.calls()).toBe(2);
  });

  it('meters a whole flow across a mid-flow provider swap with one shared budget', async () => {
    // The flow-level cap (`flowBudget.ts`) is denominated in the gateway's own
    // per-task units, so it is provider-independent by construction. Prove the
    // meter counts calls made through two different providers as one flow.
    const a = cannedAdapter('google', 'gemini-test');
    const b = cannedAdapter('anthropic', 'claude-test');
    const flow = createFlowBudget({ maxUnits: 2, maxCalls: 2 });

    const callVia =
      (adapter: AiProviderAdapter): AnyTaskGatewayCall =>
      <TData>(task: AiTask, payload: unknown) =>
        handleAiRequest(
          { schemaVersion: AI_GATEWAY_SCHEMA_VERSION, task, payload },
          { adapter }
        ) as Promise<AiResponse<TData>>;

    const meteredA = flow.meter(callVia(a));
    const meteredB = flow.meter(callVia(b));
    const payload = encounterRequest().payload;

    expect((await meteredA('encounter-draft', payload)).ok).toBe(true);
    expect((await meteredB('encounter-draft', payload)).ok).toBe(true);
    // Third call on either wrapper is refused by the SHARED meter.
    expect(await meteredA('encounter-draft', payload)).toMatchObject({
      ok: false,
      code: 'budget-exceeded',
    });

    const report = flow.report();
    expect(report).toMatchObject({ callsDelivered: 2, callsDenied: 1, exceeded: true });
    expect(a.calls() + b.calls()).toBe(2);
  });
});

describe('provider-agnosticism — all-seven neutrality', () => {
  it('serves every system identically through either provider, privileging none', async () => {
    const a = cannedAdapter('google', 'gemini-test');
    const b = cannedAdapter('anthropic', 'claude-test');

    for (const systemId of ALL_SEVEN) {
      const viaA = await handleAiRequest(encounterRequest(systemId), { adapter: a });
      const viaB = await handleAiRequest(encounterRequest(systemId), { adapter: b });
      expect(viaA.ok).toBe(true);
      expect(viaB.ok).toBe(true);
      expect((viaA as { data: unknown }).data).toEqual((viaB as { data: unknown }).data);
    }
    // Every system reached the provider — none was short-circuited or special-cased.
    expect(a.calls()).toBe(ALL_SEVEN.length);
    expect(b.calls()).toBe(ALL_SEVEN.length);
  });
});
