// These interfaces live in types/character-options/pf2eBackgrounds.ts
// (review M-2); re-exported here so existing imports keep working.
export type {
  Pf2eBackgroundChoice,
  Pf2eBackgroundDefinition,
  Pf2eBackgroundFeatGrant,
} from '../../../../types/character-options/pf2eBackgrounds';
import type { Pf2eBackgroundDefinition } from '../../../../types/character-options/pf2eBackgrounds';
import { srdPf2eGeneratedBackgrounds } from './generated';

const coreSource = 'Core Rulebook';

// Hand-written Core Rulebook backgrounds. The bulk CRB backgrounds sourced from
// Pf2eTools (scripts/encode-pf2e-backgrounds.mjs) are appended below; the
// hand-written entries here win on name match.
const handWrittenBackgrounds: Pf2eBackgroundDefinition[] = [
  {
    id: 'pf2e-bg-acolyte',
    name: 'Acolyte',
    source: coreSource,
    description: 'Raised in a faith tradition with training in religion and ritual life.',
    abilityBoosts: { options: ['int', 'wis'], label: 'Intelligence or Wisdom, plus one free' },
    skillTraining: 'religion',
    loreTraining: 'scribing-lore',
    feat: {
      id: 'student-of-the-canon',
      name: 'Student of the Canon',
      type: 'skill',
      description: 'Granted by the Acolyte background.',
    },
  },
  {
    id: 'pf2e-bg-acrobat',
    name: 'Acrobat',
    source: coreSource,
    description: 'Trained as a tumbler, performer, or circus athlete.',
    abilityBoosts: { options: ['str', 'dex'], label: 'Strength or Dexterity, plus one free' },
    skillTraining: 'acrobatics',
    loreTraining: 'circus-lore',
    feat: {
      id: 'steady-balance',
      name: 'Steady Balance',
      type: 'skill',
      description: 'Granted by the Acrobat background.',
    },
  },
  {
    id: 'pf2e-bg-artist',
    name: 'Artist',
    source: coreSource,
    description: 'You practiced a craft or performance as your livelihood.',
    abilityBoosts: { options: ['dex', 'cha'], label: 'Dexterity or Charisma, plus one free' },
    skillTraining: 'crafting',
    loreTraining: 'art-lore',
    feat: {
      id: 'specialty-crafting',
      name: 'Specialty Crafting',
      type: 'skill',
      description: 'Granted by the Artist background.',
    },
  },
  {
    id: 'pf2e-bg-barkeep',
    name: 'Barkeep',
    source: coreSource,
    description: 'You worked in taverns and learned to read people quickly.',
    abilityBoosts: { options: ['con', 'cha'], label: 'Constitution or Charisma, plus one free' },
    skillTraining: 'diplomacy',
    loreTraining: 'alcohol-lore',
    feat: {
      id: 'hobnobber',
      name: 'Hobnobber',
      type: 'skill',
      description: 'Granted by the Barkeep background.',
    },
  },
  {
    id: 'pf2e-bg-criminal',
    name: 'Criminal',
    source: coreSource,
    description: 'You survived through illicit work, smuggling, or theft.',
    abilityBoosts: { options: ['dex', 'int'], label: 'Dexterity or Intelligence, plus one free' },
    skillTraining: 'stealth',
    loreTraining: 'underworld-lore',
    feat: {
      id: 'experienced-smuggler',
      name: 'Experienced Smuggler',
      type: 'skill',
      description: 'Granted by the Criminal background.',
    },
  },
  {
    id: 'pf2e-bg-emissary',
    name: 'Emissary',
    source: coreSource,
    description: 'You served as a negotiator, envoy, or messenger between groups.',
    abilityBoosts: { options: ['int', 'cha'], label: 'Intelligence or Charisma, plus one free' },
    skillTraining: 'diplomacy',
    loreTraining: {
      options: ['society', 'city-lore'],
      label: 'Society or a Lore skill tied to a specific city',
    },
    feat: {
      id: 'multilingual',
      name: 'Multilingual',
      type: 'general',
      description: 'Granted by the Emissary background.',
    },
  },
  {
    id: 'pf2e-bg-farmhand',
    name: 'Farmhand',
    source: coreSource,
    description: 'Hard work and practical life in rural settlements shaped you.',
    abilityBoosts: { options: ['con', 'wis'], label: 'Constitution or Wisdom, plus one free' },
    skillTraining: 'athletics',
    loreTraining: 'farming-lore',
    feat: {
      id: 'assurance-athletics',
      name: 'Assurance (Athletics)',
      type: 'skill',
      description: 'Granted by the Farmhand background.',
    },
  },
  {
    id: 'pf2e-bg-guard',
    name: 'Guard',
    source: coreSource,
    description: 'You trained to keep watch, defend others, and maintain order.',
    abilityBoosts: { options: ['str', 'cha'], label: 'Strength or Charisma, plus one free' },
    skillTraining: 'intimidation',
    loreTraining: {
      options: ['legal-lore', 'warfare-lore'],
      label: 'Legal Lore or Warfare Lore',
    },
    feat: {
      id: 'quick-coercion',
      name: 'Quick Coercion',
      type: 'skill',
      description: 'Granted by the Guard background.',
    },
  },
  {
    id: 'pf2e-bg-herbalist',
    name: 'Herbalist',
    source: coreSource,
    description: 'You gathered and prepared plants for remedies and alchemy.',
    abilityBoosts: { options: ['con', 'wis'], label: 'Constitution or Wisdom, plus one free' },
    skillTraining: 'nature',
    loreTraining: 'herbalism-lore',
    feat: {
      id: 'natural-medicine',
      name: 'Natural Medicine',
      type: 'skill',
      description: 'Granted by the Herbalist background.',
    },
  },
  {
    id: 'pf2e-bg-laborer',
    name: 'Laborer',
    source: coreSource,
    description: 'You earned your living through physical work and endurance.',
    abilityBoosts: { options: ['con', 'str'], label: 'Constitution or Strength, plus one free' },
    skillTraining: 'athletics',
    loreTraining: 'labor-lore',
    feat: {
      id: 'hefty-hauler',
      name: 'Hefty Hauler',
      type: 'general',
      description: 'Granted by the Laborer background.',
    },
  },
  {
    id: 'pf2e-bg-noble',
    name: 'Noble',
    source: coreSource,
    description: 'You were raised in influential circles and social expectations.',
    abilityBoosts: { options: ['int', 'cha'], label: 'Intelligence or Charisma, plus one free' },
    skillTraining: 'society',
    loreTraining: {
      options: ['genealogy-lore', 'heraldry-lore'],
      label: 'Genealogy Lore or Heraldry Lore',
    },
    feat: {
      id: 'courtly-graces',
      name: 'Courtly Graces',
      type: 'skill',
      description: 'Granted by the Noble background.',
    },
  },
  {
    id: 'pf2e-bg-sailor',
    name: 'Sailor',
    source: coreSource,
    description: 'You learned discipline and danger from life at sea.',
    abilityBoosts: { options: ['str', 'dex'], label: 'Strength or Dexterity, plus one free' },
    skillTraining: 'athletics',
    loreTraining: 'sailing-lore',
    feat: {
      id: 'underwater-marauder',
      name: 'Underwater Marauder',
      type: 'skill',
      description: 'Granted by the Sailor background.',
    },
  },
  {
    id: 'pf2e-bg-scout',
    name: 'Scout',
    source: coreSource,
    description: 'You traveled ahead of others, surveying routes and threats.',
    abilityBoosts: { options: ['dex', 'wis'], label: 'Dexterity or Wisdom, plus one free' },
    skillTraining: 'nature',
    loreTraining: {
      options: ['terrain-lore'],
      label: 'A Lore skill tied to a specific terrain',
    },
    feat: {
      id: 'forager',
      name: 'Forager',
      type: 'skill',
      description: 'Granted by the Scout background.',
    },
  },
  {
    id: 'pf2e-bg-scholar',
    name: 'Scholar',
    source: coreSource,
    description: 'Academic study and research shaped your perspective.',
    abilityBoosts: { options: ['int', 'wis'], label: 'Intelligence or Wisdom, plus one free' },
    skillTraining: {
      options: ['arcana', 'nature', 'occultism', 'religion'],
      label: 'Arcana, Nature, Occultism, or Religion',
    },
    loreTraining: 'academia-lore',
    feat: {
      id: 'assurance-scholar',
      name: 'Assurance',
      type: 'skill',
      description: 'Granted by the Scholar background for the chosen scholastic skill.',
    },
  },
  {
    id: 'pf2e-bg-street-urchin',
    name: 'Street Urchin',
    source: coreSource,
    description: 'You grew up with little and learned to survive in city streets.',
    abilityBoosts: { options: ['dex', 'con'], label: 'Dexterity or Constitution, plus one free' },
    skillTraining: 'thievery',
    loreTraining: {
      options: ['city-lore'],
      label: 'A Lore skill tied to a specific city',
    },
    feat: {
      id: 'pickpocket',
      name: 'Pickpocket',
      type: 'skill',
      description: 'Granted by the Street Urchin background.',
    },
  },
  {
    id: 'pf2e-bg-warrior',
    name: 'Warrior',
    source: coreSource,
    description: 'Military training or mercenary life taught you battle discipline.',
    abilityBoosts: { options: ['str', 'con'], label: 'Strength or Constitution, plus one free' },
    skillTraining: 'intimidation',
    loreTraining: 'warfare-lore',
    feat: {
      id: 'intimidating-glare',
      name: 'Intimidating Glare',
      type: 'skill',
      description: 'Granted by the Warrior background.',
    },
  },
];

export { handWrittenBackgrounds };

// Full Core Rulebook background list: hand-written entries plus the generated
// CRB backgrounds (which never duplicate a hand-written name).
export const pf2eBackgrounds: Pf2eBackgroundDefinition[] = [
  ...handWrittenBackgrounds,
  ...srdPf2eGeneratedBackgrounds,
];
