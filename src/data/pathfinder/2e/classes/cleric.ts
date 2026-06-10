import { CharacterClass } from '../../../../types/character-options/classes';

export const cleric: CharacterClass = {
  id: 'cleric',
  name: 'Cleric',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 116,
    url: 'https://2e.aonprd.com/Classes.aspx?ID=5',
  },
  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['wis', 'cha'],
  armorProficiencies: ['light', 'medium'],
  weaponProficiencies: ['simple', 'deity-favored'],
  toolProficiencies: [],
  // CRB: trained in the class's fixed skill(s) plus `count` free choices
  // (+ Int). `options` is the truthful eligible list — every skill except
  // the fixed grants — so a Choice-honoring consumer can't mis-render
  // 'choose 2 from a 1-item list'. Fixed training (religion) is granted by the class template.
  skillProficiencies: {
    count: 2,
    options: [
      'acrobatics',
      'arcana',
      'athletics',
      'crafting',
      'deception',
      'diplomacy',
      'intimidation',
      'medicine',
      'nature',
      'occultism',
      'performance',
      'society',
      'stealth',
      'survival',
      'thievery',
    ],
    label: 'Trained in Religion and 2 + Int skills',
  },
  equipmentChoices: [],
  // CRB p.271: every PF2e class starts with 15 gp (150 sp) flat — not a dice roll.
  startingGold: { flat: 15 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'deity',
          name: 'Deity',
          source: 'Cleric 1',
          description: 'You serve a deity and follow their edicts and anathema.',
        },
        {
          id: 'divine-font',
          name: 'Divine Font',
          source: 'Cleric 1',
          description: 'Through your deity, you gain either heal or harm spells.',
        },
        {
          id: 'doctrine',
          name: 'Doctrine',
          source: 'Cleric 1',
          description: 'Choose Cloistered Cleric or Warpriest to determine your combat role.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'second-doctrine',
          name: 'Second Doctrine',
          source: 'Cleric 3',
          description: 'Gain additional benefits from your doctrine.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'third-doctrine',
          name: 'Third Doctrine',
          source: 'Cleric 7',
          description: 'Your doctrine grants further benefits.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'fourth-doctrine',
          name: 'Fourth Doctrine',
          source: 'Cleric 11',
          description: 'Your doctrine grants even greater power.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'fifth-doctrine',
          name: 'Fifth Doctrine',
          source: 'Cleric 15',
          description: 'Near mastery of your doctrine.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'sixth-doctrine',
          name: 'Sixth Doctrine',
          source: 'Cleric 19',
          description: 'Full mastery of your chosen doctrine.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  // The former subclass list named 19 Golarion deities (Paizo Product
  // Identity) with invented mechanics. It was replaced with the cleric's
  // actual Core Rulebook subclass choice — the two doctrines. The deity
  // itself is a roleplaying choice made with the GM (see the generic Deity
  // feature above); no setting-specific deity names ship in this data.
  subclasses: [
    {
      id: 'cloistered-cleric',
      name: 'Cloistered Cleric',
      parentClassId: 'cleric',
      description:
        'You are a cleric of the cloth, focusing on divine magic and your connection to your deity’s domains.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'cloistered-first-doctrine',
              name: 'First Doctrine (Cloistered Cleric)',
              source: 'Cloistered Cleric 1',
              description: 'You gain the Domain Initiate cleric feat.',
            },
          ],
        },
      ],
    },
    {
      id: 'warpriest',
      name: 'Warpriest',
      parentClassId: 'cleric',
      description:
        'Counted among the ranks of holy warriors, you’re a warpriest, trained in both divine magic and the art of war.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'warpriest-first-doctrine',
              name: 'First Doctrine (Warpriest)',
              source: 'Warpriest 1',
              description:
                'You gain the Shield Block general feat. If your deity’s favored weapon is a simple weapon, you gain the Deadly Simplicity cleric feat.',
            },
          ],
        },
      ],
    },
  ],
  spellcasting: {
    ability: 'wis',
    spellListId: 'divine-pf2e',
    preparedCasterFormula: 'wis_mod + class_level',
    spellSlots: {
      1: [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      2: [0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      3: [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3],
    },
    ritualCasting: true,
    multiclassCasterLevel: 'full',
  },
  classResources: [
    {
      id: 'divine-font',
      name: 'Divine Font',
      maxFormula: '1 + cha_mod',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
  ],
  multiclassRequirements: [{ type: 'attribute', value: 14, description: 'Wisdom 14' }],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    'Deities work their will upon the world in infinite ways, and you serve as one of their most powerful instruments.',
  displayMetadata: {
    icon: 'cross',
    color: '#FFD700',
    shortDescription: "A divine spellcaster who channels their deity's power.",
    playStyle: 'Full divine caster with heal/harm font',
    complexity: 'moderate',
    role: 'support',
    idealFor: ['Divine casters', 'Healers'],
    tags: ['divine', 'spellcaster', 'support'],
    casterType: 'full',
  },
};
