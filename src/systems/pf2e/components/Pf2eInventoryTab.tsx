import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import { CurrencyEditor } from '../../../components/CurrencyEditor';
import { InventoryManager } from '../../../components/InventoryManager';
import { abilityMod } from '../../../utils/math';
import type { CharacterDocument } from '../../../types/core/document';
import type { Pf2eDataModel } from '../data-model';
import { getPf2eBulkState } from '../pf2eSheetShared';

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  canUpdate: boolean;
  onCurrencyChange?: (currency: Pf2eDataModel['currency']) => void;
  onAddItem?: (item: { id: string; name: string; quantity: number; weight: number }) => void;
  onRemoveItem?: (itemId: string) => void;
}

export const Pf2eInventoryTab: React.FC<Props> = ({
  document,
  canUpdate,
  onCurrencyChange,
  onAddItem,
  onRemoveItem,
}) => {
  const data = document.system;
  const equippedBulk = data.equipment.reduce(
    (sum, item) => sum + (item.equipped ? item.bulk : 0),
    0
  );
  const inventoryBulk = data.inventory.reduce((sum, item) => sum + item.bulk * item.quantity, 0);
  const totalBulk = equippedBulk + inventoryBulk;
  const strengthModifier = abilityMod(data.baseAttributes.str ?? 10);
  // CRB p.272: encumbered/overloaded only when Bulk *exceeds* the threshold.
  const { encumbered, maxBulk, isEncumbered, isOverloaded } = getPf2eBulkState(
    totalBulk,
    strengthModifier
  );

  return (
    <>
      <section className="bg-card p-3 rounded-lg border flex items-center gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Total Bulk</span>
          <span
            className={`text-lg font-bold tabular-nums ${isOverloaded ? 'text-destructive' : isEncumbered ? 'text-amber-500' : ''}`}
          >
            {totalBulk}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Encumbered over <span className="font-medium">{encumbered}</span> &bull; Max{' '}
          <span className="font-medium">{maxBulk}</span>
        </div>
        {isOverloaded && (
          <Badge variant="destructive" className="text-[10px]">
            Overloaded
          </Badge>
        )}
        {isEncumbered && !isOverloaded && (
          <Badge variant="warning" className="text-[10px]">
            Encumbered
          </Badge>
        )}
      </section>

      <CurrencyEditor
        currency={data.currency as unknown as Record<string, number>}
        onChange={
          canUpdate && onCurrencyChange
            ? (currency) => onCurrencyChange(currency as Pf2eDataModel['currency'])
            : undefined
        }
      />

      <div className="mt-4" />

      <InventoryManager
        items={data.inventory.map((item) => ({
          id: item.itemId,
          name: item.name,
          quantity: item.quantity,
          weight: item.bulk,
          value: '0 gp',
        }))}
        onAddItem={canUpdate ? onAddItem : undefined}
        onRemoveItem={canUpdate ? onRemoveItem : undefined}
        // `weight` carries Bulk here (see the mapping above) — label it as such.
        weightUnit="Bulk"
      />
    </>
  );
};
