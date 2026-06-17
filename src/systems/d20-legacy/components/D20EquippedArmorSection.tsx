import React from 'react';
import type { Armor, Item, Shield } from '../../../types/equipment/items';

/** Shape of a character's equipped armor/shield entry (subset of the data model). */
interface EquipEntry {
  itemId: string;
  name: string;
  equipped: boolean;
  armorClass?: number;
  armorType?: 'light' | 'medium' | 'heavy';
  dexBonusMax?: number;
  shieldBonus?: number;
  armorCheckPenalty?: number;
}

interface Props {
  equipmentItems: Item[];
  equipment: EquipEntry[];
  canUpdate: boolean;
  onEquipArmor: (item: {
    id: string;
    name: string;
    armorClass?: number;
    armorType?: 'light' | 'medium' | 'heavy';
    dexBonusMax?: number;
    armorCheckPenalty?: number;
  }) => void;
  onEquipShield: (item: {
    id: string;
    name: string;
    shieldBonus?: number;
    armorCheckPenalty?: number;
  }) => void;
  onUnequipArmor: () => void;
  onUnequipShield: () => void;
}

/**
 * Equip a single armor and shield from the loaded catalog. Equipping copies the
 * item's AC bonus, max-Dex cap, and check penalty onto the character entry,
 * which drives AC (computeD20LegacyAC) and the skill check penalty. Selecting
 * "None" unequips.
 */
export const D20EquippedArmorSection: React.FC<Props> = ({
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
          <label className="text-xs text-muted-foreground" htmlFor="d20-equip-armor">
            Armor
          </label>
          <select
            id="d20-equip-armor"
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
                  armorClass: item.armorClass,
                  armorType: item.armorType,
                  dexBonusMax: item.dexBonusMax,
                  armorCheckPenalty: item.armorCheckPenalty,
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
              {equippedArmor.dexBonusMax != null ? `, max Dex +${equippedArmor.dexBonusMax}` : ''}
              {equippedArmor.armorCheckPenalty ? `, ACP ${equippedArmor.armorCheckPenalty}` : ''}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs text-muted-foreground" htmlFor="d20-equip-shield">
            Shield
          </label>
          <select
            id="d20-equip-shield"
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
                  shieldBonus: item.shieldBonus,
                  armorCheckPenalty: item.armorCheckPenalty,
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
              +{equippedShield.shieldBonus} AC
              {equippedShield.armorCheckPenalty ? `, ACP ${equippedShield.armorCheckPenalty}` : ''}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
