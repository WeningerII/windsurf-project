// Pathfinder 1e Feats Index — Core Rulebook Only
// Fabricated placeholder files removed (racial, class, magic, ability, divine)
// Non-CRB teamwork feats removed (source: Advanced Player's Guide)

import { combatFeats } from './combat';
import { metamagicFeats } from './metamagic';
import { generalFeats } from './general';
import { pf1eGeneratedFeats } from './generated';

export const pf1eFeats = {
  combat: combatFeats,
  metamagic: metamagicFeats,
  general: generalFeats,
  // CRB feats from the Foundry pf1 system pack not covered by the hand-written
  // category files (generated; see scripts/encode-pf1e-feats.mjs).
  generated: pf1eGeneratedFeats,
};

export const getFeat = (id: string) => {
  const allFeats = [
    ...pf1eFeats.combat,
    ...pf1eFeats.metamagic,
    ...pf1eFeats.general,
    ...pf1eFeats.generated,
  ];
  return allFeats.find((f) => f.id === id);
};
