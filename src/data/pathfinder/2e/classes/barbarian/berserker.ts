import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Barbarian Berserker Subclass
export const berserkerSubclass: Subclass = {
  id: 'pf2e-barbarian-berserker',
  name: 'Berserker',
  parentClassId: 'barbarian',
  description: 'A warrior who enters an uncontrollable rage, becoming a whirlwind of destruction.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'berserker-rage',
          name: 'Berserker Rage',
          source: 'Barbarian 1',
          description: 'You can enter a berserker rage, gaining bonuses to melee damage and taking penalties to AC. While raging, you can only use melee attacks and can\'t use ranged weapons.',
        },
        {
          id: 'rage-damage',
          name: 'Rage Damage',
          source: 'Barbarian 1',
          description: 'While raging, your melee attacks deal an extra 2 damage.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'reckless-attack',
          name: 'Reckless Attack',
          source: 'Barbarian 2',
          description: 'While raging, you can make reckless attacks. You gain advantage on melee attack rolls, but attack rolls against you have advantage.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'berserker-feat',
          name: 'Berserker Feat',
          source: 'Barbarian 3',
          description: 'You gain a special feat related to your berserker abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'relentless-rage',
          name: 'Relentless Rage',
          source: 'Barbarian 4',
          description: 'Your rage can continue even when you don\'t attack. If you don\'t attack or take damage during your turn, your rage continues.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'berserker-mastery',
          name: 'Berserker Mastery',
          source: 'Barbarian 5',
          description: 'Your rage becomes more powerful. Increase the damage bonus to +3.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-berserker-feat',
          name: 'Advanced Berserker Feat',
          source: 'Barbarian 6',
          description: 'You gain an advanced feat related to your berserker abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'unstoppable-rage',
          name: 'Unstoppable Rage',
          source: 'Barbarian 7',
          description: 'While raging, you gain resistance to all damage.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'mighty-strikes',
          name: 'Mighty Strikes',
          source: 'Barbarian 8',
          description: 'Your melee attacks can now knock enemies prone.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'berserker-ultimate-feat',
          name: 'Ultimate Berserker Feat',
          source: 'Barbarian 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your berserker abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'berserker-perfection',
          name: 'Berserker Perfection',
          source: 'Barbarian 10',
          description: 'You have perfected your berserker abilities. Increase the damage bonus to +4.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-berserker-feat',
          name: 'Master Berserker Feat',
          source: 'Barbarian 11',
          description: 'You gain a master-level feat related to your berserker abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'whirlwind-attack',
          name: 'Whirlwind Attack',
          source: 'Barbarian 12',
          description: 'While raging, you can make melee attacks against all creatures within reach.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'berserker-supreme-feat',
          name: 'Supreme Berserker Feat',
          source: 'Barbarian 13',
          description: 'You gain a supreme feat that represents mastery of berserker rage.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-rage',
          name: 'Immortal Rage',
          source: 'Barbarian 14',
          description: 'Your rage can last indefinitely. Increase the damage bonus to +5.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'berserker-apex-feat',
          name: 'Apex Berserker Feat',
          source: 'Barbarian 15',
          description: 'You gain an apex feat that represents the ultimate expression of your berserker abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'titan-rage',
          name: 'Titan Rage',
          source: 'Barbarian 16',
          description: 'While raging, you become as large as a giant and your attacks deal double damage.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'berserker-transcendent-feat',
          name: 'Transcendent Berserker Feat',
          source: 'Barbarian 17',
          description: 'You gain a transcendent feat that goes beyond normal berserker abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-rage',
          name: 'Perfect Rage',
          source: 'Barbarian 18',
          description: 'Your rage is perfect. Increase the damage bonus to +6.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'berserker-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Barbarian 19',
          description: 'You gain the ultimate mastery feat for your berserker abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'berserker-ascension',
          name: 'Berserker Ascension',
          source: 'Barbarian 20',
          description: 'You have ascended to the pinnacle of berserker mastery. You gain all benefits of your berserker abilities at their maximum potency.',
        },
      ],
    },
  ],
};
