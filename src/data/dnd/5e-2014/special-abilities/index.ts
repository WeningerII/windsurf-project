// D&D 5e SRD Special Abilities Index
import { eldritchInvocations } from './eldritch-invocations';
import { divineSmites } from './divine-smites';
import { sorcererMetamagic } from './sorcerer-metamagic';

export const dnd5eSpecialAbilities = {
  eldritchInvocations,
  divineSmites,
  sorcererMetamagic,
};

export const getInvocation = (id: string) => {
  return eldritchInvocations.find((inv) => inv.id === id);
};

export const getSmite = (id: string) => {
  return divineSmites.find((smite) => smite.id === id);
};

export const getMetamagic = (id: string) => {
  return sorcererMetamagic.find((meta) => meta.id === id);
};
