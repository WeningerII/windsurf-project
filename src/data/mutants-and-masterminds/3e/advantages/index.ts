// Mutants & Masterminds 3e Advantages - Master Index
// Single-source architecture: all advantages combined from category files

import { Advantage } from '../../../../types/mam/advantages';
import { combatAdvantages } from './combat';
import { fortuneAdvantages } from './fortune';
import { generalAdvantages } from './general';
import { skillAdvantages } from './skill';

// All advantages combined (single source of truth)
export const mam3eAdvantages: Advantage[] = [
  ...combatAdvantages,
  ...fortuneAdvantages,
  ...generalAdvantages,
  ...skillAdvantages,
];

// Advantages indexed by ID for quick lookup
export const mam3eAdvantagesById: Record<string, Advantage> = mam3eAdvantages.reduce(
  (acc, advantage) => {
    if (acc[advantage.id] && import.meta.env.DEV) {
      console.warn(`Duplicate advantage ID detected: ${advantage.id}`);
    }
    acc[advantage.id] = advantage;
    return acc;
  },
  {} as Record<string, Advantage>
);

// Advantages organized by type
export const mam3eAdvantagesByType: Record<string, Advantage[]> = {
  combat: combatAdvantages,
  fortune: fortuneAdvantages,
  general: generalAdvantages,
  skill: skillAdvantages,
};
