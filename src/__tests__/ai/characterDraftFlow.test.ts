import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  draftCharacterWithAi,
  type CharacterDraftApplier,
  type DocumentValidator,
  type DraftCharacterParams,
  type GatewayCall,
} from '../../ai/characterDraftFlow';
import { loadCharacterDraftPools } from '../../ai/characterDraftPools';
import type {
  AiResponse,
  CharacterDraftCandidatePools,
  CharacterDraftData,
} from '../../ai/contracts';
import { AI_GATEWAY_SCHEMA_VERSION } from '../../ai/contracts';
import { handleAiRequest } from '../../ai/gatewayCore';
import { systemRegistry } from '../../registry';
import type { ValidationIssue } from '../../registry/types';
import { registerAllSystems } from '../../systems';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import { applyDnd5eClassTemplate } from '../../systems/dnd5e/shared/classTemplate';
import { loadClassesForSystem } from '../../utils/dataLoader';

// The 7 validator-bearing systems (registry.validateDocument 7/7 on main).
const VALIDATOR_SYSTEMS: GameSystemId[] = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

beforeAll(() => {
  registerAllSystems();
});

const EMPTY_POOLS: CharacterDraftCandidatePools = {
  classes: [],
  ancestries: [],
  backgrounds: [],
  feats: [],
  spells: [],
};

/** A gateway stub that replays a fixed sequence of responses and records payloads. */
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

function draftSuccess(data: CharacterDraftData): AiResponse<CharacterDraftData> {
  return { ok: true, task: 'character-draft', data, usage: { source: 'fixture' } };
}

function errorIssue(message: string): ValidationIssue {
  return { code: 'test-invalid', severity: 'error', message };
}

/** Build a default document for a system through the registry's creation factory. */
function buildDefaultDocument(
  systemId: GameSystemId,
  draft: CharacterDraftData
): CharacterDocument<SystemDataModel> {
  const def = systemRegistry.get(systemId);
  if (!def) throw new Error(`No registered system '${systemId}'.`);
  return {
    id: `draft-${systemId}`,
    name: draft.name,
    systemId,
    system: def.createDefaultData(),
    createdAt: new Date('2026-07-01T00:00:00.000Z'),
    updatedAt: new Date('2026-07-01T00:00:00.000Z'),
    version: 1,
  };
}

/** The applier the client injects: default systemData + the drafted name. */
function makeApplier(systemId: GameSystemId): CharacterDraftApplier {
  return (draft) => buildDefaultDocument(systemId, draft);
}

/**
 * The deterministic validator the client injects: the per-system registry
 * validator (routed by `document.systemId`), filtered to blocking (error-severity)
 * issues.
 */
const registryValidator: DocumentValidator = async (document) => {
  const { issues } = await systemRegistry.validateDocument(document, { reason: 'ai-draft' });
  return issues.filter((issue) => issue.severity === 'error');
};

describe('draftCharacterWithAi — draft/validate/apply for all 7 validator systems', () => {
  it.each(VALIDATOR_SYSTEMS)(
    'drafts, validates deterministically, and applies a valid %s character',
    async (systemId) => {
      // Loader-derived candidate pools — the model picks ids from these.
      const pools = await loadCharacterDraftPools(systemId, { limitPerPool: 5 });
      // Draft a real class id when the system offers classes (exercises the
      // in-pool acceptance path of the id gate); otherwise just a name.
      const classId = pools.classes[0]?.id;
      const draft: CharacterDraftData = { name: 'Draft Hero', ...(classId ? { classId } : {}) };

      const { call, payloads } = scriptedGateway([draftSuccess(draft)]);
      const result = await draftCharacterWithAi(
        { systemId, prompt: 'a memorable hero', pools },
        makeApplier(systemId),
        registryValidator,
        { call }
      );

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.document.systemId).toBe(systemId);
        expect(result.document.name).toBe('Draft Hero');
      }
      // A valid first draft needs no repair round-trip.
      expect(payloads).toHaveLength(1);
    }
  );
});

