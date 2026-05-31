/**
 * Content denominator for D&D 5e (2014) — cited against SRD 5.1.
 *
 * Scope is bounded by src/utils/openContentPolicy.ts (allowedSources for
 * 'dnd-5e-2014' = SRD 5.1). Completeness for a category is measured by the
 * metric as `loader ids ∩ manifest ids` over in-scope manifest entries, so a
 * wrong/absent id surfaces as a real gap rather than a self-asserted 100%.
 *
 * Categories included so far are the ones whose SRD 5.1 denominator is
 * unambiguous and fully encoded: all 12 classes (each with its single SRD
 * subclass) and all 9 SRD races. Large catalogs (spells, feats, equipment,
 * monsters, backgrounds) are deferred until their full open-content denominator
 * is sourced and cited; they are intentionally absent here rather than asserted.
 */

import type { SystemManifest } from './types';

const SRD = 'SRD 5.1';

export const dnd5e2014Manifest: SystemManifest = {
  systemId: 'dnd-5e-2014',
  srdVersion: SRD,
  entries: [
    // --- Classes (SRD 5.1 contains all 12 PHB classes) ---
    { id: 'barbarian', category: 'classes', name: 'Barbarian', source: SRD, status: 'encoded' },
    { id: 'bard', category: 'classes', name: 'Bard', source: SRD, status: 'encoded' },
    { id: 'cleric', category: 'classes', name: 'Cleric', source: SRD, status: 'encoded' },
    { id: 'druid', category: 'classes', name: 'Druid', source: SRD, status: 'encoded' },
    { id: 'fighter', category: 'classes', name: 'Fighter', source: SRD, status: 'encoded' },
    { id: 'monk', category: 'classes', name: 'Monk', source: SRD, status: 'encoded' },
    { id: 'paladin', category: 'classes', name: 'Paladin', source: SRD, status: 'encoded' },
    { id: 'ranger', category: 'classes', name: 'Ranger', source: SRD, status: 'encoded' },
    { id: 'rogue', category: 'classes', name: 'Rogue', source: SRD, status: 'encoded' },
    { id: 'sorcerer', category: 'classes', name: 'Sorcerer', source: SRD, status: 'encoded' },
    { id: 'warlock', category: 'classes', name: 'Warlock', source: SRD, status: 'encoded' },
    { id: 'wizard', category: 'classes', name: 'Wizard', source: SRD, status: 'encoded' },

    // --- Species / Races (SRD 5.1 contains exactly these 9) ---
    { id: 'dragonborn', category: 'species', name: 'Dragonborn', source: SRD, status: 'encoded' },
    { id: 'dwarf', category: 'species', name: 'Dwarf', source: SRD, status: 'encoded' },
    { id: 'elf', category: 'species', name: 'Elf', source: SRD, status: 'encoded' },
    { id: 'gnome', category: 'species', name: 'Gnome', source: SRD, status: 'encoded' },
    { id: 'half-elf', category: 'species', name: 'Half-Elf', source: SRD, status: 'encoded' },
    { id: 'half-orc', category: 'species', name: 'Half-Orc', source: SRD, status: 'encoded' },
    { id: 'halfling', category: 'species', name: 'Halfling', source: SRD, status: 'encoded' },
    { id: 'human', category: 'species', name: 'Human', source: SRD, status: 'encoded' },
    { id: 'tiefling', category: 'species', name: 'Tiefling', source: SRD, status: 'encoded' },
  ],
};

export default dnd5e2014Manifest;
