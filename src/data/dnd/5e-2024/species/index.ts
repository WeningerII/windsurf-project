import { dragonborn } from './dragonborn';
import { dwarf } from './dwarf';
import { elf } from './elf';
import { gnome } from './gnome';
import { goliath } from './goliath';
import { halfling } from './halfling';
import { human } from './human';
import { orc } from './orc';
import { tiefling } from './tiefling';

// SRD 5.2 (2024) species. Half-Elf and Half-Orc are not part of the 2024 SRD
// (the edition folds mixed lineage into other rules); Goliath and Orc are.
export const dnd5e2024Species = [
  dragonborn,
  dwarf,
  elf,
  gnome,
  goliath,
  halfling,
  human,
  orc,
  tiefling,
];

export const getSpecies = (id: string) => {
  return dnd5e2024Species.find((s) => s.id === id);
};
