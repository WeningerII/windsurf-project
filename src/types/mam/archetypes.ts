import type { Feature } from '../core/character';

/**
 * M&M 3e archetype — a REFERENCE-ONLY build template (review H-5).
 *
 * Previously typed as `CharacterClass`, which forced fabricated values: M&M
 * has no hit dice, no ability-keyed save proficiencies, and no starting gold,
 * yet every archetype carried `hitDie: 'd8'`, a save pair, and rolled wealth
 * just to satisfy required fields. This type matches the documented
 * reference-only boundary (`docs/srd-manifest/_exclusions.ts`,
 * 'mam3e.archetypes.reference-only'): pinning an archetype displays guidance
 * and does not auto-build anything.
 */
export interface Mam3eArchetype {
  id: string;
  name: string;
  system: 'mam3e';
  source: string;
  version?: string;
  lastUpdated?: string;
  sourceBook?: {
    name: string;
    page?: number;
    url?: string;
  };
  description: string;
  /** Skills the published archetype suggests training. */
  suggestedSkills?: string[];
  /** Reference build guidance, grouped the way the source presents it. */
  features: Array<{
    level: number;
    features: Feature[];
  }>;
}
