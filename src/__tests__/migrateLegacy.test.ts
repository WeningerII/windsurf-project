import { describe, expect, it } from 'vitest';
import type { Character } from '../types/game-systems';
import { migrateLegacyCharacter, migrateLegacyCharacters } from '../utils/migrateLegacy';

function createLegacyCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 'legacy-1',
    name: 'Legacy Hero',
    system: 'dnd-5e-2014',
    level: 3,
    experiencePoints: 900,
    classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [8, 7, 6] }],
    baseAttributes: { str: 14, dex: 12, con: 13, int: 10, wis: 10, cha: 8 },
    skillProficiencies: {},
    hitPoints: { current: 24, max: 24, temp: 0 },
    hitDice: [{ die: 'd10', total: 3, remaining: 3 }],
    armorClass: 15,
    initiative: 1,
    speed: 30,
    armorProficiencies: [],
    weaponProficiencies: [],
    toolProficiencies: [],
    languageProficiencies: [],
    savingThrowProficiencies: ['str', 'con'],
    features: [],
    feats: [],
    equipment: [],
    inventory: [],
    currency: { copper: 0, silver: 0, electrum: 0, gold: 25, platinum: 0 },
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    ...overrides,
  };
}

describe('migrateLegacy', () => {
  it('migrates d20 legacy characters by preserving system payload fields', () => {
    const legacy = createLegacyCharacter({ name: 'D20 Hero', system: 'pf2e' });

    const migrated = migrateLegacyCharacter(legacy);

    expect(migrated.id).toBe(legacy.id);
    expect(migrated.name).toBe('D20 Hero');
    expect(migrated.systemId).toBe('pf2e');
    expect(migrated.system).toMatchObject({
      level: legacy.level,
      classLevels: legacy.classLevels,
      baseAttributes: legacy.baseAttributes,
      hitPoints: legacy.hitPoints,
    });
  });

  it('maps M&M legacy attributes into M&M document abilities', () => {
    const mamLegacy = createLegacyCharacter({
      system: 'mam3e',
      baseAttributes: { str: 3, dex: 4, con: 2, int: 5, wis: 1, cha: 6 },
    });

    const migrated = migrateLegacyCharacter(mamLegacy);

    expect(migrated.systemId).toBe('mam3e');
    expect(migrated.system).toMatchObject({
      powerLevel: 10,
      abilities: {
        str: 3,
        sta: 2,
        agi: 4,
        dex: 0,
        fgt: 0,
        int: 5,
        awe: 1,
        pre: 6,
      },
      powers: [],
      advantages: [],
      complications: [],
    });
  });

  it('defaults M&M ability mappings to zero when base attributes are missing', () => {
    const mamLegacyWithoutAttributes = {
      ...createLegacyCharacter({ system: 'mam3e' }),
      baseAttributes: undefined,
    } as unknown as Character;

    const migrated = migrateLegacyCharacter(mamLegacyWithoutAttributes);
    const system = migrated.system as {
      abilities: Record<string, number>;
    };

    expect(system.abilities).toMatchObject({
      str: 0,
      sta: 0,
      agi: 0,
      int: 0,
      awe: 0,
      pre: 0,
    });
  });

  it('migrates arrays of legacy characters', () => {
    const migrated = migrateLegacyCharacters([
      createLegacyCharacter({ id: 'one' }),
      createLegacyCharacter({ id: 'two', system: 'mam3e' }),
    ]);

    expect(migrated).toHaveLength(2);
    expect(migrated[0]?.id).toBe('one');
    expect(migrated[1]?.id).toBe('two');
  });
});
