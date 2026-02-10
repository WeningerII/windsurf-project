import { Character, ClassLevel, SpellSlots } from '../../types/core/character';
import { CasterType } from '../../types/progression/multiclassing';

// Multiclass spell slot table (D&D 5e)
const MULTICLASS_SPELL_SLOTS: Record<number, SpellSlots> = {
  1: { 1: { max: 2, used: 0 }, 2: { max: 0, used: 0 }, 3: { max: 0, used: 0 }, 4: { max: 0, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  2: { 1: { max: 3, used: 0 }, 2: { max: 0, used: 0 }, 3: { max: 0, used: 0 }, 4: { max: 0, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  3: { 1: { max: 4, used: 0 }, 2: { max: 2, used: 0 }, 3: { max: 0, used: 0 }, 4: { max: 0, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  4: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 0, used: 0 }, 4: { max: 0, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  5: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 2, used: 0 }, 4: { max: 0, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  6: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 0, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  7: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 1, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  8: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 2, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  9: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 1, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  10: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 2, used: 0 }, 6: { max: 0, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  11: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 2, used: 0 }, 6: { max: 1, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  12: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 2, used: 0 }, 6: { max: 1, used: 0 }, 7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  13: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 2, used: 0 }, 6: { max: 1, used: 0 }, 7: { max: 1, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  14: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 2, used: 0 }, 6: { max: 1, used: 0 }, 7: { max: 1, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 } },
  15: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 2, used: 0 }, 6: { max: 1, used: 0 }, 7: { max: 1, used: 0 }, 8: { max: 1, used: 0 }, 9: { max: 0, used: 0 } },
  16: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 2, used: 0 }, 6: { max: 1, used: 0 }, 7: { max: 1, used: 0 }, 8: { max: 1, used: 0 }, 9: { max: 0, used: 0 } },
  17: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 2, used: 0 }, 6: { max: 1, used: 0 }, 7: { max: 1, used: 0 }, 8: { max: 1, used: 0 }, 9: { max: 1, used: 0 } },
  18: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 3, used: 0 }, 6: { max: 1, used: 0 }, 7: { max: 1, used: 0 }, 8: { max: 1, used: 0 }, 9: { max: 1, used: 0 } },
  19: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 3, used: 0 }, 6: { max: 2, used: 0 }, 7: { max: 1, used: 0 }, 8: { max: 1, used: 0 }, 9: { max: 1, used: 0 } },
  20: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 }, 3: { max: 3, used: 0 }, 4: { max: 3, used: 0 }, 5: { max: 3, used: 0 }, 6: { max: 2, used: 0 }, 7: { max: 2, used: 0 }, 8: { max: 1, used: 0 }, 9: { max: 1, used: 0 } },
};

const createEmptySpellSlots = (): SpellSlots => ({
  1: { max: 0, used: 0 },
  2: { max: 0, used: 0 },
  3: { max: 0, used: 0 },
  4: { max: 0, used: 0 },
  5: { max: 0, used: 0 },
  6: { max: 0, used: 0 },
  7: { max: 0, used: 0 },
  8: { max: 0, used: 0 },
  9: { max: 0, used: 0 },
});

export function calculateMulticlassSpellSlots(character: Character): SpellSlots {
  let casterLevel = 0;
  
  for (const classLevel of character.classLevels) {
    const casterType = getCasterTypeForClass(classLevel);
    
    switch (casterType) {
      case 'full':
        casterLevel += classLevel.level;
        break;
      case 'half':
        casterLevel += Math.floor(classLevel.level / 2);
        break;
      case 'third':
        casterLevel += Math.floor(classLevel.level / 3);
        break;
      case 'pact':
        // Warlock uses separate pact magic system
        break;
    }
  }
  
  casterLevel = Math.max(0, Math.min(20, casterLevel));
  if (casterLevel === 0) {
    return createEmptySpellSlots();
  }
  return MULTICLASS_SPELL_SLOTS[casterLevel];
}

function getCasterTypeForClass(classLevel: ClassLevel): CasterType {
  const { classId, subclassId } = classLevel;
  const casterTypes: Record<string, CasterType> = {
    'bard': 'full',
    'cleric': 'full',
    'druid': 'full',
    'sorcerer': 'full',
    'wizard': 'full',
    'paladin': 'half',
    'ranger': 'half',
    'warlock': 'pact',
    'barbarian': 'none',
    'monk': 'none',
  };
  
  if (classId === 'fighter') {
    return subclassId === 'eldritch-knight' ? 'third' : 'none';
  }
  if (classId === 'rogue') {
    return subclassId === 'arcane-trickster' ? 'third' : 'none';
  }
  return casterTypes[classId] || 'none';
}
