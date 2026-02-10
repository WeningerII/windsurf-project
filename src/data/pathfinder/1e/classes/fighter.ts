import { CharacterClass } from '../../../../types/character-options/classes';

export const fighter: CharacterClass = {
  id: 'fighter',
  name: 'Fighter',
  system: 'pf1e',
  source: 'Core Rulebook',
  
  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 55,
    url: 'https://www.d20pfsrd.com/classes/core-classes/fighter/'
  },
  
  hitDie: 'd10',
  primaryAbility: ['str'],
  savingThrowProficiencies: ['str', 'con'],
  
  armorProficiencies: ['light', 'medium', 'heavy', 'shields', 'tower-shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  
  skillProficiencies: {
    count: 2,
    options: ['climb', 'handle-animal', 'intimidate', 'knowledge-dungeoneering', 'knowledge-engineering', 'ride', 'survival', 'swim'],
    label: 'Choose class skills (2 + Int modifier ranks per level)',
  },
  
  equipmentChoices: [],
  
  startingGold: {
    dice: '5d6',
    multiplier: 10,
  },
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'bonus-feat-1',
          name: 'Bonus Feat',
          source: 'Fighter 1',
          description: 'At 1st level, and at every even level thereafter, a fighter gains a bonus feat in addition to those gained from normal advancement. These bonus feats must be selected from those listed as combat feats.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'bravery',
          name: 'Bravery',
          source: 'Fighter 2',
          description: 'Starting at 2nd level, a fighter gains a +1 bonus on Will saves against fear. This bonus increases by +1 for every four levels beyond 2nd.',
        },
        {
          id: 'bonus-feat-2',
          name: 'Bonus Feat',
          source: 'Fighter 2',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'armor-training-1',
          name: 'Armor Training',
          source: 'Fighter 3',
          description: 'Starting at 3rd level, a fighter learns to be more maneuverable while wearing armor. Whenever he is wearing armor, he reduces the armor check penalty by 1 (to a minimum of 0) and increases the maximum Dexterity bonus allowed by his armor by 1. Every four levels thereafter (7th, 11th, and 15th), these bonuses increase by +1 each time.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'bonus-feat-4',
          name: 'Bonus Feat',
          source: 'Fighter 4',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'weapon-training-1',
          name: 'Weapon Training',
          source: 'Fighter 5',
          description: 'Starting at 5th level, a fighter can select one group of weapons. Whenever he attacks with a weapon from this group, he gains a +1 bonus on attack and damage rolls. Every four levels thereafter (9th, 13th, and 17th), a fighter becomes further trained in another group of weapons. He gains a +1 bonus on attack and damage rolls when using a weapon from this group.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'bravery-2',
          name: 'Bravery (+2)',
          source: 'Fighter 6',
          description: 'The fighter\'s bonus on Will saves against fear increases to +2.',
        },
        {
          id: 'bonus-feat-6',
          name: 'Bonus Feat',
          source: 'Fighter 6',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'armor-training-2',
          name: 'Armor Training (+2)',
          source: 'Fighter 7',
          description: 'The fighter\'s armor training bonuses increase to +2.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'bonus-feat-8',
          name: 'Bonus Feat',
          source: 'Fighter 8',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'weapon-training-2',
          name: 'Weapon Training (+2)',
          source: 'Fighter 9',
          description: 'The fighter selects another weapon group and gains +1 with it. Previous weapon group bonuses increase by +1.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'bravery-3',
          name: 'Bravery (+3)',
          source: 'Fighter 10',
          description: 'The fighter\'s bonus on Will saves against fear increases to +3.',
        },
        {
          id: 'bonus-feat-10',
          name: 'Bonus Feat',
          source: 'Fighter 10',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'armor-training-3',
          name: 'Armor Training (+3)',
          source: 'Fighter 11',
          description: 'The fighter\'s armor training bonuses increase to +3.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'bonus-feat-12',
          name: 'Bonus Feat',
          source: 'Fighter 12',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'weapon-training-3',
          name: 'Weapon Training (+3)',
          source: 'Fighter 13',
          description: 'The fighter selects another weapon group and gains +1 with it. Previous weapon group bonuses increase by +1.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'bravery-4',
          name: 'Bravery (+4)',
          source: 'Fighter 14',
          description: 'The fighter\'s bonus on Will saves against fear increases to +4.',
        },
        {
          id: 'bonus-feat-14',
          name: 'Bonus Feat',
          source: 'Fighter 14',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'armor-training-4',
          name: 'Armor Training (+4)',
          source: 'Fighter 15',
          description: 'The fighter\'s armor training bonuses increase to +4.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'bonus-feat-16',
          name: 'Bonus Feat',
          source: 'Fighter 16',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'weapon-training-4',
          name: 'Weapon Training (+4)',
          source: 'Fighter 17',
          description: 'The fighter selects another weapon group and gains +1 with it. Previous weapon group bonuses increase by +1.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'bravery-5',
          name: 'Bravery (+5)',
          source: 'Fighter 18',
          description: 'The fighter\'s bonus on Will saves against fear increases to +5.',
        },
        {
          id: 'bonus-feat-18',
          name: 'Bonus Feat',
          source: 'Fighter 18',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'armor-mastery',
          name: 'Armor Mastery',
          source: 'Fighter 19',
          description: 'At 19th level, a fighter gains DR 5/— whenever he is wearing armor or using a shield.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'weapon-mastery',
          name: 'Weapon Mastery',
          source: 'Fighter 20',
          description: 'At 20th level, a fighter chooses one weapon, such as the longsword, greataxe, or longbow. Any attacks made with that weapon automatically confirm all critical threats and have their damage multiplier increased by 1 (×2 becomes ×3, for example). In addition, he cannot be disarmed while wielding a weapon of this type.',
        },
        {
          id: 'bonus-feat-20',
          name: 'Bonus Feat',
          source: 'Fighter 20',
          description: 'The fighter gains a bonus combat feat.',
        },
      ],
    },
  ],
  
  subclassLevel: 0,
  subclasses: [],
  
  classResources: [],
  
  multiclassRequirements: [],
  
  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },
  
  description: 'Some take up arms for glory, wealth, or revenge. Others do battle to prove themselves, to protect others, or because they know nothing else. Still others learn the ways of weaponcraft to hone their bodies in battle and prove their mettle in the forge of war.',
  
  displayMetadata: {
    icon: 'sword',
    color: '#8B4513',
    shortDescription: 'A master of martial combat with unparalleled weapon and armor skills.',
    playStyle: 'Combat specialist with bonus feats and weapon mastery',
    complexity: 'simple',
    role: 'striker',
    idealFor: ['Combat-focused players', 'Feat optimizers', 'Beginners'],
    tags: ['martial', 'melee', 'versatile'],
  },
};
