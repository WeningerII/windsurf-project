/**
 * Engine-math verification for Pathfinder 2e.
 *
 * Pins the system-defining PF2e math: proficiency = level + tier (0 untrained),
 * degrees of success (beat DC by 10 = crit; nat 20/1 shift one step), valued
 * conditions (frightened/clumsy/enfeebled... as status penalties), the
 * clumsy→AC interaction, and HP = ancestry + level×(class die + Con).
 * Pins docs/compute-register/pf2e.ts.
 */
import { Pf2eEngine } from '../systems/pf2e/engine';
import { profTotal, tierBonus, createDefaultPf2eData, type Pf2eDataModel } from '../systems/pf2e/data-model';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');
const engine = new Pf2eEngine();

function doc(over: Partial<Pf2eDataModel>): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-engine-math',
    name: 'PF2e Character',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

// ── L1: proficiency = level + tier (0 if untrained) ─────────────────────────
describe('L1 proficiency (rank + level)', () => {
  it('tier bonuses are 0/2/4/6/8', () => {
    expect(tierBonus('untrained')).toBe(0);
    expect(tierBonus('trained')).toBe(2);
    expect(tierBonus('expert')).toBe(4);
    expect(tierBonus('master')).toBe(6);
    expect(tierBonus('legendary')).toBe(8);
  });
  it('untrained is always 0 (level not added)', () => {
    expect(profTotal(1, 'untrained')).toBe(0);
    expect(profTotal(20, 'untrained')).toBe(0);
  });
  it('trained+ adds character level to the tier bonus', () => {
    expect(profTotal(1, 'trained')).toBe(3);
    expect(profTotal(5, 'expert')).toBe(9);
    expect(profTotal(20, 'legendary')).toBe(28);
  });
  it('prepareData recomputes proficiency totals at the current level', () => {
    const out = engine.prepareData(
      doc({
        level: 5,
        saveProficiencies: {
          fortitude: { tier: 'expert', total: 0 },
          reflex: { tier: 'trained', total: 0 },
          will: { tier: 'untrained', total: 0 },
        },
      })
    );
    expect(out.system.saveProficiencies.fortitude.total).toBe(9); // 5 + 4
    expect(out.system.saveProficiencies.reflex.total).toBe(7); // 5 + 2
    expect(out.system.saveProficiencies.will.total).toBe(0); // untrained
  });
});

// ── L2: AC = 10 + Dex mod + armor proficiency (+ clumsy interaction) ─────────
describe('L2 PF2e AC', () => {
  it('default unarmored trained level 1: 10 + Dex 0 + prof 3 = 13', () => {
    const out = engine.prepareData(doc({}));
    expect(out.system.armorClass).toBe(13);
  });
  it('higher Dex raises AC', () => {
    const out = engine.prepareData(
      doc({ baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 } })
    );
    expect(out.system.armorClass).toBe(16); // 10 + 3 + 3
  });
  it('clumsy reduces effective Dex (−2 score per value) before AC', () => {
    const out = engine.prepareData(
      doc({ conditions: [{ id: 'c', name: 'clumsy', value: 1 }] })
    );
    expect(out.system.armorClass).toBe(12); // Dex 10→8 (mod −1): 10 − 1 + 3
  });
});

// ── L7: HP = ancestry HP + level × (class die + Con mod) ─────────────────────
describe('L7 PF2e HP', () => {
  it('default (ancestry 8, no class → d8, level 1, Con 0) = 16', () => {
    const out = engine.prepareData(doc({}));
    expect(out.system.hitPoints.max).toBe(16);
  });
  it('scales by level and Con: ancestry 8 + 3×(8 + 2) = 38', () => {
    const out = engine.prepareData(
      doc({ level: 3, baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 } })
    );
    expect(out.system.hitPoints.max).toBe(38);
  });
});

// ── L8: degrees of success (CRB p.445) ──────────────────────────────────────
describe('L8 degrees of success', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const rollWithD20 = async (d20: number, dc: number) => {
    // d20 = floor(random * 20) + 1  ⇒  random = (d20 - 1) / 20
    vi.spyOn(Math, 'random').mockReturnValue((d20 - 1) / 20);
    // 'str' ability check on a default character → modifier 0, so total = d20.
    return engine.rollCheck(doc({}), 'str', { dc });
  };

  it('meeting the DC is a success', async () => {
    expect((await rollWithD20(11, 11)).degreeOfSuccess).toBe('success');
  });
  it('beating the DC by 10+ is a critical success', async () => {
    expect((await rollWithD20(11, 1)).degreeOfSuccess).toBe('critical-success');
  });
  it('missing the DC by 10+ is a critical failure', async () => {
    expect((await rollWithD20(11, 21)).degreeOfSuccess).toBe('critical-failure');
  });
  it('missing the DC (by < 10) is a failure', async () => {
    expect((await rollWithD20(11, 12)).degreeOfSuccess).toBe('failure');
  });
  it('natural 20 upgrades one step (success → critical success)', async () => {
    expect((await rollWithD20(20, 11)).degreeOfSuccess).toBe('critical-success');
  });
  it('natural 1 downgrades one step (success → failure)', async () => {
    expect((await rollWithD20(1, 1)).degreeOfSuccess).toBe('failure');
  });
});

// ── L8: valued conditions apply status penalties ────────────────────────────
describe('L8 valued conditions', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // d20 = 11
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('frightened N is an N status penalty to checks', async () => {
    const r = await engine.rollCheck(doc({ conditions: [{ id: 'f', name: 'frightened', value: 2 }] }), 'str');
    expect(r.total).toBe(11 - 2);
  });
  it('enfeebled penalizes Strength-based checks', async () => {
    const r = await engine.rollCheck(doc({ conditions: [{ id: 'e', name: 'enfeebled', value: 3 }] }), 'str');
    expect(r.total).toBe(11 - 3);
  });
  it('only the highest status penalty applies (frightened vs sickened)', async () => {
    const r = await engine.rollCheck(
      doc({
        conditions: [
          { id: 'f', name: 'frightened', value: 2 },
          { id: 's', name: 'sickened', value: 1 },
        ],
      }),
      'str'
    );
    expect(r.total).toBe(11 - 2);
  });
});

// ── L2/L8: perception and damage application ────────────────────────────────
describe('L2/L8 PF2e perception and damage', () => {
  it('perception = Wis mod + perception proficiency (trained@1 = 3)', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // d20 = 11
    const prepared = engine.prepareData(doc({})); // perception trained by default
    const r = await engine.rollCheck(prepared, 'perception');
    expect(r.total).toBe(11 + 3);
    vi.restoreAllMocks();
  });
  it('apply damage: temp HP absorbs first, current floors at 0', () => {
    const out = engine.applyDamage(
      doc({ hitPoints: { current: 10, max: 10, temp: 5 } }),
      8,
      'slashing'
    );
    expect(out.system.hitPoints.temp).toBe(0);
    expect(out.system.hitPoints.current).toBe(7);
  });
  it('overkill floors current HP at 0', () => {
    const out = engine.applyDamage(doc({ hitPoints: { current: 5, max: 10, temp: 0 } }), 12, 'fire');
    expect(out.system.hitPoints.current).toBe(0);
  });
});
