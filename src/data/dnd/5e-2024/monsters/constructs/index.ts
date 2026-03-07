import { constructsCR0to5 } from './cr-0-5';
import { constructsCR6to10 } from './cr-6-10';
import { constructsCR11Plus } from './cr-11-plus';

export { constructsCR0to5, constructsCR6to10, constructsCR11Plus };

export const allConstructs = [...constructsCR0to5, ...constructsCR6to10, ...constructsCR11Plus];

export default allConstructs;
