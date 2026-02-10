import { plantsCR0to5 } from './cr-0-5';
import { plantsCR6to10 } from './cr-6-10';
import { plantsCR11Plus } from './cr-11-plus';

export { plantsCR0to5, plantsCR6to10, plantsCR11Plus };

export const allPlants = [
  ...plantsCR0to5,
  ...plantsCR6to10,
  ...plantsCR11Plus,
];

export default allPlants;
