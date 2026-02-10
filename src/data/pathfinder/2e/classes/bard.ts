import { CharacterClass } from '../../../../types/character-options/classes';

export const bard: CharacterClass = {
  id: 'bard',
  name: 'Bard',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: { name: 'Pathfinder Core Rulebook', page: 96, url: 'https://2e.aonprd.com/Classes.aspx?ID=3' },
  hitDie: 'd8',
  primaryAbility: ['cha'],
  savingThrowProficiencies: ['cha', 'wis'],
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'longsword', 'rapier', 'sap', 'shortbow', 'shortsword', 'whip'],
  toolProficiencies: [],
  skillProficiencies: { count: 4, options: ['occultism', 'performance'], label: 'Trained in 4 + Int skills' },
  equipmentChoices: [],
  startingGold: { dice: '15', multiplier: 1 },
  features: [
    { level: 1, features: [
      { id: 'muse', name: 'Muse', source: 'Bard 1', description: 'Choose a muse: Enigma, Maestro, or Polymath. Your muse influences your spells and abilities.' },
      { id: 'composition-spells', name: 'Composition Spells', source: 'Bard 1', description: 'You can use your performances to cast unique composition spells.' },
    ]},
    { level: 3, features: [{ id: 'signature-spells', name: 'Signature Spells', source: 'Bard 3', description: 'You can heighten certain spells freely.' }]},
    { level: 7, features: [{ id: 'expert-spellcaster', name: 'Expert Spellcaster', source: 'Bard 7', description: 'Your proficiency ranks for occult spell attacks and DCs increase to expert.' }]},
    { level: 9, features: [{ id: 'great-fortitude', name: 'Great Fortitude', source: 'Bard 9', description: 'Your proficiency rank for Fortitude saves increases to expert.' }]},
    { level: 11, features: [{ id: 'vigilant-senses', name: 'Vigilant Senses', source: 'Bard 11', description: 'Your proficiency rank for Perception increases to master.' }]},
    { level: 13, features: [{ id: 'light-armor-expertise', name: 'Light Armor Expertise', source: 'Bard 13', description: 'Your proficiency rank for light armor increases to expert.' }]},
    { level: 15, features: [{ id: 'master-spellcaster', name: 'Master Spellcaster', source: 'Bard 15', description: 'Your proficiency ranks for occult spell attacks and DCs increase to master.' }]},
    { level: 19, features: [{ id: 'legendary-spellcaster', name: 'Legendary Spellcaster', source: 'Bard 19', description: 'Your proficiency ranks for occult spell attacks and DCs increase to legendary.' }]},
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'enigma',
      name: 'Enigma Muse',
      parentClassId: 'bard',
      description: 'Your muse is a mystery, driving you to uncover hidden secrets and knowledge.',
      features: [
        { level: 1, features: [
          { id: 'bardic-lore', name: 'Bardic Lore', source: 'Enigma Muse 1', description: 'Your muse has taught you unusual lore. You gain the Bardic Lore feat and become trained in Occultism and a Lore skill of your choice.' },
        ]},
        { level: 4, features: [{ id: 'enigma-scholar', name: 'Enigma Scholar', source: 'Enigma Muse 4', description: 'Your pursuit of knowledge has led you to master various skills. You gain expert proficiency in Occultism.' }]},
      ],
    },
    {
      id: 'maestro',
      name: 'Maestro Muse',
      parentClassId: 'bard',
      description: 'Your muse is a virtuoso, inspiring you to perform with technical mastery.',
      features: [
        { level: 1, features: [
          { id: 'lingering-composition', name: 'Lingering Composition', source: 'Maestro Muse 1', description: 'You gain the lingering composition focus spell. You can extend the duration of your composition spells.' },
        ]},
        { level: 2, features: [{ id: 'maestro-performance', name: 'Maestro Performance', source: 'Maestro Muse 2', description: 'Your performances are legendary. You gain expert proficiency in Performance.' }]},
      ],
    },
    {
      id: 'polymath',
      name: 'Polymath Muse',
      parentClassId: 'bard',
      description: 'Your muse is a jack of all trades, inspiring you to dabble in many skills.',
      features: [
        { level: 1, features: [
          { id: 'versatile-performance', name: 'Versatile Performance', source: 'Polymath Muse 1', description: 'You can use Performance instead of Diplomacy, Deception, or Intimidation for certain checks.' },
        ]},
        { level: 2, features: [{ id: 'esoteric-polymath', name: 'Esoteric Polymath', source: 'Polymath Muse 2', description: 'You can add spells from other traditions to your repertoire by using a special polymath ability.' }]},
      ],
    },
    {
      id: 'lore',
      name: 'Lore Muse',
      parentClassId: 'bard',
      description: 'Your muse grants you knowledge of hidden lore and forgotten secrets.',
      features: [
        { level: 1, features: [
          { id: 'lore-master', name: 'Lore Master', source: 'Lore Muse 1', description: 'You gain additional skill training and can Recall Knowledge more effectively. You become trained in two additional skills of your choice.' },
        ]},
        { level: 2, features: [{ id: 'scholarly-insight', name: 'Scholarly Insight', source: 'Lore Muse 2', description: 'When you Recall Knowledge, you gain a +1 status bonus to the check.' }]},
      ],
    },
    {
      id: 'occult',
      name: 'Occult Muse',
      parentClassId: 'bard',
      description: 'Your muse connects you to occult mysteries and supernatural knowledge.',
      features: [
        { level: 1, features: [
          { id: 'occult-connection', name: 'Occult Connection', source: 'Occult Muse 1', description: 'You gain additional occult spells and can sense supernatural presences. You become trained in Occultism.' },
        ]},
        { level: 2, features: [{ id: 'supernatural-awareness', name: 'Supernatural Awareness', source: 'Occult Muse 2', description: 'You gain a +1 status bonus to Perception checks to sense supernatural creatures.' }]},
      ],
    },
    {
      id: 'whispers',
      name: 'Whispers Muse',
      parentClassId: 'bard',
      description: 'Your muse speaks through whispers and shadows, granting you secrets and deceptions.',
      features: [
        { level: 1, features: [
          { id: 'whispered-secrets', name: 'Whispered Secrets', source: 'Whispers Muse 1', description: 'You gain the whispered secrets focus spell. You can communicate with allies telepathically.' },
        ]},
        { level: 2, features: [{ id: 'shadow-network', name: 'Shadow Network', source: 'Whispers Muse 2', description: 'You gain a +1 status bonus to Deception and Stealth checks.' }]},
      ],
    },
  ],
  spellcasting: { ability: 'cha', spellListId: 'occult-pf2e', spellSlots: { 1: [2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3], 2: [0,0,0,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3], 3: [0,0,0,0,0,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3], 4: [0,0,0,0,0,0,0,2,3,3,3,3,3,3,3,3,3,3,3,3], 5: [0,0,0,0,0,0,0,0,0,2,3,3,3,3,3,3,3,3,3,3], 6: [0,0,0,0,0,0,0,0,0,0,0,2,3,3,3,3,3,3,3,3], 7: [0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,3,3,3,3], 8: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,3,3], 9: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3] }, ritualCasting: true, multiclassCasterLevel: 'full' },
  classResources: [{ id: 'focus-points', name: 'Focus Points', maxFormula: '1', recoveryType: 'short-rest', displayOrder: 1 }],
  multiclassRequirements: [{ type: 'attribute', value: 14, description: 'Charisma 14' }],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description: 'You are a master of artistry, a scholar of hidden secrets, and a captivating persuader.',
  displayMetadata: {
    icon: 'music', color: '#9932CC',
    shortDescription: 'An occult spellcaster who uses performance and inspiration.',
    playStyle: 'Support caster with composition spells',
    complexity: 'moderate', role: 'support',
    idealFor: ['Social characters', 'Support players'],
    tags: ['spellcaster', 'support', 'face', 'skill-monkey'],
    casterType: 'full',
  },
};