describe('draftCharacterWithAi — deterministic validation drives a bounded repair', () => {
  it('feeds real registry validator errors back and repairs (dnd-5e-2024, level gate)', async () => {
    const systemId: GameSystemId = 'dnd-5e-2024';
    const pools = EMPTY_POOLS;
    const draft: CharacterDraftData = { name: 'Reginald' };
    const { call, payloads } = scriptedGateway([draftSuccess(draft), draftSuccess(draft)]);

    // The first application produces an invalid document (level 0 → the real
    // dnd5e validator emits `dnd5e-invalid-level`); the second is valid.
    let attempt = 0;
    const apply: CharacterDraftApplier = (d) => {
      const doc = buildDefaultDocument(systemId, d);
      if (attempt === 0) (doc.system as { level: number }).level = 0;
      attempt += 1;
      return doc;
    };

    const result = await draftCharacterWithAi(
      { systemId, prompt: 'a knight', pools },
      apply,
      registryValidator,
      { call }
    );

    expect(result.ok).toBe(true);
    expect(payloads).toHaveLength(2);
    // The repair carried the machine-readable validator message (about level).
    expect(payloads[1].repairIssues).toEqual([expect.stringMatching(/level/i)]);
  });

  it('applies the drafted class through the real dnd5e template and validates', async () => {
    const systemId: GameSystemId = 'dnd-5e-2024';
    const classes = await loadClassesForSystem(systemId);
    const chosen = classes[0];
    expect(chosen).toBeDefined();
    const pools = await loadCharacterDraftPools(systemId, { limitPerPool: 5 });

    // Applier threads the drafted class id through the EXISTING template path.
    const apply: CharacterDraftApplier = (draft) => {
      let doc = buildDefaultDocument(systemId, draft);
      const cls = classes.find((c) => c.id === draft.classId);
      if (cls) doc = applyDnd5eClassTemplate(doc as never, cls) as never;
      return doc;
    };

    const { call } = scriptedGateway([draftSuccess({ name: 'Vanguard', classId: chosen.id })]);
    const result = await draftCharacterWithAi(
      { systemId, prompt: 'a frontline fighter', pools },
      apply,
      registryValidator,
      { call }
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      const applied = result.document.system as { classLevels?: unknown[] };
      expect(Array.isArray(applied.classLevels) && applied.classLevels.length).toBeTruthy();
    }
  });

  it('repairs once when a scripted validator rejects then accepts', async () => {
    const draft: CharacterDraftData = { name: 'X' };
    const { call, payloads } = scriptedGateway([draftSuccess(draft), draftSuccess(draft)]);
    const validate = vi
      .fn<DocumentValidator>()
      .mockResolvedValueOnce([errorIssue('ability score out of range')])
      .mockResolvedValueOnce([]);
    const apply: CharacterDraftApplier = (d) => buildDefaultDocument('dnd-5e-2024', d);

    const result = await draftCharacterWithAi(
      { systemId: 'dnd-5e-2024', prompt: 'x', pools: EMPTY_POOLS },
      apply,
      validate,
      { call }
    );

    expect(result.ok).toBe(true);
    expect(payloads[1].repairIssues).toEqual(['ability score out of range']);
  });

  it('gives up after TWO repairs (three attempts) and returns the last issues', async () => {
    const draft: CharacterDraftData = { name: 'X' };
    const { call, payloads } = scriptedGateway([draftSuccess(draft)]);
    const apply: CharacterDraftApplier = (d) => buildDefaultDocument('dnd-5e-2024', d);
    const validate: DocumentValidator = () => [errorIssue('still invalid')];

    const result = await draftCharacterWithAi(
      { systemId: 'dnd-5e-2024', prompt: 'x', pools: EMPTY_POOLS },
      apply,
      validate,
      { call }
    );

    expect(result.ok).toBe(false);
    // 1 initial attempt + the default max of 2 repairs = 3 gateway calls.
    expect(payloads).toHaveLength(3);
    if (!result.ok) {
      expect(result.error).toMatch(/could not produce a valid character/i);
      expect(result.issues).toEqual([errorIssue('still invalid')]);
    }
  });

  it('honors an explicit maxRepairs of 0 (single attempt, no repair)', async () => {
    const { call, payloads } = scriptedGateway([draftSuccess({ name: 'X' })]);
    const apply: CharacterDraftApplier = (d) => buildDefaultDocument('dnd-5e-2024', d);
    const result = await draftCharacterWithAi(
      { systemId: 'dnd-5e-2024', prompt: 'x', pools: EMPTY_POOLS },
      apply,
      () => [errorIssue('nope')],
      { call, maxRepairs: 0 }
    );
    expect(result.ok).toBe(false);
    expect(payloads).toHaveLength(1);
  });
});

