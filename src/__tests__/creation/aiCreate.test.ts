import { describe, it, expect, beforeAll, vi } from 'vitest';
import { registerAllSystems } from '../../systems';
import '../../creation'; // side-effect: registers the per-system creators
import { createCharacterWithAi } from '../../creation/aiCreate';
import { buildOptionsManifest, hasOptionsManifest } from '../../creation/optionsManifest';
import type { DaggerheartDataModel } from '../../systems/daggerheart/data-model';
import type { FetchLike } from '../../rules/ai/llmNarration';

beforeAll(() => {
  registerAllSystems();
});

function gatewayReturning(spec: unknown): { fetch: FetchLike; timeoutMs: number } {
  return {
    timeoutMs: 0,
    fetch: vi.fn<FetchLike>(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ spec }),
    })),
  };
}

function gatewayUnconfigured(): { fetch: ReturnType<typeof vi.fn>; timeoutMs: number } {
  return {
    timeoutMs: 0,
    fetch: vi.fn(async () => ({ ok: false, status: 503, json: async () => ({}) })),
  };
}

describe('createCharacterWithAi — Daggerheart "Batman"', () => {
  it('builds the LLM-authored selections (stealthy Rogue named Batman), validated by the rules', async () => {
    // The model authors a real build against the manifest: Batman = a finesse
    // Rogue, not the keyword fallback's Bard.
    const spec = {
      name: 'Batman',
      level: 1,
      selections: {
        class: 'Rogue',
        heritage: 'Human',
        traits: {
          finesse: 2,
          agility: 1,
          knowledge: 1,
          instinct: 0,
          presence: 0,
          strength: -1,
        },
        experiences: ['Vigilante', "World's Greatest Detective"],
      },
    };

    const result = await createCharacterWithAi('daggerheart', 'Batman', {
      gateway: gatewayReturning(spec),
    });

    expect(result.ok).toBe(true);
    const system = result.document.system as DaggerheartDataModel;
    expect(result.document.name).toBe('Batman');
    expect(system.class).toBe('Rogue'); // authored, not the Bard fallback
    expect(system.attributes.finesse).toBe(2); // authored finesse-lead
    expect(system.experiences).toContain('Vigilante');
    // Still rules-legal: the trait array is the fixed level-1 set.
    expect([...Object.values(system.attributes)].sort((a, b) => b - a)).toEqual([
      2, 1, 1, 0, 0, -1,
    ]);
  });

  it('falls back to deterministic creation when the gateway is unconfigured (503)', async () => {
    const result = await createCharacterWithAi('daggerheart', 'Batman', {
      gateway: gatewayUnconfigured(),
    });
    // Deterministic "Batman" => the keyword fallback (Bard). Complete + legal,
    // just not clever — exactly the gap the LLM path fills.
    expect(result.ok).toBe(true);
    expect((result.document.system as DaggerheartDataModel).class).toBe('Bard');
  });

  it('skips the gateway entirely for systems without a manifest yet', async () => {
    const gateway = gatewayUnconfigured();
    const result = await createCharacterWithAi('mam3e', 'a brawler', { gateway });
    expect(result.ok).toBe(true);
    expect(gateway.fetch).not.toHaveBeenCalled(); // no manifest => no LLM call
  });

  it('exposes a manifest for daggerheart but not (yet) for mam3e', () => {
    expect(hasOptionsManifest('daggerheart')).toBe(true);
    expect(buildOptionsManifest('daggerheart')).toBeTruthy();
    expect(buildOptionsManifest('mam3e')).toBeUndefined();
  });
});
