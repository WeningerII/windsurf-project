import { CharacterClass } from '../../../../types/character-options/classes';

export const ranger: CharacterClass = {
  id: 'ranger',
  name: 'Ranger',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: { name: 'Pathfinder Core Rulebook', page: 166, url: 'https://2e.aonprd.com/Classes.aspx?ID=9' },
  hitDie: 'd10',
  primaryAbility: ['str', 'dex'],
  savingThrowProficiencies: ['str', 'dex'],
  armorProficiencies: ['light', 'medium'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: { count: 4, options: ['nature', 'survival'], label: 'Trained in Nature, Survival, and 4 + Int skills' },
  equipmentChoices: [],
  startingGold: { dice: '15', multiplier: 1 },
  features: [
    { level: 1, features: [
      { id: 'hunt-prey', name: 'Hunt Prey', source: 'Ranger 1', description: 'You designate a creature as your prey. You gain bonuses against that creature.' },
      { id: 'hunters-edge', name: 'Hunter\'s Edge', source: 'Ranger 1', description: 'Choose an edge: Flurry, Precision, or Outwit. This determines your hunting style.' },
    ]},
    { level: 3, features: [{ id: 'iron-will', name: 'Iron Will', source: 'Ranger 3', description: 'Your proficiency rank for Will saves increases to expert.' }]},
    { level: 5, features: [{ id: 'weapon-expertise', name: 'Weapon Expertise', source: 'Ranger 5', description: 'Your proficiency ranks for simple and martial weapons increase to expert.' }]},
    { level: 7, features: [{ id: 'evasion', name: 'Evasion', source: 'Ranger 7', description: 'Your proficiency rank for Reflex saves increases to master.' }]},
    { level: 9, features: [{ id: 'vigilant-senses', name: 'Vigilant Senses', source: 'Ranger 9', description: 'Your proficiency rank for Perception increases to master.' }]},
    { level: 11, features: [{ id: 'natures-edge', name: 'Nature\'s Edge', source: 'Ranger 11', description: 'Enemies in natural difficult terrain are flat-footed to you.' }]},
    { level: 13, features: [{ id: 'weapon-mastery', name: 'Weapon Mastery', source: 'Ranger 13', description: 'Your proficiency ranks for simple and martial weapons increase to master.' }]},
    { level: 15, features: [{ id: 'greater-weapon-specialization', name: 'Greater Weapon Specialization', source: 'Ranger 15', description: 'Your damage bonuses increase.' }]},
    { level: 17, features: [{ id: 'masterful-hunter', name: 'Masterful Hunter', source: 'Ranger 17', description: 'Your hunter\'s edge benefits double against your prey.' }]},
    { level: 19, features: [{ id: 'swift-prey', name: 'Swift Prey', source: 'Ranger 19', description: 'You can Hunt Prey as a free action.' }]},
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'flurry',
      name: 'Flurry Edge',
      parentClassId: 'ranger',
      description: 'You rely on speed and rapid strikes to bring down your prey.',
      features: [
        { level: 1, features: [
          { id: 'flurry-edge', name: 'Flurry Edge', source: 'Flurry 1', description: 'You can make multiple attacks against your hunted prey without suffering multiple attack penalty. Your multiple attack penalty against your hunted prey is –3 (–2 with an agile weapon) on your second attack, and –6 (–4 with an agile weapon) on your third or subsequent attacks.' },
        ]},
        { level: 11, features: [{ id: 'flurry-mastery', name: 'Flurry Mastery', source: 'Flurry 11', description: 'Your multiple attack penalty is reduced further against your hunted prey.' }]},
      ],
    },
    {
      id: 'precision',
      name: 'Precision Edge',
      parentClassId: 'ranger',
      description: 'You strike with devastating accuracy against your prey.',
      features: [
        { level: 1, features: [
          { id: 'precision-edge', name: 'Precision Edge', source: 'Precision 1', description: 'The first attack you make against your hunted prey on each of your turns deals 1d8 additional precision damage. This increases to 2d8 at 11th level and 3d8 at 19th level.' },
        ]},
        { level: 11, features: [{ id: 'precision-mastery', name: 'Precision Mastery', source: 'Precision 11', description: 'Your precision damage increases to 2d8.' }]},
        { level: 19, features: [{ id: 'greater-precision', name: 'Greater Precision', source: 'Precision 19', description: 'Your precision damage increases to 3d8.' }]},
      ],
    },
    {
      id: 'outwit',
      name: 'Outwit Edge',
      parentClassId: 'ranger',
      description: 'You use cunning and knowledge to gain an advantage over your prey.',
      features: [
        { level: 1, features: [
          { id: 'outwit-edge', name: 'Outwit Edge', source: 'Outwit 1', description: 'When you Hunt Prey, you also attempt a Recall Knowledge check as a free action. Your hunted prey is flat-footed against your attacks until the end of your next turn.' },
        ]},
        { level: 11, features: [{ id: 'outwit-mastery', name: 'Outwit Mastery', source: 'Outwit 11', description: 'Your hunted prey remains flat-footed against your attacks for a longer duration.' }]},
      ],
    },
  ],
  classResources: [],
  multiclassRequirements: [{ type: 'attribute', value: 14, description: 'Dexterity 14' }],
  multiclassProficiencies: { armor: ['light', 'medium'], weapons: ['simple', 'martial'], tools: [] },
  description: 'Some rangers believe that civilization wears down the soul, but still guard its edges against the wild.',
  displayMetadata: {
    icon: 'bow', color: '#228B22',
    shortDescription: 'A skilled hunter who tracks and takes down prey.',
    playStyle: 'Versatile combatant with hunting focus',
    complexity: 'simple', role: 'striker',
    idealFor: ['Hunters', 'Archers', 'Two-weapon fighters'],
    tags: ['martial', 'ranged', 'melee'],
  },
};
