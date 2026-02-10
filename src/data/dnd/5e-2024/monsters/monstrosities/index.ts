import { monstrositiesCR0to5 } from './cr-0-5';
import { monstrositiesCR6to10 } from './cr-6-10';
import { monstrositiesCR11Plus } from './cr-11-plus';

export { monstrositiesCR0to5, monstrositiesCR6to10, monstrositiesCR11Plus };

export const allMonstrosities = [
  ...monstrositiesCR0to5,
  ...monstrositiesCR6to10,
  ...monstrositiesCR11Plus,
];

export default allMonstrosities;
