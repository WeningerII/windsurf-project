import { CharacterClass } from '../../../../../types/character-options/classes';

export const rogue: CharacterClass = {
  id: 'rogue',
  name: 'Rogue',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',
  
  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Player\'s Handbook 3.5',
    url: 'https://www.d20srd.org/srd/classes/rogue.htm'
  },
  
  hitDie: 'd6',
  primaryAbility: ['dex'],
  savingThrowProficiencies: ['dex', 'int'],
  
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'hand-crossbow', 'rapier', 'sap', 'shortbow', 'short-sword'],
  toolProficiencies: [],
  
  skillProficiencies: {
    count: 8,
    options: ['balance', 'bluff', 'climb', 'diplomacy', 'disable-device', 'disguise', 'escape-artist', 'gather-info', 'hide', 'intimidate', 'jump', 'listen', 'move-silently', 'open-lock', 'search', 'sense-motive', 'sleight-of-hand', 'spot', 'swim', 'tumble', 'use-magic', 'use-rope'],
    label: 'Choose eight skills',
  },
  
  equipmentChoices: [],
  
  startingGold: {
    dice: '5d4',
    multiplier: 10,
  },
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'sneak-attack-35e',
          name: 'Sneak Attack',
          source: 'Rogue 1',
          description: 'If a rogue can catch an opponent when he is unable to defend himself effectively from her attack, she can strike a vital spot for extra damage. The rogue\'s attack deals extra damage any time her target would be denied a Dexterity bonus to AC, or when the rogue flanks her target. This extra damage is 1d6 at 1st level, and it increases by 1d6 every two rogue levels thereafter.',
        },
        {
          id: 'trapfinding',
          name: 'Trapfinding',
          source: 'Rogue 1',
          description: 'Rogues can use the Search skill to locate traps when the task has a Difficulty Class higher than 20. Finding a nonmagical trap has a DC of at least 20, or higher if it is well hidden.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'evasion-35e',
          name: 'Evasion',
          source: 'Rogue 2',
          description: 'At 2nd level and higher, a rogue can avoid even magical and unusual attacks with great agility. If she makes a successful Reflex saving throw against an attack that normally deals half damage on a successful save, she instead takes no damage.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'trap-sense-rogue',
          name: 'Trap Sense',
          source: 'Rogue 3',
          description: 'At 3rd level, a rogue gains an intuitive sense that alerts her to danger from traps, giving her a +1 bonus on Reflex saves made to avoid traps and a +1 dodge bonus to AC against attacks made by traps.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'uncanny-dodge-rogue',
          name: 'Uncanny Dodge',
          source: 'Rogue 4',
          description: 'Starting at 4th level, a rogue can react to danger before her senses would normally allow her to do so. She retains her Dexterity bonus to AC even if she is caught flat-footed or struck by an invisible attacker.',
        },
      ],
    },
    { level: 5, features: [{ id: 'rogue-5', name: 'Improved Trap Sense', source: 'Rogue 5', description: 'Trap sense bonus increases.' }] },
    { level: 6, features: [{ id: 'rogue-6', name: 'Special Ability', source: 'Rogue 6', description: 'Rogue gains a special ability.' }] },
    { level: 7, features: [{ id: 'rogue-7', name: 'Improved Evasion', source: 'Rogue 7', description: 'Evasion ability improves.' }] },
    {
      level: 8,
      features: [
        {
          id: 'improved-uncanny-dodge-rogue',
          name: 'Improved Uncanny Dodge',
          source: 'Rogue 8',
          description: 'A rogue of 8th level or higher can no longer be flanked.',
        },
      ],
    },
    { level: 9, features: [{ id: 'rogue-9', name: 'Advanced Trap Sense', source: 'Rogue 9', description: 'Trap sense becomes more advanced.' }] },
    {
      level: 10,
      features: [
        {
          id: 'special-ability-10',
          name: 'Special Ability',
          source: 'Rogue 10',
          description: 'On attaining 10th level, and at every three levels thereafter, a rogue gains a special ability of her choice from among the following options.',
        },
      ],
    },
    { level: 11, features: [{ id: 'rogue-11', name: 'Master Evasion', source: 'Rogue 11', description: 'Evasion reaches mastery.' }] },
    { level: 12, features: [{ id: 'rogue-12', name: 'Advanced Uncanny Dodge', source: 'Rogue 12', description: 'Uncanny dodge becomes more advanced.' }] },
    { level: 13, features: [{ id: 'rogue-13', name: 'Perfect Trap Sense', source: 'Rogue 13', description: 'Trap sense becomes perfect.' }] },
    { level: 14, features: [{ id: 'rogue-14', name: 'Special Ability', source: 'Rogue 14', description: 'Rogue gains another special ability.' }] },
    { level: 15, features: [{ id: 'rogue-15', name: 'Supreme Evasion', source: 'Rogue 15', description: 'Evasion reaches supreme power.' }] },
    { level: 16, features: [{ id: 'rogue-16', name: 'Perfect Uncanny Dodge', source: 'Rogue 16', description: 'Uncanny dodge becomes perfect.' }] },
    { level: 17, features: [{ id: 'rogue-17', name: 'Master Assassin', source: 'Rogue 17', description: 'Rogue becomes a master assassin.' }] },
    { level: 18, features: [{ id: 'rogue-18', name: 'Special Ability', source: 'Rogue 18', description: 'Rogue gains another special ability.' }] },
    { level: 19, features: [{ id: 'rogue-19', name: 'Perfect Rogue', source: 'Rogue 19', description: 'Rogue achieves perfect mastery.' }] },
    { level: 20, features: [{ id: 'rogue-20', name: 'Shadow Master', source: 'Rogue 20', description: 'Rogue becomes a master of shadows.' }] },
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
  
  description: 'A skilled character adept at many tasks, particularly stealth and thievery.',
  
  displayMetadata: {
    icon: 'dagger',
    color: '#696969',
    shortDescription: 'A skilled character adept at stealth and thievery.',
    playStyle: 'Stealthy skill expert',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Skill-focused players'],
    tags: ['martial', 'stealth'],
  },
};
