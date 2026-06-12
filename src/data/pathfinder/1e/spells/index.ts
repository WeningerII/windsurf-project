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
import { srdPf1eLevel0Spells } from './srd-level-0';
import { srdPf1eLevel1Spells } from './srd-level-1';
import { srdPf1eLevel2Spells } from './srd-level-2';
import { srdPf1eLevel3Spells } from './srd-level-3';
import { srdPf1eLevel4Spells } from './srd-level-4';
import { srdPf1eLevel5Spells } from './srd-level-5';
import { srdPf1eLevel6Spells } from './srd-level-6';
import { srdPf1eLevel7Spells } from './srd-level-7';
import { srdPf1eLevel8Spells } from './srd-level-8';
import { srdPf1eLevel9Spells } from './srd-level-9';

// Hand-written files first (catalog dedupe is first-entry-wins), then the
// generated Core Rulebook encodings (scripts/encode-pf1e-spells.mjs), which
// exclude hand-written names at generation time.
const rawSpellsByLevel: Record<number, Spell[]> = {
  0: [...cantrips, ...srdPf1eLevel0Spells],
  1: [...level1Spells, ...srdPf1eLevel1Spells],
  2: [...level2Spells, ...srdPf1eLevel2Spells],
  3: [...level3Spells, ...srdPf1eLevel3Spells],
  4: [...level4Spells, ...srdPf1eLevel4Spells],
  5: [...level5Spells, ...srdPf1eLevel5Spells],
  6: [...level6Spells, ...srdPf1eLevel6Spells],
  7: [...level7Spells, ...srdPf1eLevel7Spells],
  8: [...level8Spells, ...srdPf1eLevel8Spells],
  9: [...level9Spells, ...srdPf1eLevel9Spells],
};

const catalog = buildSpellCatalog(rawSpellsByLevel);

export const allSpells = catalog.allSpells;
export const spellsByLevel = catalog.spellsByLevel;
export const spellsById = catalog.spellsById;
export const spellsByClass = catalog.spellsByClass;
export const spellsBySchool = catalog.spellsBySchool;
export const spellIdAliases = catalog.spellIdAliases;
export const spellStats = catalog.spellStats;
export const spellsByClassAndLevel = catalog.spellsByClassAndLevel ?? {};
export const getSpell = catalog.getSpell;

export const pf1eSpells = allSpells;
export const pf1eSpellsByLevel = spellsByLevel;
export const pf1eSpellsById = spellsById;
export const pf1eSpellsByClass = spellsByClass;
export const pf1eSpellsBySchool = spellsBySchool;
export const pf1eSpellsByClassAndLevel = spellsByClassAndLevel;

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
