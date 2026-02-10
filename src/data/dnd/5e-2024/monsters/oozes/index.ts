import { oozesCR0to5 } from './cr-0-5';
import { oozesCR6to10 } from './cr-6-10';
import { oozesCR11Plus } from './cr-11-plus';

export { oozesCR0to5, oozesCR6to10, oozesCR11Plus };

export const allOozes = [
  ...oozesCR0to5,
  ...oozesCR6to10,
  ...oozesCR11Plus,
];

export default allOozes;
