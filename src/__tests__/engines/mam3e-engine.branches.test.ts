import { describe, expect, it } from 'vitest';
import { Mam3eEngine } from '../../systems/mam3e/engine';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../systems/mam3e/data-model';
import type { CharacterDocument } from '../../types/core/document';
import type { Power } from '../../types/mam/powers';

const engine = new Mam3eEngine();
const ZERO_ABILITIES = { str: 0, sta: 0, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 };

function makeDoc(overrides: Partial<Mam3eDataModel> = {}): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'mam3e-engine-branch',
    name: 'Branch Hero',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  };
}

function power(overrides: Partial<Power>): Power {
  return {
    id: 'p',
    name: 'Power',
    system: 'mam3e',
    source: 'test',
    type: 'attack',
    action: 'standard',
    range: 'close',
    duration: 'instant',
    baseCost: 1,
    perRank: true,
    rank: 1,
    description: '',
    effects: [],
    ...overrides,
  };
}

function labels(doc: CharacterDocument<Mam3eDataModel>): string[] {
  return (engine.prepareData(doc).system.plViolations ?? []).map((entry) => entry.label);
}

describe('Mam3eEngine prepareData defense contributions', () => {
  it('adds a Protection power rank to the Toughness total', () => {
    const base = engine.prepareData(makeDoc({ abilities: ZERO_ABILITIES }));
    const boosted = engine.prepareData(
      makeDoc({
        abilities: ZERO_ABILITIES,
        powers: [power({ id: 'protection', name: 'Protection', type: 'defense', rank: 6 })],
      })
    );
    expect(boosted.system.defenses.toughness.total - base.system.defenses.toughness.total).toBe(6);
  });

  it('adds a Force Field power rank to the Toughness total', () => {
    const boosted = engine.prepareData(
      makeDoc({
        abilities: { ...ZERO_ABILITIES, sta: 2 },
        powers: [power({ id: 'force-field', name: 'Force Field', type: 'defense', rank: 4 })],
      })
    );
    // Sta 2 + Force Field 4 = 6.
    expect(boosted.system.defenses.toughness.total).toBe(6);
  });

  it('ignores an Enhanced Trait descriptor that is not a defense key', () => {
    // 'awareness' is not a defense, so the `descriptor in data.defenses` guard
    // is false and no defense total moves.
    const base = engine.prepareData(makeDoc({ abilities: ZERO_ABILITIES }));
    const result = engine.prepareData(
      makeDoc({
        abilities: ZERO_ABILITIES,
        powers: [
          power({
            id: 'enhanced-trait',
            name: 'Enhanced Awareness',
            rank: 5,
            descriptors: ['awareness'],
          }),
        ],
      })
    );
    expect(result.system.defenses.dodge.total).toBe(base.system.defenses.dodge.total);
    expect(result.system.defenses.parry.total).toBe(base.system.defenses.parry.total);
    expect(result.system.defenses.will.total).toBe(base.system.defenses.will.total);
  });
});

