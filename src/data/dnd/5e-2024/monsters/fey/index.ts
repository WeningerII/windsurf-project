import { feyCR0to5 } from './cr-0-5';
import { feyCR6to10 } from './cr-6-10';
import { feyCR11Plus } from './cr-11-plus';

export { feyCR0to5, feyCR6to10, feyCR11Plus };

export const allFey = [
  ...feyCR0to5,
  ...feyCR6to10,
  ...feyCR11Plus,
];

export default allFey;
