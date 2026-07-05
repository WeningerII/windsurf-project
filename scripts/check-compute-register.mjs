#!/usr/bin/env tsx
/**
 * check:compute-register — the integrity gate for Denominator B.
 *
 * The "verified" marks in docs/compute-register/*.ts are hand-stamped strings.
 * Nothing previously verified that a `testRef` (a) resolves to a real test file,
 * (b) names a test that actually exists and PASSES, or (c) is mutation-sensitive.
 * This gate enforces all three and DEMOTES any 'verified' entry that fails to
 * status 'implemented' (in-scope, not done). It NEVER promotes, and never
 * invents verification.
 *
 * Tiers:
 *   (default)  Tier A — structure + file-resolve + exact-name-resolve + pass +
 *              anti-bootstrap. Read-only; prints demotions; exits non-zero if any.
 *   --mutate   Tier A then Tier B — for entries carrying a mutationAnchor, break
 *              the engine source and require a linked assertion to flip red.
 *   --write    Apply demotions to the register .ts files, then re-run roadmap
 *              metrics. Refuses to run on a dirty tree.
 *
 * Run via: npx tsx scripts/check-compute-register.mjs [--mutate] [--write]
 *
 * The un-fakeable artifact is the vitest JSON result tree: pass/fail decisions
 * come SOLELY from there, never from grepping test source or reading the
 * register's own edgeCases[].
 */

import { promises as fs } from 'node:fs';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';

import { COMPUTE_REGISTERS } from '../docs/compute-register/index.ts';
import { MUTATION_ANCHORS } from '../docs/compute-register/mutation-anchors.ts';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const SCRATCH = path.join(REPO_ROOT, 'node_modules', '.cache', 'compute-register-gate');
const GATE_JSON = path.join(REPO_ROOT, 'docs/generated/compute-register-gate.json');

const SEP = ' :: ';

const FLAGS = new Set(process.argv.slice(2));
const DO_MUTATE = FLAGS.has('--mutate');
const DO_WRITE = FLAGS.has('--write');

/** Map systemId -> register source file (used by the --write AST/text edit). */
const REGISTER_FILE_BY_SYSTEM = {
  'dnd-5e-2014': 'docs/compute-register/dnd5e-2014.ts',
  'dnd-5e-2024': 'docs/compute-register/dnd5e-2024.ts',
  'dnd-3.5e': 'docs/compute-register/dnd35e.ts',
  pf1e: 'docs/compute-register/pf1e.ts',
  pf2e: 'docs/compute-register/pf2e.ts',
  mam3e: 'docs/compute-register/mam3e.ts',
  daggerheart: 'docs/compute-register/daggerheart.ts',
};

// ───────────────────────── vitest JSON runner ──────────────────────────────

/**
 * Run one whole test FILE under vitest with the JSON reporter, parse the result
 * tree, and return the array of assertion objects. Cached per file. This is the
 * un-fakeable artifact: pass/fail flows only from here.
 */
const vitestCache = new Map();
function runVitestFile(absFile) {
  if (vitestCache.has(absFile)) return vitestCache.get(absFile);
  const hash = crypto.createHash('sha1').update(absFile).digest('hex').slice(0, 16);
  const out = path.join(SCRATCH, `${hash}.json`);
  const res = spawnSync(
    'npx',
    ['vitest', 'run', absFile, '--reporter=json', `--outputFile=${out}`],
    { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 300000 }
  );
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(out, 'utf8'));
  } catch (err) {
    throw new Error(
      `vitest JSON output unreadable for ${absFile} (exit ${res.status}): ${String(err)}\n` +
        `stderr: ${(res.stderr || '').slice(-2000)}`
    );
  }
  // Shape assertion — fail loudly if the vitest contract changes.
  if (!Array.isArray(parsed.testResults)) {
    throw new Error(`Unexpected vitest JSON shape for ${absFile}: missing testResults[]`);
  }
  // Find the suite whose name matches the file (usually the only one).
  const suite =
    parsed.testResults.find((t) => t.name === absFile) ??
    parsed.testResults.find((t) => path.resolve(t.name) === absFile) ??
    parsed.testResults[0];
  const assertions = Array.isArray(suite?.assertionResults) ? suite.assertionResults : [];
  for (const a of assertions) {
    if (!Array.isArray(a.ancestorTitles) || typeof a.status !== 'string') {
      throw new Error(`Unexpected assertion shape in ${absFile}`);
    }
  }
  vitestCache.set(absFile, assertions);
  return assertions;
}

