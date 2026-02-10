import { beastsCR0to5 } from './cr-0-5';
import { beastsCR6to10 } from './cr-6-10';
import { beastsCR11Plus } from './cr-11-plus';

export { beastsCR0to5, beastsCR6to10, beastsCR11Plus };

export const allBeasts = [
  ...beastsCR0to5,
  ...beastsCR6to10,
  ...beastsCR11Plus,
];

export default allBeasts;
