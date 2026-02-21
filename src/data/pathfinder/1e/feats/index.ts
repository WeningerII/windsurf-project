// Pathfinder 1e Feats Index — Core Rulebook Only
// Fabricated placeholder files removed (racial, class, magic, ability, divine)
// Non-CRB teamwork feats removed (source: Advanced Player's Guide)

import { combatFeats } from './combat';
import { metamagicFeats } from './metamagic';
import { generalFeats } from './general';

export const pf1eFeats = {
  combat: combatFeats,
  metamagic: metamagicFeats,
  general: generalFeats,
};

export const getFeat = (id: string) => {
  const allFeats = [
    ...pf1eFeats.combat,
    ...pf1eFeats.metamagic,
    ...pf1eFeats.general,
  ];
  return allFeats.find((f) => f.id === id);
};
