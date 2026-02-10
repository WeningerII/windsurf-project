import { describe, it, expect } from 'vitest';
import { calculateMulticlassSpellSlots } from '../engine/multiclassing/spell-slot-calculator';
import { levelUpCharacter } from '../engine/progression/level-up-engine';
import { Character } from '../types/core/character';

const createCharacter = (overrides: Partial<Character> = {}): Character => ({
  id: 'char-1',
  name: 'Test Character',
  system: 'dnd-5e-2014',
  level: 1,
  experiencePoints: 0,
  speciesId: undefined,
  classLevels: [],
  backgroundId: undefined,
  alignmentId: undefined,
  baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skillProficiencies: {},
  skillRanks: {},
  hitPoints: { current: 10, max: 10, temp: 0 },
  hitDice: [],
  armorClass: 10,
  initiative: 0,
  speed: 30,
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  languageProficiencies: [],
  savingThrowProficiencies: [],
  features: [],
  feats: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
  createdAt: new Date('2020-01-01T00:00:00Z'),
  updatedAt: new Date('2020-01-01T00:00:00Z'),
  ...overrides,
});

describe('Multiclass spell slots', () => {
  it('returns empty slots for non-casters', () => {
    const character = createCharacter({
      classLevels: [{ classId: 'fighter', subclassId: 'champion', level: 3, hitDieRolls: [10, 6, 6] }],
      level: 3,
    });
    const slots = calculateMulticlassSpellSlots(character);
    const allZero = Object.values(slots).every(slot => slot.max === 0 && slot.used === 0);
    expect(allZero).toBe(true);
  });

  it('counts eligible third-caster subclasses', () => {
    const character = createCharacter({
      classLevels: [{ classId: 'fighter', subclassId: 'eldritch-knight', level: 3, hitDieRolls: [10, 6, 6] }],
      level: 3,
    });
    const slots = calculateMulticlassSpellSlots(character);
    expect(slots[1].max).toBe(2);
    expect(slots[2].max).toBe(0);
  });

  it('combines full and half casters correctly', () => {
    const character = createCharacter({
      classLevels: [
        { classId: 'wizard', level: 1, hitDieRolls: [6] },
        { classId: 'paladin', level: 2, hitDieRolls: [10, 6] },
      ],
      level: 3,
    });
    const slots = calculateMulticlassSpellSlots(character);
    expect(slots[1].max).toBe(3);
    expect(slots[2].max).toBe(0);
  });
});

describe('Level-up HP consistency', () => {
  it('stores the same roll used for HP increase when multiclassing', () => {
    const character = createCharacter({
      classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [10] }],
      level: 1,
      hitPoints: { current: 10, max: 10, temp: 0 },
    });

    const updated = levelUpCharacter(character, 'wizard', 'average', 2);
    const wizardLevel = updated.classLevels.find(cl => cl.classId === 'wizard');

    expect(wizardLevel?.hitDieRolls).toEqual([4]);
    expect(updated.hitPoints.max).toBe(16);
    expect(updated.hitPoints.current).toBe(16);
  });
});
