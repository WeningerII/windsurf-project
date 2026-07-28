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
import { SRD_MANIFESTS } from '../../docs/srd-manifest';

describe('manual-boundary exclusion registry', () => {
  it('gives every manifest-carrying system at least one enumerated boundary', () => {
    const uncovered = SRD_MANIFESTS.map((manifest) => manifest.systemId).filter(
      (systemId) => exclusionsForSystem(systemId).length === 0
    );

    expect(uncovered).toEqual([]);
  });

  it('keeps exclusion ids unique and system-prefixed by a known manifest system', () => {
    const knownSystems = new Set(SRD_MANIFESTS.map((manifest) => manifest.systemId));
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
