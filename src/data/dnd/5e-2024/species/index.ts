import { dragonborn } from './dragonborn';
import { dwarf } from './dwarf';
import { elf } from './elf';
import { gnome } from './gnome';
import { halfling } from './halfling';
import { human } from './human';
import { tiefling } from './tiefling';

// SRD 5.2 dropped Half-Elf and Half-Orc as standalone species; they are not in
// the 2024 SRD and are therefore excluded from this (SRD-5.2-only) loader.
export const dnd5e2024Species = [dragonborn, dwarf, elf, gnome, halfling, human, tiefling];

export const getSpecies = (id: string) => {
  return dnd5e2024Species.find((s) => s.id === id);
};
