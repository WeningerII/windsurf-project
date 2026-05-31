/**
 * Engine-math verification for D&D 5e (2014) — Denominator B coverage.
 *
 * Each block pins a derived quantity from the compute register
 * (docs/compute-register/dnd5e-2014.ts) to its RAW formula, including edge
 * cases and the content x compute interactions (armor type x shield x Dex cap;
 * multiclass HP; exhaustion x HP). Asserts only behavior the engine actually
 * implements; quantities the engine does not compute (e.g. spell save DC) are
 * tracked as `missing` in the register, not asserted here.
 */
import { Dnd5eEngine } from '../systems/dnd5e/engine';
import { abilityMod } from '../utils/math';
import { profBonus, rollD20, normalizeDeathSaves } from '../systems/dnd5e/shared/engine';
import { compute5eAC } from '../utils/armorClass';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function doc(system: Dnd5eDataModel): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'dnd5e-2014-engine-math',
    name: 'Engine Math Character',
    systemId: 'dnd-5e-2014',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function chest(armorClass: number, armorType: 'light' | 'medium' | 'heavy', dexBonusMax?: number) {
  return { itemId: 'armor', slot: 'chest', attuned: false, armorClass, armorType, dexBonusMax };
}
const SHIELD = { itemId: 'shield', slot: 'offHand', attuned: false, shieldBonus: 2 };

const engine = new Dnd5eEngine();

// ── L1: ability modifier — floor((score - 10) / 2) ──────────────────────────
describe('L1 ability modifier', () => {
  it.each([
    [1, -5],
    [7, -2],
    [8, -1],
    [10, 0],
    [14, 2],
    [15, 2],
    [20, 5],
  ])('abilityMod(%i) = %i', (score, expected) => {
    expect(abilityMod(score)).toBe(expected);
  });
});

// ── L1: proficiency bonus — ceil(level / 4) + 1 ─────────────────────────────
describe('L1 proficiency bonus by level', () => {
  it.each([
    [1, 2],
    [4, 2],
    [5, 3],
    [8, 3],
    [9, 4],
    [12, 4],
    [13, 5],
    [16, 5],
    [17, 6],
    [20, 6],
  ])('profBonus(%i) = %i', (level, expected) => {
    expect(profBonus(level)).toBe(expected);
  });
});

// ── L2: Armor Class formula set (the "AC zoo") ──────────────────────────────
describe('L2 AC formula set', () => {
  it('unarmored = 10 + Dex mod', () => {
    expect(compute5eAC(14, [])).toBe(12);
    expect(compute5eAC(8, [])).toBe(9);
  });
  it('unarmored + shield = 10 + Dex + 2', () => {
    expect(compute5eAC(14, [SHIELD])).toBe(14);
  });
  it('light armor = base + full Dex', () => {
    expect(compute5eAC(14, [chest(11, 'light')])).toBe(13);
  });
  it('medium armor caps Dex at +2 by default', () => {
    expect(compute5eAC(16, [chest(14, 'medium')])).toBe(16); // 14 + min(3,2)
    expect(compute5eAC(12, [chest(14, 'medium')])).toBe(15); // 14 + min(1,2)
  });
  it('medium armor honors an explicit Dex cap', () => {
    expect(compute5eAC(16, [chest(14, 'medium', 3)])).toBe(17); // 14 + min(3,3)
  });
  it('heavy armor ignores Dex', () => {
    expect(compute5eAC(16, [chest(18, 'heavy')])).toBe(18);
    expect(compute5eAC(16, [chest(18, 'heavy'), SHIELD])).toBe(20);
  });
});

// ── L2/L4: AC + initiative wired through prepareData ────────────────────────
describe('L2/L4 prepareData derives AC and initiative', () => {
  it('default character: AC 10, initiative 0', () => {
    const out = engine.prepareData(doc(createDefaultDnd5eData()));
    expect(out.system.armorClass).toBe(10);
    expect(out.system.initiative).toBe(0);
  });
  it('Dex 14 unarmored: AC 12, initiative +2', () => {
    const out = engine.prepareData(
      doc({
        ...createDefaultDnd5eData(),
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
      })
    );
    expect(out.system.armorClass).toBe(12);
    expect(out.system.initiative).toBe(2);
  });
  it('does not mutate the input document', () => {
    const input = doc(createDefaultDnd5eData());
    const serialized = JSON.stringify(input);
    engine.prepareData(input);
    expect(JSON.stringify(input)).toBe(serialized);
  });
});

