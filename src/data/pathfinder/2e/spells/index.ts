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
import { level10Spells } from './level-10';

const rawSpellsByLevel: Record<number, Spell[]> = {
  0: cantrips,
  1: level1Spells,
  2: level2Spells,
  3: level3Spells,
  4: level4Spells,
  5: level5Spells,
  6: level6Spells,
  7: level7Spells,
  8: level8Spells,
  9: level9Spells,
  10: level10Spells,
};

const catalog = buildSpellCatalog(rawSpellsByLevel, {
  omittedSpellIds: ['teleport-7-pf2e', 'time-stop-pf2e', 'wish-9-pf2e'],
  spellIdAliases: {
    'teleport-7-pf2e': 'teleport-pf2e',
    'time-stop-pf2e': 'time-stop-9-pf2e',
    'wish-9-pf2e': 'wish-pf2e',
  },
});

export const allSpells = catalog.allSpells;
export const spellsByLevel = catalog.spellsByLevel;
export const spellsById = catalog.spellsById;
export const spellsByClass = catalog.spellsByClass;
export const spellsBySchool = catalog.spellsBySchool;
export const spellIdAliases = catalog.spellIdAliases;
export const spellStats = catalog.spellStats;
export const spellsByClassAndLevel = catalog.spellsByClassAndLevel;
export const getSpell = catalog.getSpell;

export const pf2eSpells = allSpells;
export const pf2eSpellsByLevel = spellsByLevel;
export const pf2eSpellsById = spellsById;
export const pf2eSpellsByClass = spellsByClass;
export const pf2eSpellsBySchool = spellsBySchool;

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
  level10Spells,
};
