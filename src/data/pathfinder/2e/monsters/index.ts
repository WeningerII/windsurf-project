import { Monster } from '../../../../types/creatures/monsters';
// GENERATED Bestiary 1 coverage files (encode-pf2e-monsters.mjs); hand-written
// entries added here later always win on name match via the encoder's baseline.
import { pf2eSrdLevel01Monsters } from './srd-level-0-1';
import { pf2eSrdLevel25Monsters } from './srd-level-2-5';
import { pf2eSrdLevel610Monsters } from './srd-level-6-10';
import { pf2eSrdLevel11PlusMonsters } from './srd-level-11-plus';

export const pf2eMonsters: Monster[] = [
  ...pf2eSrdLevel01Monsters,
  ...pf2eSrdLevel25Monsters,
  ...pf2eSrdLevel610Monsters,
  ...pf2eSrdLevel11PlusMonsters,
];
