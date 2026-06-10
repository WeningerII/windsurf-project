import React, { Suspense } from 'react';
import type { Item } from '../../../types/equipment/items';
import { lazyWithPreload } from '../../../utils/lazyWithPreload';
import { MamResourceLoadError } from './MamResourceLoadError';

const EquipmentBrowser = lazyWithPreload(async () => {
  const module = await import('../../../components/EquipmentBrowser');
  return { default: module.EquipmentBrowser };
});

function formatMamEquipmentCost(item: Item): string {
  const rawCost = (item as Item & { cost?: unknown }).cost;

  if (typeof rawCost === 'number' && Number.isFinite(rawCost)) {
    return `${rawCost} ep`;
  }

  if (rawCost && typeof rawCost === 'object') {
    const amount = (rawCost as { amount?: unknown }).amount;
    const currency = (rawCost as { currency?: unknown }).currency;

    if (typeof amount === 'number' && typeof currency === 'string') {
      return `${amount} ${currency}`;
    }
  }

  return '0';
}

interface Props {
  equipmentLoaded: boolean;
  equipmentError?: boolean;
  onRetryEquipment?: () => void;
  equipmentItems: Item[];
}

type MamEquipmentBrowserTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const MamEquipmentBrowserTab = (({
  equipmentLoaded,
  equipmentError,
  onRetryEquipment,
  equipmentItems,
}) =>
  equipmentError && !equipmentLoaded ? (
    <MamResourceLoadError resourceLabel="the M&M equipment catalog" onRetry={onRetryEquipment} />
  ) : !equipmentLoaded ? (
    <div className="text-center py-8 text-muted-foreground">Click to load equipment...</div>
  ) : (
    <Suspense
      fallback={
        <div className="text-center py-8 text-muted-foreground text-sm">
          Loading Equipment Browser...
        </div>
      }
    >
      <EquipmentBrowser
        equipment={equipmentItems.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type || 'gear',
          rarity: item.rarity || 'common',
          cost: formatMamEquipmentCost(item),
          weight: item.weight ?? 0,
          description: item.description,
        }))}
      />
    </Suspense>
  )) as MamEquipmentBrowserTabComponent;

MamEquipmentBrowserTab.preload = () => EquipmentBrowser.preload();
