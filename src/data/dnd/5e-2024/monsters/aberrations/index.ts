import { Monster } from '../../../../../types/creatures/monsters';
import { aberrationsCR0to5 } from './cr-0-5';
import { aberrationsCR6to10 } from './cr-6-10';
import { aberrationsCR11Plus } from './cr-11-plus';

export const allAberrations: Monster[] = [
  ...aberrationsCR0to5,
  ...aberrationsCR6to10,
  ...aberrationsCR11Plus,
];

export { aberrationsCR0to5, aberrationsCR6to10, aberrationsCR11Plus };
