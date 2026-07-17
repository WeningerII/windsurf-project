import React, { Suspense } from 'react';
import type { Item } from '../../../types/equipment/items';
import { lazyWithPreload } from '../../../utils/lazyWithPreload';

const EquipmentBrowser = lazyWithPreload(async () => {
  const module = await import('../../../components/EquipmentBrowser');
  return { default: module.EquipmentBrowser };
});

interface Props {
  equipmentLoaded: boolean;
  equipmentItems: Item[];
}

type Pf2eEquipmentBrowserTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const Pf2eEquipmentBrowserTab = (({ equipmentLoaded, equipmentItems }) =>
  !equipmentLoaded ? (
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
          cost: item.cost ? `${item.cost.amount} ${item.cost.currency}` : '0 gp',
          weight: item.weight ?? 0,
          description: item.description,
        }))}
        // PF2e item weight carries Bulk (usePf2eMutationHandlers maps
        // item.weight -> bulk), so labeling it 'lbs' printed Bulk as pounds.
        weightUnit="Bulk"
      />
    </Suspense>
  )) as Pf2eEquipmentBrowserTabComponent;

Pf2eEquipmentBrowserTab.preload = () => EquipmentBrowser.preload();
