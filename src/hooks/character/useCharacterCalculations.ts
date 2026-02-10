import { useMemo } from 'react';
import { Character } from '../../types/core/character';
import { Species } from '../../types/character-options/species';
import { computeAllAttributes } from '../../engine/mechanics/attribute-calculator';
import { calculateArmorClass, calculateInitiative } from '../../engine/mechanics/combat-calculator';
import { calculateProficiencyBonus } from '../../engine/core/calculator';

export function useCharacterCalculations(character: Character, species?: Species) {
  const attributes = useMemo(() => {
    return computeAllAttributes(character, species);
  }, [character, species]);
  
  const proficiencyBonus = useMemo(() => {
    return calculateProficiencyBonus(character.level);
  }, [character.level]);
  
  const armorClass = useMemo(() => {
    return calculateArmorClass(character, attributes.dex.modifier);
  }, [character, attributes.dex.modifier]);
  
  const initiative = useMemo(() => {
    return calculateInitiative(attributes.dex.modifier);
  }, [attributes.dex.modifier]);
  
  return {
    attributes,
    proficiencyBonus,
    armorClass,
    initiative,
  };
}
