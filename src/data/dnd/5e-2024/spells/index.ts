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
};

const catalog = buildSpellCatalog(rawSpellsByLevel, {
  omittedSpellIds: ['tensors-floating-disk', 'otilukes-resilience-6'],
  spellIdAliases: {
    'tensors-floating-disk': 'tensers-floating-disk',
    'otilukes-resilience-4': 'otilukes-resilience',
    'otilukes-resilience-6': 'otilukes-resilience',
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

export const dnd5e2024Spells = {
  cantrips: spellsByLevel[0],
  level1: spellsByLevel[1],
  level2: spellsByLevel[2],
  level3: spellsByLevel[3],
  level4: spellsByLevel[4],
  level5: spellsByLevel[5],
  level6: spellsByLevel[6],
  level7: spellsByLevel[7],
  level8: spellsByLevel[8],
  level9: spellsByLevel[9],
};

export const dnd5e2024AllSpells = allSpells;
export const dnd5e2024SpellsByLevel = spellsByLevel;
export const dnd5e2024SpellsById = spellsById;
export const dnd5e2024SpellsByClass = spellsByClass;
export const dnd5e2024SpellsBySchool = spellsBySchool;
export const dnd5e2024SpellStats = spellStats;

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
