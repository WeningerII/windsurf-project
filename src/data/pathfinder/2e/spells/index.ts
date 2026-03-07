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
import { level10Spells } from './level-10';

export const pf2eSpells: Spell[] = [
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
  ...level10Spells,
];

export const pf2eSpellsByLevel: Record<number, Spell[]> = {
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

export const pf2eSpellsById: Record<string, Spell> = pf2eSpells.reduce(
  (acc, spell) => {
    acc[spell.id] = spell;
    return acc;
  },
  {} as Record<string, Spell>
);

export const pf2eSpellsByClass: Record<string, Spell[]> = pf2eSpells.reduce(
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

export const pf2eSpellsBySchool: Record<string, Spell[]> = pf2eSpells.reduce(
  (acc, spell) => {
    if (!acc[spell.school]) {
      acc[spell.school] = [];
    }
    acc[spell.school].push(spell);
    return acc;
  },
  {} as Record<string, Spell[]>
);

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
