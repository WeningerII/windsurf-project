import { Character, ClassLevel } from '../../types/core/character';
import { CharacterClass } from '../../types/character-options/classes';
import { LevelUpResult } from '../../types/progression/leveling';

export function levelUpCharacter(
  character: Character,
  classToLevel: string,
  hitPointRoll: number | 'max' | 'average',
  conModifier: number
): Character {
  const newLevel = character.level + 1;
  const hitDie = getHitDieForClass(classToLevel);
  const hitDieSize = parseInt(hitDie.substring(1));
  const hpRoll = resolveHitPointRoll(hitPointRoll, hitDieSize);
  
  // Find or create class level entry
  const classLevelIndex = character.classLevels.findIndex(
    cl => cl.classId === classToLevel
  );
  
  let updatedClassLevels: ClassLevel[];
  
  if (classLevelIndex >= 0) {
    // Level up existing class
    const classLevel = character.classLevels[classLevelIndex];
    const newClassLevel = classLevel.level + 1;
    
    updatedClassLevels = [...character.classLevels];
    updatedClassLevels[classLevelIndex] = {
      ...classLevel,
      level: newClassLevel,
      hitDieRolls: [...classLevel.hitDieRolls, hpRoll],
    };
  } else {
    // Multiclass into new class
    updatedClassLevels = [
      ...character.classLevels,
      {
        classId: classToLevel,
        level: 1,
        hitDieRolls: [hpRoll],
      },
    ];
  }
  
  // Calculate new HP
  const hpIncrease = hpRoll + conModifier;
  
  return {
    ...character,
    level: newLevel,
    classLevels: updatedClassLevels,
    hitPoints: {
      ...character.hitPoints,
      max: character.hitPoints.max + hpIncrease,
      current: character.hitPoints.current + hpIncrease,
    },
    updatedAt: new Date(),
  };
}

export function getLevelUpOptions(
  character: Character,
  characterClass: CharacterClass
): LevelUpResult {
  const nextLevel = character.level + 1;
  const classLevelForClass = character.classLevels.find(
    cl => cl.classId === characterClass.id
  );
  const nextClassLevel = classLevelForClass ? classLevelForClass.level + 1 : 1;
  
  // Find features for this level
  const levelFeatures = characterClass.features.find(f => f.level === nextClassLevel);
  const featuresGained = levelFeatures?.features || [];
  
  // Check for ASI
  const hasASI = featuresGained.some(f => f.id.includes('ability-score-improvement'));
  
  // Check for subclass choice
  const needsSubclassChoice = nextClassLevel === characterClass.subclassLevel && !classLevelForClass?.subclassId;
  
  return {
    level: nextLevel,
    hitPointIncrease: 0, // Calculated separately
    featuresGained,
    proficienciesGained: [],
    abilityScoreImprovement: hasASI,
    subclassChoice: needsSubclassChoice,
  };
}

function resolveHitPointRoll(hitPointRoll: number | 'max' | 'average', hitDieSize: number): number {
  if (hitPointRoll === 'max') {
    return hitDieSize;
  }
  if (hitPointRoll === 'average') {
    return Math.floor(hitDieSize / 2) + 1;
  }
  return hitPointRoll;
}

function getHitDieForClass(classId: string): string {
  const hitDiceMap: Record<string, string> = {
    'barbarian': 'd12',
    'fighter': 'd10',
    'paladin': 'd10',
    'ranger': 'd10',
    'bard': 'd8',
    'cleric': 'd8',
    'druid': 'd8',
    'monk': 'd8',
    'rogue': 'd8',
    'warlock': 'd8',
    'sorcerer': 'd6',
    'wizard': 'd6',
  };
  
  return hitDiceMap[classId] || 'd8';
}
