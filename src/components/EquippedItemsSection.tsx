import React from 'react';
import { Shield, X } from 'lucide-react';
import type { EquippedItem, EquipmentSlot } from '../types/core/character';

const SLOT_LABELS: Record<EquipmentSlot, string> = {
  head: 'Head',
  neck: 'Neck',
  chest: 'Chest',
  back: 'Back',
  mainHand: 'Main Hand',
  offHand: 'Off Hand',
  hands: 'Hands',
  ring1: 'Ring 1',
  ring2: 'Ring 2',
  waist: 'Waist',
  feet: 'Feet',
};

const SLOT_ORDER: EquipmentSlot[] = [
  'head',
  'neck',
  'chest',
  'back',
  'mainHand',
  'offHand',
  'hands',
  'ring1',
  'ring2',
  'waist',
  'feet',
];

interface Props {
  equipment: EquippedItem[];
  /**
   * The slot identifies the exact entry, so duplicate item ids equipped in
   * different slots (e.g. the same ring in ring1/ring2) are never affected
   * together.
   */
  onUnequip?: (itemId: string, slot: EquipmentSlot) => void;
  onToggleAttune?: (itemId: string, slot: EquipmentSlot) => void;
}

export const EquippedItemsSection: React.FC<Props> = ({ equipment, onUnequip, onToggleAttune }) => {
  const bySlot = new Map<EquipmentSlot, EquippedItem>();
  for (const item of equipment) {
    bySlot.set(item.slot, item);
  }

  const attunedCount = equipment.filter((e) => e.attuned).length;

  return (
    <section className="bg-card p-4 rounded-lg border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4" /> Equipped Items
          {equipment.length > 0 && (
            <span className="text-xs text-muted-foreground">({equipment.length} equipped)</span>
          )}
        </h3>
        {attunedCount > 0 && (
          <span className="text-xs text-muted-foreground">{attunedCount}/3 attuned</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {SLOT_ORDER.map((slot) => {
          const item = bySlot.get(slot);
          return (
            <div
              key={slot}
              className={`p-2 rounded border text-sm transition-colors ${
                item
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/30 border-dashed border-muted-foreground/20'
              }`}
            >
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {SLOT_LABELS[slot]}
              </div>
              {item ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium truncate text-xs">
                      {item.customName || item.itemId}
                    </span>
                    {onUnequip && (
                      <button
                        type="button"
                        onClick={() => onUnequip(item.itemId, slot)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        title="Unequip"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    {item.armorClass != null && (
                      <span className="px-1 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        AC {item.armorClass}
                      </span>
                    )}
                    {item.shieldBonus != null && (
                      <span className="px-1 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        +{item.shieldBonus} Shield
                      </span>
                    )}
                    {item.armorType && <span className="capitalize">{item.armorType}</span>}
                    {onToggleAttune && (
                      <button
                        type="button"
                        onClick={() => onToggleAttune(item.itemId, slot)}
                        className={`px-1 py-0.5 rounded transition-colors ${
                          item.attuned
                            ? 'bg-amber-500/20 text-amber-600 font-medium'
                            : 'hover:bg-muted'
                        }`}
                        title={item.attuned ? 'Unattune' : 'Attune'}
                      >
                        {item.attuned ? '★' : '☆'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-6">
                  <span className="text-[10px] text-muted-foreground/50 italic">Empty</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
