/**
 * Shared AC computation for d20 systems.
 *
 * D&D 5e (2014 & 2024):
 *   - Unarmored: 10 + DEX mod
 *   - Light armor: armorClass + DEX mod
 *   - Medium armor: armorClass + min(DEX mod, dexBonusMax ?? 2)
 *   - Heavy armor: armorClass (no DEX)
 *   - Shield: +shieldBonus (typically 2)
 *
 * D&D 3.5e / PF1e (also produces touch and flat-footed):
 *   - Base: 10 + armor bonus + shield bonus + DEX mod (capped) + size mod
 *   - Touch: 10 + DEX mod + size mod (no armor/shield)
 *   - Flat-footed: 10 + armor bonus + shield bonus + size mod (no DEX)
 *
 * PF2e:
 *   - Unarmored: 10 + DEX mod + proficiency bonus
 *   - Armored: armorClass + min(DEX mod, dexCap) + proficiency bonus
 *   - Shield: raised shield adds shieldBonus
 */

import { abilityMod } from './math';

/** Equipment item with optional armor stats */
interface ArmorEquipItem {
  equipped?: boolean;
  armorClass?: number;
  armorType?: 'light' | 'medium' | 'heavy';
  dexBonusMax?: number;
  shieldBonus?: number;
}

// ─── 5e AC ───────────────────────────────────────────────────────────────────

export function compute5eAC(
  dexScore: number,
  equipment: Array<{ slot?: string } & ArmorEquipItem>
): number {
  const dexMod = abilityMod(dexScore);

  // Find equipped armor (chest slot) and shield (offHand slot)
  const armor = equipment.find((e) => e.slot === 'chest' && e.armorClass != null);
  const shield = equipment.find((e) => e.slot === 'offHand' && e.shieldBonus != null);

  let ac: number;
  if (!armor) {
    // Unarmored
    ac = 10 + dexMod;
  } else if (armor.armorType === 'light') {
    ac = armor.armorClass! + dexMod;
  } else if (armor.armorType === 'medium') {
    const cap = armor.dexBonusMax ?? 2;
    ac = armor.armorClass! + Math.min(dexMod, cap);
  } else {
    // Heavy — no DEX bonus
    ac = armor.armorClass!;
  }

  if (shield) {
    ac += shield.shieldBonus!;
  }

  return ac;
}

// ─── 3.5e / PF1e AC ─────────────────────────────────────────────────────────

const SIZE_AC_MOD: Record<string, number> = {
  fine: 8,
  diminutive: 4,
  tiny: 2,
  small: 1,
  medium: 0,
  large: -1,
  huge: -2,
  gargantuan: -4,
  colossal: -8,
};

export function computeD20LegacyAC(
  dexScore: number,
  sizeCategory: string,
  equipment: Array<ArmorEquipItem>
): { total: number; touch: number; flatFooted: number } {
  const dexMod = abilityMod(dexScore);
  const sizeMod = SIZE_AC_MOD[sizeCategory] ?? 0;

  // Find equipped armor and shield
  const armor = equipment.find((e) => e.equipped && e.armorClass != null && !e.shieldBonus);
  const shield = equipment.find((e) => e.equipped && e.shieldBonus != null);

  const armorBonus = armor?.armorClass ?? 0;
  const shieldBonus = shield?.shieldBonus ?? 0;

  // DEX cap from armor
  const dexCap = armor?.dexBonusMax;
  const effectiveDex = dexCap != null ? Math.min(dexMod, dexCap) : dexMod;

  const total = 10 + armorBonus + shieldBonus + effectiveDex + sizeMod;
  const touch = 10 + dexMod + sizeMod; // No armor/shield
  const flatFooted = 10 + armorBonus + shieldBonus + sizeMod; // No DEX

  return { total, touch, flatFooted };
}

// ─── PF2e AC ─────────────────────────────────────────────────────────────────

export function computePf2eAC(
  dexScore: number,
  proficiencyBonus: number,
  equipment: Array<ArmorEquipItem>
): number {
  const dexMod = abilityMod(dexScore);

  const armor = equipment.find((e) => e.equipped && e.armorClass != null && !e.shieldBonus);
  const shield = equipment.find((e) => e.equipped && e.shieldBonus != null);

  let ac: number;
  if (!armor) {
    // Unarmored: 10 + DEX + proficiency
    ac = 10 + dexMod + proficiencyBonus;
  } else {
    const dexCap = armor.dexBonusMax;
    const effectiveDex = dexCap != null ? Math.min(dexMod, dexCap) : dexMod;
    ac = 10 + armor.armorClass! + effectiveDex + proficiencyBonus;
  }

  if (shield) {
    ac += shield.shieldBonus!;
  }

  return ac;
}
