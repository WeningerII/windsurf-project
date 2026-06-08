import { CharacterClass } from '../../../../types/character-options/classes';

export const sorcerer: CharacterClass = {
  id: 'sorcerer',
  name: 'Sorcerer',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 190,
    url: 'https://2e.aonprd.com/Classes.aspx?ID=11',
  },
  hitDie: 'd6',
  primaryAbility: ['cha'],
  savingThrowProficiencies: ['cha', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: [],
    label: 'Trained in 2 + Int skills based on bloodline',
  },
  equipmentChoices: [],
  startingGold: { dice: '15', multiplier: 1 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'bloodline',
          name: 'Bloodline',
          source: 'Sorcerer 1',
          description:
            'Choose a bloodline: Aberrant, Angelic, Demonic, Diabolic, Draconic, Elemental, Fey, Hag, Imperial, or Undead. Your bloodline grants you spells and abilities.',
        },
        {
          id: 'bloodline-spells',
          name: 'Bloodline Spells',
          source: 'Sorcerer 1',
          description:
            'Your bloodline grants you bloodline spells, which are a type of focus spell.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'signature-spells',
          name: 'Signature Spells',
          source: 'Sorcerer 3',
          description: 'You can freely heighten signature spells.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'expert-spellcaster',
          name: 'Expert Spellcaster',
          source: 'Sorcerer 7',
          description: 'Your spell attack and DC proficiency increases to expert.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'lightning-reflexes',
          name: 'Lightning Reflexes',
          source: 'Sorcerer 9',
          description: 'Your proficiency rank for Reflex saves increases to expert.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'alertness',
          name: 'Alertness',
          source: 'Sorcerer 11',
          description: 'Your proficiency rank for Perception increases to expert.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'defensive-robes',
          name: 'Defensive Robes',
          source: 'Sorcerer 13',
          description: 'Your proficiency rank for unarmored defense increases to expert.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'master-spellcaster',
          name: 'Master Spellcaster',
          source: 'Sorcerer 15',
          description: 'Your spell attack and DC proficiency increases to master.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'legendary-spellcaster',
          name: 'Legendary Spellcaster',
          source: 'Sorcerer 19',
          description: 'Your spell attack and DC proficiency increases to legendary.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'aberrant',
      name: 'Aberrant Bloodline',
      parentClassId: 'sorcerer',
      description:
        'Your bloodline is touched by aberrations, granting you strange and unsettling powers.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'aberrant-spells',
              name: 'Aberrant Spells',
              source: 'Aberrant Bloodline 1',
              description:
                'You add occult spells to your spell list, including true strike, touch of idiocy, and more.',
            },
            {
              id: 'tentacular-limbs',
              name: 'Tentacular Limbs',
              source: 'Aberrant Bloodline 1',
              description:
                'You gain the tentacular limbs bloodline spell, allowing you to grow writhing tentacles.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'aberrant-whispers',
              name: 'Aberrant Whispers',
              source: 'Aberrant Bloodline 3',
              description: 'Your spells gain mental components that can disorient foes.',
            },
          ],
        },
      ],
      spellListExpansion: ['true-strike-pf2e', 'touch-of-idiocy-pf2e', 'hypercognition-pf2e'],
    },
    {
      id: 'angelic',
      name: 'Angelic Bloodline',
      parentClassId: 'sorcerer',
      description: 'Your bloodline carries the blessing of celestials, granting you holy powers.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'angelic-spells',
              name: 'Angelic Spells',
              source: 'Angelic Bloodline 1',
              description:
                'You add divine spells to your spell list, including heal, spiritual weapon, and more.',
            },
            {
              id: 'angelic-halo',
              name: 'Angelic Halo',
              source: 'Angelic Bloodline 1',
              description:
                'You gain the angelic halo bloodline spell, creating a protective halo of light.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'celestial-wings',
              name: 'Celestial Wings',
              source: 'Angelic Bloodline 3',
              description: 'You can manifest angelic wings to fly.',
            },
          ],
        },
      ],
      spellListExpansion: ['heal-pf2e', 'spiritual-armament-pf2e', 'divine-wrath-pf2e'],
    },
    {
      id: 'demonic',
      name: 'Demonic Bloodline',
      parentClassId: 'sorcerer',
      description:
        'Your bloodline is tainted by demonic power, granting you destructive abilities.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'demonic-spells',
              name: 'Demonic Spells',
              source: 'Demonic Bloodline 1',
              description:
                'You add divine spells to your spell list, including fear, harm, and more.',
            },
            {
              id: 'gluttons-jaws',
              name: "Glutton's Jaws",
              source: 'Demonic Bloodline 1',
              description:
                "You gain the glutton's jaws bloodline spell, manifesting demonic fangs.",
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'demonic-resistance',
              name: 'Demonic Resistance',
              source: 'Demonic Bloodline 3',
              description: 'You gain resistance to fire and poison damage.',
            },
          ],
        },
      ],
      spellListExpansion: ['fear-pf2e', 'harm-pf2e', 'fireball-pf2e'],
    },
    {
      id: 'draconic',
      name: 'Draconic Bloodline',
      parentClassId: 'sorcerer',
      description:
        'Your bloodline is descended from dragons, granting you draconic resilience and power.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'draconic-spells',
              name: 'Draconic Spells',
              source: 'Draconic Bloodline 1',
              description: 'You add arcane spells to your spell list based on your dragon type.',
            },
            {
              id: 'dragon-claws',
              name: 'Dragon Claws',
              source: 'Draconic Bloodline 1',
              description:
                'You gain the dragon claws bloodline spell, manifesting deadly draconic claws.',
            },
            {
              id: 'dragon-breath',
              name: 'Dragon Breath',
              source: 'Draconic Bloodline 1',
              description: 'You can breathe elemental energy like a dragon.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'draconic-resistance',
              name: 'Draconic Resistance',
              source: 'Draconic Bloodline 3',
              description: 'You gain resistance to the damage type of your dragon ancestry.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'wings-of-the-dragon',
              name: 'Wings of the Dragon',
              source: 'Draconic Bloodline 9',
              description: 'You can manifest dragon wings and fly.',
            },
          ],
        },
      ],
      spellListExpansion: ['true-strike-pf2e', 'fear-pf2e', 'haste-pf2e'],
    },
    {
      id: 'fey',
      name: 'Fey Bloodline',
      parentClassId: 'sorcerer',
      description:
        'Your bloodline carries the magic of the fey, granting you whimsical and unpredictable powers.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'fey-spells',
              name: 'Fey Spells',
              source: 'Fey Bloodline 1',
              description:
                'You add occult spells to your spell list, including charm, color spray, and more.',
            },
            {
              id: 'fey-glamour',
              name: 'Fey Glamour',
              source: 'Fey Bloodline 1',
              description:
                'You gain the fey glamour bloodline spell, allowing you to charm and deceive.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'fey-magic',
              name: 'Fey Magic',
              source: 'Fey Bloodline 3',
              description: 'You gain a +1 status bonus to Deception and Diplomacy checks.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'fey-wings',
              name: 'Fey Wings',
              source: 'Fey Bloodline 9',
              description: 'You can manifest delicate fey wings and fly.',
            },
          ],
        },
      ],
      spellListExpansion: ['charm-pf2e', 'color-spray-pf2e', 'suggestion-pf2e'],
    },
    {
      id: 'undead',
      name: 'Undead Bloodline',
      parentClassId: 'sorcerer',
      description:
        'Your bloodline is touched by undeath, granting you necromantic power and resilience.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'undead-spells',
              name: 'Undead Spells',
              source: 'Undead Bloodline 1',
              description:
                'You add divine spells to your spell list, including chill touch, false life, and more.',
            },
            {
              id: 'undead-touch',
              name: 'Undead Touch',
              source: 'Undead Bloodline 1',
              description:
                'You gain the undead touch bloodline spell, draining life force from your foes.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'undead-resilience',
              name: 'Undead Resilience',
              source: 'Undead Bloodline 3',
              description: 'You gain resistance to negative damage equal to your level.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'undead-form',
              name: 'Undead Form',
              source: 'Undead Bloodline 9',
              description:
                'You can assume a partially undead form, gaining additional undead traits.',
            },
          ],
        },
      ],
      spellListExpansion: ['chill-touch-pf2e', 'false-vitality-pf2e', 'summon-undead-pf2e'],
    },
  ],
  spellcasting: {
    ability: 'cha',
    spellListId: 'varies-by-bloodline',
    spellSlots: {
      1: [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      2: [0, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      3: [0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      4: [0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4, 4, 4],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 4],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'full',
  },
  classResources: [
    {
      id: 'focus-points',
      name: 'Focus Points',
      maxFormula: '1',
      recoveryType: 'short-rest',
      displayOrder: 1,
    },
  ],
  multiclassRequirements: [{ type: 'attribute', value: 14, description: 'Charisma 14' }],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    "You didn't choose to become a spellcaster—you were born one. There's magic in your blood.",
  displayMetadata: {
    icon: 'fire',
    color: '#DC143C',
    shortDescription: 'A spontaneous caster with innate bloodline magic.',
    playStyle: 'Flexible caster with bloodline powers',
    complexity: 'moderate',
    role: 'controller',
    idealFor: ['Spontaneous casters', 'Blasters'],
    tags: ['spellcaster'],
    casterType: 'full',
  },
};
