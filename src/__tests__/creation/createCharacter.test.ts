import { describe, it, expect, beforeAll } from 'vitest';
import { registerAllSystems } from '../../systems';
import { createCharacterFromPrompt, hasCreator } from '../../creation';
import type { DaggerheartDataModel } from '../../systems/daggerheart/data-model';
import type { Pf2eDataModel } from '../../systems/pf2e/data-model';
import type { Mam3eDataModel } from '../../systems/mam3e/data-model';
import type { GameSystemId } from '../../types/game-systems';
import type { CharacterDocument } from '../../types/core/document';

const ALL_SYSTEMS: GameSystemId[] = [
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

const LEVEL_ONE_ARRAY = [2, 1, 1, 0, 0, -1];

function traitValues(doc: CharacterDocument<DaggerheartDataModel>): number[] {
  const a = doc.system.attributes;
  return [a.agility, a.strength, a.finesse, a.instinct, a.presence, a.knowledge];
}

describe('createCharacterFromPrompt — Daggerheart', () => {
  it('turns a prompt into a finished, derived, error-free sheet', async () => {
    const result = await createCharacterFromPrompt({
      systemId: 'daggerheart',
      prompt: 'a clever wizard scholar named Kara',
    });

    expect(result.ok).toBe(true);
    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);

    const system = result.document.system as DaggerheartDataModel;
    // Core build choices are filled in from the catalog.
    expect(system.class).toBeTruthy();
    expect(system.subclass).toBeTruthy();
    expect(system.heritage).toBeTruthy();
    expect(system.community).toBeTruthy();

    // Level-1 traits are the fixed array, and the prompt's "wizard/clever/scholar"
    // hints put the +2 on Knowledge.
    expect([...traitValues(result.document)].sort((a, b) => b - a)).toEqual(LEVEL_ONE_ARRAY);
    expect(system.attributes.knowledge).toBe(2);

    // The name came from the prompt.
    expect(result.document.name).toBe('Kara');

    // The engine derived combat stats (HP/Evasion/thresholds are no longer zero).
    expect(system.hitPoints.max).toBeGreaterThan(0);
    expect(system.evasion).toBeGreaterThan(0);

    // Starting loadout came from the class domains and is within the cap.
    expect(system.domainCards.length).toBeGreaterThan(0);
    expect(system.domainCards.length).toBeLessThanOrEqual(5);
  });

  it('reads an explicit level from the prompt', async () => {
    const result = await createCharacterFromPrompt({
      systemId: 'daggerheart',
      prompt: 'a mighty guardian at level 3',
    });

    expect(result.ok).toBe(true);
    expect(result.document.system.level).toBe(3);
    expect((result.document.system as DaggerheartDataModel).attributes.strength).toBe(2);
  });

  it('still produces a complete sheet from a vague prompt (deterministic fallback)', async () => {
    const result = await createCharacterFromPrompt({
      systemId: 'daggerheart',
      prompt: 'someone cool',
    });

    expect(result.ok).toBe(true);
    const system = result.document.system as DaggerheartDataModel;
    expect(system.class).toBeTruthy();
    expect([...traitValues(result.document)].sort((a, b) => b - a)).toEqual(LEVEL_ONE_ARRAY);
  });

  it('is deterministic — the same prompt yields the same build', async () => {
    const prompt = 'a sneaky rogue named Vell';
    const a = await createCharacterFromPrompt({ systemId: 'daggerheart', prompt });
    const b = await createCharacterFromPrompt({ systemId: 'daggerheart', prompt });

    // Ignore the generated id/timestamps; the build itself must match.
    expect(b.document.system).toEqual(a.document.system);
    expect(b.document.name).toBe(a.document.name);
  });

  it('registers a creator for daggerheart', () => {
    expect(hasCreator('daggerheart')).toBe(true);
  });
});

describe('createCharacterFromPrompt — Pathfinder 2e', () => {
  it('turns a prompt into a finished, derived, error-free sheet', async () => {
    const result = await createCharacterFromPrompt({
      systemId: 'pf2e',
      prompt: 'a wizard elf scholar',
    });

    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(result.ok).toBe(true);

    const system = result.document.system as Pf2eDataModel;
    expect(system.classId).toBeTruthy();
    expect(system.ancestryId).toBeTruthy();
    expect(system.backgroundId).toBeTruthy();
    // The engine derived combat stats.
    expect(system.hitPoints.max).toBeGreaterThan(0);
    expect(system.armorClass).toBeGreaterThan(0);
    // The class key-ability boost + a free boost land on the key ability.
    expect(system.keyAbility).toBeTruthy();
    expect(system.baseAttributes[system.keyAbility!]).toBeGreaterThanOrEqual(14);
    // The four free level-1 boosts spread across distinct abilities, none over 18.
    const scores = Object.values(system.baseAttributes);
    expect(scores.filter((score) => score >= 12).length).toBeGreaterThanOrEqual(4);
    expect(Math.max(...scores)).toBeLessThanOrEqual(18);
  });

  it('honors an explicit level from the prompt', async () => {
    const result = await createCharacterFromPrompt({
      systemId: 'pf2e',
      prompt: 'a fighter at level 5',
    });
    expect(result.ok).toBe(true);
    expect(result.document.system.level).toBe(5);
  });

  it('registers a creator for pf2e', () => {
    expect(hasCreator('pf2e')).toBe(true);
  });
});

