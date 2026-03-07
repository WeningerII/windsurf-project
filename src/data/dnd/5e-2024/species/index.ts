import { dragonborn } from './dragonborn';
import { dwarf } from './dwarf';
import { elf } from './elf';
import { gnome } from './gnome';
import { halfElf } from './half-elf';
import { halfOrc } from './half-orc';
import { halfling } from './halfling';
import { human } from './human';
import { tiefling } from './tiefling';

export const dnd5e2024Species = [
  dragonborn,
  dwarf,
  elf,
  gnome,
  halfElf,
  halfOrc,
  halfling,
  human,
  tiefling,
];

export const getSpecies = (id: string) => {
  return dnd5e2024Species.find((s) => s.id === id);
};
