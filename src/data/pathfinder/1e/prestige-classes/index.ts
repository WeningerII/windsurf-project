// Pathfinder 1e Prestige Classes Index
import { CharacterClass } from '../../../../types/character-options/classes';
import { arcaneArcher } from './arcane-archer';
import { assassin } from './assassin';
import { dragonDisciple } from './dragon-disciple';
import { duelist } from './duelist';
import { loreMaster } from './lore-master';
import { mysticTheurge } from './mystic-theurge';
import { shadowdancer } from './shadowdancer';

// Vetted against the official PF1e prestige-class index. The local archmage
// draft stays on disk for now, but is not exported until its provenance can be
// proven because it is not listed in the Core Rulebook prestige catalog.
export const pf1ePrestigeClasses: CharacterClass[] = [
  arcaneArcher,
  assassin,
  dragonDisciple,
  duelist,
  loreMaster,
  mysticTheurge,
  shadowdancer,
];

export {
  arcaneArcher,
  assassin,
  dragonDisciple,
  duelist,
  loreMaster,
  mysticTheurge,
  shadowdancer,
};
