import { describe, expect, it } from 'vitest';
import type { Monster } from '../../types/creatures/monsters';
import { generateNpc, generateNpcName } from '../../scene/npcGenerator';
import { createSeededRng } from '../../scene/seededRng';

const catalog = [
  { id: 'goblin', name: 'Goblin' },
  { id: 'orc', name: 'Orc' },
  { id: 'wolf', name: 'Wolf' },
] as Monster[];

describe('generateNpcName', () => {
  it('is deterministic for a given seed and non-empty', () => {
    const a = generateNpcName(createSeededRng('seed-1'));
    const b = generateNpcName(createSeededRng('seed-1'));
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('varies with the seed', () => {
    const names = new Set(
      Array.from({ length: 8 }, (_, i) => generateNpcName(createSeededRng(`seed-${i}`)))
    );
    // Not all identical — the tables produce variety.
    expect(names.size).toBeGreaterThan(1);
  });
});

describe('generateNpc', () => {
  it('picks a catalog creature and a name, deterministically per seed', () => {
    const a = generateNpc(catalog, createSeededRng('npc-1'));
    const b = generateNpc(catalog, createSeededRng('npc-1'));
    expect(a).toEqual(b);
    expect(catalog).toContain(a?.monster);
    expect(a?.name.length).toBeGreaterThan(0);
  });

  it('returns undefined when the catalog is empty', () => {
    expect(generateNpc([], createSeededRng('x'))).toBeUndefined();
  });
});
