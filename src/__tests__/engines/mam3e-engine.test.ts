import { describe, it, expect } from 'vitest';
import { Mam3eEngine } from '../../systems/mam3e/engine';
import { createDefaultMam3eData } from '../../systems/mam3e/data-model';
import { CharacterDocument } from '../../types/core/document';
import { Mam3eDataModel } from '../../systems/mam3e/data-model';

function makeDoc(overrides: Partial<Mam3eDataModel> = {}): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'test-mam',
    name: 'Test Hero',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...overrides },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('Mam3eEngine', () => {
  const engine = new Mam3eEngine();

  describe('prepareData', () => {
    it('returns a new document reference from prepareData without mutating the original system', () => {
      const doc = makeDoc({
        abilities: { str: 3, sta: 2, agi: 1, dex: 0, fgt: 4, int: 0, awe: 0, pre: 0 },
      });
      const originalSystem = doc.system;
      const originalSpent = { ...doc.system.powerPoints.spent };

      const result = engine.prepareData(doc);

      expect(result).not.toBe(doc);
      expect(result.system).not.toBe(originalSystem);
      expect(result.system.powerPoints).not.toBe(originalSystem.powerPoints);
      expect(result.system.defenses).not.toBe(originalSystem.defenses);
      expect(doc.system.powerPoints.spent).toEqual(originalSpent);
    });

    it('calculates defense totals from abilities + ranks', () => {
      const doc = makeDoc({
        abilities: { str: 2, sta: 4, agi: 6, dex: 3, fgt: 5, int: 1, awe: 3, pre: 2 },
        defenses: {
          dodge: { rank: 2, total: 0 },
          parry: { rank: 3, total: 0 },
          fortitude: { rank: 1, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 2, total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // Dodge = AGI + rank = 6 + 2 = 8
      expect(result.system.defenses.dodge.total).toBe(8);
      // Parry = FGT + rank = 5 + 3 = 8
      expect(result.system.defenses.parry.total).toBe(8);
      // Fortitude = STA + rank = 4 + 1 = 5
      expect(result.system.defenses.fortitude.total).toBe(5);
      // Toughness = STA + rank = 4 + 0 = 4
      expect(result.system.defenses.toughness.total).toBe(4);
      // Will = AWE + rank = 3 + 2 = 5
      expect(result.system.defenses.will.total).toBe(5);
    });

    it('calculates PP spent on abilities (each rank costs 2 PP)', () => {
      const doc = makeDoc({
        abilities: { str: 3, sta: 2, agi: 1, dex: 0, fgt: 4, int: 0, awe: 0, pre: 0 },
      });
      const result = engine.prepareData(doc);
      // Total ability ranks = 3+2+1+0+4+0+0+0 = 10, cost = 10 * 2 = 20
      expect(result.system.powerPoints.spent.abilities).toBe(20);
    });

    it('calculates PP spent on defenses', () => {
      const doc = makeDoc({
        defenses: {
          dodge: { rank: 5, total: 0 },
          parry: { rank: 3, total: 0 },
          fortitude: { rank: 2, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 4, total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // Defense ranks = 5+3+2+0+4 = 14, cost = 14 * 1 = 14
      expect(result.system.powerPoints.spent.defenses).toBe(14);
    });

    it('charges PP for a directly-entered Toughness rank', () => {
      const doc = makeDoc({
        defenses: {
          dodge: { rank: 1, total: 0 },
          parry: { rank: 0, total: 0 },
          fortitude: { rank: 0, total: 0 },
          toughness: { rank: 3, total: 0 },
          will: { rank: 0, total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // Toughness rank contributes to total, so it must be charged like the
      // other defenses: 1 + 0 + 0 + 3 + 0 = 4 PP.
      expect(result.system.powerPoints.spent.defenses).toBe(4);
    });

    it('calculates power costs using rank plus extras/flaws modifiers', () => {
      const doc = makeDoc({
        powers: [
          {
            id: 'blast',
            name: 'Blast',
            system: 'mam3e',
            source: 'test',
            type: 'attack',
            action: 'standard',
            range: 'ranged',
            duration: 'instant',
            baseCost: 2,
            perRank: true,
            rank: 4,
            extras: ['accurate', 'subtle'],
            flaws: ['limited', 'activation'],
            modifierRanks: {
              accurate: 1,
              subtle: 1,
              limited: 1,
              activation: 1,
            },
            description: '',
            effects: [],
          },
        ],
      });
      const result = engine.prepareData(doc);
      // Accurate is a FLAT extra — 1 point per rank of Accurate, not +1 per
      // effect rank (Hero's Handbook, Extras): (base 2 + limited −1) × rank 4
      // + (accurate +1, subtle +1, activation −1) = 4 + 1 = 5.
      expect(result.system.powerPoints.spent.powers).toBe(5);
    });

    it('applies the minimum-cost rule when flaws drive cost per rank below 1', () => {
      // Hero's Handbook (Powers — Modifiers): below 1 point per rank, the
      // effect costs 1 point per 2 ranks (then per 3, ...), rounded up — it
      // never becomes free. Damage 10 (base 1) + Limited (−1/rank) = 5 PP.
      const result = engine.prepareData(
        makeDoc({
          powers: [
            {
              id: 'damage',
              name: 'Damage',
              system: 'mam3e',
              source: 'test',
              type: 'attack',
              action: 'standard',
              range: 'close',
              duration: 'instant',
              baseCost: 1,
              perRank: true,
              rank: 10,
              flaws: ['limited'],
              modifierRanks: { limited: 1 },
              description: '',
              effects: [],
            },
          ],
        })
      );
      expect(result.system.powerPoints.spent.powers).toBe(5);
    });

    it('never reduces a power to 0 PP, even with two per-rank flaws', () => {
      // Damage 10 + Limited + Distracting → cost/rank −1 → 1 point per
      // 3 ranks → ceil(10/3) = 4 PP, and the floor stays at 1 minimum.
      const result = engine.prepareData(
        makeDoc({
          powers: [
            {
              id: 'damage',
              name: 'Damage',
              system: 'mam3e',
              source: 'test',
              type: 'attack',
              action: 'standard',
              range: 'close',
              duration: 'instant',
              baseCost: 1,
              perRank: true,
              rank: 10,
              flaws: ['limited', 'distracting'],
              modifierRanks: { limited: 1, distracting: 1 },
              description: '',
              effects: [],
            },
          ],
        })
      );
      expect(result.system.powerPoints.spent.powers).toBe(4);
      expect(result.system.powerPoints.spent.powers).toBeGreaterThanOrEqual(1);
    });

    it('clamps negative purchased defense and skill ranks to 0 (no PP refunds)', () => {
      const result = engine.prepareData(
        makeDoc({
          abilities: { str: 0, sta: 2, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
          defenses: {
            dodge: { rank: -4, total: 0 },
            parry: { rank: 0, total: 0 },
            fortitude: { rank: 0, total: 0 },
            toughness: { rank: 0, total: 0 },
            will: { rank: 0, total: 0 },
          },
          skills: { acrobatics: { rank: -8, total: 0 } },
        })
      );

      expect(result.system.defenses.dodge.rank).toBe(0);
      expect(result.system.defenses.dodge.total).toBe(0); // Agi 0 + clamped 0
      expect(result.system.powerPoints.spent.defenses).toBe(0);
      expect(result.system.skills.acrobatics.rank).toBe(0);
      expect(result.system.powerPoints.spent.skills).toBe(0); // not ceil(-8/2) = -4
    });

    it('flags close attack/effect PL cap violations', () => {
      const doc = makeDoc({
        powerLevel: 8, // cap = 16
        abilities: { str: 0, sta: 0, agi: 0, dex: 0, fgt: 10, int: 0, awe: 0, pre: 0 },
        skills: {
          'close-combat': { rank: 7, total: 0 },
        },
        powers: [
          {
            id: 'strike',
            name: 'Strike',
            system: 'mam3e',
            source: 'test',
            type: 'attack',
            action: 'standard',
            range: 'close',
            duration: 'instant',
            baseCost: 1,
            perRank: true,
            rank: 5,
            description: '',
            effects: [],
          },
        ],
      });
      const result = engine.prepareData(doc);
      expect(
        result.system.plViolations?.some((entry) => entry.label === 'Close Attack + Effect')
      ).toBe(true);
    });

    it('adds an Enhanced Trait power rank to the named defense', () => {
      const zeroAbilities = { str: 0, sta: 0, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 };
      const base = engine.prepareData(makeDoc({ abilities: zeroAbilities }));
      const boosted = engine.prepareData(
        makeDoc({
          abilities: zeroAbilities,
          powers: [
            {
              id: 'enhanced-trait',
              name: 'Enhanced Dodge',
              system: 'mam3e',
              source: 'test',
              type: 'attack',
              action: 'standard',
              range: 'close',
              duration: 'instant',
              baseCost: 1,
              perRank: true,
              rank: 3,
              description: '',
              effects: [],
              descriptors: ['dodge'],
            },
          ],
        })
      );

      // Enhanced Trait lifts the named defense by its rank (delta isolates it
      // from whatever baseline the defense formula produces).
      expect(boosted.system.defenses.dodge.total - base.system.defenses.dodge.total).toBe(3);
    });
  });

  describe('rollCheck', () => {
    it('rolls an ability check', async () => {
      const doc = makeDoc({
        abilities: { str: 8, sta: 0, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
      });
      const result = await engine.rollCheck(doc, 'str');
      // d20 + 8
      expect(result.total).toBeGreaterThanOrEqual(9);
      expect(result.total).toBeLessThanOrEqual(28);
      expect(result.formula).toBe('1d20 + 8');
    });

    it('rolls an ability check for a different ability', async () => {
      const doc = makeDoc({
        abilities: { str: 0, sta: 0, agi: 4, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
      });
      const result = await engine.rollCheck(doc, 'agi');
      // d20 + AGI rank (4)
      expect(result.formula).toBe('1d20 + 4');
    });

    it('rolls a skill check as ability rank + skill rank', async () => {
      const doc = makeDoc({
        abilities: { str: 0, sta: 0, agi: 3, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
        skills: { acrobatics: { rank: 5, total: 8 } },
      });
      const result = await engine.rollCheck(doc, 'acrobatics');
      // acrobatics maps to AGI: AGI rank 3 + skill rank 5 = 8.
      expect(result.formula).toBe('1d20 + 8');
      expect(result.flavor).toBe('acrobatics Check');
    });

    it('applies the cumulative -1 per Bruised to Toughness checks', async () => {
      // Hero's Handbook (Damage): each Bruised result imposes a cumulative -1
      // on further Toughness resistance checks.
      const prepared = engine.prepareData(
        makeDoc({
          abilities: { str: 0, sta: 4, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
          conditionTrack: { bruised: 2, dazed: false, staggered: false, incapacitated: false },
        })
      );
      const result = await engine.rollCheck(prepared, 'toughness');
      // Toughness total 4 (Sta) − 2 bruises = +2
      expect(result.formula).toBe('1d20 + 2');
    });

    it('does not apply the Bruised penalty to other defense checks', async () => {
      const prepared = engine.prepareData(
        makeDoc({
          abilities: { str: 0, sta: 4, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
          conditionTrack: { bruised: 2, dazed: false, staggered: false, incapacitated: false },
        })
      );
      const result = await engine.rollCheck(prepared, 'fortitude');
      expect(result.formula).toBe('1d20 + 4');
    });
  });

  describe('applyDamage', () => {
    it('applies bruised on a low toughness failure (1-4)', () => {
      const doc = makeDoc();
      const result = engine.applyDamage(doc, 3, 'damage');
      expect(result.system.conditionTrack.bruised).toBe(1);
      expect(result.system.conditionTrack.dazed).toBe(false);
      expect(result.system.conditionTrack.staggered).toBe(false);
      expect(result.system.conditionTrack.incapacitated).toBe(false);
    });

    it('applies dazed on a medium toughness failure (5-9)', () => {
      const doc = makeDoc();
      const result = engine.applyDamage(doc, 7, 'damage');
      expect(result.system.conditionTrack.bruised).toBe(1);
      expect(result.system.conditionTrack.dazed).toBe(true);
      expect(result.system.conditionTrack.staggered).toBe(false);
      expect(result.system.conditionTrack.incapacitated).toBe(false);
    });

    it('applies staggered on a high toughness failure (10-14)', () => {
      const doc = makeDoc();
      const result = engine.applyDamage(doc, 12, 'damage');
      expect(result.system.conditionTrack.bruised).toBe(1);
      expect(result.system.conditionTrack.dazed).toBe(false);
      expect(result.system.conditionTrack.staggered).toBe(true);
      expect(result.system.conditionTrack.incapacitated).toBe(false);
    });

    it('applies incapacitated on a severe toughness failure (15+)', () => {
      const doc = makeDoc();
      const result = engine.applyDamage(doc, 18, 'damage');
      expect(result.system.conditionTrack.incapacitated).toBe(true);
    });

    it('escalates to staggered when already dazed and failing by 5+', () => {
      const doc = makeDoc({
        conditionTrack: {
          bruised: 2,
          dazed: true,
          staggered: false,
          incapacitated: false,
        },
      });
      const result = engine.applyDamage(doc, 6, 'damage');
      expect(result.system.conditionTrack.bruised).toBe(3);
      expect(result.system.conditionTrack.dazed).toBe(true);
      expect(result.system.conditionTrack.staggered).toBe(true);
    });

    it('escalates a second Staggered result to Incapacitated', () => {
      // Hero's Handbook (Damage): a Staggered target that is staggered again
      // becomes Incapacitated — the result must not just re-set staggered.
      const doc = makeDoc({
        conditionTrack: {
          bruised: 1,
          dazed: false,
          staggered: true,
          incapacitated: false,
        },
      });
      const result = engine.applyDamage(doc, 12, 'damage');
      expect(result.system.conditionTrack.incapacitated).toBe(true);
      expect(result.system.conditionTrack.bruised).toBe(2);
    });
  });
});

describe('roll outcome flags (review L5)', () => {
  const engine = new Mam3eEngine();
  // Hero's Handbook: a natural 20 is a critical success on checks; a natural
  // 1 always fails. The badge previously never fired for M&M because the
  // engine left isCritical/isFumble unset.
  it('flags natural 20 as critical and natural 1 as fumble', async () => {
    const doc = makeDoc({});
    const randomSpy = vi.spyOn(Math, 'random');

    randomSpy.mockReturnValueOnce(0.999); // d20 = 20
    const crit = await engine.rollCheck(doc, 'str');
    expect(crit.isCritical).toBe(true);
    expect(crit.isFumble).toBe(false);

    randomSpy.mockReturnValueOnce(0); // d20 = 1
    const fumble = await engine.rollCheck(doc, 'str');
    expect(fumble.isCritical).toBe(false);
    expect(fumble.isFumble).toBe(true);

    randomSpy.mockRestore();
  });
});
