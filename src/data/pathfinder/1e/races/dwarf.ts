import { Species } from '../../../../types/character-options/species';

export const dwarf: Species = {
  id: 'dwarf',
  name: 'Dwarf',
  system: 'pf1e',
  source: 'Core Rulebook',
  
  abilityScoreIncrease: [
    { type: 'fixed', attributes: { con: 2, wis: 2, cha: -2 } },
  ],
  
  size: 'medium',
  speed: 20,
  
  languages: {
    automatic: ['Common', 'Dwarven'],
    choice: { count: 0, options: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon'], label: 'Bonus languages' },
  },
  
  traits: [
    { id: 'slow-and-steady', name: 'Slow and Steady', source: 'Dwarf', description: 'Dwarves have a base speed of 20 feet, but their speed is never modified by armor or encumbrance.' },
    { id: 'darkvision', name: 'Darkvision', source: 'Dwarf', description: 'Dwarves can see in the dark up to 60 feet.' },
    { id: 'defensive-training', name: 'Defensive Training', source: 'Dwarf', description: 'Dwarves gain a +4 dodge bonus to AC against monsters of the giant subtype.' },
    { id: 'greed', name: 'Greed', source: 'Dwarf', description: 'Dwarves gain a +2 racial bonus on Appraise checks made to determine the price of non-magical goods that contain precious metals or gemstones.' },
    { id: 'hatred', name: 'Hatred', source: 'Dwarf', description: 'Dwarves gain a +1 racial bonus on attack rolls against humanoid creatures of the orc and goblinoid subtypes.' },
    { id: 'hardy', name: 'Hardy', source: 'Dwarf', description: 'Dwarves gain a +2 racial bonus on saving throws against poison, spells, and spell-like abilities.' },
    { id: 'stability', name: 'Stability', source: 'Dwarf', description: 'Dwarves gain a +4 racial bonus to their CMD when resisting a bull rush or trip attempt while standing on the ground.' },
    { id: 'stonecunning', name: 'Stonecunning', source: 'Dwarf', description: 'Dwarves gain a +2 bonus on Perception checks to notice unusual stonework, such as traps and hidden doors located in stone walls or floors.' },
    { id: 'weapon-familiarity', name: 'Weapon Familiarity', source: 'Dwarf', description: 'Dwarves are proficient with battleaxes, heavy picks, and warhammers, and treat any weapon with the word "dwarven" in its name as a martial weapon.' },
  ],
  
  description: 'Dwarves are a stoic but stern race, ensconced in cities carved from the hearts of mountains and fiercely determined to repel the depredations of savage races.',
  ageInfo: 'Dwarves are considered young until age 40, reach adulthood around 40, and can live over 400 years.',
  alignmentTendency: 'Dwarves are usually lawful.',
  sizeDescription: 'Dwarves are Medium creatures and have no bonuses or penalties due to their size.',
};
