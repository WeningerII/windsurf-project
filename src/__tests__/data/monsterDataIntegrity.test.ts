import { describe, it, expect } from 'vitest';
import type { Monster } from '../../types/creatures/monsters';

const VALID_DAMAGE_TYPES = new Set([
  'acid',
  'bludgeoning',
  'cold',
  'fire',
  'force',
  'lightning',
  'necrotic',
  'piercing',
  'poison',
  'psychic',
  'radiant',
  'slashing',
  'thunder',
]);

/** Recursively assert no NaN leaked into any numeric field of shipped data. */
function expectNoNaN(value: unknown, path: string): void {
  if (typeof value === 'number') {
    expect(Number.isNaN(value), `NaN at ${path}`).toBe(false);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => expectNoNaN(v, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) expectNoNaN(v, `${path}.${k}`);
  }
}

async function loadMonsters(): Promise<Record<string, Monster[]>> {
  const [p2, p1, e35, e2024] = await Promise.all([
    import('../../data/pathfinder/2e/monsters'),
    import('../../data/pathfinder/1e/monsters'),
    import('../../data/dnd/3.5e/monsters'),
    import('../../data/dnd/5e-2024/monsters'),
  ]);
  return {
    pf2e: p2.pf2eMonsters,
    pf1e: p1.pf1eMonsters,
    'dnd-3.5e': e35.dnd35eMonsters ?? [],
    'dnd-5e-2024': e2024.dnd5e2024Monsters,
  };
}

describe('generated monster-data integrity (no fabrication, no NaN)', () => {
  it('every damage type across every system is a real DamageType (no fabricated defaults leaking)', async () => {
    const all = await loadMonsters();
    const offenders: string[] = [];
    for (const [system, monsters] of Object.entries(all)) {
      for (const m of monsters) {
        for (const action of m.actions ?? []) {
          for (const d of action.damage ?? []) {
            if (d.type !== undefined && !VALID_DAMAGE_TYPES.has(d.type)) {
              offenders.push(`${system}:${m.id}:${action.name}=${d.type}`);
            }
          }
        }
      }
    }
    expect(offenders, offenders.slice(0, 10).join(', ')).toHaveLength(0);
  });

  it('no NaN reached any numeric field in any generated monster', async () => {
    const all = await loadMonsters();
    for (const [system, monsters] of Object.entries(all)) {
      monsters.forEach((m) => expectNoNaN(m, `${system}:${m.id}`));
    }
  });

  it('PF2e damage types match the source primary clause for known weapons', async () => {
    const { pf2eMonsters } = await import('../../data/pathfinder/2e/monsters');
    const typeOf = (id: string, attack: string) =>
      pf2eMonsters.find((m) => m.id === id)?.actions.find((a) => a.name === attack)?.damage?.[0]
        ?.type;
    // These were mislabeled 'bludgeoning' before the types[]-vs-string fix.
    expect(typeOf('arbiter', 'Shortsword')).toBe('piercing');
    expect(typeOf('deinonychus', 'Jaws')).toBe('piercing');
    expect(typeOf('deinonychus', 'Talon')).toBe('slashing');
    // Genuinely-bludgeoning weapons stay bludgeoning (source-faithful).
    expect(typeOf('chuul', 'Claws')).toBe('bludgeoning');
  });

  it('3.5e monsters carry no fabricated intrinsic XP (party-relative, encoded 0)', async () => {
    const { dnd35eMonsters } = await import('../../data/dnd/3.5e/monsters');
    expect(dnd35eMonsters.length).toBeGreaterThan(0);
    // Previously every creature shipped a flat fabricated experiencePoints: 10.
    expect(dnd35eMonsters.every((m) => m.experiencePoints === 0)).toBe(true);
    // CR must still vary (sanity that we didn't flatten everything).
    expect(new Set(dnd35eMonsters.map((m) => m.challengeRating)).size).toBeGreaterThan(5);
  });
});
