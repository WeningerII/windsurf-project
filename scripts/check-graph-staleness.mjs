#!/usr/bin/env node

/**
 * check:graph-staleness — an ADVISORY, WARN-ONLY report on how far the committed
 * graphify index has drifted from the current source tree.
 *
 * WHY IT EXISTS (WORK_PLAN 7.2): agents orient through `graphify query` per
 * CLAUDE.md, and when the index lags the tree the query silently returns nothing
 * for symbols that plainly exist (ShellContext, SurfaceStage, SceneCanvas all
 * came back empty). A silent miss is worse than a loud one: every agent that hit
 * it fell back to blind file reads and burned the context budget the graph was
 * built to save. This script makes the lag visible and names the fix.
 *
 * THIS IS NOT A GATE. IT ALWAYS EXITS 0. DO NOT "PROMOTE" IT TO ONE.
 * The reasoning is load-bearing, so it is written down here rather than left to
 * be rediscovered:
 *   1. The graphify artifacts (graph.json, manifest.json, wiki/) are COMMITTED.
 *      A hard gate would therefore fail on essentially every PR that touches
 *      src/ — any code change makes the committed index stale by definition, so
 *      the gate would be red by construction rather than on a real defect.
 *   2. The only way to make such a gate green would be to regenerate the graph
 *      during the run, i.e. to rewrite tracked files mid-chain. The
 *      check:generated-docs family of gates deliberately never does that: a
 *      verify run must not mutate the working tree it is judging.
 *   3. Staleness is not a correctness property. Nothing ships broken because the
 *      index lags; only agent navigation degrades. That is a warning-shaped
 *      problem, and warn-only is the correct strength for it.
 * If the index ever stops being committed, revisit (1) and (2) — until then, a
 * red build here would be noise, and noise is how the 22 real gates get ignored.
 *
 * WHAT IT READS (read-only; the ONLY thing it ever writes is an append to
 * $GITHUB_STEP_SUMMARY, a runner scratch path — never a file in the repo):
 *   - graphify-out/graph.json    -> `built_at_commit` + per-node `source_file`
 *   - graphify-out/manifest.json -> the exact file set the last build indexed
 *   - git history / working tree -> what has changed since that commit
 *
 * WHY NO mtime COMPARISON, even though manifest.json records one per file: git
 * does not preserve mtimes. After a fresh clone or `actions/checkout`, every
 * file on disk is newer than every manifest entry, so an mtime-based count
 * reports 100% staleness in CI and on any new machine — an unfalsifiable
 * "always stale" signal. The commit identity in `built_at_commit` is exact and
 * clone-stable, and the file-set diff below is exact even with no history at
 * all, so both are preferred over mtime.
 *
 * DEPENDENCY-FREE ON PURPOSE: node builtins only, no imports from src/. That
 * lets it run in a bare checkout without `npm ci`, which is what makes the cheap
 * advisory CI job in .github/workflows/ci.yml possible.
 *
 * NO `npm run node:check` PRELUDE in package.json, unlike 20 of the 22 verify
 * steps (check:bundle-size and check:keepalive-budget are the existing
 * exceptions). node:check exits 1 on an unsupported runtime, which would hand
 * this advisory a non-zero exit and break the contract above. It uses nothing
 * newer than node: builtins, so it has no runtime floor of its own to assert.
 */

import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const gitCommand = process.platform === 'win32' ? 'git.exe' : 'git';

const GRAPH_PATH = 'graphify-out/graph.json';
const MANIFEST_PATH = 'graphify-out/manifest.json';
const GRAPHIFY_IGNORE = '.graphifyignore';
const REMEDIATION =
  'Refresh it with `npm run graph:update` (AST-only, local, no API key), then commit graphify-out/.';

/** Every message this script emits, in order. Printed once at the end. */
const notes = [];
/** Distinct staleness findings; empty means the index is level with the tree. */
const findings = [];

/**
 * Print the report, and mirror it into the GitHub Actions job summary when one
 * is available. The summary is where a reviewer actually looks; a warning folded
 * inside a collapsed job log is a warning nobody reads.
 *
 * $GITHUB_STEP_SUMMARY is a runner scratch path outside the repository — this is
 * the only write this script performs, and it never touches a tracked file.
 */
function emit(stream, body) {
  stream(body);
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  try {
    appendFileSync(
      summaryPath,
      `### graphify index staleness (advisory)\n\n\`\`\`text\n${body}\n\`\`\`\n`
    );
  } catch {
    // The summary is a nicety; failing to write it must not change the outcome.
  }
}

