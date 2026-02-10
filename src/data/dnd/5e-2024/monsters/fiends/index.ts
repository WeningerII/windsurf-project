import { fiendsCR0to5 } from './cr-0-5';
import { fiendsCR6to10 } from './cr-6-10';
import { fiendsCR11Plus } from './cr-11-plus';

export { fiendsCR0to5, fiendsCR6to10, fiendsCR11Plus };

export const allFiends = [
  ...fiendsCR0to5,
  ...fiendsCR6to10,
  ...fiendsCR11Plus,
];

export default allFiends;
