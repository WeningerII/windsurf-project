#!/usr/bin/env node
/**
 * check-compute-register.mjs
 *
 * Reads all 7 compute registers as TEXT (no TS compilation needed), extracts
 * every verified entry and its testRef, then checks that:
 *   - the referenced test file exists on disk
 *   - a describe() or it() block with the exact label exists in that file
 *
 * Exits 0 if every verified entry is GREEN.
 * Exits 1 if any RED (file missing) or UNLINKED (no testRef) entries exist.
 *
 * --demote flag: changes status from 'verified' → 'implemented' for any RED
 *   or UNLINKED entries, in place in the source .ts file.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ── resolve project root ─────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEMOTE = process.argv.includes('--demote');

// ── the 7 register files ─────────────────────────────────────────────────────
const REGISTER_FILES = [
  'docs/compute-register/dnd5e-2014.ts',
  'docs/compute-register/dnd5e-2024.ts',
  'docs/compute-register/dnd35e.ts',
  'docs/compute-register/pf1e.ts',
  'docs/compute-register/mam3e.ts',
  'docs/compute-register/pf2e.ts',
  'docs/compute-register/daggerheart.ts',
];

// ── ANSI colour helpers ──────────────────────────────────────────────────────
const c = {
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
  dim:    (s) => `\x1b[2m${s}\x1b[0m`,
};

// ── parse one register file and extract verified entries ─────────────────────
/**
 * We cannot import TypeScript directly. Instead we read the raw source and use
 * a series of regex passes to extract every { … } block that has
 * status: 'verified' (or status: "verified"), then from each block pull out
 * the id and testRef fields.
 *
 * Strategy: split on top-level `{` … `}` object literals in the `entries`
 * array. Because the entries are single-level objects (no nested objects at
 * the value level beyond arrays), we can do a brace-counting scan.
 */