describe.each([
  ['dnd-5e-2014' as const, 'a stealthy rogue halfling'],
  ['dnd-5e-2024' as const, 'a wise cleric of the mountain'],
])('createCharacterFromPrompt — %s', (systemId, prompt) => {
  it('turns a prompt into a finished, derived, error-free sheet', async () => {
    const result = await createCharacterFromPrompt({ systemId, prompt });

    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(result.ok).toBe(true);

    const system = result.document.system;
    expect(system.classLevels.length).toBeGreaterThan(0);
    expect(system.speciesId).toBeTruthy();
    expect(system.hitPoints.max).toBeGreaterThan(0);
    // The standard array put a 15+ on the class's primary ability.
    const topScore = Math.max(...Object.values(system.baseAttributes));
    expect(topScore).toBeGreaterThanOrEqual(15);
  });

  it('honors an explicit level', async () => {
    const result = await createCharacterFromPrompt({ systemId, prompt, level: 4 });
    expect(result.ok).toBe(true);
    expect(result.document.system.level).toBe(4);
    expect(result.document.system.classLevels[0].level).toBe(4);
  });

  it('registers a creator', () => {
    expect(hasCreator(systemId)).toBe(true);
  });
});

describe('createCharacterFromPrompt — Mutants & Masterminds 3e', () => {
  it('turns a prompt into a finished, legal sheet within budget and caps', async () => {
    const result = await createCharacterFromPrompt({
      systemId: 'mam3e',
      prompt: 'a powerful brawler',
    });

    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(result.ok).toBe(true);

    const system = result.document.system as Mam3eDataModel;
    // Standard starting Power Level and its 15 × PL budget.
    expect(system.powerLevel).toBe(10);
    expect(system.powerPoints.total).toBe(150);
    // No PL trait-cap violations, and spending is within budget.
    expect(system.plViolations ?? []).toEqual([]);
    const spent = Object.values(system.powerPoints.spent).reduce((a, b) => a + b, 0);
    expect(spent).toBeLessThanOrEqual(system.powerPoints.total);
    // It has a signature power.
    expect(system.powers.length).toBeGreaterThan(0);
  });

  it('reads an explicit power level from the prompt', async () => {
    const result = await createCharacterFromPrompt({
      systemId: 'mam3e',
      prompt: 'a street-level vigilante at PL 6',
    });
    expect(result.ok).toBe(true);
    expect(result.document.system.powerLevel).toBe(6);
    expect(result.document.system.powerPoints.total).toBe(90);
  });

  it('registers a creator for mam3e', () => {
    expect(hasCreator('mam3e')).toBe(true);
  });
});

describe('createCharacterFromPrompt — all seven systems', () => {
  it('produces an error-free, derived sheet for every system from one prompt', async () => {
    for (const systemId of ALL_SYSTEMS) {
      const result = await createCharacterFromPrompt({
        systemId,
        prompt: 'a brave hero named Aria',
      });
      const errors = result.issues.filter((issue) => issue.severity === 'error');
      expect(errors, `${systemId} should have no validator errors`).toEqual([]);
      expect(result.ok, `${systemId} should be ok`).toBe(true);
      expect(result.document.name).toBeTruthy();
      expect(hasCreator(systemId)).toBe(true);
    }
  });
});

describe.each([
  ['pf1e' as const, 'a tough fighter dwarf'],
  ['dnd-3.5e' as const, 'a clever wizard elf'],
])('createCharacterFromPrompt — %s', (systemId, prompt) => {
  it('turns a prompt into a finished, derived, error-free sheet', async () => {
    const result = await createCharacterFromPrompt({ systemId, prompt });

    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(result.ok).toBe(true);

    const system = result.document.system;
    expect(system.classLevels.length).toBeGreaterThan(0);
    expect(system.speciesId).toBeTruthy();
    expect(system.hitPoints.max).toBeGreaterThan(0);
    const topScore = Math.max(...Object.values(system.baseAttributes));
    expect(topScore).toBeGreaterThanOrEqual(15);
  });

  it('honors an explicit level and keeps class levels consistent', async () => {
    const result = await createCharacterFromPrompt({ systemId, prompt, level: 3 });
    expect(result.ok).toBe(true);
    expect(result.document.system.level).toBe(3);
    const total = result.document.system.classLevels.reduce((sum, cl) => sum + cl.level, 0);
    expect(total).toBe(3);
  });

  it('registers a creator', () => {
    expect(hasCreator(systemId)).toBe(true);
  });
});
