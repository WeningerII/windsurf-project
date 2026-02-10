import { CharacterClass } from '../../../../../types/character-options/classes';
import { fiendSubclass } from './fiend';

export const warlock: CharacterClass = {
  id: 'warlock',
  name: 'Warlock',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
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
          id: 'pact-magic',
          name: 'Pact Magic',
          source: 'Warlock 1',
          description: 'You have struck a bargain with an otherworldly being. You can cast spells using your Warlock spell slots, which are always of the highest level you can cast. You regain all expended spell slots when you finish a Short or Long Rest.',
        },
        {
          id: 'eldritch-invocations',
          name: 'Eldritch Invocations',
          source: 'Warlock 1',
          description: 'You have unearthed fragments of forbidden knowledge that imbue you with an abiding magical ability. You gain 1 invocation of your choice. You gain additional invocations as you gain Warlock levels.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'magical-cunning',
          name: 'Magical Cunning',
          source: 'Warlock 2',
          description: 'You can perform a 1-minute ritual to regain half your expended Pact Magic spell slots (rounded up). Once you use this feature, you can\'t use it again until you finish a Long Rest.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'warlock-subclass',
          name: 'Warlock Subclass',
          source: 'Warlock 3',
          description: 'You choose an otherworldly patron who grants you power.',
        },
        {
          id: 'pact-boon',
          name: 'Pact Boon',
          source: 'Warlock 3',
          description: 'Your patron grants you a boon. Choose one of the following Invocation options: Pact of the Blade, Pact of the Chain, or Pact of the Tome.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'invocations-5',
          name: 'Eldritch Invocations (5)',
          source: 'Warlock 5',
          description: 'You now know 5 Eldritch Invocations.',
        },
      ],
    },
    {
      level: 6,
      features: [],
    },
    {
      level: 7,
      features: [
        {
          id: 'invocations-6',
          name: 'Eldritch Invocations (6)',
          source: 'Warlock 7',
          description: 'You now know 6 Eldritch Invocations.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Warlock 8',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'contact-patron',
          name: 'Contact Patron',
          source: 'Warlock 9',
          description: 'You can contact your patron directly. You always have the Contact Other Plane spell prepared. You can cast it once without expending a spell slot, and you regain the ability to do so when you finish a Long Rest. When you cast the spell with this feature, you automatically succeed on the Intelligence saving throw.',
        },
      ],
    },
    {
      level: 10,
      features: [],
    },
    {
      level: 11,
      features: [
        {
          id: 'mystic-arcanum-6',
          name: 'Mystic Arcanum (6th level)',
          source: 'Warlock 11',
          description: 'Your patron bestows upon you a magical secret called an Arcanum. Choose one 6th-level spell from the Warlock spell list. You can cast your Arcanum spell once without expending a spell slot. You must finish a Long Rest before you can do so again.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
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
          description: 'Choose one 7th-level spell from the Warlock spell list as your Arcanum.',
        },
      ],
    },
    {
      level: 14,
      features: [],
    },
    {
      level: 15,
      features: [
        {
          id: 'mystic-arcanum-8',
          name: 'Mystic Arcanum (8th level)',
          source: 'Warlock 15',
          description: 'Choose one 8th-level spell from the Warlock spell list as your Arcanum.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
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
          description: 'Choose one 9th-level spell from the Warlock spell list as your Arcanum.',
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
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Warlock 19',
          description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
        },
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Warlock 19',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
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
          description: 'When you use your Magical Cunning feature, you regain all your expended Pact Magic spell slots.',
        },
      ],
    },
  ],
  
  subclassLevel: 3,
  subclasses: [fiendSubclass],
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose a Warlock Subclass.'
  },
  
  classResources: [
    {
      id: 'invocations',
      name: 'Invocations',
      maxFormula: 'level >= 18 ? "8" : level >= 15 ? "7" : level >= 12 ? "6" : level >= 9 ? "5" : level >= 7 ? "4" : level >= 5 ? "3" : level >= 2 ? "2" : "1"',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
  ],
  
  spellcasting: {
    ability: 'cha',
    spellListId: 'warlock',
    cantripsKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    spellsKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
    
    // PACT MAGIC: Warlock slots work differently than normal spellcasting
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
    ritualCasting: true, // Warlocks have Ritual Casting in 2024
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
