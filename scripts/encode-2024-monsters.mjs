/**
 * Encode SRD 5.2.1 monsters from the downfallx/dnd-5e-srd-markdown bestiary
 * (CC-BY-4.0 — the same source the srd:coverage denominator uses; see
 * docs/srd-sources.md) into the repo's Monster data files for dnd-5e-2024.
 *
 * Sources: monsters-A-Z.md (each `###` heading is one stat block; `##` groups
 * variants) and animals.md (each `##` heading is one stat block; its `###`
 * headings are section labels like Traits/Actions).
 *
 * Honest-mapping rules (mirroring encode-5e-monsters.mjs):
 *  - Hand-written monsters (matched by normalized name) are never overwritten.
 *  - Stat blocks whose HP carries no dice formula, or whose size/type/
 *    alignment/CR cannot be mapped onto the typed model, are skipped and
 *    REPORTED, never guessed.
 *  - 2024 merges damage and condition entries in one Immunities line; items
 *    are classified per word — known damage types become damageImmunities,
 *    everything else conditionImmunities. Resistance items that are not
 *    damage types are skipped and reported.
 *  - Attack actions get STRUCTURED attackBonus/reach/damage parsed from the
 *    2024 prose ("Melee Attack Roll: +9 ... 12 (2d6 + 5) Bludgeoning damage"),
 *    so scene combat uses the numbers the statblock prints.
 *
 * Usage: npx tsx scripts/encode-2024-monsters.mjs   (writes
 * src/data/dnd/5e-2024/monsters/srd-cr-*.ts and prints a report; commit the
 * output).
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MD_BASE = 'https://raw.githubusercontent.com/downfallx/dnd-5e-srd-markdown/master';

const DAMAGE_TYPES = new Set([
  'acid',
  'bludgeoning',
  'cold',
  'fire',
  'force',
  'lightning',
  'necrotic',
  'piercing',
  'poison',
  'psychic',
  'radiant',
  'slashing',
  'thunder',
]);

const CREATURE_TYPES = new Set([
  'aberration',
  'beast',
  'celestial',
  'construct',
  'dragon',
  'elemental',
  'fey',
  'fiend',
  'giant',
  'humanoid',
  'monstrosity',
  'ooze',
  'plant',
  'undead',
]);

const ALIGNMENTS = new Set([
  'lawful good',
  'neutral good',
  'chaotic good',
  'lawful neutral',
  'true neutral',
  'chaotic neutral',
  'lawful evil',
  'neutral evil',
  'chaotic evil',
  'unaligned',
  'any',
]);

const SIZES = new Set(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']);

const normalizeName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Strip markdown/HTML noise from a prose run, keeping the sentence text. */
function cleanProse(text) {
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<hr\s*\/?>/gi, ' ')
    .replace(/&emsp;/g, ' ')
    .replace(/\*\*/g, '')
    .replace(/_/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapAlignment(raw) {
  const value = raw
    .toLowerCase()
    .replace(/^typically\s+/, '')
    .trim();
  if (value === 'neutral') return 'true neutral';
  if (value.startsWith('any')) return 'any';
  return ALIGNMENTS.has(value) ? value : null;
}

/** "_Large Aberration, Lawful Evil_" / "_Medium or Small Humanoid, Neutral_" */
function parseMeta(line) {
  const inner = /^_(.+)_$/.exec(line.trim());
  if (!inner) return null;
  const lastComma = inner[1].lastIndexOf(',');
  if (lastComma < 0) return null;
  const head = inner[1].slice(0, lastComma).trim();
  const alignment = mapAlignment(inner[1].slice(lastComma + 1));
  const sizeMatch = /^(Tiny|Small|Medium|Large|Huge|Gargantuan)/i.exec(head);
  if (!sizeMatch || !alignment) return null;
  const size = sizeMatch[1].toLowerCase();
  const headLower = head.toLowerCase();
  let type = null;
  if (headLower.includes('swarm')) {
    type = 'swarm';
  } else {
    for (const candidate of CREATURE_TYPES) {
      if (new RegExp(`\\b${candidate}\\b`).test(headLower)) {
        type = candidate;
        break;
      }
    }
  }
  if (!type || !SIZES.has(size)) return null;
  return { size, type, alignment };
}

function parseDiceExpr(count, faces, sign, mod) {
  const modifier = mod ? (sign === '-' ? -Number(mod) : Number(mod)) : undefined;
  return {
    count: Number(count),
    die: `d${faces}`,
    ...(modifier !== undefined ? { modifier } : {}),
    notation: `${count}d${faces}${modifier ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`,
  };
}

function parseSpeed(text) {
  const out = {};
  const walk = /^(\d+)\s*ft/.exec(text.trim());
  if (walk) out.walk = Number(walk[1]);
  for (const [, mode, feet] of text.matchAll(/(Burrow|Climb|Fly|Swim)\s+(\d+)\s*ft/gi)) {
    out[mode.toLowerCase()] = Number(feet);
  }
  return out;
}

const CR_FRACTIONS = { '1/8': 0.125, '1/4': 0.25, '1/2': 0.5 };

/** Signed integers in the stat table use U+2212 for minus. */
const signedInt = (raw) => Number(raw.replace(/−/g, '-').replace(/\+/g, ''));

const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

function parseAbilityTable(block) {
  const abilities = {};
  const saves = {};
  let strict = true;
  for (const ability of ABILITIES) {
    const re = new RegExp(
      `<strong>${ability.toUpperCase()}</strong></td>\\s*<td>(\\d+)</td>\\s*<td>([+\\u2212-]?\\d+)</td>\\s*<td>([+\\u2212-]?\\d+)</td>`
    );
    const m = re.exec(block);
    if (m) {
      abilities[ability] = Number(m[1]);
      const mod = signedInt(m[2]);
      const save = signedInt(m[3]);
      // Only proficient saves (save != raw mod) are worth carrying.
      if (save !== mod) saves[ability] = save;
      continue;
    }
    // A handful of source tables are malformed (merged cells, e.g. the
    // Remorhaz prints "<td>13 +1</td>"). Salvage the SCORE — the first
    // integer in the cell after the ability label — and skip save capture
    // for the whole block (the merged cells make saves ambiguous).
    const loose = new RegExp(`<strong>${ability.toUpperCase()}</strong></td>\\s*<td>(\\d+)`).exec(
      block
    );
    if (!loose) return null;
    abilities[ability] = Number(loose[1]);
    strict = false;
  }
  return { abilities, saves: strict ? saves : {} };
}

/** Split "Poison; Exhaustion, Poisoned" style lists into damage vs condition. */
function classifyImmunityList(text) {
  const damage = [];
  const conditions = [];
  for (const item of text.split(/[;,]/)) {
    const value = item.trim().toLowerCase();
    if (!value) continue;
    if (DAMAGE_TYPES.has(value)) damage.push(value);
    else conditions.push(value);
  }
  return { damage, conditions };
}

/** Parse the 2024 attack prose into structured action fields. */
function parseActionMechanics(name, description, report, id) {
  const out = { name, description };
  const attackRoll = /(?:Melee|Ranged|Melee or Ranged) Attack Roll:\s*([+−-]\d+)/i.exec(
    description
  );
  if (attackRoll) out.attackBonus = signedInt(attackRoll[1]);
  const reach = /reach (\d+)\s*ft/i.exec(description);
  if (reach) out.reach = Number(reach[1]);
  const range = /range (\d+)(?:\/(\d+))?\s*ft/i.exec(description);
  if (range) out.range = { normal: Number(range[1]), max: Number(range[2] ?? range[1]) };

  const damage = [];
  for (const m of description.matchAll(
    /\d+\s*\((\d+)d(\d+)(?:\s*([+−-])\s*(\d+))?\)\s*([A-Za-z]+)\s+damage/g
  )) {
    const type = m[5].toLowerCase();
    if (!DAMAGE_TYPES.has(type)) {
      report.unparsedDamage.push(`${id}/${name}: ${m[0]}`);
      continue;
    }
    damage.push({
      dice: parseDiceExpr(m[1], m[2], m[3] === '−' ? '-' : m[3], m[4]),
      type,
    });
  }
  if (damage.length > 0) out.damage = damage;

  const save = /(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) Saving Throw:\s*DC (\d+)/.exec(
    description
  );
  if (save) {
    out.savingThrow = {
      attribute: save[1].slice(0, 3).toLowerCase(),
      dc: Number(save[2]),
      effect: /Success:\s*Half damage/i.test(description) ? 'half' : 'none',
    };
  }
  const recharge = /\(Recharge (\d)(?:[-–]6)?\)/i.exec(name);
  if (recharge) out.recharge = `${recharge[1]}-6`;
  return out;
}

/** Split a `#### Section` body into `**_Name._** description` entries. */
function parseEntries(sectionText) {
  const entries = [];
  const re = /\*\*_(.+?)\.?_\*\*/g;
  const markers = [...sectionText.matchAll(re)];
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index + markers[i][0].length;
    const end = i + 1 < markers.length ? markers[i + 1].index : sectionText.length;
    entries.push({
      name: markers[i][1].trim().replace(/\.$/, ''),
      description: cleanProse(sectionText.slice(start, end)),
    });
  }
  return entries;
}

