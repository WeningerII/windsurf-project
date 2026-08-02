#!/usr/bin/env node

/**
 * Verify-chain gate — static WCAG-AA contrast over Tailwind colour classes
 * (WORK_PLAN §6.4, the half of the a11y gate the rendered scan cannot reach).
 *
 * `e2e/a11y.spec.ts` judges computed styles on 8 surfaces; this judges the
 * source of every `.ts`/`.tsx` under `src`. The two are complements, and the reason both are needed
 * is recorded in `scripts/lib/tailwindContrast.mjs` — including the measurement
 * that the rendered scan stayed green while a 1.79:1 badge shipped.
 *
 * Pre-existing failures are recorded in `scripts/data/a11y-contrast-baseline.json`
 * with their EXACT ratio, the same ratchet `check:srd-fidelity` uses: baselined
 * entries are DEBT, not approval, and any change to one — fixed or worsened —
 * fails until the record is updated with `npm run a11y:contrast:record`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindColors from 'tailwindcss/colors.js';
import { evaluateAgainstBaseline, findingKey, scanSources } from './lib/tailwindContrast.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const BASELINE_PATH = path.join(HERE, 'data', 'a11y-contrast-baseline.json');
const THEME_CSS = 'src/index.css';

/**
 * The whole of `src`, deliberately — not a curated list of UI trees.
 *
 * This started as `['src/components', 'src/dock']`, which reads like the right
 * scope and is not: **5 of the ~17 files the 2026-07-31 contrast fix touched
 * live under `src/systems/`** (`DaggerheartInventorySection`,
 * `FeatureOptionBrowser`, `MamArchetypeBrowser`, `MamComplicationBrowser`,
 * `Pf2eSpellsTab` — see commit 5b3ed83), as does the app shell's own
 * `src/App.tsx`. A gate built to cover that defect population while skipping
 * 5/17 of it would be the fourth instance of §6.4's recorded pattern: "the code
 * was fine by the measure applied and broken by the measure that mattered".
 *
 * Scanning everything also removes the judgement call — there is no curated list
 * to go stale when a tree is added. `src/data` is 505 generated SRD files with
 * no colour class in them; including it costs ~0.2s and means a colour class
 * appearing there would be seen rather than assumed away.
 */
const SCAN_DIRS = ['src'];

/**
 * Renamed in Tailwind v2/v3 and kept as warning getters. Reading them prints
 * five deprecation warnings per run; none of them is a class name this repo can
 * write, since the config extends the default palette rather than aliasing them.
 */
const DEPRECATED_FAMILIES = new Set(['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray']);

/**
 * Written into a freshly recorded baseline so the rationale cannot be lost by
 * regenerating the file. An edited note survives re-recording.
 */
const BASELINE_NOTE =
  'Contrast pairs in src/components and src/dock that are below WCAG AA TODAY, each pinned to its ' +
  'EXACT measured ratio. This is a RATCHET, not an allowlist, and the entries are DEBT, not ' +
  'approval: any baselined pair whose ratio changes at all — improved or worsened — fails ' +
  'scripts/check-a11y-contrast.mjs, as does any pair that stops occurring, as does any NEW failure. ' +
  'Re-record with `npm run a11y:contrast:record` after a reviewed change, and keep the note.';

function fail(message) {
  console.error(`\nContrast check failed: ${message}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Colour resolution: the shipped palette and the shipped theme tokens.
// ---------------------------------------------------------------------------

function buildPalette() {
  const palette = new Map();
  for (const family of Object.keys(tailwindColors)) {
    if (DEPRECATED_FAMILIES.has(family)) continue;
    const value = tailwindColors[family];
    const kebab = family.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    if (typeof value === 'string') {
      if (value.startsWith('#')) palette.set(kebab, hexToRgb(value));
      continue;
    }
    if (!value || typeof value !== 'object') continue;
    for (const [shade, hex] of Object.entries(value)) {
      if (typeof hex === 'string' && hex.startsWith('#')) {
        palette.set(`${kebab}-${shade}`, hexToRgb(hex));
      }
    }
  }
  return palette;
}

function hexToRgb(hex) {
  const digits = hex.replace('#', '');
  const full =
    digits.length === 3
      ? digits
          .split('')
          .map((d) => d + d)
          .join('')
      : digits;
  return [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16));
}

function hslToRgb(h, s, l) {
  const saturation = s / 100;
  const lightness = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = saturation * Math.min(lightness, 1 - lightness);
  const channel = (n) => lightness - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [channel(0), channel(8), channel(4)].map((v) => Math.round(v * 255));
}

/** Read one CSS rule's body by selector, brace-matched so nesting cannot fool it. */
function ruleBody(css, selector) {
  const at = css.indexOf(selector);
  if (at === -1) return null;
  const open = css.indexOf('{', at);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i);
  }
  return null;
}

function readThemeTokens() {
  const cssPath = path.join(ROOT, THEME_CSS);
  if (!fs.existsSync(cssPath)) {
    fail(`${THEME_CSS} not found — the theme tokens the check resolves against are gone.`);
  }
  const css = fs.readFileSync(cssPath, 'utf8');
  const themes = { light: ':root', dark: '.dark' };
  const tokens = { light: new Map(), dark: new Map() };
  for (const [theme, selector] of Object.entries(themes)) {
    const body = ruleBody(css, selector);
    if (!body)
      fail(`${THEME_CSS} has no \`${selector}\` block — cannot resolve the ${theme} theme.`);
    for (const match of body.matchAll(/--([a-z-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*;/g)) {
      tokens[theme].set(match[1], hslToRgb(Number(match[2]), Number(match[3]), Number(match[4])));
    }
    if (!tokens[theme].has('background') || !tokens[theme].has('foreground')) {
      fail(`${THEME_CSS} \`${selector}\` defines no --background/--foreground pair.`);
    }
  }
  return tokens;
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

function collectSources() {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== '__tests__') walk(full);
        continue;
      }
      if (!/\.tsx?$/.test(entry.name) || /\.test\.tsx?$/.test(entry.name)) continue;
      files.push({ file: path.relative(ROOT, full), source: fs.readFileSync(full, 'utf8') });
    }
  };
  for (const dir of SCAN_DIRS) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) fail(`${dir} not found — the scan would silently cover nothing.`);
    walk(full);
  }
  // The silent-pass hole in a source lint is scanning an empty set.
  if (files.length === 0) fail(`no source files found under ${SCAN_DIRS.join(', ')}.`);
  return files;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const palette = buildPalette();
