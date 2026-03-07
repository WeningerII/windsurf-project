import { CharacterClass } from '../../../../../types/character-options/classes';
import { openHandSubclass } from './open-hand';

export const monk: CharacterClass = {
  id: 'monk',
  name: 'Monk',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
  },

  hitDie: 'd8',
  primaryAbility: ['dex', 'wis'],
  savingThrowProficiencies: ['str', 'dex'],

  armorProficiencies: [],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [
    {
      count: 1,
      options: ['artisans-tools', 'musical-instrument'],
      label: "Choose one type of artisan's tools or one musical instrument",
    },
  ],

  skillProficiencies: {
    count: 2,
    options: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
    label: 'Choose two skills',
  },

  equipmentChoices: [
    {
      choose: 1,
      options: [['shortsword'], ['simple-weapon']],
    },
    {
      choose: 1,
      options: [['dungeoneers-pack'], ['explorers-pack']],
    },
    {
      choose: 1,
      options: [
        ['spear', 'spear', 'spear', 'spear', 'spear', 'spear', 'spear', 'spear', 'spear', 'spear'],
      ],
    },
  ],

  startingGold: {
    dice: '5d4',
    multiplier: 1,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'martial-arts',
          name: 'Martial Arts',
          source: 'Monk 1',
          description:
            'Your practice of martial arts gives you mastery of combat styles that use Unarmed Strikes and Monk Weapons. Your Martial Arts die is a d6. It increases as you gain Monk levels. You can use Dexterity instead of Strength for attack and damage rolls of your Unarmed Strikes and Monk Weapons. When you use the Attack action with an Unarmed Strike or a Monk Weapon, you can make one Unarmed Strike as a Bonus Action.',
        },
        {
          id: 'unarmored-defense-monk',
          name: 'Unarmored Defense',
          source: 'Monk 1',
          description:
            'While you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'monks-focus',
          name: "Monk's Focus",
          source: 'Monk 2',
          description:
            'Your training allows you to harness a well of extraordinary energy within yourself. Your access to this energy is represented by a number of Focus Points equal to your Monk level. You can spend these points to fuel various features: Flurry of Blows (1 point), Patient Defense (1 point), Step of the Wind (1 point).',
          uses: {
            current: 2,
            max: 2,
            recoveryType: 'short-rest',
          },
        },
        {
          id: 'unarmored-movement',
          name: 'Unarmored Movement',
          source: 'Monk 2',
          description:
            'Your Speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain Monk levels.',
        },
        {
          id: 'uncanny-metabolism',
          name: 'Uncanny Metabolism',
          source: 'Monk 2',
          description:
            "When you roll Initiative, you can regain all expended Focus Points. When you do so, you regain a number of Hit Points equal to your Monk level + your Monk's Focus die roll. Once you use this feature, you can't use it again until you finish a Long Rest.",
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'monastic-tradition',
          name: 'Monk Subclass',
          source: 'Monk 3',
          description: 'You commit yourself to a monastic tradition.',
        },
        {
          id: 'deflect-attacks',
          name: 'Deflect Attacks',
          source: 'Monk 3',
          description:
            "When you are hit by an attack roll, you can use your Reaction to reduce the damage by 1d10 + your Dexterity modifier + your Monk level. If you reduce the damage to 0, you can spend 1 Focus Point to redirect some of the attack's force. If you do so, you can make a melee or ranged attack against a creature within 60 feet of you.",
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Monk 4',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
        {
          id: 'slow-fall',
          name: 'Slow Fall',
          source: 'Monk 4',
          description:
            'You can use your Reaction when you fall to reduce any falling damage you take by an amount equal to five times your Monk level.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'extra-attack-monk',
          name: 'Extra Attack',
          source: 'Monk 5',
          description:
            'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
        },
        {
          id: 'stunning-strike',
          name: 'Stunning Strike',
          source: 'Monk 5',
          description:
            'Once per turn when you hit a creature with a Monk Weapon or an Unarmed Strike, you can spend 1 Focus Point to attempt a stunning strike. The target must succeed on a Constitution saving throw or have the Stunned condition until the start of your next turn.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'empowered-strikes',
          name: 'Empowered Strikes',
          source: 'Monk 6',
          description:
            'Your Unarmed Strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. You can also deal Force damage instead of Bludgeoning damage with your Unarmed Strikes.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'evasion-monk',
          name: 'Evasion',
          source: 'Monk 7',
          description:
            'When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Monk 8',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'acrobatic-movement',
          name: 'Acrobatic Movement',
          source: 'Monk 9',
          description:
            'You gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'heightened-focus',
          name: 'Heightened Focus',
          source: 'Monk 10',
          description:
            'Your Flurry of Blows now grants three Unarmed Strikes. Your Patient Defense now grants Temporary Hit Points. Your Step of the Wind now allows you to move a willing creature with you.',
        },
        {
          id: 'self-restoration',
          name: 'Self-Restoration',
          source: 'Monk 10',
          description:
            "You can use a Bonus Action to remove the Charmed, Frightened, or Poisoned condition from yourself. In addition, you don't suffer a level of Exhaustion from going without food or water.",
        },
      ],
    },
    {
      level: 11,
      features: [],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Monk 12',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'deflect-energy',
          name: 'Deflect Energy',
          source: 'Monk 13',
          description:
            'You can now use your Deflect Attacks feature against attacks that deal any damage type, not just Bludgeoning, Piercing, or Slashing.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'disciplined-survivor',
          name: 'Disciplined Survivor',
          source: 'Monk 14',
          description:
            'You gain proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 Focus Point to reroll it and take the second result.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'perfect-focus',
          name: 'Perfect Focus',
          source: 'Monk 15',
          description:
            'If you roll Initiative and have no Focus Points remaining, you regain 4 Focus Points.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Monk 16',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [],
    },
    {
      level: 18,
      features: [
        {
          id: 'superior-defense',
          name: 'Superior Defense',
          source: 'Monk 18',
          description:
            'At the start of your turn, you can spend 3 Focus Points to gain Resistance to all damage types except Force damage for 1 minute or until you have the Incapacitated condition.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Monk 19',
          description:
            'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
        },
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Monk 19',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'body-and-mind',
          name: 'Body and Mind',
          source: 'Monk 20',
          description:
            'Your Dexterity and Wisdom scores increase by 4. Your maximum for those scores is now 26.',
        },
      ],
    },
  ],

  subclassLevel: 3,
  subclasses: [openHandSubclass],

  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose a Monastic Tradition.',
  },

  classResources: [
    {
      id: 'focus-points',
      name: 'Focus Points',
      maxFormula: 'level',
      recoveryType: 'short-rest',
      displayOrder: 1,
    },
    {
      id: 'martial-arts-die',
      name: 'Martial Arts Die',
      maxFormula: 'level >= 17 ? "d12" : level >= 11 ? "d10" : level >= 5 ? "d8" : "d6"',
      recoveryType: 'long-rest',
      displayOrder: 2,
    },
  ],

  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Dexterity 13 and Wisdom 13',
    },
  ],

  multiclassProficiencies: {
    armor: [],
    weapons: ['simple', 'martial'],
    tools: [],
  },

  description:
    'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',

  displayMetadata: {
    icon: 'fist',
    color: '#4169E1',
    shortDescription: 'A martial artist who harnesses focus energy for supernatural abilities.',
    playStyle: 'Mobile melee striker with special powers',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Tactical players', 'Players who like mobility'],
    tags: ['martial', 'melee', 'versatile'],
    casterType: 'none',
  },
};
