import { Species } from '../../../../types/character-options/species';

export const dragonborn: Species = {
  id: 'dragonborn',
  name: 'Dragonborn',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { str: 2, cha: 1 },
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
      description:
        'Your lineage stems from a dragon progenitor. Choose one kind of dragon from the Draconic Ancestry table. Your choice affects your Breath Weapon and Damage Resistance traits.',
    },
    {
      id: 'breath-weapon',
      name: 'Breath Weapon',
      source: 'Dragonborn',
      description:
        'When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy. Each creature in a 15-foot Cone or 30-foot Line must make a Dexterity saving throw (DC 8 + your Constitution modifier + your proficiency bonus). On a failed save, a creature takes 1d10 damage of the type associated with your Draconic Ancestry. On a successful save, a creature takes half as much damage. This damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10). You can use your Breath Weapon a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a Long Rest.',
    },
    {
      id: 'damage-resistance',
      name: 'Damage Resistance',
      source: 'Dragonborn',
      description: 'You have resistance to the damage type associated with your Draconic Ancestry.',
    },
    {
      id: 'draconic-flight',
      name: 'Draconic Flight',
      source: 'Dragonborn',
      description:
        "When you reach 5th level, you can channel draconic magic to give yourself temporary flight. As a Bonus Action, you sprout spectral wings on your back that last for 10 minutes or until you retract them (no action required). During that time, you have a Fly Speed equal to your Speed. Your wings appear to be made of the same energy as your Breath Weapon. Once you use this trait, you can't use it again until you finish a Long Rest.",
    },
  ],

  description:
    'Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension.',

  ageInfo:
    'Young dragonborn grow quickly. They walk hours after hatching, attain the size and development of a 10-year-old human child by the age of 3, and reach adulthood by 15. They live to be around 80.',

  alignmentTendency:
    'Dragonborn tend to extremes, making a conscious choice for one side or the other in the cosmic war between good and evil.',

  sizeDescription:
    'Dragonborn are taller and heavier than humans, standing well over 6 feet tall and averaging almost 250 pounds. Your size is Medium.',
};
