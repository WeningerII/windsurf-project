/**
 * Shared SRD 3.5 core monster-name extraction (olimot/srd-v3.5-md chapters).
 *
 * Both the coverage denominator (src/scripts/srd-coverage.ts) and the bestiary
 * encoder (scripts/encode-35e-monsters.mjs) MUST enumerate the SRD monster
 * roster identically — otherwise the coverage percentage drifts from what the
 * encoder can actually fill. This module is the single source of that roster.
 *
 * The SRD nests many creatures: a category entry (## Demon, ## Dragon, ## Giant)
 * carries the real stat blocks as ### sub-headings (### Balor, ### Red Dragon,
 * ### Hill Giant). A naive "count every ## heading" both miscounts each category
 * as one monster AND misses every nested stat block. We instead emit:
 *   - ## headings that are themselves stat blocks (everything except the known
 *     category/template/intro headers in CATEGORY_OR_NONMONSTER_H2), and
 *   - ### headings that are stat blocks (everything except section scaffolding —
 *     Combat, Construction, "X as Characters", "Creating a X", etc.).
 * ### sub-headings of a category (### Balor under ## Demon) are thereby counted
 * in place of the category header. #### headings are stat-block field labels and
 * subrace notes (Name, Hit Dice, Drow, Duergar) — never standalone monsters — so
 * they are not emitted, matching how the repo models creatures.
 */

export const OLIMOT_MONSTER_BASE =
  'https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/monsters';

export const OLIMOT_MONSTER_FILES = [
  'monsters-intro-a.md',
  'monsters-b-c.md',
  'monsters-d-de.md',
  'monsters-di-do.md',
  'monsters-dr-dw.md',
  'monsters-e-f.md',
  'monsters-g.md',
  'monsters-h-i.md',
  'monsters-k-l.md',
  'monsters-m-n.md',
  'monsters-o-r.md',
  'monsters-s.md',
  'monsters-t-z.md',
  'monsters-animals.md',
  'monsters-vermin.md',
];

// ## headers that are NOT themselves a stat block: pure category umbrellas whose
// real creatures live in ### sub-headings, inherited-template entries (no fixed
// stat block of their own), and the chapter intro. Their ### children are still
// emitted, so denying the umbrella drops the duplicate, not the monsters.
export const CATEGORY_OR_NONMONSTER_H2 = new Set([
  'Reading the Entries',
  'Combat',
  // Type/family umbrellas (children are the stat blocks)
  'Angel',
  'Archon',
  'Demon',
  'Devil',
  'Dragon, True',
  'Chromatic Dragons',
  'Metallic Dragons',
  'Dinosaur',
  'Dire Animal',
  'Elemental',
  'Formian',
  'Fungus',
  'Genie',
  'Giant',
  'Golem',
  'Hag',
  'Inevitable',
  'Lycanthrope',
  'Mephit',
  'Naga',
  'Nightshade',
  'Ooze',
  'Sphinx',
  'Sprite',
  'Swarm',
  'Snake',
  // Templates (applied to a base creature; no intrinsic stat block)
  'Celestial Creature',
  'Fiendish Creature',
  'Half-Celestial',
  'Half-Dragon',
  'Half-Fiend',
  'Planetouched',
]);

// ### headers that are section scaffolding or an item, not a creature.
const H3_NOISE_EXACT = new Set([
  'Combat',
  'Construction',
  'Subraces',
  'Statistics Block',
  'Tactics Round-by-Round',
  'Dragon Overland Movement',
  'Dragonhide',
  'Nightshade Abilities',
  'Vampire Spawn Weaknesses',
  "The Lich's Phylactery",
  'The Lich’s Phylactery',
  'Control Shape (Wis)',
  'Lycanthropy as an Affliction',
  'Half-Orcs',
  'Vulnerabilities of Swarms',
  'Heartstone',
  'Hag Eye',
  'Amulet', // the Shield Guardian's control amulet, not a creature
]);

// Umbrella ## categories whose ### children are bare role names (### Worker,
// ### Queen) that only make sense qualified by the parent (Formian Worker).
const H2_PREFIX_CHILDREN = new Set(['Formian']);

/**
 * Strip a trailing alternate-name parenthetical so a heading matches the plain
 * creature name used by structured sources: "Barbed Devil (Hamatula)" →
 * "Barbed Devil". Only a single trailing "(...)" is removed.
 */
function stripParenthetical(name) {
  return name.replace(/\s*\([^()]*\)\s*$/, '').trim();
}

/** True when a ### heading is section scaffolding, not a creature stat block. */
export function isMonsterSectionNoise(name) {
  if (H3_NOISE_EXACT.has(name)) return true;
  // "Bugbears as Characters", "Kobold Characters", "Stone Giants as Characters"
  if (/\bcharacters$/i.test(name)) return true;
  // "Creating a Lich", "Training a Griffon"
  if (/^(?:creating|training)\b/i.test(name)) return true;
  // "Hound Archon Hero Mounts" — a mount appendix, not its own entry
  if (/\bmounts$/i.test(name)) return true;
  return false;
}

/**
 * Extract the SRD monster roster from one chapter's markdown: ## stat-block
 * headers (minus category/template umbrellas) plus ### nested stat blocks
 * (minus section scaffolding). Bare caste children inherit their parent
 * category name. Returns names in document order.
 */
export function extractMonsterNamesFromMarkdown(text) {
  const names = [];
  let currentH2 = '';
  for (const match of text.matchAll(/^(#{2,3}) (.+)$/gm)) {
    const level = match[1].length;
    const name = match[2].trim();
    if (level === 2) {
      currentH2 = name;
      if (!CATEGORY_OR_NONMONSTER_H2.has(name)) names.push(stripParenthetical(name));
    } else if (!isMonsterSectionNoise(name)) {
      const qualified = H2_PREFIX_CHILDREN.has(currentH2) ? `${currentH2} ${name}` : name;
      names.push(stripParenthetical(qualified));
    }
  }
  return names;
}

/**
 * Fetch every chapter and return the de-duplicated SRD monster roster. Accepts a
 * fetch implementation (the global by default) so callers can inject one.
 */
export async function fetchSrd35MonsterNames(fetchImpl = fetch) {
  const seen = new Set();
  const names = [];
  for (const file of OLIMOT_MONSTER_FILES) {
    const response = await fetchImpl(`${OLIMOT_MONSTER_BASE}/${file}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching ${file}`);
    }
    const text = await response.text();
    for (const name of extractMonsterNamesFromMarkdown(text)) {
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      names.push(name);
    }
  }
  return names;
}
