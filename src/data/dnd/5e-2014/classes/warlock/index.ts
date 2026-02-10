import { CharacterClass } from '../../../../../types/character-options/classes';
import { fiendSubclass } from './fiend';

export const warlock: CharacterClass = {
  id: 'warlock',
  name: 'Warlock',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
  },
  
  hitDie: 'd8',
  primaryAbility: ['cha'],
  savingThrowProficiencies: ['wis', 'cha'],
  
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],
  
  skillProficiencies: {
    count: 2,
    options: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
    label: 'Choose two skills',
  },
  
  equipmentChoices: [
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
        ['component-pouch'],
        ['arcane-focus'],
      ],
    },
    {
      choose: 1,
      options: [
        ['scholars-pack'],
        ['dungeoneers-pack'],
      ],
    },
    {
      choose: 1,
      options: [
        ['leather-armor', 'simple-weapon', 'dagger', 'dagger'],
      ],
    },
  ],
  
  startingGold: {
    dice: '4d4',
    multiplier: 10,
  },
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'otherworldly-patron',
          name: 'Otherworldly Patron',
          source: 'Warlock 1',
          description: 'At 1st level, you have struck a bargain with an otherworldly being of your choice.',
        },
        {
          id: 'pact-magic',
          name: 'Pact Magic',
          source: 'Warlock 1',
          description: 'Your arcane research and the magic bestowed on you by your patron have given you facility with spells.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'eldritch-invocations',
          name: 'Eldritch Invocations',
          source: 'Warlock 2',
          description: 'In your study of occult lore, you have unearthed eldritch invocations, fragments of forbidden knowledge that imbue you with an abiding magical ability.\n\nAt 2nd level, you gain two eldritch invocations of your choice. When you gain certain warlock levels, you gain additional invocations of your choice, as shown in the Invocations Known column of the Warlock table.\n\nAdditionally, when you gain a level in this class, you can choose one of the invocations you know and replace it with another invocation that you could learn at that level.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'pact-boon',
          name: 'Pact Boon',
          source: 'Warlock 3',
          description: 'At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice.\n\nPact of the Chain: You learn the find familiar spell and can cast it as a ritual. The spell doesn\'t count against your number of spells known.\n\nPact of the Blade: You can use your action to create a pact weapon in your empty hand. You can choose the form that this melee weapon takes each time you create it. You are proficient with it while you wield it.\n\nPact of the Tome: Your patron gives you a grimoire called a Book of Shadows. When you gain this feature, choose three cantrips from any class\'s spell list. While the book is on your person, you can cast those cantrips at will.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Warlock 4',
          description: 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [],
    },
    {
      level: 6,
      features: [
        {
          id: 'otherworldly-patron-6',
          name: 'Otherworldly Patron Feature',
          source: 'Warlock 6',
          description: 'At 6th level, you gain a feature from your Otherworldly Patron.',
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
          source: 'Warlock 8',
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
          id: 'otherworldly-patron-10',
          name: 'Otherworldly Patron Feature',
          source: 'Warlock 10',
          description: 'At 10th level, you gain a feature from your Otherworldly Patron.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'mystic-arcanum-6',
          name: 'Mystic Arcanum (6th level)',
          source: 'Warlock 11',
          description: 'At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list as this arcanum.\n\nYou can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Warlock 12',
          description: 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'mystic-arcanum-7',
          name: 'Mystic Arcanum (7th level)',
          source: 'Warlock 13',
          description: 'At 13th level, your patron bestows upon you a magical secret called an arcanum. Choose one 7th-level spell from the warlock spell list as this arcanum.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'otherworldly-patron-14',
          name: 'Otherworldly Patron Feature',
          source: 'Warlock 14',
          description: 'At 14th level, you gain a feature from your Otherworldly Patron.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'mystic-arcanum-8',
          name: 'Mystic Arcanum (8th level)',
          source: 'Warlock 15',
          description: 'At 15th level, your patron bestows upon you a magical secret called an arcanum. Choose one 8th-level spell from the warlock spell list as this arcanum.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Warlock 16',
          description: 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'mystic-arcanum-9',
          name: 'Mystic Arcanum (9th level)',
          source: 'Warlock 17',
          description: 'At 17th level, your patron bestows upon you a magical secret called an arcanum. Choose one 9th-level spell from the warlock spell list as this arcanum.',
        },
      ],
    },
    {
      level: 18,
      features: [],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Warlock 19',
          description: 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'eldritch-master',
          name: 'Eldritch Master',
          source: 'Warlock 20',
          description: 'At 20th level, you can draw on your inner reserve of mystical power while entreating your patron to regain expended spell slots. You can spend 1 minute entreating your patron for aid to regain all your expended spell slots from your Pact Magic feature. Once you regain spell slots with this feature, you must finish a long rest before you can do so again.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
      ],
    },
  ],
  
  subclassLevel: 1,
  subclasses: [fiendSubclass],
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 1st level, you make a pact with an otherworldly being.'
  }, // SRD: The Fiend only
  
  spellcasting: {
    ability: 'cha',
    spellListId: 'warlock',
    cantripsKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    spellsKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
    
    // PACT MAGIC: Warlock slots work differently than normal spellcasting
    // - All slots are the same level (increases with Warlock level)
    // - Recover on SHORT rest (not long rest)
    // - Don't combine with other casters for multiclass spell slots
    spellSlots: {
      1: [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Level 1-2: 1st level slots
      2: [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Level 3-4: 2nd level slots
      3: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Level 5-6: 3rd level slots
      4: [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Level 7-8: 4th level slots
      5: [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4], // Level 9+: 5th level slots (increases quantity)
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Use Mystic Arcanum
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Use Mystic Arcanum
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Use Mystic Arcanum
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Use Mystic Arcanum
    },
    
    isPactMagic: true,
    slotRecovery: 'short-rest',
    multiclassCasterLevel: 'none', // Warlock Pact Magic doesn't contribute to multiclass spell slots
    ritualCasting: false,
  },
  
  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Charisma 13',
    },
  ],
  
  multiclassProficiencies: {
    armor: ['light'],
    weapons: ['simple'],
    tools: [],
  },
  
  description: 'A wielder of magic that is derived from a bargain with an extraplanar entity.',
  
  displayMetadata: {
    icon: 'tome',
    color: '#8B008B',
    shortDescription: 'A spellcaster bound by pact to an otherworldly patron.',
    playStyle: 'Consistent caster with eldritch powers',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Eldritch blast enthusiasts', 'Players who like reliability'],
    tags: ['spellcaster', 'arcane', 'versatile'],
    casterType: 'pact',
  },
};
