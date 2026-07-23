import { Monster } from '../../../../types/creatures/monsters';
import { indexById } from '../../../../utils/indexById';
import { srdCr01Monsters35e } from './srd-cr-0-1';
import { srdCr25Monsters35e } from './srd-cr-2-5';
import { srdCr610Monsters35e } from './srd-cr-6-10';
import { srdCr11PlusMonsters35e } from './srd-cr-11-plus';
import { dnd35eHandAuthoredMonsters } from './hand-authored';

// Generated SRD 3.5 core bestiary (scripts/encode-35e-monsters.mjs):
// olimot/srd-v3.5-md core names intersected with D35E structured data.
// Hand-authored entries first so they win on id match (first-wins indexById).
export const dnd35eMonsters: Monster[] = [
  ...dnd35eHandAuthoredMonsters,
  ...srdCr01Monsters35e,
  ...srdCr25Monsters35e,
  ...srdCr610Monsters35e,
  ...srdCr11PlusMonsters35e,
];

export const dnd35eMonstersById: Record<string, Monster> = indexById(
  dnd35eMonsters,
  'dnd35eMonstersById'
);
