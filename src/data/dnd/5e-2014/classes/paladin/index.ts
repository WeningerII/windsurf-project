import { CharacterClass } from '../../../../../types/character-options/classes';
import { devotionSubclass } from './devotion';

export const paladin: CharacterClass = {
  id: 'paladin',
  name: 'Paladin',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',

  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
  },

  hitDie: 'd10',
  primaryAbility: ['str', 'cha'],
  savingThrowProficiencies: ['wis', 'cha'],

  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 2,
    options: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
    label: 'Choose two skills',
  },

  equipmentChoices: [
    {
      choose: 1,
      options: [
        ['martial-weapon', 'shield'],
        ['martial-weapon', 'martial-weapon'],
      ],
    },
    {
      choose: 1,
      options: [['javelin', 'javelin', 'javelin', 'javelin', 'javelin'], ['simple-melee-weapon']],
    },
    {
      choose: 1,
      options: [['priests-pack'], ['explorers-pack']],
    },
    {
      choose: 1,
      options: [['chain-mail', 'holy-symbol']],
    },
  ],

  startingGold: {
    dice: '5d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'divine-sense',
          name: 'Divine Sense',
          source: 'Paladin 1',
          description:
            'The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity. Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the hallow spell.\n\nYou can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'lay-on-hands',
          name: 'Lay on Hands',
          source: 'Paladin 1',
          description:
            'Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5.\n\nAs an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.\n\nAlternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.\n\nThis feature has no effect on undead and constructs.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'fighting-style-paladin',
          name: 'Fighting Style',
          source: 'Paladin 2',
          description:
            "At 2nd level, you adopt a style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again.\n\nDefense: While you are wearing armor, you gain a +1 bonus to AC.\n\nDueling: When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.\n\nGreat Weapon Fighting: When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property for you to gain this benefit.\n\nProtection: When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.",
        },
        {
          id: 'spellcasting-paladin',
          name: 'Spellcasting',
          source: 'Paladin 2',
          description:
            'By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does.',
        },
        {
          id: 'divine-smite',
          name: 'Divine Smite',
          source: 'Paladin 2',
          description:
            "Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend, to a maximum of 6d8.",
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'divine-health',
          name: 'Divine Health',
          source: 'Paladin 3',
          description:
            'By 3rd level, the divine magic flowing through you makes you immune to disease.',
        },
        {
          id: 'sacred-oath',
          name: 'Sacred Oath',
          source: 'Paladin 3',
          description:
            'When you reach 3rd level, you swear the oath that binds you as a paladin forever.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Paladin 4',
          description:
            'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'extra-attack-paladin',
          name: 'Extra Attack',
          source: 'Paladin 5',
          description:
            'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'aura-of-protection',
          name: 'Aura of Protection',
          source: 'Paladin 6',
          description:
            'Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.\n\nAt 18th level, the range of this aura increases to 30 feet.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'sacred-oath-7',
          name: 'Sacred Oath Feature',
          source: 'Paladin 7',
          description: 'At 7th level, you gain a feature from your Sacred Oath.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Paladin 8',
          description:
            'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [],
    },
    {
      level: 10,
      features: [
        {
          id: 'aura-of-courage',
          name: 'Aura of Courage',
          source: 'Paladin 10',
          description:
            "Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.\n\nAt 18th level, the range of this aura increases to 30 feet.",
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'improved-divine-smite',
          name: 'Improved Divine Smite',
          source: 'Paladin 11',
          description:
            'By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Paladin 12',
          description:
            'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [],
    },
    {
      level: 14,
      features: [
        {
          id: 'cleansing-touch',
          name: 'Cleansing Touch',
          source: 'Paladin 14',
          description:
            'Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.\n\nYou can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain expended uses when you finish a long rest.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'sacred-oath-15',
          name: 'Sacred Oath Feature',
          source: 'Paladin 15',
          description: 'At 15th level, you gain a feature from your Sacred Oath.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Paladin 16',
          description:
            'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
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
          id: 'aura-improvements',
          name: 'Aura Improvements',
          source: 'Paladin 18',
          description: 'At 18th level, the range of your auras increase to 30 feet.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Paladin 19',
          description:
            'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'sacred-oath-20',
          name: 'Sacred Oath Feature',
          source: 'Paladin 20',
          description: 'At 20th level, you gain a feature from your Sacred Oath.',
        },
      ],
    },
  ],

  subclassLevel: 3,
  subclasses: [devotionSubclass],

  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you swear the oath that binds you as a paladin.',
  }, // SRD: Oath of Devotion only

  classResources: [
    {
      id: 'lay-on-hands',
      name: 'Lay on Hands',
      maxFormula: 'level * 5',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
    {
      id: 'channel-divinity',
      name: 'Channel Divinity',
      maxFormula: '1',
      recoveryType: 'short-rest',
      displayOrder: 2,
      defaultValue: 1,
    },
  ],

  spellcasting: {
    ability: 'cha',
    spellListId: 'paladin',
    preparedCasterFormula: 'cha_modifier + (paladin_level / 2)',
    spellSlots: {
      1: [0, 0, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      2: [0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      3: [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 3],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'half',
  },

  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Strength 13 and Charisma 13',
    },
  ],

  multiclassProficiencies: {
    armor: ['light', 'medium', 'shields'],
    weapons: ['simple', 'martial'],
    tools: [],
  },

  description: 'A holy warrior bound to a sacred oath.',

  displayMetadata: {
    icon: 'shield',
    color: '#FFD700',
    shortDescription: 'A holy warrior bound by sacred oaths to uphold justice.',
    playStyle: 'Melee combatant with divine magic and healing',
    complexity: 'moderate',
    role: 'hybrid',
    idealFor: ['Players who like paladins', 'Support warriors'],
    tags: ['martial', 'divine', 'melee', 'tank', 'support'],
    casterType: 'half',
  },
};
