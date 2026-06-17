/**
 * Exclusion registry — the accepted manual / reference-only / non-numeric
 * boundaries that are intentionally NOT automated.
 *
 * A system may honestly read supportLevel 'full' when its ONLY residual gap is
 * contained here. These items are excluded from BOTH denominators (content and
 * compute) so the completion metric is not gamed by fake automation. Every
 * exclusion cites the governing decision in docs/MASTER_PLAN.md.
 *
 * This is a deliberate, enumerated list — NOT a place to hide unfinished work.
 * If an item could reasonably be automated within an accepted product boundary,
 * it does not belong here.
 */

import type { ManifestSystemId } from './types';

export interface ManualExclusion {
  /** Stable id, e.g. "daggerheart.domain-cards.triggered". */
  id: string;
  systemId: ManifestSystemId;
  /** What is excluded. */
  subject: string;
  /** Why it is manual / reference-only / non-numeric. */
  reason: string;
  /** Pointer to the governing decision (MASTER_PLAN section or RFC). */
  masterPlanRef: string;
}

export const MANUAL_EXCLUSIONS: ManualExclusion[] = [
  {
    id: 'daggerheart.domain-cards.triggered',
    systemId: 'daggerheart',
    subject: 'Triggered / narrative domain-card effects',
    reason:
      'Daggerheart cards are tagged triggered-manual or reference-only; only passive cards are deterministic. Non-passive card effects are GM/player adjudicated by design.',
    masterPlanRef: 'MASTER_PLAN.md: Daggerheart support — "bounded passive automation only"',
  },
  {
    id: 'daggerheart.duality.narrative',
    systemId: 'daggerheart',
    subject: 'Hope/Fear duality narrative resolution',
    reason:
      'Hope/Fear outcomes drive narrative consequences that are not reducible to a numeric derived value.',
    masterPlanRef: 'MASTER_PLAN.md: Daggerheart support',
  },
  {
    id: 'mam3e.archetypes.reference-only',
    systemId: 'mam3e',
    subject: 'Archetype application',
    reason:
      'Pinning an archetype is reference-only and does NOT auto-build powers, skills, or advantages. Documented reference-only boundary.',
    masterPlanRef: 'MASTER_PLAN.md: M&M 3e support — archetypes (reference-only)',
  },
  {
    id: 'mam3e.powers.freeform-descriptors',
    systemId: 'mam3e',
    subject: 'Freeform power descriptors',
    reason:
      'M&M power descriptors are open-ended narrative tags with no fixed mechanical effect; not a derived quantity.',
    masterPlanRef: 'MASTER_PLAN.md: M&M 3e support',
  },
  {
    id: 'dnd5e.feature-options.downstream-riders',
    systemId: 'dnd-5e-2014',
    subject: 'Feature-option downstream riders',
    reason:
      'Only ASI/proficiency automation is in scope for 5e feats/feature options; narrative or DM-adjudicated downstream riders stay manual.',
    masterPlanRef: 'MASTER_PLAN.md: D&D 5e support — feat ASI/proficiency automation',
  },
  {
    id: 'dnd5e-2024.feature-options.downstream-riders',
    systemId: 'dnd-5e-2024',
    subject: 'Feature-option downstream riders',
    reason:
      'Only ASI/proficiency automation is in scope for 5e feats/feature options; narrative or DM-adjudicated downstream riders stay manual.',
    masterPlanRef: 'MASTER_PLAN.md: D&D 5e support — feat ASI/proficiency automation',
  },
  {
    id: 'dnd-3.5e.spellcasting.manual-prepared-slots',
    systemId: 'dnd-3.5e',
    subject: 'Vancian prepared-slot assignment',
    reason:
      'All slot counts — base, casting-ability bonus, cleric domain, wizard specialist, and prestige (Dragon Disciple) bonus slots — are auto-resolved. Which specific spell a caster prepares into each slot each day is the Vancian play choice and stays manual.',
    masterPlanRef: 'MASTER_PLAN.md: D&D 3.5e support — Vancian tracked/prepared workflow',
  },
  {
    id: 'dnd-3.5e.spellcasting.spontaneous-conversion',
    systemId: 'dnd-3.5e',
    subject: 'Spontaneous cure/inflict conversion',
    reason:
      'A cleric trades a prepared spell for a cure/inflict spell at the moment of casting; this is a cast-time play choice, surfaced as a reference list rather than auto-applied.',
    masterPlanRef: 'MASTER_PLAN.md: D&D 3.5e support — spontaneous conversion reference',
  },
  {
    id: 'pf1e.spellcasting.manual-prepared-slots',
    systemId: 'pf1e',
    subject: 'Vancian prepared-slot assignment',
    reason:
      'All slot counts — base, casting-ability bonus, cleric domain, wizard specialist, and prestige (Dragon Disciple) bonus slots — are auto-resolved. Which specific spell a caster prepares into each slot each day is the Vancian play choice and stays manual.',
    masterPlanRef: 'MASTER_PLAN.md: Pathfinder 1e support — Vancian tracked/prepared workflow',
  },
  {
    id: 'pf1e.spellcasting.spontaneous-conversion',
    systemId: 'pf1e',
    subject: 'Spontaneous cure/inflict conversion',
    reason:
      'A cleric trades a prepared spell for a cure/inflict spell at the moment of casting; this is a cast-time play choice, surfaced as a reference list rather than auto-applied.',
    masterPlanRef: 'MASTER_PLAN.md: Pathfinder 1e support — spontaneous conversion reference',
  },
];

export function exclusionsForSystem(systemId: ManifestSystemId): ManualExclusion[] {
  return MANUAL_EXCLUSIONS.filter((e) => e.systemId === systemId);
}
