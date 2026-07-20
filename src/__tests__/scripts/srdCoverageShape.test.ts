/**
 * Unit coverage for the PURE SRD-coverage shape helpers
 * (`src/scripts/srdCoverageShape.ts`). These prove the denominator/normalization
 * LOGIC offline — no network, no `srd-coverage` `main()` — so the fix is
 * verifiable independently of a networked coverage run (whose refreshed
 * published percentages are produced at integration).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  norm,
  qualifierOrderVariants,
  loaderNormVariants,
  srdNormVariants,
  collapsePf1eContainerRecords,
  pf1eContainerRecords,
  collapse35eMonsterHeadings,
  SRD_35E_MONSTER_CATEGORY_HEADINGS,
} from '../../scripts/srdCoverageShape';

describe('collapsePf1eContainerRecords (PF1e bestiary container collapse)', () => {
  // Two dragon parents (3 age children each), one elemental parent (6 sizes),
  // single-child pairs that MUST survive, and a genuine miss with no children.
  const fixture = [
    'Aboleth',
    'Barghest',
    'Barghest, Greater',
    'Shadow',
    'Shadow, Greater',
    'Werewolf',
    'Werewolf (Hybrid Form)',
    'Dragon, Chromatic, Black',
    'Dragon, Chromatic, Black, Young',
    'Dragon, Chromatic, Black, Adult',
    'Dragon, Chromatic, Black, Ancient',
    'Dragon, Metallic, Gold',
    'Dragon, Metallic, Gold, Young',
    'Dragon, Metallic, Gold, Adult',
    'Dragon, Metallic, Gold, Ancient',
    'Elemental, Air',
    'Elemental, Air, Small',
    'Elemental, Air, Medium',
    'Elemental, Air, Large',
    'Elemental, Air, Huge',
    'Elemental, Air, Greater',
    'Elemental, Air, Elder',
    'Skeletal Champion',
  ];

  it('removes exactly the dragon/elemental parent CONTAINER records', () => {
    expect(pf1eContainerRecords(fixture)).toEqual([
      'Dragon, Chromatic, Black',
      'Dragon, Metallic, Gold',
      'Elemental, Air',
    ]);
  });

  it('keeps the age/size variants as individual stat blocks', () => {
    const kept = collapsePf1eContainerRecords(fixture);
    expect(kept).toContain('Dragon, Chromatic, Black, Young');
    expect(kept).toContain('Dragon, Chromatic, Black, Ancient');
    expect(kept).toContain('Dragon, Metallic, Gold, Adult');
    expect(kept).toContain('Elemental, Air, Small');
    expect(kept).toContain('Elemental, Air, Elder');
  });

  it('preserves single-child pairs and (comma boundary) parenthetical forms', () => {
    const kept = collapsePf1eContainerRecords(fixture);
    // Barghest / Shadow have exactly one comma-child — both remain individuals.
    expect(kept).toEqual(expect.arrayContaining(['Barghest', 'Barghest, Greater']));
    expect(kept).toEqual(expect.arrayContaining(['Shadow', 'Shadow, Greater']));
    // "Werewolf (Hybrid Form)" is not a comma-descendant of "Werewolf".
    expect(kept).toEqual(expect.arrayContaining(['Werewolf', 'Werewolf (Hybrid Form)']));
  });

  it('preserves a genuine missing individual (no descendants)', () => {
    expect(collapsePf1eContainerRecords(fixture)).toContain('Skeletal Champion');
  });

  it('collapses the REAL pinned manifest to exactly its 14 dragon/elemental parents, keeping Skeletal Champion', () => {
    const manifestPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../scripts/data/pf1e-bestiary-manifest.json'
    );
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      entries: Array<{ name: string }>;
    };
    const names = manifest.entries.map((e) => e.name);
    const containers = pf1eContainerRecords(names);

    expect(containers).toHaveLength(14);
    // 10 dragon parents + 4 elemental parents, nothing else.
    expect(containers.filter((n) => n.startsWith('Dragon,'))).toHaveLength(10);
    expect(containers.filter((n) => n.startsWith('Elemental,'))).toHaveLength(4);
    expect(containers).toContain('Dragon, Chromatic, Black');
    expect(containers).toContain('Elemental, Air');

    const collapsed = collapsePf1eContainerRecords(names);
    expect(collapsed).toHaveLength(names.length - 14);
    // The genuine miss stays; the containers are gone.
    expect(collapsed).toContain('Skeletal Champion');
    expect(collapsed).not.toContain('Dragon, Chromatic, Black');
    expect(collapsed).not.toContain('Elemental, Water');
    // Barghest and its single Greater variant both survive as individuals.
    expect(collapsed).toEqual(expect.arrayContaining(['Barghest', 'Barghest, Greater']));
  });
});

describe('collapse35eMonsterHeadings (3.5e SRD monster denominator shape)', () => {
  const headings = [
    'Aboleth',
    'Angel', // category container
    'Astral Deva', // member — individual
    'Planetar',
    'Solar',
    'Genie', // category container
    'Djinni',
    'Efreeti',
    'Elemental', // category container
    'Small Air Elemental', // size variants → fold to "Air Elemental"
    'Large Air Elemental',
    'Huge Air Elemental',
    'Dragon', // category container
    'Young Black Dragon', // age variants → fold to "Black Dragon"
    'Adult Black Dragon',
    'Ancient Black Dragon',
    'Young Adult Red Dragon', // multi-word age → "Red Dragon"
    'Giant', // category container
    'Golem', // category container
    'Bear, Black', // genus,species — NOT a variant, must survive intact
    'Dire Bear', // "Dire" not a variant word — survives
    'Salamander', // genuine miss individual
    'Hydra',
    'Lich',
    'Ghost',
  ];

  const result = collapse35eMonsterHeadings(headings);

  it('drops every taxonomic category container header', () => {
    for (const category of ['Angel', 'Genie', 'Elemental', 'Dragon', 'Giant', 'Golem']) {
      expect(result).not.toContain(category);
    }
  });

  it('keeps separately-named category members as individuals', () => {
    expect(result).toEqual(
      expect.arrayContaining(['Astral Deva', 'Planetar', 'Solar', 'Djinni', 'Efreeti'])
    );
  });

  it('folds age variants to one archetype per creature', () => {
    expect(result).toContain('Black Dragon');
    expect(result.filter((n) => n === 'Black Dragon')).toHaveLength(1);
    expect(result).not.toContain('Young Black Dragon');
    expect(result).not.toContain('Adult Black Dragon');
    expect(result).toContain('Red Dragon');
  });

  it('folds elemental size variants to one archetype', () => {
    expect(result.filter((n) => n === 'Air Elemental')).toHaveLength(1);
    expect(result).not.toContain('Large Air Elemental');
  });

  it('never folds a genus/species comma or a non-variant descriptor', () => {
    expect(result).toContain('Bear, Black');
    expect(result).toContain('Dire Bear');
  });

  it('preserves confirmed genuine misses as individual stat blocks', () => {
    expect(result).toEqual(expect.arrayContaining(['Salamander', 'Hydra', 'Lich', 'Ghost']));
  });

  it('never lists a genuine individual (Salamander/Hydra) as a category container', () => {
    const cats = SRD_35E_MONSTER_CATEGORY_HEADINGS.map(norm);
    for (const individual of ['Salamander', 'Hydra', 'Lich', 'Ghost']) {
      expect(cats).not.toContain(norm(individual));
    }
  });
});

describe('qualifier word-order normalization (confirmed provenance variants)', () => {
  it('maps "Greater X" and "X, Greater" to a shared key on both sides', () => {
    const loaderKeys = loaderNormVariants('Greater Invisibility');
    const srdKeys = srdNormVariants('Invisibility, Greater');
    // The loader-side variant contains the SRD plain norm (clears "missing")...
    expect(loaderKeys).toContain(norm('Invisibility, Greater'));
    // ...and the SRD-side variant contains the loader plain norm (clears suspect).
    expect(srdKeys).toContain(norm('Greater Invisibility'));
  });

  it('clears the confirmed live suspects via a simulated diff', () => {
    const pairs: Array<[string, string]> = [
      ['Greater Invisibility', 'Invisibility, Greater'],
      ['Greater Dispel Magic', 'Dispel Magic, Greater'],
      ['Greater Teleport', 'Teleport, Greater'],
      ['Mass Cure Light Wounds', 'Cure Light Wounds, Mass'],
    ];
    for (const [loaderName, srdName] of pairs) {
      const loaderSet = new Set(loaderNormVariants(loaderName));
      const srdSet = new Set(srdNormVariants(srdName));
      // Not "missing": the SRD plain norm is covered by a loader variant.
      expect(loaderSet.has(norm(srdName))).toBe(true);
      // Not an over-inclusion "suspect": the loader plain norm is in the SRD set.
      expect(srdSet.has(norm(loaderName))).toBe(true);
    }
  });

  it('returns no variant for names without a leading/trailing qualifier', () => {
    expect(qualifierOrderVariants('Fireball')).toEqual([]);
    expect(qualifierOrderVariants('Massacre')).toEqual([]); // "mass" only as a whole word
    expect(srdNormVariants('Fireball')).toEqual(['fireball']);
  });

  it('does NOT mask a genuine non-SRD entry as a variant', () => {
    // Loader ships "Greater Fireball" but the SRD only has "Fireball" (no
    // "Fireball, Greater") — it must stay a suspect, not be silently cleared.
    const srdSet = new Set(srdNormVariants('Fireball'));
    expect(srdSet.has(norm('Greater Fireball'))).toBe(false);
  });
});