function parseRegister(filePath) {
  const absPath = path.join(ROOT, filePath);
  const src = readFileSync(absPath, 'utf8');

  // Derive systemId from the systemId: '…' line
  const systemIdMatch = src.match(/systemId:\s*['"]([^'"]+)['"]/);
  const systemId = systemIdMatch ? systemIdMatch[1] : path.basename(filePath, '.ts');

  // Find the entries: [ … ] array — everything between the first `[` after
  // "entries:" and its matching `]`.
  const entriesStart = src.indexOf('entries:');
  if (entriesStart === -1) {
    console.warn(`  ${c.yellow('WARN')} No entries: array found in ${filePath}`);
    return { systemId, filePath, entries: [] };
  }

  const bracketOpen = src.indexOf('[', entriesStart);
  if (bracketOpen === -1) {
    return { systemId, filePath, entries: [] };
  }

  // Walk forward counting brackets to find the matching ]
  let depth = 0;
  let bracketClose = -1;
  for (let i = bracketOpen; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') {
      depth--;
      if (depth === 0) { bracketClose = i; break; }
    }
  }

  const arrayBody = src.slice(bracketOpen + 1, bracketClose);

  // Split into individual { … } entry blocks using brace counting
  const entryBlocks = [];
  let braceDepth = 0;
  let blockStart = -1;
  for (let i = 0; i < arrayBody.length; i++) {
    const ch = arrayBody[i];
    if (ch === '{') {
      if (braceDepth === 0) blockStart = i;
      braceDepth++;
    } else if (ch === '}') {
      braceDepth--;
      if (braceDepth === 0 && blockStart !== -1) {
        entryBlocks.push(arrayBody.slice(blockStart, i + 1));
        blockStart = -1;
      }
    }
  }

  // Parse each block
  const entries = [];
  for (const block of entryBlocks) {
    // Extract status
    const statusMatch = block.match(/\bstatus:\s*['"]([^'"]+)['"]/);
    if (!statusMatch) continue;
    const status = statusMatch[1];
    if (status !== 'verified') continue;

    // Extract id
    const idMatch = block.match(/\bid:\s*['"]([^'"]+)['"]/);
    const id = idMatch ? idMatch[1] : '(unknown)';

    // Extract testRef — may be on multiple lines with a template literal or string concat
    // Pattern: testRef: `…` or testRef: '…' or testRef: "…"
    // Also handle: testRef:\n    'path' (multi-line with backtick template)
    // We need to grab everything after testRef: until the trailing comma/newline

    let testRef = null;

    // Try template literal first (backtick): testRef: `…`
    const tlMatch = block.match(/testRef:\s*`([^`]*)`/s);
    if (tlMatch) {
      testRef = tlMatch[1].trim();
    } else {
      // Try single- or double-quoted string (possibly multi-line with concat — rare)
      const sqMatch = block.match(/testRef:\s*['"]([^'"]*)['"]/);
      if (sqMatch) {
        testRef = sqMatch[1].trim();
      } else {
        // Multi-line string literal split across lines
        // e.g. testRef:\n        'src/__tests__/… :: label',
        const mlMatch = block.match(/testRef:\s*\n\s*['"]([^'"]*)['"]/s);
        if (mlMatch) {
          testRef = mlMatch[1].trim();
        }
      }
    }

    // Resolve any ${T} or ${T14} / ${T24} / ${SRD} etc. template variables
    // by looking for const declarations in the file header
    if (testRef && testRef.includes('${')) {
      testRef = resolveTemplateVars(testRef, src);
    }

    entries.push({ id, status, testRef, block });
  }

  return { systemId, filePath, entries };
}

/**
 * Resolve simple ${VAR} substitutions from `const VAR = '…'` declarations
 * in the same file.
 */
function resolveTemplateVars(str, src) {
  // Find all const X = 'value' or const X = "value" declarations
  const constPattern = /const\s+(\w+)\s*=\s*['"`]([^'"`]+)['"`]/g;
  const vars = {};
  let m;
  while ((m = constPattern.exec(src)) !== null) {
    vars[m[1]] = m[2];
  }

  // Replace ${VAR} references
  return str.replace(/\$\{(\w+)\}/g, (_, name) => vars[name] ?? `\${${name}}`);
}

// ── check a single testRef ────────────────────────────────────────────────────
/**
 * Returns: 'green' | 'yellow' | 'red'
 */
function checkTestRef(testRef) {
  // Split on " :: " — the separator from the types.ts docstring
  const sepIdx = testRef.indexOf(' :: ');
  if (sepIdx === -1) {
    // Malformed testRef (no separator): treat as red so it gets attention
    return { status: 'red', filePath: testRef, label: null, note: 'no " :: " separator in testRef' };
  }

  const relFilePath = testRef.slice(0, sepIdx).trim();
  const label = testRef.slice(sepIdx + 4).trim();
  const absFilePath = path.join(ROOT, relFilePath);

  if (!existsSync(absFilePath)) {
    return { status: 'red', filePath: relFilePath, label, note: 'file not found' };
  }

  const testSrc = readFileSync(absFilePath, 'utf8');

  // Check for describe('label', or describe("label",  or it('label', etc.
  // Also handle template literals: describe(`label`,
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const labelPattern = new RegExp(
    `(?:describe|it)\\s*\\(\\s*['"\`]${escaped}['"\`]\\s*,`,
  );

  if (labelPattern.test(testSrc)) {
    return { status: 'green', filePath: relFilePath, label };
  }

  return { status: 'yellow', filePath: relFilePath, label, note: 'label not found in file' };
}

// ── demote entries in-place ───────────────────────────────────────────────────
/**
 * For a given entry block, replace status: 'verified' with status: 'implemented'
 * in the source file. We do a targeted string replacement using the entry's
 * unique id to scope the change.
 */
function demoteEntry(filePath, entryId) {
  const absPath = path.join(ROOT, filePath);
  let src = readFileSync(absPath, 'utf8');

  // Find the block containing this id and replace its status field
  // We use the id as an anchor: find id: '…' then replace the next
  // status: 'verified' within the same block.
  const idPattern = new RegExp(`(id:\\s*['"]${entryId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][\\s\\S]*?)status:\\s*'verified'`);
  const newSrc = src.replace(idPattern, (match, prefix) => {
    return `${prefix}status: 'implemented'`;
  });

  if (newSrc === src) {
    console.warn(`  ${c.yellow('WARN')} Could not demote ${entryId} in ${filePath}`);
    return false;
  }

  writeFileSync(absPath, newSrc, 'utf8');
  return true;
}

// ── main ──────────────────────────────────────────────────────────────────────
console.log(c.bold('\nCompute Register Linkage Check'));
console.log(c.dim('Checking testRef linkage for all verified entries...\n'));

const allResults = [];
let anyRedOrUnlinked = false;

for (const regFile of REGISTER_FILES) {
  const { systemId, filePath, entries } = parseRegister(regFile);

  const systemResults = {
    systemId,
    filePath,
    total: entries.length,
    green: 0,
    yellow: 0,
    red: 0,
    unlinked: 0,
    items: [],
  };

  for (const entry of entries) {
    if (!entry.testRef) {
      // verified but no testRef
      systemResults.unlinked++;
      anyRedOrUnlinked = true;
      systemResults.items.push({
        id: entry.id,
        outcome: 'unlinked',
        filePath: null,
        label: null,
        note: 'no testRef field',
      });

      if (DEMOTE) {
        demoteEntry(filePath, entry.id);
      }
    } else {
      const result = checkTestRef(entry.testRef);
      systemResults.items.push({ id: entry.id, outcome: result.status, ...result });

      if (result.status === 'green') systemResults.green++;
      else if (result.status === 'yellow') systemResults.yellow++;
      else if (result.status === 'red') {
        systemResults.red++;
        anyRedOrUnlinked = true;

        if (DEMOTE) {
          demoteEntry(filePath, entry.id);
        }
      }
    }
  }

  allResults.push(systemResults);

  // Per-system detail
  const hasBad = systemResults.red > 0 || systemResults.unlinked > 0 || systemResults.yellow > 0;
  const header = `${c.bold(systemId)} ${c.dim(`(${filePath})`)}`;
  console.log(header);

  for (const item of systemResults.items) {
    let tag, line;
    if (item.outcome === 'green') {
      tag = c.green('GREEN   ');
      line = `${tag} ${c.dim(item.id)}  ${c.dim('→')}  ${item.label}`;
    } else if (item.outcome === 'yellow') {
      tag = c.yellow('YELLOW  ');
      line = `${tag} ${item.id}\n         file: ${item.filePath}\n         label not found: "${item.label}"`;
    } else if (item.outcome === 'red') {
      tag = c.red('RED     ');
      line = `${tag} ${item.id}\n         missing file: ${item.filePath}`;
      if (item.note) line += `  (${item.note})`;
    } else {
      tag = c.red('UNLINKED');
      line = `${tag} ${item.id}  — ${item.note}`;
    }
    console.log(`  ${line}`);
  }

  if (!hasBad && systemResults.total === 0) {
    console.log(c.dim('  (no verified entries)'));
  }

  console.log('');
}

// ── summary table ─────────────────────────────────────────────────────────────
const COL = { system: 20, total: 7, green: 7, yellow: 7, red: 5, unlinked: 8 };

function pad(str, len) {
  return String(str).padEnd(len);
}

const hdr = [
  pad('system', COL.system),
  pad('verified', COL.total),
  pad('green', COL.green),
  pad('yellow', COL.yellow),
  pad('red', COL.red),
  pad('unlinked', COL.unlinked),
].join('  ');

const divider = '-'.repeat(hdr.length);
console.log(c.bold('Summary'));
console.log(divider);
console.log(c.bold(hdr));
console.log(divider);

for (const r of allResults) {
  const greenStr  = r.green    > 0 ? c.green(pad(r.green, COL.green))      : pad(r.green, COL.green);
  const yellowStr = r.yellow   > 0 ? c.yellow(pad(r.yellow, COL.yellow))   : pad(r.yellow, COL.yellow);
  const redStr    = r.red      > 0 ? c.red(pad(r.red, COL.red))            : pad(r.red, COL.red);
  const unlStr    = r.unlinked > 0 ? c.red(pad(r.unlinked, COL.unlinked))  : pad(r.unlinked, COL.unlinked);

  console.log([
    pad(r.systemId, COL.system),
    pad(r.total, COL.total),
    greenStr,
    yellowStr,
    redStr,
    unlStr,
  ].join('  '));
}

console.log(divider);

// Totals row
const totals = allResults.reduce(
  (acc, r) => ({
    total: acc.total + r.total,
    green: acc.green + r.green,
    yellow: acc.yellow + r.yellow,
    red: acc.red + r.red,
    unlinked: acc.unlinked + r.unlinked,
  }),
  { total: 0, green: 0, yellow: 0, red: 0, unlinked: 0 }
);

const totalGreenStr  = totals.green    > 0 ? c.green(pad(totals.green, COL.green))      : pad(totals.green, COL.green);
const totalYellowStr = totals.yellow   > 0 ? c.yellow(pad(totals.yellow, COL.yellow))   : pad(totals.yellow, COL.yellow);
const totalRedStr    = totals.red      > 0 ? c.red(pad(totals.red, COL.red))            : pad(totals.red, COL.red);
const totalUnlStr    = totals.unlinked > 0 ? c.red(pad(totals.unlinked, COL.unlinked))  : pad(totals.unlinked, COL.unlinked);

console.log([
  c.bold(pad('TOTAL', COL.system)),
  c.bold(pad(totals.total, COL.total)),
  totalGreenStr,
  totalYellowStr,
  totalRedStr,
  totalUnlStr,
].join('  '));

console.log(divider);

// ── final verdict ─────────────────────────────────────────────────────────────
if (DEMOTE) {
  console.log('');
  const demotedCount = totals.red + totals.unlinked;
  if (demotedCount > 0) {
    console.log(c.yellow(`--demote: ${demotedCount} entries changed from 'verified' → 'implemented' in register files.`));
  } else {
    console.log(c.green('--demote: nothing to demote.'));
  }
}

console.log('');
if (anyRedOrUnlinked) {
  const parts = [];
  if (totals.red > 0)      parts.push(`${totals.red} RED (test file missing)`);
  if (totals.unlinked > 0) parts.push(`${totals.unlinked} UNLINKED (no testRef)`);
  console.log(c.red(`FAIL: ${parts.join(', ')}`));
  process.exit(1);
} else if (totals.yellow > 0) {
  console.log(c.yellow(`WARN: ${totals.yellow} YELLOW entries (test file exists but label not found). Exiting 0.`));
} else {
  console.log(c.green('OK: all verified entries have a green testRef.'));
}
