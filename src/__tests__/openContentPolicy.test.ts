import { describe, expect, it } from 'vitest';
import {
  extractSourceAttribution,
  filterOpenContentBySource,
  isOpenContentCompliant,
  type OpenContentCategory,
} from '../utils/openContentPolicy';
import type { GameSystemId } from '../types/game-systems';

describe('openContentPolicy', () => {
  it('extracts source attribution from supported shapes', () => {
    expect(extractSourceAttribution({ source: ' SRD 5.1 ' })).toBe('SRD 5.1');
    expect(extractSourceAttribution({ source: { book: 'Core Rulebook' } })).toBe('Core Rulebook');
    expect(extractSourceAttribution({ source: { name: 'CRB' } })).toBe('CRB');
    expect(extractSourceAttribution({ sourceBook: { name: "Hero's Handbook" } })).toBe(
      "Hero's Handbook"
    );
  });

  it('returns null when source attribution is missing or invalid', () => {
    expect(extractSourceAttribution(null)).toBeNull();
    expect(extractSourceAttribution({})).toBeNull();
    expect(extractSourceAttribution({ source: { book: '' } })).toBeNull();
  });

  it('validates compliant and non-compliant source values', () => {
    const compliantItem = { source: '  System   Reference Document 5.2  ' };
    const nonCompliantItem = { source: 'Player Companion' };

    expect(isOpenContentCompliant('dnd-5e-2024', 'spells', compliantItem)).toBe(true);
    expect(isOpenContentCompliant('dnd-5e-2024', 'spells', nonCompliantItem)).toBe(false);
  });

  it('rejects missing source when category does not allow missing attribution', () => {
    expect(isOpenContentCompliant('pf2e', 'feats', { id: 'feat-1' })).toBe(false);
  });

  it('rejects closed-book citations for dnd-3.5e', () => {
    expect(isOpenContentCompliant('dnd-3.5e', 'feats', { source: 'SRD 3.5' })).toBe(true);
    expect(isOpenContentCompliant('dnd-3.5e', 'feats', { source: 'PHB' })).toBe(false);
    expect(isOpenContentCompliant('dnd-3.5e', 'feats', { source: 'PHB 3.5' })).toBe(false);
    expect(isOpenContentCompliant('dnd-3.5e', 'feats', { source: "Player's Handbook 3.5" })).toBe(
      false
    );
  });

  it('checks nested subrace sources for species when present', () => {
    const compliantSpecies = {
      source: 'SRD 5.1',
      subraces: [{ id: 'high-elf', source: 'SRD 5.1' }],
    };
    const speciesWithClosedSubrace = {
      source: 'SRD 5.1',
      subraces: [
        { id: 'high-elf', source: 'SRD 5.1' },
        { id: 'wood-elf', source: 'PHB' },
      ],
    };
    const speciesWithUnsourcedSubrace = {
      source: 'SRD 5.1',
      subraces: [{ id: 'high-elf' }],
    };

    expect(isOpenContentCompliant('dnd-5e-2014', 'species', compliantSpecies)).toBe(true);
    expect(isOpenContentCompliant('dnd-5e-2014', 'species', speciesWithClosedSubrace)).toBe(false);
    // Subrace attribution is only enforced when present.
    expect(isOpenContentCompliant('dnd-5e-2014', 'species', speciesWithUnsourcedSubrace)).toBe(
      true
    );
    // Nested checks only apply to the species category.
    expect(
      isOpenContentCompliant('dnd-5e-2014', 'feats', {
        source: 'SRD 5.1',
        subraces: [{ id: 'x', source: 'PHB' }],
      })
    ).toBe(true);
  });

  it('filters arrays to compliant content only', () => {
    const items = [
      { id: 'a', source: 'SRD 5.1' },
      { id: 'b', source: 'Unearthed Arcana' },
      { id: 'c', source: { book: 'System Reference Document 5.1' } },
      { id: 'd' },
    ];

    const filtered = filterOpenContentBySource('dnd-5e-2014', 'spells', items);
    expect(filtered.map((item) => item.id)).toEqual(['a', 'c']);
  });

  it('works across all declared systems and categories without throwing', () => {
    const systems: GameSystemId[] = [
      'dnd-5e-2014',
      'dnd-5e-2024',
      'dnd-3.5e',
      'pf1e',
      'pf2e',
      'mam3e',
    ];

    const categories: OpenContentCategory[] = [
      'spells',
      'classes',
      'species',
      'backgrounds',
      'monsters',
      'equipment',
      'feats',
      'powers',
      'advantages',
      'archetypes',
      'complications',
      'powerModifiers',
    ];

    for (const system of systems) {
      for (const category of categories) {
        expect(() => isOpenContentCompliant(system, category, { source: 'SRD' })).not.toThrow();
      }
    }
  });
});
