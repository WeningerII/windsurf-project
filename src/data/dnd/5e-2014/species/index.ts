import { Species } from '../../../../types/character-options/species';
import { human } from './human';
import { elf } from './elf';
import { dwarf } from './dwarf';
import { halfling } from './halfling';
import { dragonborn } from './dragonborn';
import { gnome } from './gnome';
import { halfElf } from './half-elf';
import { halfOrc } from './half-orc';
import { tiefling } from './tiefling';

// SRD 5.1: 9 species only (no Variant Human)
export const dnd5eSpecies: Species[] = [
  human,
  elf,
  dwarf,
  halfling,
  dragonborn,
  gnome,
  halfElf,
  halfOrc,
  tiefling,
];

export function getSpeciesById(id: string): Species | undefined {
  return dnd5eSpecies.find((species) => species.id === id);
}

export function getSpeciesBySystem(system: string): Species[] {
  return dnd5eSpecies.filter((species) => species.system === system);
}
