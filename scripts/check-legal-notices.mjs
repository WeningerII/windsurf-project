#!/usr/bin/env node
/**
 * check-legal-notices.mjs
 *
 * Verifies that the three required legal scaffold files are present and
 * non-empty:
 *   - LICENSE         (OGL 1.0a text — required by OGL Section 15)
 *   - NOTICE          (per-system open-content attributions + CC-BY notice)
 *   - src/components/LegalNotices.tsx  (in-app /legal route component)
 *
 * Also performs light content checks:
 *   - LICENSE must contain "OPEN GAME LICENSE" and "Version 1.0a"
 *   - NOTICE must reference each of the 7 systems by keyword
 *   - LegalNotices.tsx must export a default React component
 *
 * Exits 0 if all checks pass.
 * Exits 1 if any check fails (with actionable output).
 */

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ANSI helpers
const c = {
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
  dim:    (s) => `\x1b[2m${s}\x1b[0m`,
};

let anyFail = false;

function pass(label) {
  console.log(`  ${c.green('PASS')}  ${label}`);
}

function fail(label, detail) {
  console.log(`  ${c.red('FAIL')}  ${label}`);
  if (detail) console.log(`        ${c.dim(detail)}`);
  anyFail = true;
}

function checkFile(relPath, checks) {
  const absPath = path.join(ROOT, relPath);
  if (!existsSync(absPath)) {
    fail(`${relPath} — file missing`, `Create this file to satisfy open-content license requirements.`);
    return;
  }

  const content = readFileSync(absPath, 'utf8').trim();
  if (!content) {
    fail(`${relPath} — file is empty`);
    return;
  }

  pass(`${relPath} — exists and non-empty`);

  for (const { description, test } of checks) {
    if (test(content)) {
      pass(`${relPath} — ${description}`);
    } else {
      fail(`${relPath} — ${description}`);
    }
  }
}

console.log(c.bold('\nLegal Notices Scaffold Check'));
console.log(c.dim('Verifying LICENSE, NOTICE, and LegalNotices.tsx are present and well-formed...\n'));

// ── LICENSE ───────────────────────────────────────────────────────────────────
checkFile('LICENSE', [
  {
    description: 'contains "OPEN GAME LICENSE"',
    test: (s) => s.includes('OPEN GAME LICENSE'),
  },
  {
    description: 'contains "Version 1.0a"',
    test: (s) => s.includes('Version 1.0a'),
  },
]);

// ── NOTICE ────────────────────────────────────────────────────────────────────
const SYSTEM_KEYWORDS = [
  { system: 'D&D 5e (2014/SRD 5.1)', keyword: 'SRD 5.1' },
  { system: 'D&D 5e (2024/SRD 5.2)', keyword: 'SRD 5.2' },
  { system: 'D&D 3.5e',              keyword: '3.5' },
  { system: 'Pathfinder 1e',         keyword: 'Pathfinder' },
  { system: 'Pathfinder 2e',         keyword: 'Pathfinder' },
  { system: 'Mutants & Masterminds', keyword: 'Mutants' },
  { system: 'Daggerheart',           keyword: 'Daggerheart' },
];

checkFile('NOTICE', [
  {
    description: 'contains CC-BY attribution notice',
    test: (s) => s.toLowerCase().includes('creative commons') || s.includes('CC BY'),
  },
  ...SYSTEM_KEYWORDS.map(({ system, keyword }) => ({
    description: `references ${system}`,
    test: (s) => s.includes(keyword),
  })),
]);

// ── src/components/LegalNotices.tsx ───────────────────────────────────────────
checkFile('src/components/LegalNotices.tsx', [
  {
    description: 'exports a default React component',
    test: (s) => /export\s+default\s+function\s+\w+/.test(s) || /export\s*\{\s*\w+\s+as\s+default\s*\}/.test(s),
  },
  {
    description: 'references OGL or Open Game License',
    test: (s) => s.includes('OGL') || s.includes('Open Game License'),
  },
]);

// ── result ────────────────────────────────────────────────────────────────────
console.log('');
if (anyFail) {
  console.log(c.red('FAIL: one or more legal-notices checks did not pass.'));
  process.exit(1);
} else {
  console.log(c.green('OK: all legal-notices checks passed.'));
}
