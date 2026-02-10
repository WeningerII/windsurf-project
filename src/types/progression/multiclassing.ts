import { Prerequisite } from '../core/common';

export interface MulticlassRequirements {
  [classId: string]: Prerequisite[];
}

export interface MulticlassSpellSlots {
  casterLevel: number;
  slotsByLevel: number[];
}

// D&D 5e multiclass spell slot calculation
// Full casters: Bard, Cleric, Druid, Sorcerer, Wizard
// Half casters: Paladin, Ranger
// Third casters: Eldritch Knight Fighter, Arcane Trickster Rogue
export type CasterType = 'full' | 'half' | 'third' | 'pact' | 'none';

export interface ClassCasterInfo {
  classId: string;
  type: CasterType;
  roundDown?: boolean; // For half/third casters
}