const tokens = readThemeTokens();
const resolve = (name, theme) => tokens[theme].get(name) ?? palette.get(name) ?? null;
// `--card` and `--popover` are the same colour as `--background` in both themes,
// so the page background stands in for every surface a component sits on.
const surfaceFor = (theme) => tokens[theme].get('background');

const sources = collectSources();
const { findings, unchecked, colourStrings } = scanSources(sources, { resolve, surfaceFor });

const describe = (finding) =>
  `${finding.file}:${finding.line}  ${finding.theme.padEnd(5)} ` +
  `${finding.foreground} on ${finding.background} — ${finding.ratio.toFixed(2)}:1 ` +
  `(needs ${finding.threshold}:1)`;

if (process.argv.includes('--record')) {
  const previous = fs.existsSync(BASELINE_PATH)
    ? JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'))
    : {};
  const pairs = {};
  for (const key of [...new Set(findings.map(findingKey))].sort()) {
    const finding = findings.find((candidate) => findingKey(candidate) === key);
    pairs[key] = {
      ratio: finding.ratio,
      threshold: finding.threshold,
      note: previous.pairs?.[key]?.note ?? 'Pre-existing; not yet triaged.',
    };
  }
  fs.writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify({ note: previous.note ?? BASELINE_NOTE, pairs }, null, 2)}\n`,
    'utf8'
  );
  console.log(`Recorded ${Object.keys(pairs).length} contrast pairs to ${BASELINE_PATH}`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE_PATH)) {
  fail(`${path.relative(ROOT, BASELINE_PATH)} is missing — run \`npm run a11y:contrast:record\`.`);
}
const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
const { unrecorded, changed, stale, current } = evaluateAgainstBaseline(findings, baseline);

console.log(
  `Contrast: ${sources.length} files, ${colourStrings} colour class strings, ` +
    `${current.size} distinct failing pairs (${Object.keys(baseline.pairs ?? {}).length} baselined)` +
    `${unchecked.length ? `, ${unchecked.length} unchecked` : ''}`
);
for (const skipped of unchecked) {
  console.log(`  unchecked  ${skipped.file}:${skipped.line} — ${skipped.reason}`);
}

let failed = false;

if (unrecorded.length > 0) {
  failed = true;
  console.error(`\n${unrecorded.length} contrast pair(s) below WCAG AA and not baselined:\n`);
  for (const finding of unrecorded) console.error(`  ${describe(finding)}`);
  console.error(
    '\nFix the colour — a class with no `dark:` counterpart must clear AA in BOTH themes.\n' +
      'If it genuinely cannot be fixed now, record it with `npm run a11y:contrast:record`\n' +
      'and give the entry a note saying why.'
  );
}

if (changed.length > 0) {
  failed = true;
  console.error(`\n${changed.length} baselined pair(s) no longer match their recorded ratio:\n`);
  for (const finding of changed) {
    console.error(`  ${describe(finding)} — recorded ${finding.recordedRatio.toFixed(2)}:1`);
  }
  console.error('\nRe-record with `npm run a11y:contrast:record` after reviewing the change.');
}

if (stale.length > 0) {
  failed = true;
  console.error(`\n${stale.length} baselined pair(s) no longer occur and must be removed:\n`);
  for (const key of stale) console.error(`  ${key}`);
  console.error('\nRe-record with `npm run a11y:contrast:record`.');
}

if (failed) {
  console.error('');
  process.exit(1);
}

console.log('Contrast check passed.');
