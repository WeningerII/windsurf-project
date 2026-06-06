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

/** A gateway that returns each spec in turn (repeating the last) — one per round. */
function gatewaySequence(specs: unknown[]): { fetch: ReturnType<typeof vi.fn>; timeoutMs: number } {
  let call = 0;
  const fetch = vi.fn<FetchLike>(async () => {
    const spec = specs[Math.min(call, specs.length - 1)];
    call += 1;
    return { ok: true, status: 200, json: async () => ({ spec }) };
  });
  return { timeoutMs: 0, fetch };
}

const DH_TRAITS = {
  finesse: 2,
  agility: 1,
  knowledge: 1,
  instinct: 0,
  presence: 0,
  strength: -1,
};

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

  it('exposes an options manifest for every one of the seven systems', async () => {
    const systems = [
      'dnd-5e-2014',
      'dnd-5e-2024',
      'dnd-3.5e',
      'pf1e',
      'pf2e',
      'mam3e',
      'daggerheart',
    ] as const;
    for (const systemId of systems) {
      expect(hasOptionsManifest(systemId), `${systemId} manifest`).toBe(true);
      expect(await buildOptionsManifest(systemId), `${systemId} manifest`).toBeTruthy();
    }
  });
});

describe('createCharacterWithAi — validate-and-repair loop', () => {
  it('re-prompts with the unresolved pick, then uses the corrected build', async () => {
    const gateway = gatewaySequence([
      // Round 1: a class that doesn't exist — silently falls back without repair.
      { name: 'Batman', selections: { class: 'Vigilante', heritage: 'Human', traits: DH_TRAITS } },
      // Round 2 (repair): a real class.
      { name: 'Batman', selections: { class: 'Rogue', heritage: 'Human', traits: DH_TRAITS } },
    ]);

    const result = await createCharacterWithAi('daggerheart', 'Batman', { gateway });

    expect(result.ok).toBe(true);
    expect((result.document.system as DaggerheartDataModel).class).toBe('Rogue');
    // Two gateway calls: the initial draft + one repair round.
    expect(gateway.fetch).toHaveBeenCalledTimes(2);
    const repairBody = JSON.parse(gateway.fetch.mock.calls[1][1].body as string);
    expect(repairBody.repair.previousSelections.class).toBe('Vigilante');
    expect(repairBody.repair.issues.join(' ')).toContain('Vigilante');
  });

  it('does not repair when the first build is already clean', async () => {
    const gateway = gatewaySequence([
      { name: 'Vell', selections: { class: 'Rogue', heritage: 'Human', traits: DH_TRAITS } },
    ]);
    const result = await createCharacterWithAi('daggerheart', 'a rogue', { gateway });
    expect(result.ok).toBe(true);
    expect(gateway.fetch).toHaveBeenCalledTimes(1); // no repair round
  });

  it('stops after the round budget and returns the best (legal) result', async () => {
    // The model never picks a valid class; the loop gives up and keeps the
    // legal deterministic fallback (Bard), having spent 1 draft + 2 repairs.
    const gateway = gatewaySequence([
      { name: 'Batman', selections: { class: 'Vigilante', heritage: 'Human', traits: DH_TRAITS } },
    ]);
    const result = await createCharacterWithAi('daggerheart', 'Batman', {
      gateway,
      maxRepairRounds: 2,
    });
    expect(result.ok).toBe(true); // still a legal sheet
    expect((result.document.system as DaggerheartDataModel).class).toBe('Bard'); // fallback
    expect(gateway.fetch).toHaveBeenCalledTimes(3); // 1 draft + 2 repair rounds
  });
});

describe('createCharacterWithAi — M&M 3e', () => {
  it('builds a PL-legal hero for the authored power level and archetype', async () => {
    const result = await createCharacterWithAi('mam3e', 'a cunning mastermind', {
      gateway: gatewayReturning({
        name: 'The Director',
        selections: { powerLevel: 12, archetype: 'mastermind' },
      }),
    });

    expect(result.ok).toBe(true);
    expect(result.document.name).toBe('The Director');
    const system = result.document.system as {
      powerLevel: number;
      powerPoints: { total: number; spent: Record<string, number> };
      abilities: Record<string, number>;
      plViolations?: unknown[];
    };
    expect(system.powerLevel).toBe(12);
    expect(system.powerPoints.total).toBe(180); // 15 × PL
    // The archetype led with mental abilities, and the build broke no PL cap.
    expect(system.abilities.int).toBeGreaterThan(system.abilities.str);
    expect(system.plViolations ?? []).toEqual([]);
    const spent = Object.values(system.powerPoints.spent).reduce((a, b) => a + b, 0);
    expect(spent).toBeLessThanOrEqual(system.powerPoints.total);
  });
});

