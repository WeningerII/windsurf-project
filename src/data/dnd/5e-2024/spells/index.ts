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

export const dnd5e2024Spells = {
  cantrips,
  level1: level1Spells,
  level2: level2Spells,
  level3: level3Spells,
  level4: level4Spells,
  level5: level5Spells,
  level6: level6Spells,
  level7: level7Spells,
  level8: level8Spells,
  level9: level9Spells,
};

export const dnd5e2024AllSpells: Spell[] = [
  ...dnd5e2024Spells.cantrips,
  ...dnd5e2024Spells.level1,
  ...dnd5e2024Spells.level2,
  ...dnd5e2024Spells.level3,
  ...dnd5e2024Spells.level4,
  ...dnd5e2024Spells.level5,
  ...dnd5e2024Spells.level6,
  ...dnd5e2024Spells.level7,
  ...dnd5e2024Spells.level8,
  ...dnd5e2024Spells.level9,
];

export const dnd5e2024SpellsByLevel: Record<number, Spell[]> = {
  0: dnd5e2024Spells.cantrips,
  1: dnd5e2024Spells.level1,
  2: dnd5e2024Spells.level2,
  3: dnd5e2024Spells.level3,
  4: dnd5e2024Spells.level4,
  5: dnd5e2024Spells.level5,
  6: dnd5e2024Spells.level6,
  7: dnd5e2024Spells.level7,
  8: dnd5e2024Spells.level8,
  9: dnd5e2024Spells.level9,
};

export const dnd5e2024SpellsById: Record<string, Spell> = dnd5e2024AllSpells.reduce((acc, spell) => {
  acc[spell.id] = spell;
  return acc;
}, {} as Record<string, Spell>);

export const dnd5e2024SpellsByClass: Record<string, Spell[]> = dnd5e2024AllSpells.reduce((acc, spell) => {
  spell.classes.forEach(className => {
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(spell);
  });
  return acc;
}, {} as Record<string, Spell[]>);

export const dnd5e2024SpellsBySchool: Record<string, Spell[]> = dnd5e2024AllSpells.reduce((acc, spell) => {
  if (!acc[spell.school]) {
    acc[spell.school] = [];
  }
  acc[spell.school].push(spell);
  return acc;
}, {} as Record<string, Spell[]>);

export const dnd5e2024SpellStats = {
  total: dnd5e2024AllSpells.length,
  byLevel: {
    cantrips: dnd5e2024Spells.cantrips.length,
    level1: dnd5e2024Spells.level1.length,
    level2: dnd5e2024Spells.level2.length,
    level3: dnd5e2024Spells.level3.length,
    level4: dnd5e2024Spells.level4.length,
    level5: dnd5e2024Spells.level5.length,
    level6: dnd5e2024Spells.level6.length,
    level7: dnd5e2024Spells.level7.length,
    level8: dnd5e2024Spells.level8.length,
    level9: dnd5e2024Spells.level9.length,
  },
  byClass: Object.entries(dnd5e2024SpellsByClass).reduce((acc, [className, spells]) => {
    acc[className] = spells.length;
    return acc;
  }, {} as Record<string, number>),
  bySchool: Object.entries(dnd5e2024SpellsBySchool).reduce((acc, [school, spells]) => {
    acc[school] = spells.length;
    return acc;
  }, {} as Record<string, number>),
};

export const getSpell = (id: string) => dnd5e2024SpellsById[id];

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
