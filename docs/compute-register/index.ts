/**
 * Aggregated compute registers (Denominator B). The roadmap metric imports this
 * to compute per-system engine-math completeness (verified / in-scope). Systems
 * are added here as their registers are authored.
 */

import type { ManifestSystemId } from '../srd-manifest/types';
import type { SystemComputeRegister } from './types';
import { dnd5e2014ComputeRegister } from './dnd5e-2014';
import { dnd5e2024ComputeRegister } from './dnd5e-2024';
import { dnd35eComputeRegister } from './dnd35e';
import { pf1eComputeRegister } from './pf1e';
import { mam3eComputeRegister } from './mam3e';
import { pf2eComputeRegister } from './pf2e';
import { daggerheartComputeRegister } from './daggerheart';

export const COMPUTE_REGISTERS: SystemComputeRegister[] = [
  dnd5e2014ComputeRegister,
  dnd5e2024ComputeRegister,
  dnd35eComputeRegister,
  pf1eComputeRegister,
  mam3eComputeRegister,
  pf2eComputeRegister,
  daggerheartComputeRegister,
];

export function registerForSystem(systemId: ManifestSystemId): SystemComputeRegister | undefined {
  return COMPUTE_REGISTERS.find((r) => r.systemId === systemId);
}

export * from './types';
