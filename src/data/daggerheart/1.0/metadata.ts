import { daggerheartAncestries } from './ancestries';
import { daggerheartClasses } from './classes';
import { daggerheartCommunities } from './communities';
import { daggerheartDomainCards } from './domain-cards';
import { daggerheartDomains } from './domains';
import {
  daggerheartArmor,
  daggerheartConsumables,
  daggerheartLoot,
  daggerheartWeapons,
} from './equipment';

export const daggerheartMetadata = {
  system: 'daggerheart',
  edition: '1.0',
  version: 'Daggerheart SRD 1.0',

  stats: {
    classes: {
      count: daggerheartClasses.length,
    },
    ancestries: {
      count: daggerheartAncestries.length,
    },
    communities: {
      count: daggerheartCommunities.length,
    },
    domains: {
      count: daggerheartDomains.length,
    },
    domainCards: {
      count: daggerheartDomainCards.length,
    },
    equipment: {
      weapons: daggerheartWeapons.length,
      armor: daggerheartArmor.length,
      loot: daggerheartLoot.length,
      consumables: daggerheartConsumables.length,
      count:
        daggerheartWeapons.length +
        daggerheartArmor.length +
        daggerheartLoot.length +
        daggerheartConsumables.length,
    },
  },

  sources: [
    {
      id: 'dh-srd-1.0',
      name: 'Daggerheart System Reference Document 1.0',
      abbr: 'DH SRD 1.0',
    },
    {
      id: 'dpcgl',
      name: 'Darrington Press Community Gaming License',
      abbr: 'DPCGL',
    },
  ],
};

export function getProgress(): number {
  const stats = daggerheartMetadata.stats;
  const totalItems =
    stats.classes.count +
    stats.ancestries.count +
    stats.communities.count +
    stats.domains.count +
    stats.domainCards.count +
    stats.equipment.count;
  return totalItems > 0 ? 100 : 0;
}
