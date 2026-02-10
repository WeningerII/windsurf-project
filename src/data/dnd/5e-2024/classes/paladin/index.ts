import { CharacterClass } from '../../../../../types/character-options/classes';
import { devotionSubclass } from './devotion';

export const paladin: CharacterClass = {
  id: 'paladin',
  name: 'Paladin',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
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
      options: [
        ['javelin', 'javelin', 'javelin', 'javelin', 'javelin'],
        ['simple-melee-weapon'],
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
        ['chain-mail', 'holy-symbol'],
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
          id: 'lay-on-hands',
          name: 'Lay on Hands',
          source: 'Paladin 1',
          description: 'You have a pool of healing power that replenishes when you finish a Long Rest. With that pool, you can restore a total number of Hit Points equal to your Paladin level × 5. As a Bonus Action, you can touch a creature and draw power from the pool to restore a number of Hit Points to that creature, up to the maximum amount remaining in your pool. Alternatively, you can expend 5 Hit Points from your pool of healing to cure the target of one disease or neutralize one poison affecting it.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'spellcasting-paladin',
          name: 'Spellcasting',
          source: 'Paladin 1',
          description: 'You have learned to draw on divine magic through meditation and prayer to cast spells as a Cleric does. You can cast Paladin spells.',
        },
        {
          id: 'weapon-mastery-paladin',
          name: 'Weapon Mastery',
          source: 'Paladin 1',
          description: 'Your training with weapons allows you to use the mastery property of two kinds of weapons of your choice, such as Longswords and Warhammer. Whenever you finish a Long Rest, you can change the kinds of weapons you chose.',
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
          description: 'You adopt a particular style of fighting as your specialty. Choose one of the Fighting Style feats.',
        },
        {
          id: 'paladins-smite',
          name: 'Paladin\'s Smite',
          source: 'Paladin 2',
          description: 'You have learned to channel divine energy to smite your foes. You always have the Divine Smite spell prepared. In addition, you can cast Divine Smite without expending a spell slot a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'channel-divinity',
          name: 'Channel Divinity',
          source: 'Paladin 3',
          description: 'You gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with two such effects: Divine Sense and one determined by your subclass. You gain additional effects as you advance in this class.',
          uses: {
            current: 2,
            max: 2,
            recoveryType: 'short-rest',
          },
        },
        {
          id: 'sacred-oath',
          name: 'Paladin Subclass',
          source: 'Paladin 3',
          description: 'You swear the oath that binds you as a Paladin forever.',
        },
        {
          id: 'divine-sense',
          name: 'Channel Divinity: Divine Sense',
          source: 'Paladin 3',
          description: 'As a Bonus Action, you can open your awareness to detect strong evil and powerful good. Until the end of your next turn, you know the location of any Celestial, Fiend, or Undead within 60 feet of you that is not behind Total Cover.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
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
          description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
        },
        {
          id: 'faithful-steed',
          name: 'Faithful Steed',
          source: 'Paladin 5',
          description: 'You can call on the aid of a celestial steed. You always have the Find Steed spell prepared. You can cast it once without expending a spell slot, and you regain the ability to do so when you finish a Long Rest.',
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
          description: 'Whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus. At 18th level, the range of this aura increases to 30 feet.',
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
          source: 'Paladin 8',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'abjure-foes',
          name: 'Abjure Foes',
          source: 'Paladin 9',
          description: 'As a Magic action, you can use your Channel Divinity to overwhelm foes with awe. As you present your Holy Symbol or weapon, you can target a number of creatures equal to your Charisma modifier (minimum of one creature) that you can see within 60 feet of you. Each target must make a Wisdom saving throw. On a failed save, the target is Frightened for 1 minute or until it takes any damage. While Frightened, the target\'s Speed is 0, and it has Disadvantage on ability checks and attack rolls. On a successful save, the target\'s Speed is halved for 1 minute or until it takes any damage.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'aura-of-courage',
          name: 'Aura of Courage',
          source: 'Paladin 10',
          description: 'You and friendly creatures within 10 feet of you can\'t be Frightened while you are conscious. At 18th level, the range of this aura increases to 30 feet.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'radiant-strikes',
          name: 'Radiant Strikes',
          source: 'Paladin 11',
          description: 'You are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a Melee weapon and deal damage, the creature takes an extra 1d8 Radiant damage.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
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
          id: 'restoring-touch',
          name: 'Restoring Touch',
          source: 'Paladin 14',
          description: 'When you use Lay on Hands on a creature, you can also remove one or more of the following conditions from the creature: Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned. You expend 5 Hit Points from the healing pool for each condition removed.',
        },
      ],
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
          source: 'Paladin 16',
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
          id: 'aura-expansion',
          name: 'Aura Expansion',
          source: 'Paladin 18',
          description: 'The range of your Aura of Protection and Aura of Courage increases to 30 feet.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Paladin 19',
          description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
        },
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Paladin 19',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [],
    },
  ],
  
  subclassLevel: 3,
  subclasses: [devotionSubclass],
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you swear the oath that binds you as a Paladin.'
  },
  
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
      maxFormula: 'level >= 11 ? "3" : "2"',
      recoveryType: 'short-rest',
      displayOrder: 2,
      defaultValue: 2,
    },
  ],
  
  spellcasting: {
    ability: 'cha',
    spellListId: 'paladin',
    preparedCasterFormula: 'cha_modifier + (paladin_level / 2)',
    spellSlots: {
      1: [2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      2: [0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      3: [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    ritualCasting: true,
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
