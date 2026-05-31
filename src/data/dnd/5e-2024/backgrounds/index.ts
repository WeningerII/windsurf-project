import { Background } from '../../../../types/character-options/backgrounds';
import { acolyte } from './acolyte';
import { criminal } from './criminal';
import { sage } from './sage';
import { soldier } from './soldier';

// SRD 5.2 includes four backgrounds: Acolyte, Criminal, Sage, Soldier.
// Folk Hero and Noble are Player's Handbook content (not open) and are excluded.
export const dnd5e2024Backgrounds: Background[] = [acolyte, criminal, sage, soldier];

export function getBackgroundById(id: string): Background | undefined {
  return dnd5e2024Backgrounds.find((bg) => bg.id === id);
}

export function getBackgroundsBySystem(system: string): Background[] {
  return dnd5e2024Backgrounds.filter((bg) => bg.system === system);
}
