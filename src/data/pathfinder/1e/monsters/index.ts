import { Monster } from '../../../../types/creatures/monsters';
// GENERATED Bestiary 1 coverage files (encode-pf1e-monsters.mjs); hand-written
// entries added here later always win on name match via the encoder's baseline.
import { pf1eSrdCr01Monsters } from './srd-cr-0-1';
import { pf1eSrdCr25Monsters } from './srd-cr-2-5';
import { pf1eSrdCr610Monsters } from './srd-cr-6-10';
import { pf1eSrdCr11PlusMonsters } from './srd-cr-11-plus';
import { pf1eHandAuthoredMonsters } from './hand-authored';

export const pf1eMonsters: Monster[] = [
  // Hand-written entries first so they win on id/name match (first-wins dedupe).
  ...pf1eHandAuthoredMonsters,
  ...pf1eSrdCr01Monsters,
  ...pf1eSrdCr25Monsters,
  ...pf1eSrdCr610Monsters,
  ...pf1eSrdCr11PlusMonsters,
];
