// D&D 3.5e Prestige Classes — normalized SRD 3.5 entries only.
//
// A legacy `dnd35ePrestigeClasses` export (abbreviated `PrestigeClass` objects
// with un-suffixed ids, 'DMG' citations, Pathfinder-isms, and features
// truncated at level 3) was deleted; the normalized `CharacterClass` versions
// below are the only product-consumed prestige class data.

import type { CharacterClass } from '../../../../types/character-options/classes';
import { arcaneArcher } from './arcane-archer';
import { arcaneTrickster } from './arcane-trickster';
import { archmage } from './archmage';
import { assassin } from './assassin';
import { blackguard } from './blackguard';
import { dragonDisciple } from './dragon-disciple';
import { duelist } from './duelist';
import { dwarvenDefender } from './dwarven-defender';
import { eldritchKnight } from './eldritch-knight';
import { hierophant } from './hierophant';
import { horizonWalker } from './horizon-walker';
import { loremaster } from './loremaster';
import { mysticTheurge } from './mystic-theurge';
import { isDnd35eProductPrestigeClassId } from './productCatalog';
import { shadowdancer } from './shadowdancer';
import { thaumaturgist } from './thaumaturgist';

export const dnd35eNormalizedPrestigeClasses: CharacterClass[] = [
  arcaneArcher,
  arcaneTrickster,
  archmage,
  assassin,
  blackguard,
  dragonDisciple,
  duelist,
  eldritchKnight,
  hierophant,
  shadowdancer,
  horizonWalker,
  dwarvenDefender,
  loremaster,
  mysticTheurge,
  thaumaturgist,
];

export const dnd35eProductPrestigeClasses: CharacterClass[] =
  dnd35eNormalizedPrestigeClasses.filter((classData) =>
    isDnd35eProductPrestigeClassId(classData.id)
  );

export { dnd35eProductPrestigeClassIds, isDnd35eProductPrestigeClassId } from './productCatalog';
