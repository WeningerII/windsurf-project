import { Suspense, type ComponentType } from 'react';
import { EquippedItem } from '../../../../types/core/character';
import { Item } from '../../../../types/equipment/items';
import { lazyWithPreload } from '../../../../utils/lazyWithPreload';

type CurrencyEditorProps = {
  currency: Record<string, number>;
  onChange?: (currency: Record<string, number>) => void;
  entries?: Array<{ key: string; label: string; color: string }>;
};

type EquipmentBrowserItem = {
  id: string;
  name: string;
  type: string;
  rarity: string;
  cost: string;
  weight: number;
  description: string;
  properties?: string[];
};

type EquipmentBrowserProps = {
  equipment: EquipmentBrowserItem[];
  onSelectEquipment?: (item: EquipmentBrowserItem) => void;
};

type InventoryManagerItem = {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  value: string;
  description?: string;
};

type InventoryManagerProps = {
  items: InventoryManagerItem[];
  onAddItem?: (item: InventoryManagerItem) => void;
  onRemoveItem?: (itemId: string) => void;
};

type EquippedItemsSectionProps = {
  equipment: EquippedItem[];
  onEquip?: (item: EquippedItem) => void;
  onUnequip?: (itemId: string) => void;
  onToggleAttune?: (itemId: string) => void;
};

const CurrencyEditor = lazyWithPreload<CurrencyEditorProps>(async () => {
  const module = await import('../../../../components/CurrencyEditor');
  return {
    default: module.CurrencyEditor as ComponentType<CurrencyEditorProps>,
  };
});
const EquippedItemsSection = lazyWithPreload<EquippedItemsSectionProps>(async () => {
  const module = await import('../../../../components/EquippedItemsSection');
  return {
    default: module.EquippedItemsSection as ComponentType<EquippedItemsSectionProps>,
  };
});
const EquipmentBrowser = lazyWithPreload<EquipmentBrowserProps>(async () => {
  const module = await import('../../../../components/EquipmentBrowser');
  return {
    default: module.EquipmentBrowser as ComponentType<EquipmentBrowserProps>,
  };
});
const InventoryManager = lazyWithPreload<InventoryManagerProps>(async () => {
  const module = await import('../../../../components/InventoryManager');
  return {
    default: module.InventoryManager as ComponentType<InventoryManagerProps>,
  };
});

type InventoryEntry = {
  itemId: string;
  quantity: number;
  customName?: string;
  notes?: string;
};

interface Props {
  currency: Record<string, number>;
  equipment: EquippedItem[];
  inventory: InventoryEntry[];
  equipmentItems: Item[];
  equippedNames: Map<string, string>;
  equipmentLoaded: boolean;
  onCurrencyChange?: (currency: Record<string, number>) => void;
  onUnequip?: (itemId: string) => void;
  onToggleAttune?: (itemId: string) => void;
  onAddInventoryItem?: (item: {
    id: string;
    name: string;
    quantity: number;
    weight: number;
    value: string;
    description?: string;
  }) => void;
  onRemoveInventoryItem?: (itemId: string) => void;
  onSelectEquipment?: (item: Item) => void;
}

type Dnd5eEquipmentTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const Dnd5eEquipmentTab = (({
  currency,
  equipment,
  inventory,
  equipmentItems,
  equippedNames,
  equipmentLoaded,
  onCurrencyChange,
  onUnequip,
  onToggleAttune,
  onAddInventoryItem,
  onRemoveInventoryItem,
  onSelectEquipment,
}: Props) => {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading equipment tools...
        </div>
      }
    >
      <CurrencyEditor currency={currency} onChange={onCurrencyChange} />
      <EquippedItemsSection
        equipment={equipment}
        onUnequip={onUnequip}
        onToggleAttune={onToggleAttune}
      />
      <InventoryManager
        items={inventory.map((entry) => ({
          id: entry.itemId,
          name: entry.customName || equippedNames.get(entry.itemId) || entry.itemId,
          quantity: entry.quantity,
          weight: equipmentItems.find((item) => item.id === entry.itemId)?.weight || 0,
          value: (() => {
            const matchedItem = equipmentItems.find((item) => item.id === entry.itemId);
            return matchedItem ? `${matchedItem.cost.amount} ${matchedItem.cost.currency}` : '0 gp';
          })(),
          description: entry.notes,
        }))}
        onAddItem={onAddInventoryItem}
        onRemoveItem={onRemoveInventoryItem}
      />
      {!equipmentLoaded ? (
        <div className="py-8 text-center text-muted-foreground">
          Open the Equipment tab to load equipment data.
        </div>
      ) : (
        <EquipmentBrowser
          equipment={equipmentItems.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            rarity: item.rarity,
            cost: `${item.cost.amount} ${item.cost.currency}`,
            weight: item.weight,
            description: item.description,
            properties:
              'properties' in item && Array.isArray(item.properties)
                ? item.properties.map((property) =>
                    typeof property === 'string' ? property : String(property)
                  )
                : undefined,
          }))}
          onSelectEquipment={
            onSelectEquipment
              ? (item) => {
                  const selectedItem = equipmentItems.find((entry) => entry.id === item.id);
                  if (selectedItem) {
                    onSelectEquipment(selectedItem);
                  }
                }
              : undefined
          }
        />
      )}
    </Suspense>
  );
}) as Dnd5eEquipmentTabComponent;

Dnd5eEquipmentTab.preload = () =>
  Promise.all([
    CurrencyEditor.preload(),
    EquippedItemsSection.preload(),
    EquipmentBrowser.preload(),
    InventoryManager.preload(),
  ]);
