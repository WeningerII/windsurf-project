import { Spell } from '../../../../types/magic/spells';
import { buildSpellCatalog } from '../../../../utils/spellCatalog';
import { cantrips } from './cantrips';
import { level1Spells } from './level-1';
import { level2Spells } from './level-2';
import { level3Spells } from './level-3';
import { level4Spells } from './level-4';
import { level5Spells } from './level-5';
import { level6Spells } from './level-6';
import { level7Spells } from './level-7';
import { level8Spells } from './level-8';
import { level9Spells } from './level-9';
import { srdCantrips } from './srd-cantrips';
import { srdLevel1Spells } from './srd-level-1';
import { srdLevel2Spells } from './srd-level-2';
import { srdLevel3Spells } from './srd-level-3';
import { srdLevel4Spells } from './srd-level-4';
import { srdLevel5Spells } from './srd-level-5';
import { srdLevel6Spells } from './srd-level-6';
import { srdLevel7Spells } from './srd-level-7';
import { srdLevel8Spells } from './srd-level-8';
import { srdLevel9Spells } from './srd-level-9';

// Hand-written files first (catalog dedupe is first-entry-wins), then the
// generated SRD encodings (scripts/encode-5e-spells.mjs), which exclude
// hand-written names at generation time.
const rawSpellsByLevel: Record<number, Spell[]> = {
  0: [...cantrips, ...srdCantrips],
  1: [...level1Spells, ...srdLevel1Spells],
  2: [...level2Spells, ...srdLevel2Spells],
  3: [...level3Spells, ...srdLevel3Spells],
  4: [...level4Spells, ...srdLevel4Spells],
  5: [...level5Spells, ...srdLevel5Spells],
  6: [...level6Spells, ...srdLevel6Spells],
  7: [...level7Spells, ...srdLevel7Spells],
  8: [...level8Spells, ...srdLevel8Spells],
  9: [...level9Spells, ...srdLevel9Spells],
};

const catalog = buildSpellCatalog(rawSpellsByLevel);

export const allSpells = catalog.allSpells;
export const spellsByLevel = catalog.spellsByLevel;
export const spellsById = catalog.spellsById;
export const spellsByClass = catalog.spellsByClass;
export const spellsBySchool = catalog.spellsBySchool;
export const spellIdAliases = catalog.spellIdAliases;
export const spellStats = catalog.spellStats;
export const spellsByClassAndLevel = catalog.spellsByClassAndLevel;
export const getSpell = catalog.getSpell;

export const dnd5eSpells = allSpells;
export const dnd5eSpellsByLevel = spellsByLevel;
export const dnd5eSpellsById = spellsById;
export const dnd5eSpellsByClass = spellsByClass;
export const dnd5eSpellsBySchool = spellsBySchool;

export {
  cantrips,
  level1Spells,
  level2Spells,
  level3Spells,
  level4Spells,
  level5Spells,
  level6Spells,
  level7Spells,
  level8Spells,
  level9Spells,
};
