/**
 * Aggregated content denominators (Denominator A). The roadmap metric imports
 * this to compute per-(system x category) content completeness against the
 * loader totals. Systems are added here as their manifests are authored; a
 * system absent from this list simply has no content denominator yet (the
 * metric reports "—" rather than a fabricated percentage).
 */

import type { ManifestSystemId, SystemManifest } from './types';
import { dnd5e2014Manifest } from './dnd5e-2014';
import { dnd5e2024Manifest } from './dnd5e-2024';
import { pf2eManifest } from './pf2e';

export const SRD_MANIFESTS: SystemManifest[] = [dnd5e2014Manifest, dnd5e2024Manifest, pf2eManifest];

export function manifestForSystem(systemId: ManifestSystemId): SystemManifest | undefined {
  return SRD_MANIFESTS.find((m) => m.systemId === systemId);
}

export * from './types';
