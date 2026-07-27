/**
 * The character-draft creation seam (`src/ai/characterDraftSession.ts`): the
 * binding that gives the shipped character-draft flow a reachable entry point.
 *
 * What is asserted is the RFC 002 contract at this seam, not the flow's own
 * behaviour (covered by `characterDraftFlow.test.ts`): the model's ids reach
 * the system's OWN creation plan, the system's OWN validator decides, an
 * invented id never becomes a proposal, and every degraded configuration comes
 * back as a typed failure rather than a throw.
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  draftCharacterForSystem,
  resolveCharacterDraftBinding,
  type CharacterDraftBinding,
} from '../../ai/characterDraftSession';
import type { GatewayCall } from '../../ai/characterDraftFlow';
import type {
  AiResponse,
  CharacterDraftCandidatePools,
  CharacterDraftData,
} from '../../ai/contracts';
import { registerAllSystems } from '../../systems';
import type { GameSystemId } from '../../types/game-systems';

const SYSTEM_ID: GameSystemId = 'dnd-5e-2024';

beforeAll(() => {
  registerAllSystems();
});

/** A gateway stub replaying fixed responses, recording what it was asked. */
function scriptedGateway(responses: AiResponse<CharacterDraftData>[]): {
  call: GatewayCall;
  payloads: Array<Record<string, unknown>>;
} {
  const payloads: Array<Record<string, unknown>> = [];
  let index = 0;
  const call = vi.fn(async (_task: 'character-draft', payload: unknown) => {
    payloads.push(payload as Record<string, unknown>);
    const response = responses[Math.min(index, responses.length - 1)];
    index += 1;
    return response;
  }) as unknown as GatewayCall;
  return { call, payloads };
}

function draftResponse(data: CharacterDraftData): AiResponse<CharacterDraftData> {
  return { ok: true, task: 'character-draft', data, usage: { source: 'fixture' } };
}

describe('character-draft creation seam', () => {
  it('turns a concept into a proposal built by the system’s own creation plan', async () => {
    const binding = await resolveCharacterDraftBinding(SYSTEM_ID);
    expect(binding).toBeDefined();

    // Real loader-derived pools: the ids the model is offered are the ids the
    // system's validator recognizes.
    const { loadCharacterDraftPools } = await import('../../ai/characterDraftPools');
    const pools = await loadCharacterDraftPools(SYSTEM_ID, { limitPerPool: 32 });
    const classId = pools.classes[0]?.id;
    const ancestryId = pools.ancestries[0]?.id;
    expect(classId).toBeTruthy();
    expect(ancestryId).toBeTruthy();

    const { call, payloads } = scriptedGateway([
      draftResponse({
        name: 'Thera Stonehand',
        classId: classId as string,
        ancestryId: ancestryId as string,
        rationale: 'A cautious healer who used to be a soldier.',
      }),
    ]);

    const result = await draftCharacterForSystem(
      { systemId: SYSTEM_ID, prompt: 'a cautious healer who used to be a soldier' },
      { call, loadPools: async () => pools }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // The model was handed the loader-derived pools, not free rein.
    expect(payloads[0]?.pools).toBe(pools);

    // A reviewable proposal: a real document for THIS system, plus the chosen
    // options resolved to names so a surface can show what was proposed.
    expect(result.proposal.document.systemId).toBe(SYSTEM_ID);
    expect(result.proposal.document.name).toBe('Thera Stonehand');
    expect(result.proposal.rationale).toContain('healer');
    expect(result.proposal.choices.map((choice) => choice.id)).toEqual([classId, ancestryId]);
    expect(result.proposal.choices.map((choice) => choice.category)).toEqual([
      'classes',
      'ancestries',
    ]);
    for (const choice of result.proposal.choices) {
      expect(choice.name).not.toBe(choice.id);
    }
    // The class the model picked was applied by the plan, not merely reported.
    expect(result.proposal.choices.find((choice) => choice.id === classId)?.applied).toBe(true);
  });

  it('rejects an id the model invented instead of proposing it', async () => {
    const pools: CharacterDraftCandidatePools = {
      classes: [{ id: 'cleric', name: 'Cleric' }],
      ancestries: [],
      backgrounds: [],
      feats: [],
      spells: [],
    };
    const { call, payloads } = scriptedGateway([
      draftResponse({ name: 'Nobody', classId: 'archmage-supreme' }),
    ]);
    const apply = vi.fn();

    const result = await draftCharacterForSystem(
      { systemId: SYSTEM_ID, prompt: 'something impossible' },
      {
        call,
        loadPools: async () => pools,
        resolveBinding: async (): Promise<CharacterDraftBinding> => ({
          // The applier must never run for an invented id, so a plan that would
          // throw if used is the strongest available assertion.
          plan: {
            systemId: SYSTEM_ID,
            steps: [],
            get any(): never {
              throw new Error('plan consulted for an invented id');
            },
          } as unknown as CharacterDraftBinding['plan'],
          createDefaultData: apply as unknown as () => never,
        }),
      }
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(apply).not.toHaveBeenCalled();
    // Bounded repair: the pool violation was fed back as a machine-readable hint.
    expect(payloads.length).toBeGreaterThan(1);
    expect((payloads[1]?.repairIssues as string[])[0]).toContain('archmage-supreme');
    expect(result.issues?.[0]?.code).toBe('ai-draft-unknown-id');
  });

  it('degrades to a typed failure when the gateway is unconfigured (no key / flag off)', async () => {
    const call = vi.fn(async () => ({
      ok: false as const,
      task: 'character-draft' as const,
      code: 'provider-not-configured',
      message: 'AI features are turned off.',
    })) as unknown as GatewayCall;

    const result = await draftCharacterForSystem(
      { systemId: SYSTEM_ID, prompt: 'anything' },
      {
        call,
        loadPools: async () => ({
          classes: [],
          ancestries: [],
          backgrounds: [],
          feats: [],
          spells: [],
        }),
      }
    );

    expect(result).toEqual({ ok: false, error: 'AI features are turned off.' });
  });

  it('refuses, without throwing, when the system has no creation plan or its catalogs fail', async () => {
    const call = vi.fn() as unknown as GatewayCall;

    const noPlan = await draftCharacterForSystem(
      { systemId: SYSTEM_ID, prompt: 'anything' },
      { call, resolveBinding: async () => undefined }
    );
    expect(noPlan.ok).toBe(false);
    if (!noPlan.ok) expect(noPlan.error).toContain('manually');

    const brokenCatalog = await draftCharacterForSystem(
      { systemId: SYSTEM_ID, prompt: 'anything' },
      {
        call,
        loadPools: async () => {
          throw new Error('catalog unavailable');
        },
      }
    );
    expect(brokenCatalog.ok).toBe(false);
    if (!brokenCatalog.ok) expect(brokenCatalog.error).toContain('manually');

    // Never called: nothing was sent to the model once the deterministic
    // preconditions failed.
    expect(call).not.toHaveBeenCalled();
  });
});
