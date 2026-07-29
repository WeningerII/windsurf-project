import type { DamageType } from '../../types/core/common';

/**
 * Typed-damage mitigation — the L8 transform.
 *
 * WHY THIS EXISTS AT ALL. `Monster` has declared `damageResistances`,
 * `damageImmunities` and `damageVulnerabilities` since the type was written, and
 * the shipped SRD data populates them **395 times** across the seven catalogs.
 * Before this module, the only references to those three fields anywhere outside
 * `src/data/` and the tests were their own declarations in
 * `src/types/creatures/monsters.ts` — nothing read them. A fire elemental took
 * full fire damage on the grid, and a skeleton took full bludgeoning. The gap
 * was never missing data; it was a missing transform.
 *
 * WHAT IS RAW AND WHAT IS NOT. Only two sentences of the SRD are encoded here:
 *
 *   - "If a creature or an object has resistance to a damage type, damage of
 *     that type is halved against it. If a creature or an object has
 *     vulnerability to a damage type, damage of that type is doubled against
 *     it."
 *   - "Resistance and then vulnerability are applied after all other modifiers
 *     to damage."
 *
 * The both-resistant-and-vulnerable case is NOT separately stated by the SRD, so
 * it is not invented here: the second sentence fixes the ORDER, and applying that
 * order arithmetically (halve, then double) is what this module does. The net
 * result is the original amount. That is a derivation from the cited rule, not a
 * house rule, and `resolveDamageMitigation` reports it as `'none'` so the log
 * says what happened rather than implying no profile matched.
 *
 * Immunity is absolute and short-circuits both.
 *
 * ROUNDING. Halving rounds DOWN (`Math.floor`), matching the SRD's general
 * "round down" instruction for division. Doubling is exact.
 *
 * HEALING IS NOT DAMAGE. Scene damage events carry a signed `amount` where
 * negative is healing (`SceneTokenDamage`). Mitigation applies to damage only —
 * a fire-immune creature is not immune to being healed — so a negative amount is
 * returned untouched and reports `'none'`. This is the single most likely place
 * for a sign bug to hide, so it is asserted directly in the tests.
 */

/** Which branch of the transform applied. Recorded on the event so the log explains its own number. */
export type DamageMitigation = 'immune' | 'resistant' | 'vulnerable' | 'none';

/**
 * A token's standing typed-damage profile, snapshotted from its source creature
 * when the token is placed.
 *
 * SNAPSHOTTED, NOT LOOKED UP, and that is load-bearing rather than incidental.
 * RFC 006 guarantees byte-identical replay of an append-only event log. If the
 * transform resolved a monster's resistances out of `src/data/` at replay time,
 * every replay would depend on the SRD data as it exists *then* — regenerating a
 * catalog, or an owner re-tagging an entry, would silently change the outcome of
 * a scene recorded months earlier. Copying the profile onto the token makes the
 * scene self-contained.
 */
export interface DamageProfile {
  resistances?: DamageType[];
  immunities?: DamageType[];
  vulnerabilities?: DamageType[];
}

/**
 * Classify how `profile` mitigates `type`, without applying anything.
 *
 * Untyped damage (`type` undefined) is deliberately never mitigated: a profile
 * cannot match a type that was not declared, and guessing one would make the
 * pre-existing `{tokenId, amount}` events behave differently after this change
 * shipped. Every historical event is untyped, so this is what keeps replay of
 * the existing log identical.
 */
export function resolveDamageMitigation(
  profile: DamageProfile | undefined,
  type: DamageType | undefined
): DamageMitigation {
  if (!profile || !type) return 'none';

  if (profile.immunities?.includes(type)) return 'immune';

  const resistant = profile.resistances?.includes(type) ?? false;
  const vulnerable = profile.vulnerabilities?.includes(type) ?? false;

  // Both: halve then double per the cited ordering rule, which nets to the
  // original amount. Reported as 'none' because that is the honest description
  // of the arithmetic outcome.
  if (resistant && vulnerable) return 'none';
  if (resistant) return 'resistant';
  if (vulnerable) return 'vulnerable';
  return 'none';
}

/**
 * Apply a classified mitigation to a signed hit-point delta.
 *
 * Positive is damage and is mitigated; negative is healing and is returned
 * unchanged.
 */
export function applyDamageMitigation(amount: number, mitigation: DamageMitigation): number {
  if (!Number.isFinite(amount) || amount <= 0) return amount;

  switch (mitigation) {
    case 'immune':
      return 0;
    case 'resistant':
      return Math.floor(amount / 2);
    case 'vulnerable':
      return amount * 2;
    case 'none':
      return amount;
  }
}

/**
 * Copy a creature's declared typed-damage fields into a token profile, or return
 * `undefined` when it declares none.
 *
 * `undefined` rather than an empty object on purpose: a token that declares
 * nothing must serialize exactly as it did before this field existed, so scene
 * documents written by older builds and newer ones stay byte-comparable.
 *
 * The arrays are copied, not referenced. A shared reference would alias the SRD
 * catalog into every scene document, letting a consumer mutation reach back into
 * the data tables — the same hazard `cloneMarker` guards for terrain effects.
 */
export function snapshotDamageProfile(source: {
  damageResistances?: DamageType[];
  damageImmunities?: DamageType[];
  damageVulnerabilities?: DamageType[];
}): DamageProfile | undefined {
  const profile: DamageProfile = {};
  if (source.damageResistances?.length) profile.resistances = [...source.damageResistances];
  if (source.damageImmunities?.length) profile.immunities = [...source.damageImmunities];
  if (source.damageVulnerabilities?.length) {
    profile.vulnerabilities = [...source.damageVulnerabilities];
  }
  return Object.keys(profile).length > 0 ? profile : undefined;
}

/** Convenience: classify and apply in one call. Returns both so the caller can record the branch. */
export function mitigateDamage(
  amount: number,
  profile: DamageProfile | undefined,
  type: DamageType | undefined
): { amount: number; mitigation: DamageMitigation } {
  const mitigation = resolveDamageMitigation(profile, type);
  return { amount: applyDamageMitigation(amount, mitigation), mitigation };
}
