/**
 * Content denominator for Pathfinder 2e — cited against the Core Rulebook (OGC).
 * Scope bounded by src/utils/openContentPolicy.ts. Same join-based measurement
 * as the 5e manifests (manifest ids ∩ loader ids).
 *
 * Included categories are the ones whose CRB denominator is small, canonical,
 * and unambiguous: the 12 CRB classes and the 6 CRB core ancestries (heritages
 * such as half-elf/half-orc are not separate ancestries in the CRB). Large
 * catalogs (spells, feats, equipment, backgrounds, monsters) are deferred until
 * an authoritative open-content index is available to cite, rather than
 * asserted from the loader (which would be a self-confirming denominator).
 */

import type { SystemManifest } from './types';

const CRB = 'PF2e Core Rulebook (OGC)';

export const pf2eManifest: SystemManifest = {
  systemId: 'pf2e',
  srdVersion: CRB,
  entries: [
    // --- Classes (CRB: exactly 12) ---
    { id: 'alchemist', category: 'classes', name: 'Alchemist', source: CRB, status: 'encoded' },
    { id: 'barbarian', category: 'classes', name: 'Barbarian', source: CRB, status: 'encoded' },
    { id: 'bard', category: 'classes', name: 'Bard', source: CRB, status: 'encoded' },
    { id: 'champion', category: 'classes', name: 'Champion', source: CRB, status: 'encoded' },
    { id: 'cleric', category: 'classes', name: 'Cleric', source: CRB, status: 'encoded' },
    { id: 'druid', category: 'classes', name: 'Druid', source: CRB, status: 'encoded' },
    { id: 'fighter', category: 'classes', name: 'Fighter', source: CRB, status: 'encoded' },
    { id: 'monk', category: 'classes', name: 'Monk', source: CRB, status: 'encoded' },
    { id: 'ranger', category: 'classes', name: 'Ranger', source: CRB, status: 'encoded' },
    { id: 'rogue', category: 'classes', name: 'Rogue', source: CRB, status: 'encoded' },
    { id: 'sorcerer', category: 'classes', name: 'Sorcerer', source: CRB, status: 'encoded' },
    { id: 'wizard', category: 'classes', name: 'Wizard', source: CRB, status: 'encoded' },

    // --- Ancestries (CRB core: 6) ---
    { id: 'dwarf', category: 'species', name: 'Dwarf', source: CRB, status: 'encoded' },
    { id: 'elf', category: 'species', name: 'Elf', source: CRB, status: 'encoded' },
    { id: 'gnome', category: 'species', name: 'Gnome', source: CRB, status: 'encoded' },
    { id: 'goblin', category: 'species', name: 'Goblin', source: CRB, status: 'encoded' },
    { id: 'halfling', category: 'species', name: 'Halfling', source: CRB, status: 'encoded' },
    { id: 'human', category: 'species', name: 'Human', source: CRB, status: 'encoded' },
  ],
};

export default pf2eManifest;