/** Run vitest for one file WITHOUT caching (used during mutation). */
function runVitestFileFresh(absFile) {
  const hash = crypto.createHash('sha1').update(absFile + ':mut').digest('hex').slice(0, 16);
  const out = path.join(SCRATCH, `${hash}.json`);
  const res = spawnSync(
    'npx',
    ['vitest', 'run', absFile, '--reporter=json', `--outputFile=${out}`],
    { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 300000 }
  );
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(out, 'utf8'));
  } catch (err) {
    // A transform/compile error yields no parseable JSON -> zero assertions.
    return { assertions: [], compileError: true, stderr: (res.stderr || '').slice(-2000) };
  }
  const suite =
    parsed.testResults.find((t) => t.name === absFile) ??
    parsed.testResults.find((t) => path.resolve(t.name) === absFile) ??
    parsed.testResults[0];
  const assertions = Array.isArray(suite?.assertionResults) ? suite.assertionResults : [];
  return { assertions, compileError: false };
}

// ───────────────────────── name resolution ─────────────────────────────────

/**
 * An assertion MATCHES an entry's `name` iff `name` is an EXACT member of the
 * assertion's ancestorTitles array, OR equals its title, OR equals its fullName.
 * Exact membership (NOT vitest -t substring) is the integrity property.
 */
function matchingAssertions(assertions, name) {
  return assertions.filter(
    (a) =>
      (Array.isArray(a.ancestorTitles) && a.ancestorTitles.includes(name)) ||
      a.title === name ||
      a.fullName === name
  );
}

// ───────────────────────── anti-bootstrap screen ───────────────────────────

/**
 * True if the test file IMPORTS docs/compute-register/** (a byte-copy data path
 * from register -> assertion). Matches only real ES import / dynamic import /
 * require statements that reference a compute-register module path — NOT mere
 * prose mentions of the register in a comment.
 */
