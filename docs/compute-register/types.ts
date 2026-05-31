/**
 * Compute Register — DENOMINATOR B (engine math).
 *
 * Engine math is NOT a property of a content type — it is a cross-cutting
 * resolution layer. One content entry (e.g. a Barbarian) feeds many derived
 * quantities (Unarmored Defense AC, Rage damage scaling, Extra Attack count,
 * Brutal Critical dice, multiclass slot contribution). The bugs live in the
 * interactions, so the denominator for "verified engine math" is a per-system
 * register of every derived quantity the rules define — indexed by
 * (system x quantity), NOT by content type.
 *
 * Completeness for a system's compute slice is `verified / inScopeQuantities`,
 * where `verified` means a unit test proves the formula (including its edge
 * cases) AND its stacking/typing rules, and representative content entries are
 * pushed through the quantities they feed (the content x compute cross-product).
 *
 * Authoring rules (mirror the goal):
 *   - CITED, NEVER INVENTED. Every quantity carries a `source` citation to the
 *     SRD rule it encodes. If a formula cannot be verified, mark it `flagged`.
 *   - Per-system divergence is first-class. Do NOT collapse systems into a
 *     5e-shaped template: BAB/iteratives (3.5e/PF1e), proficiency=rank+level
 *     (PF2e), Power-Level caps (M&M), damage thresholds (Daggerheart) each get
 *     their own entries.
 */

import type { ManifestSystemId } from '../srd-manifest/types';

export type { ManifestSystemId };

/**
 * The ten computation layers enumerated by the goal's Denominator B.
 *   L1 ability & proficiency foundation      L6  movement & physical
 *   L2 defenses (AC/saves/DCs)               L7  resources & progression
 *   L3 offense (attack/damage/maneuvers)     L8  active-play state
 *   L4 skills & derived checks               L9  build-legality & budgets
 *   L5 spellcasting economy                  L10 encounter & economy
 */
export type ComputeLayer = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10';

/**
 * Per-quantity status.
 *   - `verified`    : formula + edge cases + stacking/typing covered by a test
 *                     (referenced by `testRef`); counts toward numerator.
 *   - `implemented` : engine computes it, but it is not yet test-pinned to the
 *                     register's edge cases. In scope; not yet "done".
 *   - `missing`     : the rules define it; the engine does not compute it yet.
 *   - `flagged`     : could not verify the rule from an open source; excluded.
 *   - `excluded`    : intentionally out of scope (see _exclusions); excluded.
 */
export type ComputeEntryStatus = 'verified' | 'implemented' | 'missing' | 'flagged' | 'excluded';

export interface ComputeRegisterEntry {
  /** Stable id, e.g. "dnd5e.L2.ac.unarmored-defense.barbarian". */
  id: string;
  layer: ComputeLayer;
  /** Human-readable derived quantity, e.g. "Unarmored Defense AC (Barbarian)". */
  quantity: string;
  /** The RAW formula, e.g. "10 + Dex mod + Con mod". */
  formula: string;
  inputs: string[];
  /** Edge cases the test must exercise, e.g. "no shield", "with shield". */
  edgeCases: string[];
  /** Typed-bonus / stacking rules, e.g. "dodge bonuses stack; others do not". */
  stacking?: string;
  /** System-specific exceptions to the base formula. */
  exceptions?: string[];
  /** Citation to the SRD rule, e.g. "D&D 5e SRD 5.1: Barbarian, Unarmored Defense". */
  source: string;
  status: ComputeEntryStatus;
  /** `path::test name` proving the quantity; required when status is `verified`. */
  testRef?: string;
  /** Required when status is `flagged` or `excluded`: why. */
  note?: string;
}

export interface SystemComputeRegister {
  systemId: ManifestSystemId;
  /** Open-content edition the formulas are cited against, e.g. "SRD 5.1". */
  srdVersion: string;
  entries: ComputeRegisterEntry[];
}

/** A quantity counts toward the denominator unless flagged or excluded. */
export function isInScope(entry: ComputeRegisterEntry): boolean {
  return (
    entry.status === 'verified' || entry.status === 'implemented' || entry.status === 'missing'
  );
}

/** Denominator (in-scope) and numerator (verified) counts for one layer. */
export function layerProgress(
  register: SystemComputeRegister,
  layer: ComputeLayer
): { denominator: number; numerator: number } {
  const inLayer = register.entries.filter((e) => e.layer === layer);
  return {
    denominator: inLayer.filter(isInScope).length,
    numerator: inLayer.filter((e) => e.status === 'verified').length,
  };
}