describe('Mam3eEngine prepareData PL trade-off caps', () => {
  it('flags the Parry + Toughness cap', () => {
    // PL 10 cap = 20. Parry (Fgt 12) + Toughness (Sta 12) = 24 > 20. Agility 0
    // keeps Dodge low so the Parry pairing is what trips.
    const found = labels(makeDoc({ abilities: { ...ZERO_ABILITIES, fgt: 12, sta: 12 } }));
    expect(found).toContain('Parry + Toughness');
    expect(found).not.toContain('Dodge + Toughness');
  });

  it('flags the Fortitude + Will cap', () => {
    // Fortitude (Sta 11) + Will (Awe 11) = 22 > 20. Toughness pairings also use
    // Sta, so isolate via separate Fort/Will ranks instead of high Stamina.
    const found = labels(
      makeDoc({
        abilities: ZERO_ABILITIES,
        defenses: {
          dodge: { rank: 0, total: 0 },
          parry: { rank: 0, total: 0 },
          fortitude: { rank: 11, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 11, total: 0 },
        },
      })
    );
    expect(found).toContain('Fortitude + Will');
  });

  it('flags the Ranged Attack + Effect cap', () => {
    // Dex 12 + ranged Blast rank 12 = 24 > 20.
    const found = labels(
      makeDoc({
        abilities: { ...ZERO_ABILITIES, dex: 12 },
        powers: [power({ id: 'blast', name: 'Blast', range: 'ranged', rank: 12 })],
      })
    );
    expect(found).toContain('Ranged Attack + Effect');
  });

  it('flags a Perception-range effect rank above the Power Level', () => {
    // Perception attacks need no attack roll, so only the effect rank is capped
    // (at PL, not 2 x PL): rank 11 > PL 10.
    const found = labels(
      makeDoc({
        abilities: ZERO_ABILITIES,
        powers: [power({ id: 'mind-blast', name: 'Mind Blast', range: 'perception', rank: 11 })],
      })
    );
    expect(found).toContain('Perception Effect Rank');
  });

  it('does not flag a Perception effect rank at exactly the Power Level', () => {
    const found = labels(
      makeDoc({
        abilities: ZERO_ABILITIES,
        powers: [power({ id: 'mind-blast', name: 'Mind Blast', range: 'perception', rank: 10 })],
      })
    );
    expect(found).not.toContain('Perception Effect Rank');
  });
});

describe('Mam3eEngine prepareData advantage costs', () => {
  it('charges a ranked advantage its rank in PP and an unranked advantage 1 PP', () => {
    const result = engine.prepareData(
      makeDoc({
        advantages: [
          { id: 'ranged-attack', name: 'Ranged Attack', rank: 4 },
          { id: 'assessment', name: 'Assessment' },
        ],
      })
    );
    // 4 (ranked) + 1 (unranked) = 5.
    expect(result.system.powerPoints.spent.advantages).toBe(5);
  });

  it('charges a minimum of 1 PP for an advantage whose rank is 0', () => {
    const result = engine.prepareData(
      makeDoc({ advantages: [{ id: 'zero', name: 'Zero Rank', rank: 0 }] })
    );
    // rank 0 is not > 0, so it falls back to the 1 PP minimum.
    expect(result.system.powerPoints.spent.advantages).toBe(1);
  });
});

describe('Mam3eEngine rollCheck fall-through', () => {
  it('returns a flat d20 with no modifier and empty flavor for an unknown check id', async () => {
    const result = await engine.rollCheck(makeDoc({ abilities: ZERO_ABILITIES }), 'not-a-trait');
    expect(result.formula).toBe('1d20 + 0');
    expect(result.flavor).toBe('');
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.total).toBeLessThanOrEqual(20);
  });

  it('rolls a skill with no ability mapping off its rank alone (abilityRank 0)', async () => {
    // A custom skill id is in data.skills but absent from SKILL_ABILITY_MAP, so
    // the abilityKey ternary takes its false arm and contributes 0.
    const doc = makeDoc({
      abilities: { ...ZERO_ABILITIES, int: 5 },
      skills: { 'custom-lore': { rank: 4, total: 4 } },
    });
    const result = await engine.rollCheck(doc, 'custom-lore');
    // No mapping -> ability rank ignored; modifier is the skill rank only.
    expect(result.formula).toBe('1d20 + 4');
    expect(result.flavor).toBe('custom lore Check');
  });
});

describe('Mam3eEngine applyDamage guard', () => {
  it('leaves the condition track untouched for a non-positive failure margin', () => {
    const doc = makeDoc({
      conditionTrack: { bruised: 1, dazed: true, staggered: false, incapacitated: false },
    });
    const result = engine.applyDamage(doc, 0, 'damage');
    // margin <= 0 returns early without applying a step.
    expect(result.system.conditionTrack).toEqual({
      bruised: 1,
      dazed: true,
      staggered: false,
      incapacitated: false,
    });
  });

  it('floors a fractional margin before banding (3.9 -> 3 -> Bruised only)', () => {
    const result = engine.applyDamage(makeDoc(), 3.9, 'damage');
    expect(result.system.conditionTrack.bruised).toBe(1);
    expect(result.system.conditionTrack.dazed).toBe(false);
  });
});
