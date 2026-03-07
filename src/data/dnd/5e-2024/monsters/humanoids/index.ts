import { humanoidsCR0to5 } from './cr-0-5';
import { humanoidsCR6to10 } from './cr-6-10';
import { humanoidsCR11Plus } from './cr-11-plus';

export { humanoidsCR0to5, humanoidsCR6to10, humanoidsCR11Plus };

export const allHumanoids = [...humanoidsCR0to5, ...humanoidsCR6to10, ...humanoidsCR11Plus];

export default allHumanoids;
