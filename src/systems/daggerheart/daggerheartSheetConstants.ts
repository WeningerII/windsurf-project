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

export const DAGGERHEART_CURRENCY_FIELDS = [
  { key: 'handfuls', label: 'Handfuls', color: 'text-amber-500' },
  { key: 'bags', label: 'Bags', color: 'text-orange-500' },
  { key: 'chests', label: 'Chests', color: 'text-yellow-200' },
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
