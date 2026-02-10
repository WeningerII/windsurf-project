// Mutants & Masterminds 3e Core Powers - Index
// Functional organization by game mechanic

export { attackPowers } from './attack';
export { defensePowers } from './defense';
export { movementPowers } from './movement';
export { sensoryPowers } from './sensory';
export { generalPowers } from './general';
export { controlPowers } from './control';

import { attackPowers } from './attack';
import { defensePowers } from './defense';
import { movementPowers } from './movement';
import { sensoryPowers } from './sensory';
import { generalPowers } from './general';
import { controlPowers } from './control';

export const corePowers = [
  ...attackPowers,
  ...defensePowers,
  ...movementPowers,
  ...sensoryPowers,
  ...generalPowers,
  ...controlPowers,
];
