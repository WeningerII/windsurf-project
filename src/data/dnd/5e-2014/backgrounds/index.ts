import { Background } from '../../../../types/character-options/backgrounds';
import { acolyte } from './acolyte';

// SRD 5.1 includes a single background (Acolyte); other PHB backgrounds are
// not open content.
export const dnd5eBackgrounds: Background[] = [acolyte];

export function getBackgroundById(id: string): Background | undefined {
  return dnd5eBackgrounds.find((bg) => bg.id === id);
}

export function getBackgroundsBySystem(system: string): Background[] {
  return dnd5eBackgrounds.filter((bg) => bg.system === system);
}