// ── L7: max HP = sum(hit die + Con) with min 1/level ────────────────────────
describe('L7 max HP from class hit dice', () => {
  const con = (c: number): Dnd5eDataModel => ({
    ...createDefaultDnd5eData(),
    baseAttributes: { str: 10, dex: 10, con: c, int: 10, wis: 10, cha: 10 },
  });

  it('Fighter 1 (d10) with Con 14: 10 + 2 = 12', () => {
    const out = engine.prepareData(
      doc({ ...con(14), classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [] }] })
    );
    expect(out.system.hitPoints.max).toBe(12);
  });
  it('Wizard 1 (d6) with Con 12: 6 + 1 = 7', () => {
    const out = engine.prepareData(
      doc({ ...con(12), classLevels: [{ classId: 'wizard', level: 1, hitDieRolls: [] }] })
    );
    expect(out.system.hitPoints.max).toBe(7);
  });
  it('Fighter 1 / Wizard 1 multiclass with Con 12: 11 + 7 = 18', () => {
    const out = engine.prepareData(
      doc({
        ...con(12),
        classLevels: [
          { classId: 'fighter', level: 1, hitDieRolls: [] },
          { classId: 'wizard', level: 1, hitDieRolls: [] },
        ],
      })
    );
    expect(out.system.hitPoints.max).toBe(18);
  });
  it('explicit hit-die rolls sum per level + Con each', () => {
    const out = engine.prepareData(
      doc({ ...con(12), classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [10, 6, 5] }] })
    );
    expect(out.system.hitPoints.max).toBe(10 + 1 + (6 + 1) + (5 + 1)); // 24
  });
});

// ── L8: 2014 exhaustion interacts with max HP ───────────────────────────────
describe('L8 exhaustion (2014)', () => {
  const fighterCon14 = (exhaustionLevel: number): Dnd5eDataModel => ({
    ...createDefaultDnd5eData(),
    baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
    classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [] }],
    exhaustionLevel,
  });

  it('level 4 halves max HP (12 -> 6)', () => {
    const out = engine.prepareData(doc(fighterCon14(4)));
    expect(out.system.hitPoints.max).toBe(6);
  });
  it('level 6 is lethal: current 0, three death-save failures', () => {
    const out = engine.prepareData(doc(fighterCon14(6)));
    expect(out.system.hitPoints.current).toBe(0);
    expect(out.system.deathSaves.failures).toBe(3);
  });
  it('clamps an out-of-range exhaustion level into [0, 6]', () => {
    const out = engine.prepareData(doc({ ...fighterCon14(99) }));
    expect(out.system.exhaustionLevel).toBe(6);
  });
});

// ── L8: damage application — temp HP, floor, death saves ────────────────────
describe('L8 applyDamage', () => {
  const base = (over: Partial<Dnd5eDataModel['hitPoints']>): Dnd5eDataModel => ({
    ...createDefaultDnd5eData(),
    hitPoints: { current: 10, max: 10, temp: 0, ...over },
  });

  it('temp HP absorbs before current HP', () => {
    const out = engine.applyDamage(doc(base({ temp: 5 })), 3, 'slashing');
    expect(out.system.hitPoints.temp).toBe(2);
    expect(out.system.hitPoints.current).toBe(10);
  });
  it('damage spills past temp HP into current', () => {
    const out = engine.applyDamage(doc(base({ temp: 5 })), 8, 'slashing');
    expect(out.system.hitPoints.temp).toBe(0);
    expect(out.system.hitPoints.current).toBe(7);
  });
  it('current HP floors at 0', () => {
    const out = engine.applyDamage(doc(base({ current: 5 })), 10, 'fire');
    expect(out.system.hitPoints.current).toBe(0);
  });
  it('taking damage while at 0 HP adds a death-save failure', () => {
    const out = engine.applyDamage(doc(base({ current: 0 })), 1, 'fire');
    expect(out.system.deathSaves.failures).toBe(1);
  });
  it('healing from 0 restores HP and resets death saves', () => {
    const start = base({ current: 0 });
    start.deathSaves = { successes: 1, failures: 2 };
    const out = engine.applyDamage(doc(start), -5, 'healing');
    expect(out.system.hitPoints.current).toBe(5);
    expect(out.system.deathSaves).toEqual({ successes: 0, failures: 0 });
  });
});

// ── L8: death-save normalization clamps to [0, 3] ───────────────────────────
describe('L8 death-save normalization', () => {
  it('clamps successes and failures into [0, 3]', () => {
    const d = doc({ ...createDefaultDnd5eData() });
    d.system.deathSaves = { successes: 9, failures: -2 };
    normalizeDeathSaves(d);
    expect(d.system.deathSaves).toEqual({ successes: 3, failures: 0 });
  });
});

// ── L4: d20 roll modes (structure of advantage/disadvantage) ────────────────
describe('L4 d20 roll modes', () => {
  it('normal rolls a single d20 in [1, 20]', () => {
    const r = rollD20('normal');
    expect(r.terms).toHaveLength(1);
    expect(r.chosen).toBeGreaterThanOrEqual(1);
    expect(r.chosen).toBeLessThanOrEqual(20);
  });
  it('advantage keeps the higher of two dice', () => {
    const r = rollD20('advantage');
    expect(r.terms).toHaveLength(2);
    expect(r.chosen).toBe(Math.max(...r.terms));
  });
  it('disadvantage keeps the lower of two dice', () => {
    const r = rollD20('disadvantage');
    expect(r.terms).toHaveLength(2);
    expect(r.chosen).toBe(Math.min(...r.terms));
  });
});
