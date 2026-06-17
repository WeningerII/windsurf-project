import React from 'react';
import type { Armor, Item, Shield } from '../types/equipment/items';

/** Payload the section hands to an equip-armor handler; each system uses the
 * fields it needs (d20 ignores `bulk`; PF2e ignores `armorCheckPenalty`). */
export interface EquipArmorInput {
  id: string;
  name: string;
  bulk?: number;
  armorClass?: number;
  armorType?: 'light' | 'medium' | 'heavy';
  dexBonusMax?: number;
  armorCheckPenalty?: number;
}

export interface EquipShieldInput {
  id: string;
  name: string;
  bulk?: number;
  shieldBonus?: number;
  armorCheckPenalty?: number;
}

/** Subset of a character's equipped armor/shield entry the section reads. */
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
  onEquipArmor: (item: EquipArmorInput) => void;
  onEquipShield: (item: EquipShieldInput) => void;
  onUnequipArmor: () => void;
  onUnequipShield: () => void;
  /** PF2e: a shield grants AC only while raised (Raise a Shield), so the note
   * reads "when raised". d20 shields always apply. */
  shieldRequiresRaise?: boolean;
}

/**
 * System-agnostic equip picker for a single armor and shield from the loaded
 * catalog. Equipping copies the AC bonus, Dex cap, Bulk, and check penalty onto
 * the character entry; the per-system AC math (computeD20LegacyAC / computePf2eAC)
 * and skill check penalty consume them. "None" unequips. Used by both the
 * d20-legacy and PF2e sheets.
 */
export const EquippedArmorSection: React.FC<Props> = ({
  equipmentItems,
  equipment,
  canUpdate,
  onEquipArmor,
  onEquipShield,
  onUnequipArmor,
  onUnequipShield,
  shieldRequiresRaise = false,
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
          <label className="text-xs text-muted-foreground" htmlFor="equip-armor">
            Armor
          </label>
          <select
            id="equip-armor"
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
          <label className="text-xs text-muted-foreground" htmlFor="equip-shield">
            Shield
          </label>
          <select
            id="equip-shield"
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
              +{equippedShield.shieldBonus} AC{shieldRequiresRaise ? ' when raised' : ''}
              {equippedShield.armorCheckPenalty ? `, ACP ${equippedShield.armorCheckPenalty}` : ''}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
