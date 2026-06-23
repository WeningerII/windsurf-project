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

/**
 * One additive term of an AC total, kept purely numeric so this module stays a
 * math util. The contribution-ledger builders map a term's `key` onto ledger
 * provenance (source item, condition, etc.). `set` establishes the base; the
 * rest add. Folding the terms reproduces the scalar AC exactly — that shared
 * derivation is the whole point, so the breakdown can never drift from the value
 * the sheet shows.
 */
export interface AcContributionTerm {
  key: 'base' | 'armor' | 'shield' | 'dex' | 'proficiency' | 'size';
  label: string;
  value: number;
  operation: 'set' | 'add';
  details?: Record<string, unknown>;
}

function foldAcTerms(terms: AcContributionTerm[]): number {
  return terms.reduce(
    (total, term) => (term.operation === 'set' ? term.value : total + term.value),
    0
  );
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

/**
 * 3.5e/PF1e total AC decomposed into its terms (base, armor, shield, Dex, size),
 * alongside touch and flat-footed. `computeD20LegacyAC` is the scalar projection.
 * The contribution ledger consumes the terms so its breakdown sums to the same
 * total the engine stores.
 */
export function computeD20LegacyACBreakdown(
  dexScore: number,
  sizeCategory: string,
  equipment: Array<ArmorEquipItem>
): { total: number; touch: number; flatFooted: number; terms: AcContributionTerm[] } {
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

  const terms: AcContributionTerm[] = [
    { key: 'base', label: 'Base', value: 10, operation: 'set' },
    { key: 'armor', label: 'Armor', value: armorBonus, operation: 'add' },
    { key: 'shield', label: 'Shield', value: shieldBonus, operation: 'add' },
    {
      key: 'dex',
      label: 'Dexterity modifier',
      value: effectiveDex,
      operation: 'add',
      details: { dexMod, dexCap: dexCap ?? null },
    },
    {
      key: 'size',
      label: 'Size modifier',
      value: sizeMod,
      operation: 'add',
      details: { sizeCategory },
    },
  ];

  const total = foldAcTerms(terms);
  const touch = 10 + effectiveDex + sizeMod; // No armor/shield, Dex still capped
  const flatFooted = 10 + armorBonus + shieldBonus + sizeMod; // No DEX

  return { total, touch, flatFooted, terms };
}

export function computeD20LegacyAC(
  dexScore: number,
  sizeCategory: string,
  equipment: Array<ArmorEquipItem>
): { total: number; touch: number; flatFooted: number } {
  const { total, touch, flatFooted } = computeD20LegacyACBreakdown(
    dexScore,
    sizeCategory,
    equipment
  );
  return { total, touch, flatFooted };
}

// ─── PF2e AC ─────────────────────────────────────────────────────────────────

/**
 * PF2e AC decomposed into its terms (base, armor, Dex, proficiency, raised
 * shield). `computePf2eAC` is the scalar projection. The contribution ledger
 * consumes the terms (plus the resolver's magic-item ledger and any condition
 * status penalty, layered on by the engine) so its breakdown sums to the AC the
 * sheet shows.
 */
export function computePf2eACBreakdown(
  dexScore: number,
  proficiencyBonus: number,
  equipment: Array<ArmorEquipItem>
): { total: number; terms: AcContributionTerm[] } {
  const dexMod = abilityMod(dexScore);

  const armor = equipment.find((e) => e.equipped && e.armorClass != null && !e.shieldBonus);
  const shield = equipment.find((e) => e.equipped && e.shieldBonus != null);

  const terms: AcContributionTerm[] = [{ key: 'base', label: 'Base', value: 10, operation: 'set' }];

  if (armor) {
    const dexCap = armor.dexBonusMax;
    const effectiveDex = dexCap != null ? Math.min(dexMod, dexCap) : dexMod;
    terms.push({ key: 'armor', label: 'Armor', value: armor.armorClass!, operation: 'add' });
    terms.push({
      key: 'dex',
      label: 'Dexterity modifier',
      value: effectiveDex,
      operation: 'add',
      details: { dexMod, dexCap: dexCap ?? null },
    });
  } else {
    // Unarmored: full Dex, no cap.
    terms.push({
      key: 'dex',
      label: 'Dexterity modifier',
      value: dexMod,
      operation: 'add',
      details: { dexMod, dexCap: null },
    });
  }

  terms.push({
    key: 'proficiency',
    label: 'Proficiency',
    value: proficiencyBonus,
    operation: 'add',
  });

  // CRB: a shield grants its bonus only while raised (the Raise a Shield
  // action); holding an equipped shield grants nothing by itself.
  if (shield?.raised) {
    terms.push({
      key: 'shield',
      label: 'Raised shield',
      value: shield.shieldBonus!,
      operation: 'add',
    });
  }

  return { total: foldAcTerms(terms), terms };
}

export function computePf2eAC(
  dexScore: number,
  proficiencyBonus: number,
  equipment: Array<ArmorEquipItem>
): number {
  return computePf2eACBreakdown(dexScore, proficiencyBonus, equipment).total;
}
