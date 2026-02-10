import { dragonsCR0to5 } from './cr-0-5';
import { dragonsCR6to10 } from './cr-6-10';
import { dragonsCR11Plus } from './cr-11-plus';

export { dragonsCR0to5, dragonsCR6to10, dragonsCR11Plus };

export const allDragons = [
  ...dragonsCR0to5,
  ...dragonsCR6to10,
  ...dragonsCR11Plus,
];

export default allDragons;
