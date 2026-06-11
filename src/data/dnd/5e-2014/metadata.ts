// D&D 5e Edition Metadata and Progress Tracking
// All counts are computed from actual data imports — never hardcoded.

import { dnd5eSpells, dnd5eSpellsByLevel, dnd5eSpellsBySchool } from './spells/index';
import { dnd5eClasses } from './classes/index';
import { dnd5eSpecies } from './species/index';
import { dnd5eBackgrounds } from './backgrounds/index';
import { dnd5eMonsters } from './monsters/index';
import {
  dnd5eWeapons,
  dnd5eArmor,
  dnd5eShields,
  dnd5eAdventuringGear,
  dnd5eMagicItems,
  dnd5eEquipmentByType,
} from './equipment/index';
import { eldritchInvocations } from './special-abilities/eldritch-invocations';
import { divineSmites } from './special-abilities/divine-smites';
import { sorcererMetamagic } from './special-abilities/sorcerer-metamagic';
import { fightingStyles } from './special-abilities/fighting-styles';
import { kiAbilities } from './special-abilities/ki-abilities';
import { maneuvers } from './special-abilities/maneuvers';
import { channelDivinityOptions } from './class-features/cleric/channel-divinity';
import { wildShapeForms } from './class-features/druid/wild-shapes';
import { dnd5e2014Feats } from './feats';

export const dnd5eMetadata = {
  system: 'dnd-5e-2014',
  edition: '5e',
  version: 'SRD 5.1 Only',

  stats: {
    spells: {
      count: dnd5eSpells.length,
      byLevel: Object.fromEntries(
        Object.entries(dnd5eSpellsByLevel).map(([k, v]) => [k, v.length])
      ) as Record<string, number>,
      bySchool: Object.fromEntries(
        Object.entries(dnd5eSpellsBySchool).map(([k, v]) => [k, v.length])
      ) as Record<string, number>,
    },

    classes: {
      count: dnd5eClasses.length,
    },

    species: {
      count: dnd5eSpecies.length,
    },

    feats: {
      count: dnd5e2014Feats.length,
    },

    backgrounds: {
      count: dnd5eBackgrounds.length,
    },

    monsters: {
      count: dnd5eMonsters.length,
    },

    equipment: {
      weapons: dnd5eWeapons.length,
      armor: dnd5eArmor.length + dnd5eShields.length,
      adventuringGear: dnd5eAdventuringGear.length,
      magicItems: dnd5eMagicItems.length + dnd5eEquipmentByType.categoryMagicItems.length,
    },

    specialAbilities: {
      smites: divineSmites.length,
      invocations: eldritchInvocations.length,
      maneuvers: maneuvers.length,
      kiAbilities: kiAbilities.length,
      channelDivinity: channelDivinityOptions.length,
      wildShapes: wildShapeForms.length,
      metamagic: sorcererMetamagic.length,
      fightingStyles: fightingStyles.length,
    },
  },

  sources: [{ id: 'srd', name: 'System Reference Document 5.1', abbr: 'SRD 5.1' }],
};

export function getProgress(): number {
  const stats = dnd5eMetadata.stats;
  const totalItems =
    stats.spells.count +
    stats.classes.count +
    stats.species.count +
    stats.feats.count +
    stats.backgrounds.count +
    stats.monsters.count +
    stats.equipment.weapons +
    stats.equipment.armor +
    stats.equipment.adventuringGear +
    stats.equipment.magicItems +
    Object.values(stats.specialAbilities).reduce((sum, n) => sum + n, 0);

  // All present data is implemented — progress is 100%
  return totalItems > 0 ? 100 : 0;
}
