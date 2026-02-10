// D&D 3.5e Feats Index

import { generalFeats } from './general';
import { metamagicFeats } from './metamagic';
import { itemCreationFeats } from './item-creation';
import { combatFeats } from './combat';
import { skillFeats } from './skill';
import { abilityFeats } from './ability';
import { magicFeats } from './magic';

export const dnd35eFeats = {
  general: generalFeats,
  metamagic: metamagicFeats,
  itemCreation: itemCreationFeats,
  combat: combatFeats,
  skill: skillFeats,
  ability: abilityFeats,
  magic: magicFeats,
};

export const getFeat = (id: string) => {
  const allFeats = [
    ...dnd35eFeats.general,
    ...dnd35eFeats.metamagic,
    ...dnd35eFeats.itemCreation,
    ...dnd35eFeats.combat,
    ...dnd35eFeats.skill,
    ...dnd35eFeats.ability,
    ...dnd35eFeats.magic,
  ];
  return allFeats.find((f) => f.id === id);
};
