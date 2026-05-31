import { Background } from '../../../../types/character-options/backgrounds';
import { acolyte } from './acolyte';

// SRD 5.1 contains exactly one background (Acolyte). The other backgrounds are
// Player's Handbook content (not open) and are intentionally excluded.
export const dnd5eBackgrounds: Background[] = [acolyte];

export function getBackgroundById(id: string): Background | undefined {
  return dnd5eBackgrounds.find((bg) => bg.id === id);
}

export function getBackgroundsBySystem(system: string): Background[] {
  return dnd5eBackgrounds.filter((bg) => bg.system === system);
}
