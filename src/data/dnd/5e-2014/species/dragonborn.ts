import { Species } from '../../../../types/character-options/species';

export const dragonborn: Species = {
  id: 'dragonborn',
  name: 'Dragonborn',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: {
        str: 2,
        cha: 1,
      },
    },
  ],
  
  size: 'medium',
  speed: 30,
  
  languages: {
    automatic: ['Common', 'Draconic'],
  },
  
  traits: [
    {
      id: 'draconic-ancestry',
      name: 'Draconic Ancestry',
      source: 'Dragonborn',
      description: 'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type, as shown in the table.\n\nDragon - Damage Type - Breath Weapon\nBlack - Acid - 5 by 30 ft. line (Dex. save)\nBlue - Lightning - 5 by 30 ft. line (Dex. save)\nBrass - Fire - 5 by 30 ft. line (Dex. save)\nBronze - Lightning - 5 by 30 ft. line (Dex. save)\nCopper - Acid - 5 by 30 ft. line (Dex. save)\nGold - Fire - 15 ft. cone (Dex. save)\nGreen - Poison - 15 ft. cone (Con. save)\nRed - Fire - 15 ft. cone (Dex. save)\nSilver - Cold - 15 ft. cone (Con. save)\nWhite - Cold - 15 ft. cone (Con. save)',
    },
    {
      id: 'breath-weapon',
      name: 'Breath Weapon',
      source: 'Dragonborn',
      description: 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation. When you use your breath weapon, each creature in the area of the exhalation must make a saving throw, the type of which is determined by your draconic ancestry. The DC for this saving throw equals 8 + your Constitution modifier + your proficiency bonus. A creature takes 2d6 damage on a failed save, and half as much damage on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level. After you use your breath weapon, you can\'t use it again until you complete a short or long rest.',
      uses: {
        current: 1,
        max: 1,
        recoveryType: 'short-rest',
      },
    },
    {
      id: 'damage-resistance',
      name: 'Damage Resistance',
      source: 'Dragonborn',
      description: 'You have resistance to the damage type associated with your draconic ancestry.',
    },
  ],
  
  description: 'Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension.',
  
  ageInfo: 'Young dragonborn grow quickly. They walk hours after hatching, attain the size and development of a 10-year-old human child by the age of 3, and reach adulthood by 15. They live to be around 80.',
  
  alignmentTendency: 'Dragonborn tend to extremes, making a conscious choice for one side or the other in the cosmic war between good and evil.',
  
  sizeDescription: 'Dragonborn are taller and heavier than humans, standing well over 6 feet tall and averaging almost 250 pounds. Your size is Medium.',
};
