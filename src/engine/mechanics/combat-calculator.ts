import { Character } from '../../types/core/character';
import { ArmorClassCalculation, Initiative } from '../../types/mechanics/combat';

export function calculateArmorClass(
  _character: Character,
  dexModifier: number
): ArmorClassCalculation {
  // Base AC calculation
  const base = 10;
  const armorBonus = 0; // Calculated from equipped armor
  const shieldBonus = 0; // Calculated from equipped shield
  const dexBonus = dexModifier;
  const dexMaxBonus = undefined; // Determined by armor type
  const naturalArmor = 0; // From racial features
  const miscModifiers = 0; // From items, spells, and features
  
  const effectiveDexBonus = dexMaxBonus !== undefined 
    ? Math.min(dexBonus, dexMaxBonus) 
    : dexBonus;
  
  const total = base + armorBonus + shieldBonus + effectiveDexBonus + naturalArmor + miscModifiers;
  
  return {
    base,
    armorBonus,
    shieldBonus,
    dexModifier: effectiveDexBonus,
    dexMaxBonus,
    naturalArmor,
    miscModifiers,
    total,
  };
}

export function calculateInitiative(
  dexModifier: number,
  bonuses: number = 0,
  advantage: boolean = false
): Initiative {
  return {
    dexModifier,
    bonuses,
    advantage,
    total: dexModifier + bonuses,
  };
}

export function calculateMaxHitPoints(
  character: Character,
  conModifier: number
): number {
  let maxHP = 0;
  
  for (const classLevel of character.classLevels) {
    // First level is always max
    const hitDie = getHitDieForClass(classLevel.classId);
    const hitDieSize = parseInt(hitDie.substring(1));
    
    if (classLevel.hitDieRolls.length === 0) {
      // First level
      maxHP += hitDieSize + conModifier;
    } else {
      // Sum rolled HP
      for (const roll of classLevel.hitDieRolls) {
        maxHP += roll + conModifier;
      }
    }
  }
  
  // Additional HP from features (e.g., Dwarven Toughness, Tough feat) can be added here
  
  return Math.max(maxHP, character.level); // Minimum 1 HP per level
}

function getHitDieForClass(classId: string): string {
  // Hit die mapping by class
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
