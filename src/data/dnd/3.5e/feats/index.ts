// D&D 3.5e Feats Index — SRD 3.5 only.
// Fabricated placeholder files removed (combat, skill, ability): every entry
// in them was invented filler ("Backstab", "Bird Call", skills-as-feats,
// "Ability Boost" feats) that does not exist in the 3.5 SRD. The keys are kept
// (as empty arrays) so downstream consumers retain a stable shape; the SRD has
// no separate combat/skill/ability feat categories.

import { FeatDefinition } from '../../../../types/character-options/feats';
import { generalFeats } from './general';
import { metamagicFeats } from './metamagic';
import { itemCreationFeats } from './item-creation';
import { magicFeats } from './magic';

export const dnd35eFeats = {
  general: generalFeats,
  metamagic: metamagicFeats,
  itemCreation: itemCreationFeats,
  combat: [] as FeatDefinition[],
  skill: [] as FeatDefinition[],
  ability: [] as FeatDefinition[],
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
