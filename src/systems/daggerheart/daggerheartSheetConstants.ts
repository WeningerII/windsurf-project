import type { DaggerheartDomainCard, DaggerheartDomainId } from '../../types/daggerheart';
import { daggerheartDomainsById } from '../../data/daggerheart/1.0/domains';
import type { DaggerheartDataModel } from './data-model';

export const ATTRIBUTES: Array<{
  id: keyof DaggerheartDataModel['attributes'];
  label: string;
  pair: string;
}> = [
  { id: 'agility', label: 'Agility', pair: 'Physical' },
  { id: 'strength', label: 'Strength', pair: 'Physical' },
  { id: 'finesse', label: 'Finesse', pair: 'Mental' },
  { id: 'instinct', label: 'Instinct', pair: 'Mental' },
  { id: 'presence', label: 'Presence', pair: 'Social' },
  { id: 'knowledge', label: 'Knowledge', pair: 'Social' },
];

export const DOMAIN_CARD_TYPE_LABELS: Record<DaggerheartDomainCard['type'], string> = {
  ability: 'Ability',
  spell: 'Spell',
  grimoire: 'Grimoire',
};

export const LOADOUT_LIMIT = 5;
export const INVENTORY_WEAPON_LIMIT = 2;
export const EMPTY_WEAPON_LOADOUT: NonNullable<DaggerheartDataModel['weapons']> = {
  primaryId: '',
  secondaryId: '',
  inventoryIds: [],
};

/**
 * Rendered by `CurrencyEditor` as `text-xs font-medium ${color}` — 12px real
 * text, so WCAG AA's 4.5:1 applies in BOTH themes.
 *
 * The 2026-07-31 contrast sweep (WORK_PLAN §6.4) fixed that component's own
 * default coin colours and missed these, because Daggerheart supplies its own
 * `entries` from this file and nothing scanned `src/systems/`. The single values
 * left behind were `text-amber-500` (2.15:1 light), `text-orange-500` (2.80:1)
 * and `text-yellow-200` (**1.16:1** — worse than the platinum 1.23:1 §6.4 named
 * as its worst find). They now follow the same light/dark pairing the coin rows
 * use: 5.02/11.98, 5.18/8.84 and 4.92/15.18.
 */
export const DAGGERHEART_CURRENCY_FIELDS = [
  { key: 'handfuls', label: 'Handfuls', color: 'text-amber-700 dark:text-amber-400' },
  { key: 'bags', label: 'Bags', color: 'text-orange-700 dark:text-orange-400' },
  { key: 'chests', label: 'Chests', color: 'text-yellow-700 dark:text-yellow-300' },
] as const;

/** Display name for a canonical domain id, from the domain record. */
export function domainDisplayName(id: DaggerheartDomainId): string {
  return daggerheartDomainsById[id]?.name ?? id;
}

/**
 * Coerce a PERSISTED domain value to its canonical id. Class data is typed
 * `DaggerheartDomainId` and needs no coercion; this exists for legacy
 * documents whose domain-card entries stored capitalized display names.
 */
export function normalizeDomainId(value: string): DaggerheartDomainId {
  return value.toLowerCase().replace(/\s+/g, '') as DaggerheartDomainId;
}
