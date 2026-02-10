import { Background } from '../../../../types/character-options/backgrounds';
import { acolyte } from './acolyte';
import { criminal } from './criminal';
import { folkHero } from './folk-hero';
import { noble } from './noble';
import { sage } from './sage';
import { soldier } from './soldier';

// SRD 5.1: 6 backgrounds included
export const dnd5eBackgrounds: Background[] = [
  acolyte,
  criminal,
  folkHero,
  noble,
  sage,
  soldier,
];

export function getBackgroundById(id: string): Background | undefined {
  return dnd5eBackgrounds.find(bg => bg.id === id);
}

export function getBackgroundsBySystem(system: string): Background[] {
  return dnd5eBackgrounds.filter(bg => bg.system === system);
}
