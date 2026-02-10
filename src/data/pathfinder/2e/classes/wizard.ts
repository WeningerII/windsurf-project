import { CharacterClass } from '../../../../types/character-options/classes';

export const wizard: CharacterClass = {
  id: 'wizard',
  name: 'Wizard',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: { name: 'Pathfinder Core Rulebook', page: 202, url: 'https://2e.aonprd.com/Classes.aspx?ID=12' },
  hitDie: 'd6',
  primaryAbility: ['int'],
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: ['club', 'crossbow', 'dagger', 'heavy-crossbow', 'staff'],
  toolProficiencies: [],
  skillProficiencies: { count: 2, options: ['arcana'], label: 'Trained in Arcana and 2 + Int skills' },
  equipmentChoices: [],
  startingGold: { dice: '15', multiplier: 1 },
  features: [
    { level: 1, features: [
      { id: 'arcane-school', name: 'Arcane School', source: 'Wizard 1', description: 'Choose a school of magic or become a universalist. Your school grants you focus spells and abilities.' },
      { id: 'arcane-bond', name: 'Arcane Bond', source: 'Wizard 1', description: 'You forge a bond with an item, typically a staff or spellbook.' },
      { id: 'arcane-thesis', name: 'Arcane Thesis', source: 'Wizard 1', description: 'Your thesis represents your approach to arcane magic.' },
    ]},
    { level: 5, features: [{ id: 'lightning-reflexes', name: 'Lightning Reflexes', source: 'Wizard 5', description: 'Your proficiency rank for Reflex saves increases to expert.' }]},
    { level: 7, features: [{ id: 'expert-spellcaster', name: 'Expert Spellcaster', source: 'Wizard 7', description: 'Your proficiency ranks for arcane spell attacks and DCs increase to expert.' }]},
    { level: 9, features: [{ id: 'magical-fortitude', name: 'Magical Fortitude', source: 'Wizard 9', description: 'Your proficiency rank for Fortitude saves increases to expert.' }]},
    { level: 11, features: [{ id: 'alertness', name: 'Alertness', source: 'Wizard 11', description: 'Your proficiency rank for Perception increases to expert.' }]},
    { level: 13, features: [{ id: 'defensive-robes', name: 'Defensive Robes', source: 'Wizard 13', description: 'Your proficiency rank for unarmored defense increases to expert.' }]},
    { level: 15, features: [{ id: 'master-spellcaster', name: 'Master Spellcaster', source: 'Wizard 15', description: 'Your proficiency ranks for arcane spell attacks and DCs increase to master.' }]},
    { level: 19, features: [{ id: 'legendary-spellcaster', name: 'Legendary Spellcaster', source: 'Wizard 19', description: 'Your proficiency ranks for arcane spell attacks and DCs increase to legendary.' }]},
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'abjuration',
      name: 'School of Abjuration',
      parentClassId: 'wizard',
      description: 'You focus on defensive magic, creating barriers and protective wards.',
      features: [
        { level: 1, features: [
          { id: 'abjuration-school', name: 'Abjuration School', source: 'Abjuration 1', description: 'You gain the protective ward school spell and can add abjuration spells to your spellbook more easily.' },
        ]},
        { level: 8, features: [{ id: 'energy-absorption', name: 'Energy Absorption', source: 'Abjuration 8', description: 'When your protective ward absorbs energy damage, you can convert it into temporary Hit Points.' }]},
      ],
    },
    {
      id: 'divination',
      name: 'School of Divination',
      parentClassId: 'wizard',
      description: 'You pierce the veil of time and space, gaining knowledge of things yet to come.',
      features: [
        { level: 1, features: [
          { id: 'divination-school', name: 'Divination School', source: 'Divination 1', description: 'You gain the diviner\'s sight school spell and can add divination spells to your spellbook more easily.' },
        ]},
        { level: 6, features: [{ id: 'vigilant-eye', name: 'Vigilant Eye', source: 'Divination 6', description: 'You gain a +1 circumstance bonus to Perception checks and initiative rolls.' }]},
      ],
    },
    {
      id: 'evocation',
      name: 'School of Evocation',
      parentClassId: 'wizard',
      description: 'You focus on harnessing raw magical energy into powerful offensive spells.',
      features: [
        { level: 1, features: [
          { id: 'evocation-school', name: 'Evocation School', source: 'Evocation 1', description: 'You gain the force bolt school spell and can add evocation spells to your spellbook more easily.' },
        ]},
        { level: 6, features: [{ id: 'energy-mastery', name: 'Energy Mastery', source: 'Evocation 6', description: 'You can change the damage type of your evocation spells that deal energy damage.' }]},
        { level: 8, features: [{ id: 'overwhelming-energy', name: 'Overwhelming Energy', source: 'Evocation 8', description: 'Your evocation spells ignore an amount of resistance equal to half your level.' }]},
      ],
    },
    {
      id: 'illusion',
      name: 'School of Illusion',
      parentClassId: 'wizard',
      description: 'You weave deceptions and figments, fooling the senses and mind.',
      features: [
        { level: 1, features: [
          { id: 'illusion-school', name: 'Illusion School', source: 'Illusion 1', description: 'You gain the warped terrain school spell and can add illusion spells to your spellbook more easily.' },
        ]},
        { level: 8, features: [{ id: 'invisibility-cloak', name: 'Invisibility Cloak', source: 'Illusion 8', description: 'You can become invisible as a free action once per day.' }]},
      ],
    },
    {
      id: 'transmutation',
      name: 'School of Transmutation',
      parentClassId: 'wizard',
      description: 'You reshape matter and energy, transforming the world around you.',
      features: [
        { level: 1, features: [
          { id: 'transmutation-school', name: 'Transmutation School', source: 'Transmutation 1', description: 'You gain the telekinetic hand school spell and can add transmutation spells to your spellbook more easily.' },
        ]},
        { level: 6, features: [{ id: 'transmutation-mastery', name: 'Transmutation Mastery', source: 'Transmutation 6', description: 'You gain a +1 status bonus to transmutation spell DCs.' }]},
      ],
    },
    {
      id: 'conjuration',
      name: 'School of Conjuration',
      parentClassId: 'wizard',
      description: 'You summon creatures and objects from other planes and locations.',
      features: [
        { level: 1, features: [
          { id: 'conjuration-school', name: 'Conjuration School', source: 'Conjuration 1', description: 'You gain the mage hand school spell and can add conjuration spells to your spellbook more easily.' },
        ]},
        { level: 8, features: [{ id: 'summoning-mastery', name: 'Summoning Mastery', source: 'Conjuration 8', description: 'Your summoned creatures gain a +1 status bonus to attack and damage rolls.' }]},
      ],
    },
    {
      id: 'necromancy',
      name: 'School of Necromancy',
      parentClassId: 'wizard',
      description: 'You command death and undeath, wielding the power of the grave.',
      features: [
        { level: 1, features: [
          { id: 'necromancy-school', name: 'Necromancy School', source: 'Necromancy 1', description: 'You gain the chill touch school spell and can add necromancy spells to your spellbook more easily.' },
        ]},
        { level: 6, features: [{ id: 'undead-mastery', name: 'Undead Mastery', source: 'Necromancy 6', description: 'Your undead minions gain additional Hit Points equal to your level.' }]},
      ],
    },
    {
      id: 'enchantment',
      name: 'School of Enchantment',
      parentClassId: 'wizard',
      description: 'You influence minds and wills, bending others to your desires.',
      features: [
        { level: 1, features: [
          { id: 'enchantment-school', name: 'Enchantment School', source: 'Enchantment 1', description: 'You gain the charm school spell and can add enchantment spells to your spellbook more easily.' },
        ]},
        { level: 8, features: [{ id: 'charm-mastery', name: 'Charm Mastery', source: 'Enchantment 8', description: 'When you cast an enchantment spell, you gain a +1 status bonus to the spell DC.' }]},
      ],
    },
  ],
  spellcasting: { ability: 'int', spellListId: 'arcane-pf2e', preparedCasterFormula: 'int_mod + class_level', spellSlots: { 1: [2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3], 2: [0,0,0,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3], 3: [0,0,0,0,0,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3], 4: [0,0,0,0,0,0,0,2,3,3,3,3,3,3,3,3,3,3,3,3], 5: [0,0,0,0,0,0,0,0,0,2,3,3,3,3,3,3,3,3,3,3], 6: [0,0,0,0,0,0,0,0,0,0,0,2,3,3,3,3,3,3,3,3], 7: [0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,3,3,3,3], 8: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,3,3], 9: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3] }, ritualCasting: true, multiclassCasterLevel: 'full' },
  classResources: [{ id: 'focus-points', name: 'Focus Points', maxFormula: '1', recoveryType: 'short-rest', displayOrder: 1 }],
  multiclassRequirements: [{ type: 'attribute', value: 14, description: 'Intelligence 14' }],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description: 'You are an eternal student of the arcane secrets of the universe, using your mastery of magic to cast powerful spells.',
  displayMetadata: {
    icon: 'book', color: '#4169E1',
    shortDescription: 'A prepared arcane caster with school specialization.',
    playStyle: 'Versatile prepared caster with arcane thesis',
    complexity: 'complex', role: 'controller',
    idealFor: ['Strategic thinkers', 'Spell variety enthusiasts'],
    tags: ['arcane', 'spellcaster'],
    casterType: 'full',
  },
};
