import { daggerheartConsumables, daggerheartLoot } from '../data/daggerheart/1.0/equipment';
import type { DaggerheartDataModel } from '../systems/daggerheart/data-model';
import type { DaggerheartConsumable, DaggerheartInventoryDefinition } from '../types/daggerheart';

export const MAX_DAGGERHEART_HANDFULS = 9;
export const MAX_DAGGERHEART_BAGS = 9;
export const MAX_DAGGERHEART_CHESTS = 1;
export const MAX_DAGGERHEART_CONSUMABLE_QUANTITY = 5;

export const daggerheartInventoryDefinitions: DaggerheartInventoryDefinition[] = [
  ...daggerheartLoot,
  ...daggerheartConsumables,
];

const inventoryDefinitionById = Object.fromEntries(
  daggerheartInventoryDefinitions.map((entry) => [entry.id, entry])
) as Record<string, DaggerheartInventoryDefinition>;

const inventoryDefinitionByName = new Map(
  daggerheartInventoryDefinitions.map((entry) => [entry.name.toLowerCase(), entry] as const)
);

function normalizeInteger(value: number, fallback = 0): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.trunc(value));
}

export function getDaggerheartInventoryDefinition(
  id: string
): DaggerheartInventoryDefinition | undefined {
  return inventoryDefinitionById[id];
}

export function findDaggerheartInventoryDefinitionByName(
  name: string
): DaggerheartInventoryDefinition | undefined {
  return inventoryDefinitionByName.get(name.toLowerCase());
}

export function isDaggerheartConsumableDefinition(
  definition: DaggerheartInventoryDefinition | undefined
): definition is DaggerheartConsumable {
  return definition?.category === 'consumable';
}

export function clampDaggerheartInventoryQuantity(itemId: string, quantity: number): number {
  const definition = getDaggerheartInventoryDefinition(itemId);
  const normalized = Math.max(1, normalizeInteger(quantity, 1));

  if (isDaggerheartConsumableDefinition(definition)) {
    return Math.min(MAX_DAGGERHEART_CONSUMABLE_QUANTITY, normalized);
  }

  return normalized;
}

export function normalizeDaggerheartCurrency(
  currency: DaggerheartDataModel['currency']
): DaggerheartDataModel['currency'] {
  let handfuls = normalizeInteger(currency.handfuls);
  let bags = normalizeInteger(currency.bags);
  let chests = normalizeInteger(currency.chests);

  bags += Math.floor(handfuls / 10);
  handfuls %= 10;

  chests += Math.floor(bags / 10);
  bags %= 10;

  return {
    handfuls: Math.min(MAX_DAGGERHEART_HANDFULS, handfuls),
    bags: Math.min(MAX_DAGGERHEART_BAGS, bags),
    chests: Math.min(MAX_DAGGERHEART_CHESTS, chests),
  };
}

export function createDaggerheartInventoryEntry(
  definition: DaggerheartInventoryDefinition
): DaggerheartDataModel['inventory'][number] {
  return {
    itemId: definition.id,
    name: definition.name,
    quantity: 1,
    description: '',
  };
}
