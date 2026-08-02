import { Background } from '../../../../types/character-options/backgrounds';
import { acolyte } from './acolyte';
import { criminal } from './criminal';
import { sage } from './sage';
import { soldier } from './soldier';

// SRD 5.2 includes four backgrounds: Acolyte, Criminal, Sage, Soldier.
// Folk Hero and Noble are Player's Handbook content (not open) and are excluded.
// All four carry the 2024 model — three ability scores, an Origin feat, two
// skills, one tool and a lettered equipment choice. The 2014 model's background
// feature, personality tables and descriptive prose are absent from SRD 5.2 and
// are not shipped here.
export const dnd5e2024Backgrounds: Background[] = [acolyte, criminal, sage, soldier];

export function getBackgroundById(id: string): Background | undefined {
  return dnd5e2024Backgrounds.find((bg) => bg.id === id);
}

export function getBackgroundsBySystem(system: string): Background[] {
  return dnd5e2024Backgrounds.filter((bg) => bg.system === system);
}
