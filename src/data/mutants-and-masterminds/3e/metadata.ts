// Mutants & Masterminds 3e Edition Metadata and Progress Tracking
// All counts are computed from actual data imports — never hardcoded.

import {
  allPowers,
  attackPowers,
  defensePowers,
  movementPowers,
  sensoryPowers,
  generalPowers,
  controlPowers,
} from './powers/aggregations';
import { powerModifiers } from './modifiers/index';
import { mam3eAdvantages } from './advantages/index';
import { combatAdvantages } from './advantages/combat';
import { fortuneAdvantages } from './advantages/fortune';
import { generalAdvantages } from './advantages/general';
import { skillAdvantages } from './advantages/skill';
import { skills } from './skills/index';
import { complications } from './complications/index';
import { mm3eArchetypes } from './archetypes/index';
// Equipment ships in exactly one provenance tier (see ./equipment/index.ts):
// the encoder-generated Hero SRD set. The hand-written original set — and with
// it the only `devices` this catalog ever had — was deleted 2026-07-30, so
// these counts are the whole browsable catalog.
import { mam3eSrdWeapons } from './equipment/srd-weapons';
import { mam3eSrdArmor } from './equipment/srd-armor';
import { mam3eSrdVehicles } from './equipment/srd-vehicles';
import { mam3eSrdGear } from './equipment/srd-gear';
import { mam3eSrdHeadquarters } from './equipment/srd-headquarters';

export const mm3eMetadata = {
  system: 'mam3e',
  edition: '3e',
  version: "Hero's Handbook + Expanded",

  stats: {
    powers: {
      count: allPowers.length,
      byType: {
        attack: attackPowers.length,
        defense: defensePowers.length,
        movement: movementPowers.length,
        sensory: sensoryPowers.length,
        general: generalPowers.length,
        control: controlPowers.length,
      },
    },

    powerModifiers: {
      extras: powerModifiers.extras.length,
      flaws: powerModifiers.flaws.length,
    },

    advantages: {
      count: mam3eAdvantages.length,
      byType: {
        combat: combatAdvantages.length,
        fortune: fortuneAdvantages.length,
        general: generalAdvantages.length,
        skill: skillAdvantages.length,
      },
    },

    skills: {
      count: skills.length,
    },

    complications: {
      count: complications.length,
    },

    equipment: {
      vehicles: mam3eSrdVehicles.length,
      headquarters: mam3eSrdHeadquarters.length,
      weapons: mam3eSrdWeapons.length,
      armor: mam3eSrdArmor.length,
      gear: mam3eSrdGear.length,
    },

    archetypes: {
      count: Object.keys(mm3eArchetypes).length,
    },
  },

  powerLevels: {
    streetLevel: { pl: 6, description: 'Street heroes, vigilantes' },
    standard: { pl: 10, description: 'Standard superheroes' },
    cosmic: { pl: 15, description: 'Cosmic-level heroes' },
    infinite: { pl: 20, description: 'Near-omnipotent beings' },
  },

  sources: [
    { id: 'hh', name: "Hero's Handbook", abbr: 'HH' },
    { id: 'gh', name: 'Gadget Guide', abbr: 'GG' },
    { id: 'pp', name: 'Power Profiles', abbr: 'PP' },
    { id: 'deluxe', name: "Deluxe Hero's Handbook", abbr: 'DHH' },
  ],
};

export function getProgress(): number {
  const stats = mm3eMetadata.stats;
  const totalItems =
    stats.powers.count +
    stats.powerModifiers.extras +
    stats.powerModifiers.flaws +
    stats.advantages.count +
    stats.skills.count +
    stats.complications.count +
    stats.equipment.vehicles +
    stats.equipment.headquarters +
    stats.equipment.weapons +
    stats.equipment.armor +
    stats.equipment.gear +
    stats.archetypes.count;

  // All present data is implemented — progress is 100%
  return totalItems > 0 ? 100 : 0;
}