function testImportsRegister(absFile) {
  let src;
  try {
    src = readFileSync(absFile, 'utf8');
  } catch {
    return false;
  }
  // static:  import ... from '.../compute-register/...'
  // dynamic: import('.../compute-register/...')   require('.../compute-register/...')
  const importFrom = /\bfrom\s+['"][^'"]*compute-register[^'"]*['"]/;
  const dynamic = /\b(?:import|require)\s*\(\s*['"][^'"]*compute-register[^'"]*['"]\s*\)/;
  return importFrom.test(src) || dynamic.test(src);
}

// ───────────────────────── flatten entries ─────────────────────────────────

function flattenEntries() {
  const out = [];
  for (const reg of COMPUTE_REGISTERS) {
    const registerFilePath = REGISTER_FILE_BY_SYSTEM[reg.systemId];
    for (const entry of reg.entries) {
      out.push({ systemId: reg.systemId, registerFilePath, entry });
    }
  }
  return out;
}

// ───────────────────────── Tier A per entry ────────────────────────────────

function evaluateTierA(record) {
  const { entry } = record;
  const result = {
    id: entry.id,
    systemId: record.systemId,
    registerFilePath: record.registerFilePath,
    resolved: false,
    passed: false,
    antiBootstrapOk: true,
    mutation: 'unanchored',
    demote: false,
    reason: '',
  };

  // Step 1 — STRUCTURE
  const testRef = entry.testRef;
  if (!testRef || !testRef.includes(SEP)) {
    result.demote = true;
    result.reason = `malformed testRef (missing '${SEP}')`;
    return result;
  }
  const idx = testRef.indexOf(SEP);
  const refPath = testRef.slice(0, idx).trim();
  const name = testRef.slice(idx + SEP.length).trim();
  if (!refPath || !name) {
    result.demote = true;
    result.reason = 'malformed testRef (empty path or name)';
    return result;
  }
  result.refPath = refPath;
  result.name = name;

  // Step 2 — RESOLVE FILE
  const absFile = path.resolve(REPO_ROOT, refPath);
  if (!existsSync(absFile)) {
    result.demote = true;
    result.reason = `referenced test file does not exist: ${refPath}`;
    return result;
  }
  result.absFile = absFile;

  // Step 3+4 — RUN FILE, RESOLVE NAME (exact-ancestor membership)
  const assertions = runVitestFile(absFile);
  const matches = matchingAssertions(assertions, name);
  const ranMatches = matches.filter((a) => a.status !== 'skipped');
  if (matches.length === 0) {
    result.demote = true;
    result.reason = `testRef name not an exact describe/it/fullName title in ${refPath}: "${name}"`;
    return result;
  }
  if (ranMatches.length === 0) {
    result.demote = true;
    result.reason = `testRef name "${name}" matched only skipped assertions in ${refPath}`;
    return result;
  }
  result.resolved = true;

  // Step 5 — PASS (every matching assertion must be 'passed'; skip-only already failed above)
  const allPassed = matches.every((a) => a.status === 'passed');
  if (!allPassed) {
    result.demote = true;
    result.reason = `at least one matching assertion did not pass for "${name}" in ${refPath}`;
    return result;
  }
  result.passed = true;

  // Step 6 — ANTI-BOOTSTRAP
  if (testImportsRegister(absFile)) {
    result.antiBootstrapOk = false;
    result.demote = true;
    result.reason = `anti-bootstrap: test file imports docs/compute-register (${refPath})`;
    return result;
  }

  return result;
}

// ───────────────────────── Tier B mutation ─────────────────────────────────

function gitRestore(file) {
  spawnSync('git', ['checkout', '--', file], { cwd: REPO_ROOT, encoding: 'utf8' });
}

/**
 * Mutate the anchored engine source, re-run the entry's referenced file, and
 * require >=1 of the entry's MATCHING assertions to flip passed -> failed.
 * Always restores the file in finally. Dedupe is handled by the caller.
 */
function evaluateMutation(record, tierAResult) {
  const anchor = MUTATION_ANCHORS[record.entry.id];
  if (!anchor) {
    tierAResult.mutation = 'unanchored';
    return;
  }
  // Anchors are only meaningful for entries that already passed Tier A.
  if (!tierAResult.passed) {
    tierAResult.mutation = 'unanchored';
    return;
  }

  const absSrc = path.resolve(REPO_ROOT, anchor.file);
  if (!existsSync(absSrc)) {
    throw new Error(`mutation anchor for ${record.entry.id}: file not found ${anchor.file}`);
  }
  const original = readFileSync(absSrc, 'utf8');
  const occurrences = original.split(anchor.find).length - 1;
  if (occurrences !== 1) {
    throw new Error(
      `mutation anchor for ${record.entry.id}: find string occurs ${occurrences}x (expected 1) in ${anchor.file} — ambiguous, aborting`
    );
  }

  const absFile = tierAResult.absFile;
  try {
    const mutated = original.replace(anchor.find, anchor.replace);
    if (mutated === original) {
      throw new Error(`mutation anchor for ${record.entry.id}: replace was a no-op`);
    }
    require_writeSync(absSrc, mutated);

    const { assertions, compileError } = runVitestFileFresh(absFile);
    if (compileError || assertions.length === 0) {
      // A transform/compile error is invalid config, NOT mutation-proof.
      tierAResult.mutation = 'invalid-anchor';
      tierAResult.demote = true;
      tierAResult.reason = `mutation anchor for ${record.entry.id} produced a compile error / zero assertions — invalid anchor`;
      return;
    }
    const matches = matchingAssertions(assertions, tierAResult.name);
    const flippedRed = matches.some(
      (a) => a.status === 'failed' && Array.isArray(a.failureMessages) && a.failureMessages.length > 0
    );
    if (flippedRed) {
      tierAResult.mutation = 'proven';
    } else {
      tierAResult.mutation = 'survived';
      tierAResult.demote = true;
      tierAResult.reason = `mutation survived: breaking ${anchor.file} (${anchor.find} -> ${anchor.replace}) did not fail any matching assertion for "${tierAResult.name}"`;
    }
  } finally {
    gitRestore(absSrc);
  }
}

// writeFileSync shim (node fs/promises imported as fs; use sync write here)
import { writeFileSync as require_writeSync } from 'node:fs';

// ───────────────────────── --write demotion edit ───────────────────────────

/**
 * Edit a register .ts file: for the entry with the given id, flip
 * status: 'verified' -> status: 'implemented' and append a machine note.
 * Scoped text replace keyed on the entry id object literal. Idempotent.
 */
function applyDemotion(absRegisterFile, src, entryId, reason, sha) {
  // Locate the entry object by its id literal.
  const idNeedle = new RegExp(`id:\\s*['"\`]${escapeRe(entryId)}['"\`]`);
  const idMatch = idNeedle.exec(src);
  if (!idMatch) {
    return { src, changed: false, error: `id not found: ${entryId}` };
  }
  // The entry object spans from the preceding '{' to its matching '}'. Find the
  // object start (the '{' just before id:) and end (matching brace).
  const objStart = src.lastIndexOf('{', idMatch.index);
  const objEnd = matchBrace(src, objStart);
  if (objStart < 0 || objEnd < 0) {
    return { src, changed: false, error: `could not bound entry object for ${entryId}` };
  }
  let obj = src.slice(objStart, objEnd + 1);

  if (/status:\s*['"`]implemented['"`]/.test(obj)) {
    return { src, changed: false, error: null, alreadyDone: true };
  }
  const statusRe = /status:\s*['"`]verified['"`]/;
  if (!statusRe.test(obj)) {
    return { src, changed: false, error: `entry ${entryId} is not status:'verified'` };
  }
  obj = obj.replace(statusRe, "status: 'implemented'");

  const machineNote = `gate-demoted @${sha}: ${reason}`;
  if (/(\n\s*)note:\s*(['"`])/.test(obj)) {
    // Append to existing note string.
    obj = obj.replace(/note:\s*(['"`])([\s\S]*?)\1/, (m, q, body) => {
      return `note: ${q}${body} | ${machineNote.replace(new RegExp(q, 'g'), '')}${q}`;
    });
  } else {
    // Insert a note field right after the (now 'implemented') status line.
    obj = obj.replace(
      /status:\s*'implemented',?/,
      (m) => `${m.endsWith(',') ? m : m + ','}\n      note: '${machineNote.replace(/'/g, '')}',`
    );
  }

  const next = src.slice(0, objStart) + obj + src.slice(objEnd + 1);
  return { src: next, changed: true, error: null };
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchBrace(src, openIdx) {
  let depth = 0;
  let inStr = null;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') {
        i++;
        continue;
      }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      inStr = c;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

// ───────────────────────────── main ────────────────────────────────────────

async function main() {
  await fs.mkdir(SCRATCH, { recursive: true });
  await fs.mkdir(path.dirname(GATE_JSON), { recursive: true });

  // --mutate perturbs engine source and restores it with `git checkout -- <file>`,
  // which reverts to HEAD — so any UNCOMMITTED change to a mutated file would be
  // silently clobbered. --write edits the register files. Both require a clean tree.
  if (DO_WRITE || DO_MUTATE) {
    const dirty = spawnSync('git', ['diff', '--quiet'], { cwd: REPO_ROOT });
    if (dirty.status !== 0) {
      const flag = DO_WRITE ? '--write' : '--mutate';
      console.error(
        `Refusing to run ${flag} on a dirty tree (its git-checkout restore would ` +
          'discard uncommitted changes). Commit or stash first.'
      );
      process.exit(2);
    }
  }

  const records = flattenEntries();
  const verified = records.filter((r) => r.entry.status === 'verified');

  const results = [];
  for (const rec of verified) {
    const res = evaluateTierA(rec);
    results.push({ rec, res });
  }

  if (DO_MUTATE) {
    // Dedupe by (file, find) so shared symbols mutate once.
    const seen = new Map(); // key -> first result that triggered it
    for (const { rec, res } of results) {
      const anchor = MUTATION_ANCHORS[rec.entry.id];
      if (!anchor || !res.passed || res.demote) {
        if (anchor && res.passed && !res.demote) {
          /* handled below */
        }
        continue;
      }
      const key = `${anchor.file}::${anchor.find}`;
      if (seen.has(key)) {
        // Reuse the prior mutation verdict for this shared symbol.
        const prior = seen.get(key);
        res.mutation = prior.mutation;
        if (prior.mutation === 'survived' || prior.mutation === 'invalid-anchor') {
          res.demote = true;
          res.reason = prior.reason;
        }
        continue;
      }
      evaluateMutation(rec, res);
      seen.set(key, { mutation: res.mutation, reason: res.reason });
    }
  }

  // ── report ──
  const sha =
    spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8' })
      .stdout?.trim() || 'unknown';

  const perSystem = {};
  for (const reg of COMPUTE_REGISTERS) {
    perSystem[reg.systemId] = {
      verifiedClaimed: reg.entries.filter((e) => e.status === 'verified').length,
      verifiedSurviving: 0,
      demoted: 0,
      // Tier B: of the surviving Tier-A entries, how many are mutation-proven
      // (only populated under --mutate; 0 in a plain Tier-A run).
      mutationProven: 0,
    };
  }
  const entryReport = results.map(({ rec, res }) => {
    const sys = perSystem[rec.systemId];
    if (res.demote) sys.demoted += 1;
    else sys.verifiedSurviving += 1;
    if (res.mutation === 'proven') sys.mutationProven += 1;
    return {
      id: res.id,
      systemId: res.systemId,
      resolved: res.resolved,
      passed: res.passed,
      antiBootstrapOk: res.antiBootstrapOk,
      mutation: res.mutation,
      demote: res.demote,
      reason: res.reason,
    };
  });

  const report = {
    generatedSha: sha,
    tier: DO_MUTATE ? 'A+B' : 'A',
    summary: { perSystem },
    entries: entryReport,
  };
  await fs.writeFile(GATE_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const demotions = results.filter(({ res }) => res.demote);

  console.log(`compute-register gate (Tier ${report.tier}) — ${verified.length} verified entries checked`);
  for (const sysId of Object.keys(perSystem)) {
    const s = perSystem[sysId];
    console.log(
      `  ${sysId}: claimed ${s.verifiedClaimed} -> surviving ${s.verifiedSurviving} (demoted ${s.demoted})`
    );
  }
  if (demotions.length) {
    console.log('\nDEMOTIONS:');
    for (const { res } of demotions) {
      console.log(`  - ${res.id} [mutation:${res.mutation}] :: ${res.reason}`);
    }
  } else {
    console.log('\nNo demotions: every verified entry resolves, passes, and is anti-bootstrap clean.');
  }

  // ── --write ──
  if (DO_WRITE && demotions.length) {
    const byFile = new Map();
    for (const { rec, res } of demotions) {
      const f = path.resolve(REPO_ROOT, rec.registerFilePath);
      if (!byFile.has(f)) byFile.set(f, []);
      byFile.get(f).push(res);
    }
    let appliedCount = 0;
    for (const [absFile, ress] of byFile.entries()) {
      let src = readFileSync(absFile, 'utf8');
      for (const res of ress) {
        const out = applyDemotion(absFile, src, res.id, res.reason, sha);
        if (out.error) {
          console.error(`WRITE ERROR for ${res.id}: ${out.error}`);
          process.exit(3);
        }
        if (out.changed) {
          src = out.src;
          appliedCount += 1;
        }
      }
      require_writeSync(absFile, src);
    }
    console.log(`\n--write applied ${appliedCount} demotion(s) to register files.`);
    // Re-publish honest counts.
    const rm = spawnSync('npm', ['run', 'roadmap:metrics'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: 'inherit',
    });
    if (rm.status !== 0) {
      console.error('roadmap:metrics failed after write.');
      process.exit(4);
    }
  }

  process.exit(demotions.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
