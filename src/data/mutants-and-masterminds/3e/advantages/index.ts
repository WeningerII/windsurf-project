// Mutants & Masterminds 3e Advantages - Master Index
import { Advantage } from '../../../../types/mam/advantages';
import { combatAdvantages } from './combat';
import { fortuneAdvantages } from './fortune';
import { generalAdvantages } from './general';
import { skillAdvantages } from './skill';
import { additionalCombatAdvantages } from './additional-combat';
import { additionalFortuneAdvantages } from './additional-fortune';
import { additionalGeneralAdvantages } from './additional-general';
import { additionalSkillAdvantages } from './additional-skill';

const baseAdvantages: Advantage[] = [
  ...combatAdvantages,
  ...fortuneAdvantages,
  ...generalAdvantages,
  ...skillAdvantages,
];

const supplementalAdvantages: Advantage[] = [
  ...additionalCombatAdvantages,
  ...additionalFortuneAdvantages,
  ...additionalGeneralAdvantages,
  ...additionalSkillAdvantages,
];

const mam3eAdvantagesDeduped: Advantage[] = [];
const mam3eAdvantagesSeen = new Set<string>();

[...baseAdvantages, ...supplementalAdvantages].forEach(advantage => {
  if (mam3eAdvantagesSeen.has(advantage.id)) {
    return;
  }
  mam3eAdvantagesSeen.add(advantage.id);
  mam3eAdvantagesDeduped.push(advantage);
});

export const mam3eAdvantages: Advantage[] = mam3eAdvantagesDeduped;

export const mam3eAdvantagesById: Record<string, Advantage> = mam3eAdvantages.reduce((acc, advantage) => {
  acc[advantage.id] = advantage;
  return acc;
}, {} as Record<string, Advantage>);

export const mam3eAdvantagesByType: Record<string, Advantage[]> = mam3eAdvantages.reduce((acc, advantage) => {
  if (!acc[advantage.type]) {
    acc[advantage.type] = [];
  }
  acc[advantage.type].push(advantage);
  return acc;
}, {} as Record<string, Advantage[]>);
