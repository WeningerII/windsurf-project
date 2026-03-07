import { CharacterClass } from '../../../../types/character-options/classes';
import { barbarian } from './barbarian';
import { bard } from './bard';
import { cleric } from './cleric';
import { druid } from './druid';
import { fighter } from './fighter';
import { monk } from './monk';
import { paladin } from './paladin';
import { ranger } from './ranger';
import { rogue } from './rogue';
import { sorcerer } from './sorcerer';
import { warlock } from './warlock';
import { wizard } from './wizard';

// All 12 SRD 5.1 Classes with their official subclasses
export const dnd5eClasses: CharacterClass[] = [
  barbarian, // Path of the Berserker
  bard, // College of Lore
  cleric, // Life Domain
  druid, // Circle of the Land
  fighter, // Champion
  monk, // Way of the Open Hand
  paladin, // Oath of Devotion
  ranger, // Hunter
  rogue, // Thief
  sorcerer, // Draconic Bloodline
  warlock, // The Fiend
  wizard, // School of Evocation
];

export function getClassById(id: string): CharacterClass | undefined {
  return dnd5eClasses.find((cls) => cls.id === id);
}

export function getClassesBySystem(system: string): CharacterClass[] {
  return dnd5eClasses.filter((cls) => cls.system === system);
}
