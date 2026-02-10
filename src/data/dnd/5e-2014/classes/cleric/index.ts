import { CharacterClass } from '../../../../../types/character-options/classes';
import { lifeDomainSubclass } from './life-domain';

export const cleric: CharacterClass = {
  id: 'cleric',
  name: 'Cleric',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
  },
  
  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['wis', 'cha'],
  
  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],
  
  skillProficiencies: {
    count: 2,
    options: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
    label: 'Choose two skills',
  },
  
  equipmentChoices: [
    {
      choose: 1,
      options: [
        ['mace'],
        ['warhammer'],
      ],
    },
    {
      choose: 1,
      options: [
        ['scale-mail'],
        ['leather-armor'],
        ['chain-mail'],
      ],
    },
    {
      choose: 1,
      options: [
        ['light-crossbow', 'bolts-20'],
        ['simple-weapon'],
      ],
    },
    {
      choose: 1,
      options: [
        ['priests-pack'],
        ['explorers-pack'],
      ],
    },
    {
      choose: 1,
      options: [
        ['shield', 'holy-symbol'],
      ],
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
          id: 'spellcasting-cleric',
          name: 'Spellcasting',
          source: 'Cleric 1',
          description: 'As a conduit for divine power, you can cast cleric spells.',
        },
        {
          id: 'divine-domain',
          name: 'Divine Domain',
          source: 'Cleric 1',
          description: 'Choose one domain related to your deity. Your choice grants you domain spells and other features when you choose it at 1st level. It also grants you additional ways to use Channel Divinity when you gain that feature at 2nd level, and additional benefits at 6th, 8th, and 17th levels.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'channel-divinity',
          name: 'Channel Divinity',
          source: 'Cleric 2',
          description: 'At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with two such effects: Turn Undead and an effect determined by your domain. Some domains grant you additional effects as you advance in levels, as noted in the domain description.\n\nWhen you use your Channel Divinity, you choose which effect to create. You must then finish a short or long rest to use your Channel Divinity again.\n\nSome Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your cleric spell save DC.\n\nBeginning at 6th level, you can use your Channel Divinity twice between rests, and beginning at 18th level, you can use it three times between rests. When you finish a short or long rest, you regain your expended uses.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'short-rest',
          },
        },
        {
          id: 'turn-undead',
          name: 'Channel Divinity: Turn Undead',
          source: 'Cleric 2',
          description: 'As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.\n\nA turned creature must spend its turns trying to move as far away from you as it can, and it can\'t willingly move to a space within 30 feet of you. It also can\'t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there\'s nowhere to move, the creature can use the Dodge action.',
        },
      ],
    },
    {
      level: 3,
      features: [],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Cleric 4',
          description: 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'destroy-undead',
          name: 'Destroy Undead',
          source: 'Cleric 5',
          description: 'Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold, as shown in the Destroy Undead table.\n\nCleric Level | Destroys Undead of CR...\n5th | 1/2 or lower\n8th | 1 or lower\n11th | 2 or lower\n14th | 3 or lower\n17th | 4 or lower',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'channel-divinity-2',
          name: 'Channel Divinity (2/rest)',
          source: 'Cleric 6',
          description: 'Beginning at 6th level, you can use your Channel Divinity twice between rests.',
        },
        {
          id: 'domain-feature-6',
          name: 'Divine Domain Feature',
          source: 'Cleric 6',
          description: 'At 6th level, you gain a feature from your Divine Domain.',
        },
      ],
    },
    {
      level: 7,
      features: [],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Cleric 8',
          description: 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
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
          id: 'divine-intervention',
          name: 'Divine Intervention',
          source: 'Cleric 10',
          description: 'Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great.\n\nImploring your deity\'s aid requires you to use your action. Describe the assistance you seek, and roll percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes. The DM chooses the nature of the intervention; the effect of any cleric spell or cleric domain spell would be appropriate.\n\nIf your deity intervenes, you can\'t use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest.\n\nAt 20th level, your call for intervention succeeds automatically, no roll required.',
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
          source: 'Cleric 12',
          description: 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [],
    },
    {
      level: 14,
      features: [],
    },
    {
      level: 15,
      features: [],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Cleric 16',
          description: 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'domain-feature-17',
          name: 'Divine Domain Feature',
          source: 'Cleric 17',
          description: 'At 17th level, you gain a feature from your Divine Domain.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'channel-divinity-3',
          name: 'Channel Divinity (3/rest)',
          source: 'Cleric 18',
          description: 'Beginning at 18th level, you can use your Channel Divinity three times between rests.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Cleric 19',
          description: 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'divine-intervention-improvement',
          name: 'Divine Intervention Improvement',
          source: 'Cleric 20',
          description: 'At 20th level, your call for divine intervention succeeds automatically, no roll required.',
        },
      ],
    },
  ],
  
  subclassLevel: 1,
  subclasses: [lifeDomainSubclass], // SRD: Life Domain only
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 1st level, you choose a domain shaped by your deity.'
  },
  
  classResources: [
    {
      id: 'channel-divinity',
      name: 'Channel Divinity',
      maxFormula: 'level >= 18 ? "3" : level >= 6 ? "2" : "1"',
      recoveryType: 'short-rest',
      displayOrder: 1,
      defaultValue: 1,
    },
  ],
  
  spellcasting: {
    ability: 'wis',
    spellListId: 'cleric',
    cantripsKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    preparedCasterFormula: 'wis_modifier + cleric_level',
    spellSlots: {
      1: [2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      2: [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      3: [0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    },
    ritualCasting: true,
    multiclassCasterLevel: 'full',
  },
  
  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Wisdom 13',
    },
  ],
  
  multiclassProficiencies: {
    armor: ['light', 'medium', 'shields'],
    weapons: [],
    tools: [],
  },
  
  description: 'A priestly champion who wields divine magic in service of a higher power.',
  
  displayMetadata: {
    icon: 'cross',
    color: '#FFD700',
    shortDescription: 'A divine spellcaster who heals allies and smites foes.',
    playStyle: 'Divine caster with healing and support',
    complexity: 'moderate',
    role: 'support',
    idealFor: ['Players who like healing', 'Support-focused players'],
    tags: ['spellcaster', 'divine', 'support', 'versatile'],
    casterType: 'full',
  },
};
