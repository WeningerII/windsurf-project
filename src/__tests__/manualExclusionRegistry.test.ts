/**
 * Guards the manual-boundary registry (docs/srd-manifest/_exclusions.ts).
 *
 * The registry's governing rule is that a system may read supportLevel 'full'
 * only when its residual gaps are enumerated there. PF2e shipped 'full' with
 * zero entries while naming a manual focus-spell surface in its own support
 * row; these assertions keep that from recurring for any system that has a
 * content denominator.
 */
import { describe, expect, it } from 'vitest';
import { MANUAL_EXCLUSIONS, exclusionsForSystem } from '../../docs/srd-manifest/_exclusions';
import type { ManifestSystemId } from '../../docs/srd-manifest/types';

/**
 * The systems this registry governs.
 *
 * This list was previously derived from `SRD_MANIFESTS`, but the per-system
 * manifests were demoted to provenance-only (`GAPS.md` §6) and their aggregating
 * index deleted — the manifests were generated FROM the loaders, so any metric
 * joining them against loaded ids was circular. Denominator A now lives in
 * `docs/generated/srd-coverage.md`.
 *
 * Naming the systems here keeps the registry's rule intact without reviving the
 * retired mechanism: a system may read supportLevel 'full' only when its residual
 * manual gaps are enumerated below.
 */
const GOVERNED_SYSTEMS: ManifestSystemId[] = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

describe('manual-boundary exclusion registry', () => {
  it('gives every governed system at least one enumerated boundary', () => {
    const uncovered = GOVERNED_SYSTEMS.filter(
      (systemId) => exclusionsForSystem(systemId).length === 0
    );

    expect(uncovered).toEqual([]);
  });

  it('keeps exclusion ids unique and system-prefixed by a governed system', () => {
    const knownSystems = new Set<string>(GOVERNED_SYSTEMS);
    const ids = MANUAL_EXCLUSIONS.map((exclusion) => exclusion.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(MANUAL_EXCLUSIONS.every((exclusion) => knownSystems.has(exclusion.systemId))).toBe(true);
  });

  it('requires a subject, a reason, and a governing decision reference on every entry', () => {
    const underspecified = MANUAL_EXCLUSIONS.filter(
      (exclusion) =>
        exclusion.subject.trim().length === 0 ||
        exclusion.reason.trim().length === 0 ||
        !exclusion.masterPlanRef.includes('MASTER_PLAN.md')
    ).map((exclusion) => exclusion.id);

    expect(underspecified).toEqual([]);
  });

  it('enumerates the PF2e boundaries its support row names', () => {
    const pf2eIds = exclusionsForSystem('pf2e').map((exclusion) => exclusion.id);

    expect(pf2eIds).toContain('pf2e.spellcasting.focus-spells');
    expect(pf2eIds).toContain('pf2e.spellcasting.manual-prepared-slots');
    expect(pf2eIds).toContain('pf2e.spellcasting.rank-10-slots');
  });
});
