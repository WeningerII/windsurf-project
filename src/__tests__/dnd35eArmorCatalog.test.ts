/**
 * Verifies the 3.5e armor catalog → loader → AC pipeline.
 *
 * The catalog authors armor in the legacy DnD35eArmor shape (weight class in
 * `type`, dex cap in `maxDexBonus`, shield bonus in `armorClassBonus`); the
 * loader normalizes those onto the canonical names the AC math reads. These
 * pin the SRD values (armor bonus, max Dex, check penalty) and confirm the
 * normalized item produces correct 3.5e AC.
 */
import { describe, expect, it } from 'vitest';
import { loadEquipmentForSystem } from '../utils/dataLoader';
import { computeD20LegacyAC } from '../utils/armorClass';
import type { Armor, Shield } from '../types/equipment/items';

describe('3.5e armor catalog → AC pipeline', () => {
  it('normalizes armor to SRD armor-bonus / max-Dex / check-penalty and caps Dex in AC', async () => {
    const items = await loadEquipmentForSystem('dnd-3.5e');
    const fullPlate = items.find((item) => item.id === 'full-plate') as Armor;

    expect(fullPlate).toBeTruthy();
    // SRD full plate: +8 armor bonus, max Dex +1, ACP -6, heavy.
    expect(fullPlate.armorClass).toBe(8);
    expect(fullPlate.dexBonusMax).toBe(1);
    expect(fullPlate.armorCheckPenalty).toBe(-6);
    expect(fullPlate.armorType).toBe('heavy');

    // A Dex-18 (+4) character in full plate has Dex capped at +1:
    // total = 10 + 8 armor + 1 capped Dex = 19; touch = 10 + 1 = 11.
    const ac = computeD20LegacyAC(18, 'medium', [
      {
        equipped: true,
        armorClass: fullPlate.armorClass,
        armorType: fullPlate.armorType,
        dexBonusMax: fullPlate.dexBonusMax,
      },
    ]);
    expect(ac).toEqual({ total: 19, touch: 11, flatFooted: 18 });
  });

  it('maps a shield AC bonus to shieldBonus and adds it to AC', async () => {
    const items = await loadEquipmentForSystem('dnd-3.5e');
    const heavySteel = items.find((item) => item.id === 'heavy-steel-shield') as Shield;

    expect(heavySteel).toBeTruthy();
    expect(heavySteel.shieldBonus).toBe(2);
    expect(heavySteel.armorCheckPenalty).toBe(-2);

    // 10 + 2 shield + 2 Dex(14) = 14.
    const ac = computeD20LegacyAC(14, 'medium', [
      { equipped: true, shieldBonus: heavySteel.shieldBonus },
    ]);
    expect(ac.total).toBe(14);
  });
});
