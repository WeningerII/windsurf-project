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
import {
  profTotal,
  tierBonus,
  createDefaultPf2eData,
  type Pf2eDataModel,
} from '../systems/pf2e/data-model';
import {
  pf2eInitialDying,
  pf2eRecoveryCheckDC,
  pf2eDyingAfterRecovery,
  pf2eIsDead,
  pf2eWoundedAfterRecovery,
  pf2eCreatureXP,
  pf2eEncounterBudget,
  pf2eAttackModifier,
  pf2eShieldBlockDamage,
  PF2E_HERO_POINTS_AT_SESSION_START,
  PF2E_HERO_POINTS_MAX,
} from '../systems/pf2e/derivedMath';
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
  it('clumsy is a status penalty to AC (CRB Conditions: "Dex-based checks and DCs, including AC")', () => {
    const out = engine.prepareData(doc({ conditions: [{ id: 'c', name: 'clumsy', value: 1 }] }));
    expect(out.system.armorClass).toBe(12); // 10 + Dex 0 + prof 3 = 13, − clumsy 1
  });
  it('frightened is a status penalty to AC (CRB Conditions: "all your checks and DCs")', () => {
    const out = engine.prepareData(
      doc({ conditions: [{ id: 'f', name: 'frightened', value: 2 }] })
    );
    expect(out.system.armorClass).toBe(11); // 10 + Dex 0 + prof 3 = 13, − frightened 2
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
    const r = await engine.rollCheck(
      doc({ conditions: [{ id: 'f', name: 'frightened', value: 2 }] }),
      'str'
    );
    expect(r.total).toBe(11 - 2);
  });
  it('enfeebled penalizes Strength-based checks', async () => {
    const r = await engine.rollCheck(
      doc({ conditions: [{ id: 'e', name: 'enfeebled', value: 3 }] }),
      'str'
    );
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
    const out = engine.applyDamage(
      doc({ hitPoints: { current: 5, max: 10, temp: 0 } }),
      12,
      'fire'
    );
    expect(out.system.hitPoints.current).toBe(0);
  });
});

describe('L4 PF2e skill check', () => {
  it('= ability mod + proficiency (trained@1)', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // d20 = 11
    const prepared = engine.prepareData(
      doc({
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        skillProficiencies: { acrobatics: { tier: 'trained', total: 0 } },
      })
    );
    const r = await engine.rollCheck(prepared, 'acrobatics'); // acrobatics → Dex
    expect(r.total).toBe(11 + 2 + 3); // Dex +2, trained@1 = +3
    vi.restoreAllMocks();
  });
});

describe('L5 PF2e focus points', () => {
  it('derives the focus pool from the class resource (wizard maxFormula "1")', () => {
    const out = engine.prepareData(doc({ classId: 'wizard' }));
    expect(out.system.spellcasting?.focusPoints.max).toBe(1);
  });
});

// ── L8: dying / wounded / recovery track ────────────────────────────────────
describe('L8 PF2e dying and recovery', () => {
  it('initial dying is 1 (or 2 from a crit) plus the current wounded value', () => {
    expect(pf2eInitialDying(false)).toBe(1);
    expect(pf2eInitialDying(true)).toBe(2);
    expect(pf2eInitialDying(false, 1)).toBe(2); // wounded 1
    expect(pf2eInitialDying(true, 2)).toBe(4); // crit + wounded 2 → instant death threshold
  });
  it('recovery check DC is 10 + the current dying value', () => {
    expect(pf2eRecoveryCheckDC(1)).toBe(11);
    expect(pf2eRecoveryCheckDC(3)).toBe(13);
  });
  it('recovery adjusts dying by degree (crit -2 / success -1 / fail +1 / crit-fail +2)', () => {
    expect(pf2eDyingAfterRecovery(2, 'critical-success')).toBe(0);
    expect(pf2eDyingAfterRecovery(2, 'success')).toBe(1);
    expect(pf2eDyingAfterRecovery(2, 'failure')).toBe(3);
    expect(pf2eDyingAfterRecovery(2, 'critical-failure')).toBe(4);
    expect(pf2eDyingAfterRecovery(1, 'critical-success')).toBe(0); // floors at 0
  });
  it('death at dying 4; wounded climbs by 1 each recovery', () => {
    expect(pf2eIsDead(3)).toBe(false);
    expect(pf2eIsDead(4)).toBe(true);
    expect(pf2eWoundedAfterRecovery(0)).toBe(1);
    expect(pf2eWoundedAfterRecovery(2)).toBe(3);
  });
});

// ── L3: attack modifier, Shield Block, hero points ──────────────────────────
describe('L3 PF2e attack rolls and shields', () => {
  it('attack modifier = ability + proficiency total + item bonus', () => {
    expect(pf2eAttackModifier(4, 7)).toBe(11); // +4 ability, level1 trained (1+2)+... example
    expect(pf2eAttackModifier(4, 7, 1)).toBe(12); // +1 potency rune
  });
  it('Shield Block reduces damage by the shield Hardness (min 0)', () => {
    expect(pf2eShieldBlockDamage(10, 5)).toBe(5);
    expect(pf2eShieldBlockDamage(3, 5)).toBe(0); // fully blocked
  });
  it('hero points start at 1 per session, capped at 3', () => {
    expect(PF2E_HERO_POINTS_AT_SESSION_START).toBe(1);
    expect(PF2E_HERO_POINTS_MAX).toBe(3);
  });
});

// ── L10: encounter building (creature XP + threat budget) ───────────────────
describe('L10 PF2e encounter math', () => {
  it('creature XP scales by level relative to the party (-4..+4 table)', () => {
    expect(pf2eCreatureXP(-4)).toBe(10);
    expect(pf2eCreatureXP(-1)).toBe(30);
    expect(pf2eCreatureXP(0)).toBe(40);
    expect(pf2eCreatureXP(3)).toBe(120);
    expect(pf2eCreatureXP(4)).toBe(160);
  });
  it('creatures more than 4 levels below the party count for nothing', () => {
    expect(pf2eCreatureXP(-5)).toBe(0);
  });
  it('a 4-character party reproduces the printed Table 10-1 budgets', () => {
    expect(pf2eEncounterBudget('trivial')).toBe(40);
    expect(pf2eEncounterBudget('low')).toBe(60);
    expect(pf2eEncounterBudget('moderate')).toBe(80);
    expect(pf2eEncounterBudget('severe')).toBe(120);
    expect(pf2eEncounterBudget('extreme')).toBe(160);
  });
  it('the budget scales at 20 XP per character', () => {
    expect(pf2eEncounterBudget('moderate', 5)).toBe(100); // 5 × 20
    expect(pf2eEncounterBudget('severe', 6)).toBe(180); // floor(120 × 1.5)
  });
});
