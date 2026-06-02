/**
 * Damage resistance / immunity / vulnerability — the per-type adjustment every
 * system applies last, after all other damage modifiers (5e DMG p.197; the same
 * shape covers 3.5e/PF's energy resistance and immunities).
 *
 * The data the app ships expresses these as sets of damage types (a creature is
 * resistant/immune/vulnerable to a type or not), so this models the set-based
 * rule: immunity zeroes the type, vulnerability doubles it, resistance halves it
 * (rounding down). PF2e's numeric resistance/weakness would need numeric data;
 * when that exists it can extend this without changing callers.
 */

/** A target's damage defenses, as type-name sets (case-insensitive matching). */
export interface DamageDefenses {
  resistant?: readonly string[];
  immune?: readonly string[];
  vulnerable?: readonly string[];
}

/** True when the defenses carry any entry (else there's nothing to apply). */
export function hasDamageDefenses(defenses: DamageDefenses | undefined): boolean {
  if (!defenses) return false;
  return Boolean(
    defenses.resistant?.length || defenses.immune?.length || defenses.vulnerable?.length
  );
}

/**
 * Adjust one damage type's amount by the target's defenses, applied last:
 * immunity → 0, then vulnerability doubles, then resistance halves (round down).
 * Vulnerability-and-resistance to the same type therefore net out, matching the
 * "they cancel" intent. Untyped damage (empty type) is never adjusted.
 */
export function adjustTypedDamage(type: string, amount: number, defenses: DamageDefenses): number {
  if (!type) return amount;
  const needle = type.toLowerCase();
  const has = (list?: readonly string[]): boolean =>
    Boolean(list?.some((entry) => entry.toLowerCase() === needle));

  if (has(defenses.immune)) return 0;
  let result = amount;
  if (has(defenses.vulnerable)) result *= 2;
  if (has(defenses.resistant)) result = Math.floor(result / 2);
  return result;
}
