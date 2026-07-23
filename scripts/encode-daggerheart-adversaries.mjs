/**
 * Encode Daggerheart SRD 1.0 adversaries from a local clone of
 * Batres3/daggerheart-srd (DPCGL — the same repo the domain-card denominator
 * uses; see docs/srd-sources.md) into typed DaggerheartAdversary data.
 *
 * The repo ships one markdown file per adversary under adversaries/Tier {1-4}/,
 * each containing a YAML-ish ```statblock fence with single-line `key: "value"`
 * pairs and a `feats:` list.
 *
 * Honest-mapping rules:
 *  - `thresholds: "None"` (Minions) encodes as ABSENT thresholds — the SRD
 *    minion rule (any damage marks 1 HP), never invented numbers.
 *  - Damage stays raw notation ('1d12+2 phy', '2 phy'); the combat adapter
 *    parses it, and anything unparseable there is an honest unsupported.
 *  - Files that fail field parsing are skipped and REPORTED.
 *
 * Usage:
 *   git clone --depth 1 https://github.com/Batres3/daggerheart-srd /tmp/dh-srd
 *   npx tsx scripts/encode-daggerheart-adversaries.mjs --src /tmp/dh-srd
 * (writes src/data/daggerheart/1.0/adversaries/tier-*.ts and prints a report)
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const srcFlag = process.argv.indexOf('--src');
const SRC = srcFlag > -1 ? process.argv[srcFlag + 1] : '/tmp/dh-srd';

const ROLES = new Set([
  'Bruiser',
  'Horde',
  'Leader',
  'Minion',
  'Ranged',
  'Skulk',
  'Social',
  'Solo',
  'Standard',
  'Support',
]);
const RANGES = new Set(['Melee', 'Very Close', 'Close', 'Far', 'Very Far']);

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Read `key: "value"` single-line fields out of the statblock fence. */
function field(block, key) {
  const m = new RegExp(`^${key}:\\s*"([^"]*)"\\s*$`, 'm').exec(block);
  return m ? m[1] : undefined;
}