describe('createCharacterWithAi — D&D 5e "Batman"', () => {
  it('builds the LLM-authored Rogue with the chosen abilities, validated', async () => {
    const result = await createCharacterWithAi('dnd-5e-2014', 'Batman', {
      gateway: gatewayReturning({
        name: 'Batman',
        level: 3,
        selections: {
          class: 'Rogue',
          species: 'Human',
          abilities: { dex: 15, con: 14, wis: 13, int: 12, cha: 10, str: 8 },
        },
      }),
    });

    expect(result.ok).toBe(true);
    expect(result.document.name).toBe('Batman');
    const system = result.document.system as {
      classLevels: Array<{ classId: string }>;
      level: number;
      baseAttributes: Record<string, number>;
    };
    expect(system.classLevels[0].classId).toBe('rogue'); // authored, not keyword Bard-equivalent
    expect(system.level).toBe(3);
    expect(system.baseAttributes.dex).toBeGreaterThanOrEqual(15); // array 15 + racial
  });

  it("fills a caster's spell list from the model's chosen spell names", async () => {
    const result = await createCharacterWithAi('dnd-5e-2024', 'a fire wizard', {
      gateway: gatewayReturning({
        name: 'Pyra',
        level: 1,
        selections: {
          class: 'Wizard',
          species: 'Elf',
          abilities: { int: 15, con: 14, dex: 13, wis: 12, cha: 10, str: 8 },
          spells: ['Fire Bolt', 'Burning Hands', 'Mage Armor', 'Magic Missile'],
        },
      }),
    });

    expect(result.ok).toBe(true);
    const known = (result.document.system as { spellcasting?: { spellsKnown: string[] } })
      .spellcasting?.spellsKnown;
    expect(known).toContain('fire-bolt'); // resolved from "Fire Bolt"
    expect(known).toContain('burning-hands');
  });
});

describe('createCharacterWithAi — Pathfinder 2e "Batman"', () => {
  it('builds the LLM-authored class/ancestry/background and free boosts, validated', async () => {
    const result = await createCharacterWithAi('pf2e', 'Batman', {
      gateway: gatewayReturning({
        name: 'Batman',
        level: 1,
        selections: {
          class: 'Rogue',
          ancestry: 'Human',
          background: 'Criminal',
          freeBoosts: ['dex', 'con', 'wis', 'int'],
        },
      }),
    });

    expect(result.ok).toBe(true);
    expect(result.document.name).toBe('Batman');
    const system = result.document.system as {
      classId?: string;
      ancestryId?: string;
      backgroundId?: string;
      baseAttributes: Record<string, number>;
    };
    expect(system.classId).toBe('rogue');
    expect(system.ancestryId).toBe('human');
    expect(system.backgroundId).toBe('pf2e-bg-criminal');
    // Dex got the class key-ability boost plus a free boost.
    expect(system.baseAttributes.dex).toBeGreaterThanOrEqual(14);
  });
});

describe.each(['pf1e', 'dnd-3.5e'] as const)('createCharacterWithAi — %s "Batman"', (systemId) => {
  it('builds the LLM-authored class/race/abilities, validated', async () => {
    const result = await createCharacterWithAi(systemId, 'Batman', {
      gateway: gatewayReturning({
        name: 'Batman',
        level: 2,
        selections: {
          class: 'Rogue',
          race: 'Human',
          abilities: { dex: 15, con: 14, wis: 13, int: 12, cha: 10, str: 8 },
        },
      }),
    });

    expect(result.ok).toBe(true);
    expect(result.document.name).toBe('Batman');
    const system = result.document.system as {
      classLevels: Array<{ classId: string }>;
      speciesId?: string;
      baseAttributes: Record<string, number>;
    };
    expect(system.classLevels[0].classId).toBe('rogue');
    expect(system.speciesId).toBe('human');
    expect(system.baseAttributes.dex).toBeGreaterThanOrEqual(15);
  });
});
