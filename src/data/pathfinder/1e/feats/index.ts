// Pathfinder 1e Feats Index

import { combatFeats } from './combat';
import { metamagicFeats } from './metamagic';
import { generalFeats } from './general';
import { racialFeats } from './racial-feats';
import { classFeats } from './class-feats';
import { magicFeats } from './magic-feats';
import { abilityFeats } from './ability-feats';
import { divineFeats } from './divine-feats';
import { teamworkFeats } from './teamwork-feats';

export const pf1eFeats = {
  combat: combatFeats,
  metamagic: metamagicFeats,
  general: generalFeats,
  racial: racialFeats,
  class: classFeats,
  magic: magicFeats,
  ability: abilityFeats,
  divine: divineFeats,
  teamwork: teamworkFeats,
};

export const getFeat = (id: string) => {
  const allFeats = [
    ...pf1eFeats.combat,
    ...pf1eFeats.metamagic,
    ...pf1eFeats.general,
    ...pf1eFeats.racial,
    ...pf1eFeats.class,
    ...pf1eFeats.magic,
    ...pf1eFeats.ability,
    ...pf1eFeats.divine,
    ...pf1eFeats.teamwork,
  ];
  return allFeats.find((f) => f.id === id);
};
