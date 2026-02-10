import { CharacterClass } from '../../../../types/character-options/classes';

export const monk: CharacterClass = {
  id: 'monk',
  name: 'Monk',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: { name: 'Pathfinder Core Rulebook', page: 154, url: 'https://2e.aonprd.com/Classes.aspx?ID=8' },
  hitDie: 'd10',
  primaryAbility: ['str', 'dex'],
  savingThrowProficiencies: ['str', 'dex', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: ['simple', 'monk'],
  toolProficiencies: [],
  skillProficiencies: { count: 4, options: ['acrobatics', 'athletics'], label: 'Trained in 4 + Int skills' },
  equipmentChoices: [],
  startingGold: { dice: '15', multiplier: 1 },
  features: [
    { level: 1, features: [
      { id: 'flurry-of-blows', name: 'Flurry of Blows', source: 'Monk 1', description: 'Make two unarmed Strikes using one action. If both hit the same creature, combine their damage for resistance.' },
      { id: 'powerful-fist', name: 'Powerful Fist', source: 'Monk 1', description: 'Your fist unarmed attacks deal 1d6 damage, don\'t have the nonlethal trait, and gain the shove trait.' },
    ]},
    { level: 3, features: [{ id: 'incredible-movement', name: 'Incredible Movement +10', source: 'Monk 3', description: 'You gain a +10-foot status bonus to your Speed whenever you\'re not wearing armor.' }]},
    { level: 5, features: [{ id: 'alertness', name: 'Alertness', source: 'Monk 5', description: 'Your proficiency rank for Perception increases to expert.' }]},
    { level: 7, features: [{ id: 'path-to-perfection', name: 'Path to Perfection', source: 'Monk 7', description: 'Choose one saving throw and increase its proficiency to master.' }]},
    { level: 9, features: [{ id: 'metal-strikes', name: 'Metal Strikes', source: 'Monk 9', description: 'Your unarmed attacks count as cold iron and silver.' }]},
    { level: 11, features: [{ id: 'second-path', name: 'Second Path to Perfection', source: 'Monk 11', description: 'Choose another saving throw to become a master in.' }]},
    { level: 13, features: [{ id: 'graceful-mastery', name: 'Graceful Mastery', source: 'Monk 13', description: 'Your proficiency rank for unarmored defense increases to master.' }]},
    { level: 15, features: [{ id: 'third-path', name: 'Third Path to Perfection', source: 'Monk 15', description: 'Your remaining saving throw becomes expert, and one master save becomes legendary.' }]},
    { level: 17, features: [{ id: 'adamantine-strikes', name: 'Adamantine Strikes', source: 'Monk 17', description: 'Your unarmed attacks count as adamantine.' }]},
    { level: 19, features: [{ id: 'perfected-form', name: 'Perfected Form', source: 'Monk 19', description: 'When you roll a failure on a Fortitude or Reflex save, you get a success instead.' }]},
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'crane-stance',
      name: 'Crane Stance',
      parentClassId: 'monk',
      description: 'You emulate the graceful and defensive movements of a crane, focusing on evasion and precision strikes.',
      features: [
        { level: 1, features: [
          { id: 'crane-stance-feature', name: 'Crane Stance', source: 'Crane Stance 1', description: 'You gain a +1 circumstance bonus to AC when using Crane Stance. You can use a reaction to gain a +2 circumstance bonus to AC against a single melee attack.' },
        ]},
        { level: 3, features: [{ id: 'crane-precision', name: 'Crane Precision', source: 'Crane Stance 3', description: 'Your unarmed Strikes gain the finesse trait when using Crane Stance.' }]},
      ],
    },
    {
      id: 'tiger-stance',
      name: 'Tiger Stance',
      parentClassId: 'monk',
      description: 'You channel the ferocity and power of a tiger, focusing on aggressive strikes and overwhelming opponents.',
      features: [
        { level: 1, features: [
          { id: 'tiger-stance-feature', name: 'Tiger Stance', source: 'Tiger Stance 1', description: 'Your unarmed Strikes deal +2 additional damage when using Tiger Stance. You gain a +1 circumstance bonus to damage rolls.' },
        ]},
        { level: 3, features: [{ id: 'tiger-pounce', name: 'Tiger Pounce', source: 'Tiger Stance 3', description: 'When you use Flurry of Blows with Tiger Stance, you can move 10 feet as part of the action.' }]},
      ],
    },
    {
      id: 'dragon-stance',
      name: 'Dragon Stance',
      parentClassId: 'monk',
      description: 'You embody the ancient wisdom and power of dragons, gaining resistance and enhanced defenses.',
      features: [
        { level: 1, features: [
          { id: 'dragon-stance-feature', name: 'Dragon Stance', source: 'Dragon Stance 1', description: 'You gain resistance 2 to one damage type of your choice when using Dragon Stance. You gain a +1 circumstance bonus to Fortitude saves.' },
        ]},
        { level: 3, features: [{ id: 'dragon-breath', name: 'Dragon Breath', source: 'Dragon Stance 3', description: 'Once per encounter, you can use a 2-action activity to breathe a cone of energy matching your chosen resistance type.' }]},
      ],
    },
  ],
  classResources: [{ id: 'focus-points', name: 'Focus Points', maxFormula: '1', recoveryType: 'short-rest', displayOrder: 1 }],
  multiclassRequirements: [{ type: 'attribute', value: 14, description: 'Strength 14 and Dexterity 14' }],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description: 'The strength of your fist flows from your mind and spirit. You seek perfection—honing your body into a flawless instrument.',
  displayMetadata: {
    icon: 'fist', color: '#DAA520',
    shortDescription: 'A martial artist seeking physical and spiritual perfection.',
    playStyle: 'Mobile unarmed combatant with ki powers',
    complexity: 'moderate', role: 'striker',
    idealFor: ['Martial arts fans', 'Mobile fighters'],
    tags: ['martial', 'melee'],
  },
};
