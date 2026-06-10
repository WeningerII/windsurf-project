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
 *   - Touch: 10 + DEX mod (capped by armor max-Dex) + size mod (no armor/shield)
 *   - Flat-footed: 10 + armor bonus + shield bonus + size mod (no DEX)
 *
 * PF2e:
 *   - Unarmored: 10 + DEX mod + proficiency bonus
 *   - Armored: 10 + item AC bonus (armorClass) + min(DEX mod, dexCap) + proficiency bonus
 *   - Shield: adds shieldBonus only while RAISED (CRB: the Raise a Shield
 *     action, one round at a time) — merely equipping/holding it grants nothing
 */

import { abilityMod } from './math';

/** Equipment item with optional armor stats */
interface ArmorEquipItem {
  equipped?: boolean;
  armorClass?: number;
  armorType?: 'light' | 'medium' | 'heavy';
  dexBonusMax?: number;
  shieldBonus?: number;
  /** PF2e only: shields contribute AC only while raised (Raise a Shield). */
  raised?: boolean;
}

// ─── 5e AC ───────────────────────────────────────────────────────────────────

/**
 * How much Dexterity an armor type lets through to AC (SRD): unarmored and
 * light pass the full mod, medium caps it (default +2), heavy passes none.
 * Single source for both the AC computation and the contribution ledger.
 */
export function dnd5eArmorDexContribution(
  armor: Pick<ArmorEquipItem, 'armorType' | 'dexBonusMax'> | undefined,
  dexMod: number
): number {
  if (!armor || armor.armorType === 'light') {
    return dexMod;
  }
  if (armor.armorType === 'medium') {
    return Math.min(dexMod, armor.dexBonusMax ?? 2);
  }
  return 0;
}

export function compute5eAC(
  dexScore: number,
  equipment: Array<{ slot?: string } & ArmorEquipItem>
): number {
  const dexMod = abilityMod(dexScore);

  // Find equipped armor (chest slot) and shield (offHand slot)
  const armor = equipment.find((e) => e.slot === 'chest' && e.armorClass != null);
  const shield = equipment.find((e) => e.slot === 'offHand' && e.shieldBonus != null);

  let ac = (armor ? armor.armorClass! : 10) + dnd5eArmorDexContribution(armor, dexMod);

  if (shield) {
    ac += shield.shieldBonus!;
  }

  return ac;
}

// ─── 3.5e / PF1e AC ─────────────────────────────────────────────────────────

/**
 * 3.5e/PF1e size modifier — the SAME value applies to AC and to attack rolls
 * (SRD: size modifier), which is why this is the single exported table.
 */
export const D20_SIZE_MOD: Record<string, number> = {
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
  const sizeMod = D20_SIZE_MOD[sizeCategory] ?? 0;

  // Find equipped armor and shield
  const armor = equipment.find((e) => e.equipped && e.armorClass != null && !e.shieldBonus);
  const shield = equipment.find((e) => e.equipped && e.shieldBonus != null);

  const armorBonus = armor?.armorClass ?? 0;
  const shieldBonus = shield?.shieldBonus ?? 0;

  // DEX cap from armor — the armor's Max Dex Bonus caps Dexterity-to-AC
  // generally (SRD), so it applies to touch AC too, not just the base total.
  const dexCap = armor?.dexBonusMax;
  const effectiveDex = dexCap != null ? Math.min(dexMod, dexCap) : dexMod;

  const total = 10 + armorBonus + shieldBonus + effectiveDex + sizeMod;
  const touch = 10 + effectiveDex + sizeMod; // No armor/shield, Dex still capped
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

  // CRB: a shield grants its bonus only while raised (the Raise a Shield
  // action); holding an equipped shield grants nothing by itself.
  if (shield?.raised) {
    ac += shield.shieldBonus!;
  }

  return ac;
}
