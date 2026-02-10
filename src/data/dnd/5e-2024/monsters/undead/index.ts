import { undeadCR0to5 } from './cr-0-5';
import { undeadCR6to10 } from './cr-6-10';
import { undeadCR11Plus } from './cr-11-plus';

export { undeadCR0to5, undeadCR6to10, undeadCR11Plus };

export const allUndead = [
  ...undeadCR0to5,
  ...undeadCR6to10,
  ...undeadCR11Plus,
];

export default allUndead;