describe('draftCharacterWithAi — invented ids are rejected before the validator', () => {
  it('rejects an id outside the offered pool and repairs with a "choose from the list" hint', async () => {
    const pools: CharacterDraftCandidatePools = {
      ...EMPTY_POOLS,
      classes: [{ id: 'fighter', name: 'Fighter' }],
    };
    const { call, payloads } = scriptedGateway([
      draftSuccess({ name: 'X', classId: 'archmage' }), // invented — not in the pool
      draftSuccess({ name: 'X', classId: 'fighter' }),
    ]);
    const apply = vi.fn<CharacterDraftApplier>((d) => buildDefaultDocument('dnd-5e-2024', d));
    const validate = vi.fn<DocumentValidator>(async () => []);

    const result = await draftCharacterWithAi(
      { systemId: 'dnd-5e-2024', prompt: 'x', pools },
      apply,
      validate,
      { call }
    );

    expect(result.ok).toBe(true);
    // The invented id never reached the template/creation path or the validator.
    expect(apply).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledTimes(1);
    expect(payloads[1].repairIssues).toEqual([
      "'archmage' is not one of the offered classes; choose from the list.",
    ]);
  });

  it('rejects an invented feat id from a list field', async () => {
    const pools: CharacterDraftCandidatePools = {
      ...EMPTY_POOLS,
      feats: [{ id: 'tough', name: 'Tough' }],
    };
    const { call, payloads } = scriptedGateway([
      draftSuccess({ name: 'X', featIds: ['tough', 'made-up-feat'] }),
      draftSuccess({ name: 'X', featIds: ['tough'] }),
    ]);
    const result = await draftCharacterWithAi(
      { systemId: 'dnd-5e-2024', prompt: 'x', pools },
      (d) => buildDefaultDocument('dnd-5e-2024', d),
      async () => [],
      { call }
    );
    expect(result.ok).toBe(true);
    expect(payloads[1].repairIssues).toEqual([
      "'made-up-feat' is not one of the offered feats; choose from the list.",
    ]);
  });
});

describe('draftCharacterWithAi — key-less degradation', () => {
  it('passes a provider-not-configured gateway failure straight through to a manual fallback', async () => {
    const call = vi.fn(async () => ({
      ok: false as const,
      task: 'character-draft' as const,
      code: 'provider-not-configured' as const,
      message: 'No AI provider is configured. Use the manual tools instead.',
    })) as unknown as GatewayCall;

    const params: DraftCharacterParams = {
      systemId: 'dnd-5e-2024',
      prompt: 'x',
      pools: EMPTY_POOLS,
    };
    const result = await draftCharacterWithAi(
      params,
      (d) => buildDefaultDocument('dnd-5e-2024', d),
      async () => [],
      { call }
    );

    expect(result).toEqual({
      ok: false,
      error: 'No AI provider is configured. Use the manual tools instead.',
    });
    // Exactly one attempt: a gateway failure is not retried as a repair.
    expect(call).toHaveBeenCalledTimes(1);
  });

  it('the gateway core degrades character-draft to provider-not-configured with no adapter or fixture', async () => {
    const response = await handleAiRequest(
      {
        schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
        task: 'character-draft',
        payload: {
          systemId: 'dnd-5e-2024',
          prompt: 'x',
          pools: EMPTY_POOLS,
        },
      },
      {} // no adapter, no fixture — the default (key-less) posture
    );
    expect(response).toMatchObject({
      ok: false,
      code: 'provider-not-configured',
      task: 'character-draft',
    });
  });
});
