import React from 'react';
import { CurrencyEditor } from '../../../components/CurrencyEditor';
import { InventoryManager } from '../../../components/InventoryManager';

type Currency = {
  copper: number;
  silver: number;
  gold: number;
  platinum: number;
};

type InventoryItem = {
  itemId: string;
  name: string;
  quantity: number;
  weight: number;
};

interface Props {
  currency: Currency;
  inventory: InventoryItem[];
  canUpdate: boolean;
  onCurrencyChange: (currency: Currency) => void;
  onAddItem: (item: { id: string; name: string; quantity: number; weight: number }) => void;
  onRemoveItem: (itemId: string) => void;
}

export const D20InventoryTab: React.FC<Props> = ({
  currency,
  inventory,
  canUpdate,
  onCurrencyChange,
  onAddItem,
  onRemoveItem,
}) => (
  <>
    <CurrencyEditor currency={currency} onChange={canUpdate ? onCurrencyChange : undefined} />
    <div className="mt-4" />
    <InventoryManager
      items={inventory.map((item) => ({
        id: item.itemId,
        name: item.name,
        quantity: item.quantity,
        weight: item.weight,
        value: '0 gp',
      }))}
      onAddItem={canUpdate ? onAddItem : undefined}
      onRemoveItem={canUpdate ? onRemoveItem : undefined}
    />
  </>
);
