import type { ContributionLedgerResult } from '../../types/core/contributionLedger';
import type { CharacterDocument } from '../../types/core/document';
import { collectPf2eConditionEffects, resolveCharacterLedger } from '../../rules';
import type { Pf2eDataModel } from './data-model';

/**
 * Non-persisted contribution ledger for Pathfinder 2e. PF2e previously had NO
 * ledger builder; this one re-backs onto the shared resolver through the W4 seam
 * (`resolveCharacterLedger`), mirroring `buildDnd5eContributionLedger` and
 * `buildD20LegacyContributionLedger`.
 *
 * It feeds the resolver the SAME equipped-items + feat/feature inputs the engine
 * uses for its derived AC (RFC 003) AND the active PF2e status conditions (the W5
 * fold): frightened/sickened penalize every check, clumsy/enfeebled/drained/
 * stupefied penalize their ability-scoped checks, and the resolver's `pf2e-status`
 * bucket keeps only the single worst penalty per target — exactly what
 * `getPf2eConditionStatusPenalty` computes, now surfaced as first-class provenance
 * instead of an opaque inline subtraction.
 *
 * These rows are EXPLANATION only — never stored on the document, never an
 * alternate state source. Additive by construction: a PF2e character with no
 * bonus-bearing gear, feats, features or value-bearing conditions yields no rows.
 */
export function buildPf2eContributionLedger(
  document: CharacterDocument<Pf2eDataModel>
): ContributionLedgerResult {
  const system = document.system;
  return resolveCharacterLedger('pf2e', {
    equipment: system.equipment.filter((item) => item.equipped),
    feats: system.feats,
    features: system.features,
    conditions: collectPf2eConditionEffects(system.conditions),
  });
}
