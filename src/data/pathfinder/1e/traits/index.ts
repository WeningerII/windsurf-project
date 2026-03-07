import type { Pf1eTrait } from '../../../../systems/pf1e/data-model';

/**
 * Core PF1e trait options (small curated starter set).
 * These are used for sheet-side trait selection until a full trait catalog is added.
 */
export const pf1eTraits: Pf1eTrait[] = [
  {
    id: 'reactionary',
    name: 'Reactionary',
    type: 'combat',
    source: 'Core Rulebook',
    description: '+2 trait bonus on initiative checks.',
  },
  {
    id: 'resilient',
    name: 'Resilient',
    type: 'combat',
    source: 'Core Rulebook',
    description: '+1 trait bonus on Fortitude saves.',
  },
  {
    id: 'indomitable-faith',
    name: 'Indomitable Faith',
    type: 'faith',
    source: 'Core Rulebook',
    description: '+1 trait bonus on Will saves.',
  },
  {
    id: 'focused-mind',
    name: 'Focused Mind',
    type: 'magic',
    source: 'Core Rulebook',
    description: '+2 trait bonus on Concentration checks.',
  },
  {
    id: 'magical-knack',
    name: 'Magical Knack',
    type: 'magic',
    source: 'Core Rulebook',
    description: '+2 caster level for one class (maximum character level).',
  },
  {
    id: 'seeker',
    name: 'Seeker',
    type: 'social',
    source: 'Core Rulebook',
    description: '+1 trait bonus on Perception checks, and Perception is always a class skill.',
  },
  {
    id: 'student-of-philosophy',
    name: 'Student of Philosophy',
    type: 'social',
    source: 'Core Rulebook',
    description: 'Use INT instead of CHA for Diplomacy to persuade and Bluff to lie.',
  },
  {
    id: 'pragmatic-activator',
    name: 'Pragmatic Activator',
    type: 'magic',
    source: 'Core Rulebook',
    description: 'Use INT instead of CHA for Use Magic Device checks.',
  },
  {
    id: 'heirloom-weapon',
    name: 'Heirloom Weapon',
    type: 'regional',
    source: 'Core Rulebook',
    description: 'Gain proficiency and a +1 trait bonus with one chosen weapon.',
  },
  {
    id: 'adopted',
    name: 'Adopted',
    type: 'race',
    source: 'Core Rulebook',
    description: 'Select one race trait from your adoptive parents.',
  },
  {
    id: 'deft-dodger',
    name: 'Deft Dodger',
    type: 'combat',
    source: 'Core Rulebook',
    description: '+1 trait bonus on Reflex saves.',
  },
  {
    id: 'world-traveler',
    name: 'World Traveler',
    type: 'campaign',
    source: 'Core Rulebook',
    description: '+1 trait bonus on Linguistics and one additional language.',
  },
];
