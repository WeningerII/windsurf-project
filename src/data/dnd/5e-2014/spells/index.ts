import { Spell } from '../../../../types/magic/spells';
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

export const dnd5eSpells: Spell[] = [
  ...cantrips,
  ...level1Spells,
  ...level2Spells,
  ...level3Spells,
  ...level4Spells,
  ...level5Spells,
  ...level6Spells,
  ...level7Spells,
  ...level8Spells,
  ...level9Spells,
];

export const dnd5eSpellsByLevel: Record<number, Spell[]> = {
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

export const dnd5eSpellsById: Record<string, Spell> = dnd5eSpells.reduce(
  (acc, spell) => {
    acc[spell.id] = spell;
    return acc;
  },
  {} as Record<string, Spell>
);

export const dnd5eSpellsByClass: Record<string, Spell[]> = dnd5eSpells.reduce(
  (acc, spell) => {
    spell.classes.forEach((className) => {
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(spell);
    });
    return acc;
  },
  {} as Record<string, Spell[]>
);

export const dnd5eSpellsBySchool: Record<string, Spell[]> = dnd5eSpells.reduce(
  (acc, spell) => {
    if (!acc[spell.school]) {
      acc[spell.school] = [];
    }
    acc[spell.school].push(spell);
    return acc;
  },
  {} as Record<string, Spell[]>
);

// Statistics
export const spellStats = {
  total: dnd5eSpells.length,
  byLevel: {
    cantrips: cantrips.length,
    level1: level1Spells.length,
    level2: level2Spells.length,
    level3: level3Spells.length,
    level4: level4Spells.length,
    level5: level5Spells.length,
    level6: level6Spells.length,
    level7: level7Spells.length,
    level8: level8Spells.length,
    level9: level9Spells.length,
  },
  byClass: Object.entries(dnd5eSpellsByClass).reduce(
    (acc, [className, spells]) => {
      acc[className] = spells.length;
      return acc;
    },
    {} as Record<string, number>
  ),
  bySchool: Object.entries(dnd5eSpellsBySchool).reduce(
    (acc, [school, spells]) => {
      acc[school] = spells.length;
      return acc;
    },
    {} as Record<string, number>
  ),
};

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
