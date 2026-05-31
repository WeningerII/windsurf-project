/**
 * Content denominator for D&D 5e (2024) — cited against SRD 5.2.
 * Scope bounded by src/utils/openContentPolicy.ts (allowedSources for
 * 'dnd-5e-2024' = SRD 5.2). Same join-based measurement as the 2014 manifest.
 * Includes the categories whose SRD 5.2 denominator is unambiguous and fully
 * encoded (12 classes, 9 species); large catalogs are deferred until sourced.
 */

import type { SystemManifest } from './types';

const SRD = 'SRD 5.2';

export const dnd5e2024Manifest: SystemManifest = {
  systemId: 'dnd-5e-2024',
  srdVersion: SRD,
  entries: [
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

export default dnd5e2024Manifest;
