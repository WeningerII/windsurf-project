import { dwarf } from './dwarf';
import { elf } from './elf';
import { gnome } from './gnome';
import { halfling } from './halfling';
import { halfElf } from './half-elf';
import { halfOrc } from './half-orc';
import { human } from './human';

export const dnd35eRaces = [
  dwarf,
  elf,
  gnome,
  halfling,
  halfElf,
  halfOrc,
  human,
];

export const getRace = (id: string) => {
  return dnd35eRaces.find(r => r.id === id);
};
