import { giantsCR0to5 } from './cr-0-5';
import { giantsCR6to10 } from './cr-6-10';
import { giantsCR11Plus } from './cr-11-plus';

export { giantsCR0to5, giantsCR6to10, giantsCR11Plus };

export const allGiants = [
  ...giantsCR0to5,
  ...giantsCR6to10,
  ...giantsCR11Plus,
];

export default allGiants;