function parseBlock(name, block, report) {
  const id = slug(name);
  const lines = block.split('\n');
  const metaLine = lines.find((line) => /^_.+_\s*$/.test(line.trim()));
  const meta = metaLine ? parseMeta(metaLine) : null;

  const ac = /\*\*AC\*\*\s*(\d+)/.exec(block);
  const hp = /\*\*HP\*\*\s*\d+\s*\((\d+)d(\d+)(?:\s*([+−-])\s*(\d+))?\)/.exec(block);
  const speed = /\*\*Speed\*\*\s*(.+?)(?:<br|$)/m.exec(block);
  // Both orders appear in the source: "(XP 700" and the wyrmlings' "(700 XP".
  const cr =
    /\*\*CR\*\*\s*([\d/]+)\s*\(XP\s*([\d,]+)/.exec(block) ??
    /\*\*CR\*\*\s*([\d/]+)\s*\(([\d,]+)\s*XP/.exec(block);
  const table = parseAbilityTable(block);

  if (!meta || !ac || !hp || !cr || !table) {
    report.skippedUnmappable.push(
      `${id}: meta=${Boolean(meta)} ac=${Boolean(ac)} hp-dice=${Boolean(hp)} cr=${Boolean(cr)} abilities=${Boolean(table)}`
    );
    return null;
  }

  const challengeRating = CR_FRACTIONS[cr[1]] ?? Number(cr[1]);
  if (!Number.isFinite(challengeRating)) {
    report.skippedUnmappable.push(`${id}: cr=${cr[1]}`);
    return null;
  }

  const lineValue = (label) =>
    new RegExp(`\\*\\*${label}\\*\\*\\s*(.+?)(?:<br|$)`, 'm').exec(block)?.[1]?.trim();

  const skills = {};
  for (const [, skillName, bonus] of (lineValue('Skills') ?? '').matchAll(
    /([A-Za-z' ]+?)\s*([+−-]\d+)/g
  )) {
    skills[skillName.trim().toLowerCase().replace(/\s+/g, '-')] = signedInt(bonus);
  }

  const resistances = classifyImmunityList(lineValue('Resistances') ?? '');
  for (const condition of resistances.conditions) {
    report.skippedDamageStrings.push(`${id} [resist]: ${condition}`);
  }
  const immunities = classifyImmunityList(lineValue('Immunities') ?? '');
  const vulnerabilities = classifyImmunityList(lineValue('Vulnerabilities') ?? '');

  const sections = {};
  for (const m of block.matchAll(
    /^####\s+(Traits|Actions|Bonus Actions|Reactions|Legendary Actions)\s*$/gm
  )) {
    const start = m.index + m[0].length;
    const next = /^####\s+/m.exec(block.slice(start));
    sections[m[1]] = block.slice(start, next ? start + next.index : block.length);
  }

  const actions = parseEntries(sections.Actions ?? '').map((entry) =>
    parseActionMechanics(entry.name, entry.description, report, id)
  );
  const bonusActions = parseEntries(sections['Bonus Actions'] ?? '').map((entry) =>
    parseActionMechanics(entry.name, entry.description, report, id)
  );
  const reactions = parseEntries(sections.Reactions ?? '').map((entry) =>
    parseActionMechanics(entry.name, entry.description, report, id)
  );
  const traits = parseEntries(sections.Traits ?? '');
  const legendary = parseEntries(sections['Legendary Actions'] ?? '').map((entry) => ({
    name: entry.name.replace(/\s*\(Costs \d+ Actions\)\s*$/i, ''),
    cost: Number(/\(Costs (\d+) Actions\)/i.exec(entry.name)?.[1] ?? 1),
    description: entry.description,
  }));

  return {
    id,
    name,
    system: 'dnd-5e-2024',
    // The open-content policy's canonical label for this system (the precise
    // provenance — SRD 5.2.1 markdown — is cited in this file's header).
    source: 'SRD 5.2',
    size: meta.size,
    type: meta.type,
    alignment: meta.alignment,
    challengeRating,
    experiencePoints: Number(cr[2].replace(/,/g, '')),
    armorClass: Number(ac[1]),
    hitPoints: parseDiceExpr(hp[1], hp[2], hp[3] === '−' ? '-' : hp[3], hp[4]),
    speed: speed ? parseSpeed(speed[1]) : {},
    abilities: table.abilities,
    ...(Object.keys(table.saves).length ? { savingThrows: table.saves } : {}),
    ...(Object.keys(skills).length ? { skills } : {}),
    ...(resistances.damage.length ? { damageResistances: resistances.damage } : {}),
    ...(immunities.damage.length ? { damageImmunities: immunities.damage } : {}),
    ...(vulnerabilities.damage.length ? { damageVulnerabilities: vulnerabilities.damage } : {}),
    ...(immunities.conditions.length ? { conditionImmunities: immunities.conditions } : {}),
    senses: (lineValue('Senses') ?? '')
      .split(';')
      .map((s) => cleanProse(s))
      .filter(Boolean),
    languages: (lineValue('Languages') ?? '')
      .split(/[;,]/)
      .map((s) => cleanProse(s))
      .filter((s) => s && s.toLowerCase() !== 'none'),
    ...(traits.length ? { specialAbilities: traits } : {}),
    actions: [...actions, ...bonusActions.map((a) => ({ ...a, name: `${a.name} (Bonus Action)` }))],
    ...(reactions.length ? { reactions } : {}),
    ...(legendary.length ? { legendaryActions: legendary } : {}),
  };
}

/** Split a markdown file into [name, blockText] stat blocks by heading level. */
function splitBlocks(text, headingPrefix) {
  const re = new RegExp(`^${headingPrefix}\\s+(.+?)\\s*$`, 'gm');
  const matches = [...text.matchAll(re)];
  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i][0].length;
    // A block ends at the next heading of the SAME or HIGHER level.
    const stop = new RegExp(`^#{1,${headingPrefix.length}}\\s+`, 'm');
    const rest = text.slice(start);
    const end = stop.exec(rest);
    blocks.push([matches[i][1], rest.slice(0, end ? end.index : rest.length)]);
  }
  return blocks;
}

function bucketFor(cr) {
  if (cr <= 1) return 'srd-cr-0-1';
  if (cr <= 5) return 'srd-cr-2-5';
  if (cr <= 10) return 'srd-cr-6-10';
  return 'srd-cr-11-plus';
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  // Baseline = the union MINUS this encoder's own previous output, so
  // regeneration is idempotent instead of self-excluding into empty files.
  const existing = await import('../src/data/dnd/5e-2024/monsters/index.ts');
  const generatedNames = new Set();
  for (const stem of ['srd-cr-0-1', 'srd-cr-2-5', 'srd-cr-6-10', 'srd-cr-11-plus']) {
    try {
      const mod = await import(`../src/data/dnd/5e-2024/monsters/${stem}.ts`);
      for (const monster of Object.values(mod)[0] ?? []) {
        generatedNames.add(normalizeName(monster.name));
      }
    } catch {
      // first run: no generated file yet
    }
  }
  const existingNames = new Set(
    existing.dnd5e2024Monsters
      .map((monster) => normalizeName(monster.name))
      .filter((name) => !generatedNames.has(name))
  );

  const [monstersMd, animalsMd] = await Promise.all([
    (await fetch(`${MD_BASE}/monsters-A-Z.md`)).text(),
    (await fetch(`${MD_BASE}/animals.md`)).text(),
  ]);

  const statBlocks = [...splitBlocks(monstersMd, '###'), ...splitBlocks(animalsMd, '##')];

  const report = {
    encoded: 0,
    skippedExisting: 0,
    skippedUnmappable: [],
    skippedDamageStrings: [],
    unparsedDamage: [],
  };
  const buckets = new Map();
  const seenIds = new Set();

  for (const [name, block] of statBlocks) {
    if (existingNames.has(normalizeName(name))) {
      report.skippedExisting += 1;
      continue;
    }
    if (seenIds.has(slug(name))) continue;
    const monster = parseBlock(name, block, report);
    if (!monster) continue;
    seenIds.add(monster.id);
    const bucket = bucketFor(monster.challengeRating);
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push(monster);
    report.encoded += 1;
  }

  for (const [bucket, monsters] of buckets) {
    monsters.sort((a, b) => a.challengeRating - b.challengeRating || a.id.localeCompare(b.id));
    const body = monsters.map((monster) => ts(monster)).join(',\n');
    const constName = `${bucket.replace(/-(\w)/g, (_, c) => c.toUpperCase())}Monsters2024`;
    const file = `// GENERATED by scripts/encode-2024-monsters.mjs from
// downfallx/dnd-5e-srd-markdown (SRD 5.2.1 bestiary, CC-BY-4.0 — see
// docs/srd-sources.md). Hand-written monsters live in the per-type
// directories and always win on name match; regenerate with:
// npx tsx scripts/encode-2024-monsters.mjs

import { Monster } from '../../../../types/creatures/monsters';

export const ${constName}: Monster[] = [
${body},
];
`;
    writeFileSync(resolve(`src/data/dnd/5e-2024/monsters/${bucket}.ts`), file);
    console.log(`${bucket}.ts: ${monsters.length} monsters`);
  }

  console.log(`\nencoded: ${report.encoded}, kept hand-written: ${report.skippedExisting}`);
  console.log(`unmappable (skipped): ${report.skippedUnmappable.length}`);
  for (const line of report.skippedUnmappable) console.log(`  - ${line}`);
  console.log(`non-damage resistance strings skipped: ${report.skippedDamageStrings.length}`);
  console.log(`unparsed damage clauses (prose-only): ${report.unparsedDamage.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
