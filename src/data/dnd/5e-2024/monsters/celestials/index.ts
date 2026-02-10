import { celestialsCR0to5 } from './cr-0-5';
import { celestialsCR6to10 } from './cr-6-10';
import { celestialsCR11Plus } from './cr-11-plus';

export { celestialsCR0to5, celestialsCR6to10, celestialsCR11Plus };

export const allCelestials = [
  ...celestialsCR0to5,
  ...celestialsCR6to10,
  ...celestialsCR11Plus,
];

export default allCelestials;
