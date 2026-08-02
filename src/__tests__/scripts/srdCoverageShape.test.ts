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
  overInclusionSuspects,
  collapsePf1eContainerRecords,
  pf1eContainerRecords,
  collapse35eMonsterHeadings,
  parseSrd35eMonsterHeadings,
  SRD_35E_NON_CREATURE_STAT_SECTIONS,
  SRD_35E_MONSTER_NONBLOCK_HEADINGS,
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

/**
 * The 3.5e monster fixtures below are DERIVED FROM THE REAL DOCUMENT, not
 * imagined. `fixtures/srd35-monsters-excerpt.md` holds verbatim lines from the
 * olimot chapters covering every shape the corpus actually has.
 *
 * The fixtures these replaced listed `Astral Deva`, `Planetar`, `Solar`,
 * `Djinni`, `Efreeti`, `Young Black Dragon`, `Deinonychus` and `Gold Dragon` as
 * flat sibling `## ` headings. The SRD has never had a single one of those
 * headings — every one of them is a `### ` child (or, for the dragon age rows, a
 * table row and not a heading at all). Those tests passed against a document
 * that does not exist, which is exactly why they never noticed that the parse
 * was collecting `## ` only and so counted no demon, devil, angel, elemental,
 * genie, giant, golem, mephit, naga, ooze, sphinx, sprite, swarm or dragon.
 */
const excerpt = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/srd35-monsters-excerpt.md'),
  'utf8'
);

describe('parseSrd35eMonsterHeadings (real chapter shape)', () => {
  const parsed = parseSrd35eMonsterHeadings(excerpt);
  const byName = new Map(parsed.map((h) => [h.name, h]));

  it('collects BOTH depths — the SRD puts real stat blocks at ## and at ###', () => {
    expect(parsed.filter((h) => h.level === 2).length).toBeGreaterThan(0);
    expect(parsed.filter((h) => h.level === 3).length).toBeGreaterThan(0);
    expect(byName.get('Angel, Astral Deva')?.level).toBe(3);
    expect(byName.get('Angel, Astral Deva')?.parent).toBe('Angel');
    expect(byName.get('Black Dragon')?.parent).toBe('Chromatic Dragons');
  });

  it('marks the ### stat blocks the old ##-only parse could not see', () => {
    for (const name of ['Angel, Astral Deva', 'Angel, Planetar', 'Kolyarut', 'Marut']) {
      expect(byName.get(name)?.hasStatBlock).toBe(true);
    }
  });

  it('accepts <td> label cells — Kolyarut and Lemure are real blocks with <td>, not <th>', () => {
    expect(excerpt).toMatch(/<td>Hit Dice:<\/td>/);
    expect(byName.get('Kolyarut')?.hasStatBlock).toBe(true);
    expect(byName.get('Marut')?.hasStatBlock).toBe(true);
  });

  it("accepts the dragons' by-age table header — the only Hit Dice cell any dragon has", () => {
    expect(excerpt).toMatch(/<th>Hit Dice \(hp\)<\/th>/);
    expect(byName.get('Black Dragon')?.hasStatBlock).toBe(true);
  });

  it('does NOT treat the words "Hit Dice" in prose as a stat block', () => {
    // "A barghest that reaches 9 Hit Dice through feeding becomes a greater
    // barghest" — verbatim prose under a heading that owns no table.
    expect(byName.get('Greater Barghest')?.hasStatBlock).toBe(false);
    expect(byName.get('Creating a Ghost')?.hasStatBlock).toBe(false);
  });

  it('gives a prose container no stat block of its own, even though its children have one', () => {
    for (const container of [
      'Angel',
      'Chromatic Dragons',
      'Inevitable',
      'Skeleton',
      'Zombie',
      'Horse',
    ]) {
      expect(byName.get(container)?.hasStatBlock).toBe(false);
    }
  });

  it('gives all THREE non-creature sections the stat table they really own', () => {
    // Load-bearing, and the reason this fixture was rebuilt: the exclusion in
    // SRD_35E_NON_CREATURE_STAT_SECTIONS only has anything to do iff these
    // sections DO print a stat table. If a fixture gives them none, the
    // exclusion never fires and the constant is tested vacuously.
    for (const { parent, name } of SRD_35E_NON_CREATURE_STAT_SECTIONS) {
      const heading = parsed.find((h) => h.name === name && h.parent === parent);
      expect(heading, `${parent} :: ${name} missing from the fixture`).toBeDefined();
      expect(heading?.hasStatBlock, `${parent} :: ${name} must own a stat table`).toBe(true);
    }
  });
});

