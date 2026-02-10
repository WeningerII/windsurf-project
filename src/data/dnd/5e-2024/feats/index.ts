// D&D 5e (2024) Feats Index

import { originFeats } from './origin';
import { generalFeats } from './general';
import { fightingStyleFeats } from './fighting-styles';
import { epicBoons } from './epic-boons';

export const dnd5e2024Feats = {
  origin: originFeats,
  general: generalFeats,
  fightingStyles: fightingStyleFeats,
  epicBoons: epicBoons,
};

export const getFeat = (id: string) => {
  const allFeats = [
    ...dnd5e2024Feats.origin,
    ...dnd5e2024Feats.general,
    ...dnd5e2024Feats.fightingStyles,
    ...dnd5e2024Feats.epicBoons,
  ];
  return allFeats.find((f) => f.id === id);
};
