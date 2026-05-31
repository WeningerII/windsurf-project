/**
 * Aggregated compute registers (Denominator B). The roadmap metric imports this
 * to compute per-system engine-math completeness (verified / in-scope). Systems
 * are added here as their registers are authored.
 */

import type { ManifestSystemId } from '../srd-manifest/types';
import type { SystemComputeRegister } from './types';
import { dnd5e2014ComputeRegister } from './dnd5e-2014';

export const COMPUTE_REGISTERS: SystemComputeRegister[] = [dnd5e2014ComputeRegister];

export function registerForSystem(systemId: ManifestSystemId): SystemComputeRegister | undefined {
  return COMPUTE_REGISTERS.find((r) => r.systemId === systemId);
}

export * from './types';
