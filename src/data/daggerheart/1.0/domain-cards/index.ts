import type { DaggerheartDomainCard, DaggerheartDomainId } from '../../../../types/daggerheart';
import { arcanaDomainCards } from './arcana';
import { bladeDomainCards } from './blade';
import { boneDomainCards } from './bone';
import { codexDomainCards } from './codex';
import { graceDomainCards } from './grace';
import { midnightDomainCards } from './midnight';
import { sageDomainCards } from './sage';
import { splendorDomainCards } from './splendor';
import { valorDomainCards } from './valor';
import { normalizeDaggerheartDomainCardAutomation } from './automation';

const daggerheartDomainCardsRaw: DaggerheartDomainCard[] = [
  ...arcanaDomainCards,
  ...bladeDomainCards,
  ...boneDomainCards,
  ...codexDomainCards,
  ...graceDomainCards,
  ...midnightDomainCards,
  ...sageDomainCards,
  ...splendorDomainCards,
  ...valorDomainCards,
];

export const daggerheartDomainCards: DaggerheartDomainCard[] = daggerheartDomainCardsRaw.map(
  normalizeDaggerheartDomainCardAutomation
);

export const daggerheartDomainCardsById = Object.fromEntries(
  daggerheartDomainCards.map((card) => [card.id, card])
) as Record<string, DaggerheartDomainCard>;

export const daggerheartDomainCardsByDomain = daggerheartDomainCards.reduce(
  (acc, card) => {
    const cards = acc[card.domain] ?? [];
    cards.push(card);
    acc[card.domain] = cards;
    return acc;
  },
  {} as Record<DaggerheartDomainId, DaggerheartDomainCard[]>
);

export function getDaggerheartDomainCard(id: string): DaggerheartDomainCard | undefined {
  return daggerheartDomainCardsById[id];
}