/** Parse the `feats:` list of `- name: "..."` / `desc: "..."` pairs. */
function parseFeats(block) {
  const feats = [];
  const re = /-\s*name:\s*"([^"]*)"\s*\n\s*desc:\s*"([^"]*)"/g;
  for (const m of block.matchAll(re)) {
    feats.push({ name: m[1], description: m[2] });
  }
  return feats;
}

function parseAdversary(filePath, report) {
  const raw = readFileSync(filePath, 'utf8');
  const fence = /```statblock\n([\s\S]*?)```/.exec(raw);
  if (!fence) {
    report.skipped.push(`${filePath}: no statblock fence`);
    return null;
  }
  const block = fence[1];
  const name = field(block, 'name');
  const tier = Number(field(block, 'tier'));
  const role = field(block, 'type');
  const difficulty = Number(field(block, 'difficulty'));
  const thresholdsRaw = field(block, 'thresholds') ?? 'None';
  const hp = Number(field(block, 'hp'));
  const stress = Number(field(block, 'stress'));
  const atkRaw = (field(block, 'atk') ?? '').replace(/−/g, '-');
  const attackName = field(block, 'attack');
  const range = field(block, 'range');
  const damage = field(block, 'damage');

  // '8/15', '4/None' (severe never reached), or 'None' (minions).
  const thresholdsMatch = /^(\d+)\s*\/\s*(\d+|None)$/i.exec(thresholdsRaw.trim());
  const minionThresholds = /^none$/i.test(thresholdsRaw.trim());
  // Horde roles print a damage-scaling qualifier: 'Horde (3/HP)'.
  const roleMatch = /^([A-Za-z]+)(?:\s*(\(.+\)))?$/.exec(role ?? '');
  const roleBase = roleMatch?.[1];
  const roleDetail = roleMatch?.[2];
  // atk is a flat signed integer, or rarely dice ('+2d4').
  const atkFlat = /^[+-]?\d+$/.test(atkRaw.trim());
  const atkDice = /^\+?(\d+)d(\d+)$/.exec(atkRaw.trim());
  if (
    !name ||
    ![1, 2, 3, 4].includes(tier) ||
    !ROLES.has(roleBase) ||
    !Number.isFinite(difficulty) ||
    !Number.isFinite(hp) ||
    !Number.isFinite(stress) ||
    (!atkFlat && !atkDice) ||
    !attackName ||
    !RANGES.has(range) ||
    !damage ||
    (!thresholdsMatch && !minionThresholds)
  ) {
    report.skipped.push(
      `${filePath}: name=${name} tier=${tier} role=${role} difficulty=${difficulty} thresholds=${thresholdsRaw} atk=${atkRaw} range=${range}`
    );
    return null;
  }

  return {
    id: slug(name),
    name,
    system: 'daggerheart',
    source: 'SRD 1.0',
    tier,
    role: roleBase,
    ...(roleDetail ? { roleDetail } : {}),
    description: field(block, 'description') ?? '',
    motivesAndTactics: field(block, 'motives_and_tactics') ?? '',
    difficulty,
    ...(thresholdsMatch
      ? {
          thresholds: {
            major: Number(thresholdsMatch[1]),
            ...(/^none$/i.test(thresholdsMatch[2]) ? {} : { severe: Number(thresholdsMatch[2]) }),
          },
        }
      : {}),
    hitPoints: hp,
    stress,
    attackModifier: atkFlat ? Number(atkRaw) : 0,
    ...(atkDice ? { attackBonusDice: { count: Number(atkDice[1]), die: Number(atkDice[2]) } } : {}),
    attack: { name: attackName, range, damage },
    ...(field(block, 'experience') ? { experience: field(block, 'experience') } : {}),
    features: parseFeats(block),
  };
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

function main() {
  const report = { encoded: 0, skipped: [], byTier: {} };
  mkdirSync(resolve('src/data/daggerheart/1.0/adversaries'), { recursive: true });

  const indexImports = [];
  const indexSpreads = [];
  const manifestEntries = [];
  for (const tier of [1, 2, 3, 4]) {
    const dir = join(SRC, 'adversaries', `Tier ${tier}`);
    const adversaries = [];
    for (const file of readdirSync(dir).sort()) {
      if (!file.endsWith('.md')) continue;
      const adversary = parseAdversary(join(dir, file), report);
      if (adversary) adversaries.push(adversary);
    }
    adversaries.sort((a, b) => a.id.localeCompare(b.id));
    for (const adversary of adversaries) manifestEntries.push({ name: adversary.name, tier });
    report.byTier[tier] = adversaries.length;
    report.encoded += adversaries.length;

    const constName = `daggerheartTier${tier}Adversaries`;
    const body = adversaries.map((adversary) => ts(adversary)).join(',\n');
    writeFileSync(
      resolve(`src/data/daggerheart/1.0/adversaries/tier-${tier}.ts`),
      `// GENERATED by scripts/encode-daggerheart-adversaries.mjs from
// Batres3/daggerheart-srd (Daggerheart SRD 1.0, DPCGL — see
// docs/srd-sources.md). Regenerate per the script header.

import { DaggerheartAdversary } from '../../../../types/daggerheart';

export const ${constName}: DaggerheartAdversary[] = [
${body},
];
`
    );
    indexImports.push(`import { ${constName} } from './tier-${tier}';`);
    indexSpreads.push(`  ...${constName},`);
    console.log(`tier-${tier}.ts: ${adversaries.length} adversaries`);
  }

  writeFileSync(
    resolve('src/data/daggerheart/1.0/adversaries/index.ts'),
    `// GENERATED by scripts/encode-daggerheart-adversaries.mjs (see tier files).

import { DaggerheartAdversary } from '../../../../types/daggerheart';
${indexImports.join('\n')}

export const daggerheartAdversaries: DaggerheartAdversary[] = [
${indexSpreads.join('\n')}
];
`
  );

  // Pinned upstream roster for src/scripts/srd-coverage.ts (Daggerheart
  // adversaries category). There is no single link-listing page upstream and
  // GitHub's tree API is rate-limited, so the verbatim adversary list is
  // committed alongside the encoder — mirroring scripts/data/pf1e-bestiary-manifest.json.
  manifestEntries.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
  mkdirSync(resolve('scripts/data'), { recursive: true });
  writeFileSync(
    resolve('scripts/data/daggerheart-adversary-manifest.json'),
    JSON.stringify(
      {
        source:
          'Batres3/daggerheart-srd (Daggerheart SRD 1.0, DPCGL) adversaries/Tier {1-4}/*.md — one markdown statblock per adversary. Pinned upstream roster; there is no single link-listing page upstream (the Fantasy Statblocks plugin reads the folder), so the denominator is pinned here, mirroring scripts/data/pf1e-bestiary-manifest.json. Regenerate via scripts/encode-daggerheart-adversaries.mjs.',
        total: manifestEntries.length,
        byTier: report.byTier,
        entries: manifestEntries,
      },
      null,
      2
    ) + '\n'
  );

  console.log(`\nencoded: ${report.encoded} (by tier: ${JSON.stringify(report.byTier)})`);
  console.log(`skipped: ${report.skipped.length}`);
  for (const line of report.skipped) console.log(`  - ${line}`);
}

main();
