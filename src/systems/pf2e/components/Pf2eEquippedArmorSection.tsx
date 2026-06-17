import React from 'react';
import type { Armor, Item, Shield } from '../../../types/equipment/items';

/** Subset of a PF2e character's equipped armor/shield entry. */
interface Pf2eEquipEntry {
  itemId: string;
  name: string;
  equipped: boolean;
  armorClass?: number;
  armorType?: 'light' | 'medium' | 'heavy';
  dexBonusMax?: number;
  shieldBonus?: number;
  raised?: boolean;
}

interface Props {
  equipmentItems: Item[];
  equipment: Pf2eEquipEntry[];
  canUpdate: boolean;
  onEquipArmor: (item: {
    id: string;
    name: string;
    bulk: number;
    armorClass?: number;
    armorType?: 'light' | 'medium' | 'heavy';
    dexBonusMax?: number;
  }) => void;
  onEquipShield: (item: { id: string; name: string; bulk: number; shieldBonus?: number }) => void;
  onUnequipArmor: () => void;
  onUnequipShield: () => void;
}

/**
 * Equip a single armor and shield from the loaded catalog. Equipping copies the
 * item bonus + Dex cap onto the character entry, which `computePf2eAC` consumes.
 * A shield equips un-raised (the Raise a Shield action is a separate toggle), so
 * it contributes AC only once raised — per the CRB. Selecting "None" unequips.
 */
export const Pf2eEquippedArmorSection: React.FC<Props> = ({
  equipmentItems,
  equipment,
  canUpdate,
  onEquipArmor,
  onEquipShield,
  onUnequipArmor,
  onUnequipShield,
}) => {
  const equippedArmor = equipment.find(
    (entry) => entry.equipped && entry.armorClass != null && entry.shieldBonus == null
  );
  const equippedShield = equipment.find((entry) => entry.equipped && entry.shieldBonus != null);
  const armorOptions = equipmentItems.filter((item) => item.type === 'armor') as Armor[];
  const shieldOptions = equipmentItems.filter((item) => item.type === 'shield') as Shield[];

  const selectClass =
    'w-full bg-transparent border border-input rounded px-2 py-1 text-sm focus:outline-none focus:border-primary disabled:opacity-50';

  return (
    <section className="mb-4 p-3 bg-card border rounded">
      <h3 className="text-sm font-semibold mb-2">Equipped Armor &amp; Shield</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground" htmlFor="pf2e-equip-armor">
            Armor
          </label>
          <select
            id="pf2e-equip-armor"
            className={selectClass}
            disabled={!canUpdate || armorOptions.length === 0}
            value={equippedArmor?.itemId ?? ''}
            onChange={(event) => {
              const id = event.target.value;
              if (!id) {
                onUnequipArmor();
                return;
              }
              const item = armorOptions.find((option) => option.id === id);
              if (item) {
                onEquipArmor({
                  id: item.id,
                  name: item.name,
                  bulk: item.weight,
                  armorClass: item.armorClass,
                  armorType: item.armorType,
                  dexBonusMax: item.dexBonusMax,
                });
              }
            }}
          >
            <option value="">— None —</option>
            {armorOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} (+{option.armorClass} AC)
              </option>
            ))}
          </select>
          {equippedArmor && (
            <p className="text-[11px] text-muted-foreground mt-1 tabular-nums">
              +{equippedArmor.armorClass} AC
              {equippedArmor.dexBonusMax != null ? `, Dex cap +${equippedArmor.dexBonusMax}` : ''}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs text-muted-foreground" htmlFor="pf2e-equip-shield">
            Shield
          </label>
          <select
            id="pf2e-equip-shield"
            className={selectClass}
            disabled={!canUpdate || shieldOptions.length === 0}
            value={equippedShield?.itemId ?? ''}
            onChange={(event) => {
              const id = event.target.value;
              if (!id) {
                onUnequipShield();
                return;
              }
              const item = shieldOptions.find((option) => option.id === id);
              if (item) {
                onEquipShield({
                  id: item.id,
                  name: item.name,
                  bulk: item.weight,
                  shieldBonus: item.shieldBonus,
                });
              }
            }}
          >
            <option value="">— None —</option>
            {shieldOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} (+{option.shieldBonus} AC)
              </option>
            ))}
          </select>
          {equippedShield && (
            <p className="text-[11px] text-muted-foreground mt-1 tabular-nums">
              +{equippedShield.shieldBonus} AC when raised
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