function git(args) {
  return execFileSync(gitCommand, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
}

function tryGit(args) {
  try {
    return git(args);
  } catch {
    return null;
  }
}

function readJson(relativePath) {
  const absolute = path.resolve(root, relativePath);
  if (!existsSync(absolute)) return null;
  try {
    return JSON.parse(readFileSync(absolute, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Minimal gitignore-subset matcher for .graphifyignore. It only has to handle
 * the shapes that file actually uses — `dir/` prefixes, `*.ext` suffixes, and
 * literal paths — because the candidate list is already `git ls-files`, so
 * .gitignore has been applied by git itself.
 */
function loadGraphifyIgnore() {
  const absolute = path.resolve(root, GRAPHIFY_IGNORE);
  if (!existsSync(absolute)) return () => false;

  const dirPrefixes = [];
  const extensions = [];
  const literals = new Set();

  for (const rawLine of readFileSync(absolute, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (line === '' || line.startsWith('#')) continue;
    if (line.endsWith('/')) dirPrefixes.push(line);
    else if (line.startsWith('*.')) extensions.push(line.slice(1));
    else literals.add(line);
  }

  return (file) =>
    literals.has(file) ||
    dirPrefixes.some((prefix) => file.startsWith(prefix)) ||
    extensions.some((extension) => file.endsWith(extension));
}

const graph = readJson(GRAPH_PATH);
const manifest = readJson(MANIFEST_PATH);

if (!graph || !manifest) {
  const missing = [!graph ? GRAPH_PATH : null, !manifest ? MANIFEST_PATH : null].filter(Boolean);
  emit(
    console.error,
    `Graph staleness: cannot read ${missing.join(' and ')} — skipping the staleness report.\n${REMEDIATION}`
  );
  process.exit(0);
}

const manifestFiles = Object.keys(manifest);
const manifestSet = new Set(manifestFiles);

// ---------------------------------------------------------------------------
// Scope. The extension allowlist is DERIVED from the manifest rather than
// hardcoded, so it tracks whatever graphify actually indexes instead of drifting
// against it. .graphifyignore is then applied on top (that is what removes *.md,
// src/data/, public/, graphify-out/ ... from the candidate set).
// Deriving-then-filtering fails in the safe direction for an advisory tool: an
// extension graphify has never indexed can never be reported as "missing".
// ---------------------------------------------------------------------------
const indexedExtensions = new Set(
  manifestFiles.map((file) => path.extname(file)).filter((extension) => extension !== '')
);
const isIgnored = loadGraphifyIgnore();
const inScope = (file) => indexedExtensions.has(path.extname(file)) && !isIgnored(file);

const trackedFiles = tryGit(['ls-files']);
const scopeFiles = trackedFiles
  ? trackedFiles.split('\n').filter((file) => file !== '' && inScope(file))
  : [];

// ---------------------------------------------------------------------------
// Signal 1 — commit distance. Exact and clone-stable when the history is deep
// enough to contain the build commit.
// ---------------------------------------------------------------------------
// `graphify update .` does an INCREMENTAL rebuild and does NOT restamp
// `built_at_commit` — measured 2026-07-30: the graph was rebuilt and committed
// that day and the field still read f5613c86 from two days earlier. Trusting the
// field alone would make this check warn permanently, even immediately after a
// refresh, which is precisely the cry-wolf outcome decision B5 chose warn-only
// to avoid.
//
// The last commit that TOUCHED graphify-out/graph.json is a sound lower bound on
// freshness: the artifact cannot be older than the commit that wrote it. So take
// whichever of the two is the more recent ancestor of HEAD. Both are exact commit
// identities, so this keeps the clone-stability property that ruled out mtimes.
const stampedCommit = typeof graph.built_at_commit === 'string' ? graph.built_at_commit : null;
const committedAt = (
  tryGit(['log', '-1', '--format=%H', '--', 'graphify-out/graph.json']) ?? ''
).trim();

const isAncestor = (sha) => sha && tryGit(['merge-base', '--is-ancestor', sha, 'HEAD']) !== null;
const stampUsable = stampedCommit && tryGit(['cat-file', '-e', `${stampedCommit}^{commit}`]) !== null;

let builtAtCommit = stampedCommit;
if (committedAt && isAncestor(committedAt)) {
  // Prefer the write-commit when the stamp is missing, unreachable, or older.
  if (!stampUsable || tryGit(['merge-base', '--is-ancestor', stampedCommit, committedAt]) !== null) {
    if (stampUsable && stampedCommit !== committedAt) {
      notes.push(
        `graph.json is stamped ${stampedCommit.slice(0, 8)} but was last written in ` +
          `${committedAt.slice(0, 8)}; using the write-commit, which is the tighter bound ` +
          '(`graphify update` does not restamp the field).'
      );
    }
    builtAtCommit = committedAt;
  }
}

let historyUsable = false;

if (!builtAtCommit) {
  notes.push('graph.json carries no `built_at_commit`; falling back to the file-set diff only.');
  // NOTE: `cat-file -e` prints nothing on success, so this must test against
  // null (command failed) and not truthiness (empty stdout is a PASS).
} else if (tryGit(['cat-file', '-e', `${builtAtCommit}^{commit}`]) === null) {
  notes.push(
    `Graph was built at ${builtAtCommit.slice(0, 8)}, which is not in this clone ` +
      '(shallow checkout or a rewritten branch), so commit distance is unavailable — ' +
      'the file-set diff below is still exact.'
  );
} else {
  historyUsable = true;

  const buildDate = (tryGit(['log', '-1', '--format=%cI', builtAtCommit]) ?? '').trim();
  if (buildDate) {
    const ageDays = Math.floor((Date.now() - Date.parse(buildDate)) / 86_400_000);
    notes.push(
      `Graph built at ${builtAtCommit.slice(0, 8)} (${buildDate.slice(0, 10)}, ${ageDays}d ago).`
    );
  }

  const behind = (tryGit(['rev-list', '--count', `${builtAtCommit}..HEAD`]) ?? '').trim();
  const changedRaw = tryGit(['diff', '--name-only', builtAtCommit, 'HEAD']);
  if (changedRaw !== null) {
    const changed = changedRaw.split('\n').filter((file) => file !== '' && inScope(file));
    if (changed.length > 0) {
      findings.push(
        `${changed.length} indexed source file(s) changed across ${behind || '?'} commit(s) since the graph was built`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Signal 2 — file-set coverage. Works with zero git history. This is the signal
// that catches the WORK_PLAN 7.2 case directly: a file the index has never seen
// can never answer a query about the symbols inside it.
// ---------------------------------------------------------------------------
const unindexed = scopeFiles.filter((file) => !manifestSet.has(file));
if (unindexed.length > 0) {
  findings.push(
    `${unindexed.length} in-scope source file(s) absent from the index (never graphed)`
  );
}

const vanished = manifestFiles.filter((file) => !existsSync(path.resolve(root, file)));
if (vanished.length > 0) {
  findings.push(
    `${vanished.length} indexed file(s) no longer exist (deleted or renamed since the build)`
  );
}

// ---------------------------------------------------------------------------
// Signal 3 — zero-node code files. A file can sit in the manifest yet contribute
// no node to graph.json, which is precisely the "query returns nothing for a
// symbol that plainly exists" symptom. Data-shaped inputs (.json, .sql) yield no
// nodes by design, so only code extensions are considered.
// ---------------------------------------------------------------------------
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.js', '.mjs', '.cjs', '.jsx']);
const filesWithNodes = new Set(
  (Array.isArray(graph.nodes) ? graph.nodes : []).map((node) => node?.source_file).filter(Boolean)
);
const zeroNode = manifestFiles.filter(
  (file) => CODE_EXTENSIONS.has(path.extname(file)) && !filesWithNodes.has(file)
);
if (zeroNode.length > 0) {
  findings.push(`${zeroNode.length} indexed code file(s) contribute no node to graph.json`);
}

// ---------------------------------------------------------------------------
// Signal 4 — uncommitted edits. Not staleness of the committed artifacts as
// such, but the same practical consequence for anyone querying right now.
// ---------------------------------------------------------------------------
const statusRaw = tryGit(['status', '--porcelain']);
if (statusRaw !== null) {
  const dirty = statusRaw
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => line.slice(3).split(' -> ').pop())
    .filter((file) => inScope(file));
  if (dirty.length > 0) {
    findings.push(
      `${dirty.length} in-scope file(s) modified in the working tree since the last commit`
    );
  }
}

// ---------------------------------------------------------------------------
// Report. Warnings go to stderr (house convention for problems); the clean-pass
// summary goes to stdout with real measured numbers, matching
// check-keepalive-budget and check-srd-fidelity.
// ---------------------------------------------------------------------------
if (!trackedFiles) {
  notes.push('`git ls-files` unavailable — coverage of new files could not be checked.');
}

if (findings.length === 0) {
  const scopeNote = historyUsable ? '' : ' (file-set diff only)';
  emit(
    console.log,
    `Graph staleness: index is level with the tree — ${manifestFiles.length} indexed file(s), ${graph.nodes?.length ?? 0} node(s)${scopeNote}.`
  );
  process.exit(0);
}

const messages = [
  'Graph staleness: the committed graphify index is behind the source tree (warning only, not a gate).',
];
messages.push(...findings.map((finding) => `- ${finding}`));
if (notes.length > 0) messages.push(...notes.map((note) => `  note: ${note}`));
messages.push(
  `Agents orient through \`graphify query\`; a stale index answers "no node found" for code that exists.`
);
messages.push(REMEDIATION);
emit(console.error, messages.join('\n'));

// Always 0. See the header — this is a warning, not a gate.
process.exit(0);