describe('collapse35eMonsterHeadings (3.5e SRD monster denominator shape)', () => {
  const result = collapse35eMonsterHeadings(parseSrd35eMonsterHeadings(excerpt));

  it('counts the ### members of every taxonomic group', () => {
    expect(result).toEqual(
      expect.arrayContaining(['Angel, Astral Deva', 'Angel, Planetar', 'Kolyarut', 'Marut'])
    );
  });

  it('counts the dragons, which have no ## heading anywhere in the SRD', () => {
    expect(result).toContain('Black Dragon');
  });

  it('drops a prose ## container once a ### child was counted under it', () => {
    for (const container of ['Angel', 'Chromatic Dragons', 'Inevitable']) {
      expect(result).not.toContain(container);
    }
  });

  it('keeps a ## that owns a COMBINED multi-column table as one stat block', () => {
    // One table, several named variants — Salamander/Hydra/Fungus/Arrowhawk/
    // Animated Object, and Formian, whose five castes share the `##` table while
    // its `###` caste sections own none. Formian was on the old hand-maintained
    // container list, so it left the denominator entirely.
    expect(result).toContain('Formian');
    expect(result).toContain('Salamander');
    expect(result).toContain('Aboleth');
    expect(result).toContain('Barghest');
  });

  it('counts a prose ### exactly zero times', () => {
    expect(result).not.toContain('Combat');
    expect(result).not.toContain('Greater Barghest');
    expect(result).not.toContain('Creating a Ghost');
  });

  it('excludes the three stat-table ### sections that are not creatures', () => {
    for (const { name } of SRD_35E_NON_CREATURE_STAT_SECTIONS) {
      expect(result).not.toContain(name);
    }
    expect(SRD_35E_NON_CREATURE_STAT_SECTIONS.map((s) => `${s.parent}/${s.name}`)).toEqual([
      'Skeleton/Creating a Skeleton',
      'Zombie/Creating a Zombie',
      'Horse/Combat',
    ]);
    // Every one of them names its reason — the exclusion is an argument, not a
    // list, and this is the defect's alibi comment being made falsifiable.
    for (const s of SRD_35E_NON_CREATURE_STAT_SECTIONS) {
      expect(s.reason.length).toBeGreaterThan(20);
    }
  });

  it('keeps the PARENT of an excluded section, so the creature is not lost', () => {
    // `## Horse`, `## Skeleton` and `## Zombie` own no table; their only
    // stat-table child is excluded. This is the step-1-before-step-3 ordering:
    // the child is removed BEFORE containers are derived, so the parent is left
    // with no counted child and stays counted itself. Dropping them as
    // containers would delete three real creatures from the denominator.
    for (const { parent } of SRD_35E_NON_CREATURE_STAT_SECTIONS) {
      expect(result, `${parent} must survive its excluded child`).toContain(parent);
    }
    expect(result).toEqual(expect.arrayContaining(['Horse', 'Skeleton', 'Zombie']));
  });

  it('drops the non-creature prose and template ## headings', () => {
    for (const dropped of ['Dragon, True', 'Half-Celestial']) {
      expect(result).not.toContain(dropped);
    }
    expect(SRD_35E_MONSTER_NONBLOCK_HEADINGS).toEqual(
      expect.arrayContaining(['Reading the Entries', 'Combat', 'Dragon, True'])
    );
  });

  it('still counts Ghost as a genuine miss rather than hiding it', () => {
    // `## Ghost` has no stat table and no counted child, so a purely structural
    // rule would drop it — along with Lich, Vampire and Half-Dragon. Four real
    // gaps would vanish and the percentage would improve. They stay counted.
    expect(result).toContain('Ghost');
    for (const kept of ['Ghost', 'Lich', 'Vampire', 'Half-Dragon']) {
      expect(SRD_35E_MONSTER_NONBLOCK_HEADINGS).not.toContain(kept);
    }
  });

  it('has no age/size fold, because the SRD has no age/size HEADINGS', () => {
    // The deleted `SRD_35E_VARIANT_WORDS`/`foldMonsterVariant` pair matched zero
    // of the 239 `## ` headings AND zero of the 432 `### ` headings. The four
    // headings it would have touched — "Greater Barghest", "Greater Stone
    // Golem", "Elder Black Pudding", "Greater Shadow" — are prose sections that
    // own no stat table, so folding them would have collided a non-entry onto a
    // real one. Dragon ages and elemental sizes live in table ROWS.
    expect(excerpt).not.toMatch(/^#{2,3} (Young|Adult|Ancient|Large|Huge) /m);
    expect(result.filter((n) => n === 'Barghest')).toHaveLength(1);
  });
});

describe('the REAL pinned 3.5e monster denominator (networked artifact, not a fixture)', () => {
  // The strongest guard available offline: `srd-overinclusion-manifest.json` is
  // written by the NETWORKED `npm run srd:overinclusion:write` from exactly the
  // sources srd-coverage.ts cites. A fixture can describe an imaginary document;
  // this cannot. Every assertion here is a fact about the shipped denominator.
  const manifestPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../scripts/data/srd-overinclusion-manifest.json'
  );
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    denominators: Record<string, { names: string[] }>;
  };
  const names = manifest.denominators['dnd-3.5e/monsters'].names;

  it('contains the group members that the ##-only parse omitted entirely', () => {
    expect(names).toEqual(
      expect.arrayContaining([
        'Balor', // Demon
        'Pit Fiend', // Devil
        'Djinni', // Genie
        'Air Elemental', // Elemental
        'Deinonychus', // Dinosaur
        'Dire Bear', // Dire Animal
        'Iron Golem', // Golem
        'Pixie', // Sprite
        'Formian', // combined-table ## wrongly dropped as a container
      ])
    );
  });

  it('contains all ten true dragons', () => {
    for (const dragon of [
      'Black Dragon',
      'Blue Dragon',
      'Green Dragon',
      'Red Dragon',
      'White Dragon',
      'Brass Dragon',
      'Bronze Dragon',
      'Copper Dragon',
      'Gold Dragon',
      'Silver Dragon',
    ]) {
      expect(names).toContain(dragon);
    }
  });

  it('contains no taxonomic container and none of the three non-creature sections', () => {
    for (const container of [
      'Angel',
      'Demon',
      'Devil',
      'Genie',
      'Elemental',
      'Chromatic Dragons',
      'Metallic Dragons',
      'Swarm',
      'Snake',
    ]) {
      expect(names).not.toContain(container);
    }
    for (const { name } of SRD_35E_NON_CREATURE_STAT_SECTIONS) expect(names).not.toContain(name);
    for (const nonBlock of SRD_35E_MONSTER_NONBLOCK_HEADINGS) expect(names).not.toContain(nonBlock);
  });

  it('is the post-fix denominator, not the deflated one', () => {
    // 207 was the `## `-only count. 332 = 208 stat-block `## ` headings + 124
    // stat-block `### ` sections (117 `Hit Dice:` + 10 by-age dragons - 3
    // non-creature exclusions).
    expect(names.length).toBe(332);
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

describe('overInclusionSuspects (reverse-diff symmetry with the coverage pass)', () => {
  // The SRD side of the diff, built exactly as srd-coverage main() does.
  const srdKeys = new Set(
    ['Magic Initiate', 'Archery', 'Invisibility, Greater', 'Fireball'].flatMap(srdNormVariants)
  );

  it('clears qualifier-named loader variants against their SRD base', () => {
    // The 2024 feat variants from docs/GAPS.md: parenthetical option + "Prefix: "
    // forms whose stripped base IS in the SRD must NOT print as suspects.
    const loader = [
      'Magic Initiate (Cleric)',
      'Magic Initiate (Druid)',
      'Magic Initiate (Wizard)',
      'Fighting Style: Archery',
    ];
    expect(overInclusionSuspects(loader, srdKeys)).toEqual([]);
  });

  it('clears a confirmed qualifier word-order variant', () => {
    // Loader "Greater Invisibility" vs SRD "Invisibility, Greater".
    expect(overInclusionSuspects(['Greater Invisibility'], srdKeys)).toEqual([]);
  });

  it('still flags a genuinely non-SRD loader entry', () => {
    // "Greater Fireball" has no SRD counterpart (SRD only has plain "Fireball"),
    // and "Hex" is absent entirely — both must remain suspects.
    expect(overInclusionSuspects(['Greater Fireball', 'Hex'], srdKeys)).toEqual([
      'Greater Fireball',
      'Hex',
    ]);
  });

  it('is symmetric with the forward coverage pass on the same fixture', () => {
    // A loader entry cleared as a suspect here must also be countable as covering
    // its SRD base in the forward direction (loaderNormVariants ∩ SRD plain norm).
    const loaderSet = new Set(loaderNormVariants('Magic Initiate (Cleric)'));
    expect(loaderSet.has(norm('Magic Initiate'))).toBe(true);
    expect(overInclusionSuspects(['Magic Initiate (Cleric)'], srdKeys)).toEqual([]);
  });
});
