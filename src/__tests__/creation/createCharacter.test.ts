import { describe, it, expect, beforeAll } from 'vitest';
import { registerAllSystems } from '../../systems';
import { createCharacterFromPrompt, hasCreator } from '../../creation';
import type { DaggerheartDataModel } from '../../systems/daggerheart/data-model';
import type { CharacterDocument } from '../../types/core/document';

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
