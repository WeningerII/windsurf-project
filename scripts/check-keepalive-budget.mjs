#!/usr/bin/env node

/**
 * UI-shell Phase 7 — verify-chain gate for the SurfaceStage keepalive budget.
 *
 * Consumes the artifact emitted by
 * `src/__tests__/components/SurfaceStageKeepaliveBudget.test.tsx` during
 * `npm test` and re-asserts it with the same pure evaluator the suite used, so
 * the two can never disagree. Runs immediately after the test step in
 * `npm run verify`, mirroring how the other `check:*` gates consume build or
 * test output.
 *
 * Failing on a MISSING artifact is deliberate: the silent-pass hole in a gate
 * like this is the test never running at all.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  KEEPALIVE_ARTIFACT_PATH,
  SURFACE_STAGE_SOURCE,
  evaluateKeepaliveBudget,
} from './lib/shellKeepaliveBudget.mjs';

const root = process.cwd();
const artifactPath = path.resolve(root, KEEPALIVE_ARTIFACT_PATH);

let report = null;
if (fs.existsSync(artifactPath)) {
  try {
    report = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  } catch (error) {
    console.error(
      `\nKeepalive budget check failed: ${artifactPath} is not valid JSON (${error}).\n`
    );
    process.exit(1);
  }
}

const sourcePath = path.resolve(root, SURFACE_STAGE_SOURCE);
if (!fs.existsSync(sourcePath)) {
  console.error(
    `\nKeepalive budget check failed: ${SURFACE_STAGE_SOURCE} not found — the gate cannot verify what it is measuring.\n`
  );
  process.exit(1);
}
const sourceHash = createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex');

// The registered system ids the measurement had to cover. Read from the
// artifact's own list is NOT enough (a measurement that skipped a system would
// vouch for itself), so cross-check it against the system directories that
// actually ship a definition.
const systemsDir = path.resolve(root, 'src/systems');
const definitionDirs = fs
  .readdirSync(systemsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) => fs.existsSync(path.join(systemsDir, entry.name, 'definition.ts')));

const violations = evaluateKeepaliveBudget(report, {
  sourceHash,
  systemIds: Array.isArray(report?.systemIds) ? report.systemIds : [],
});

if (report && Array.isArray(report.systemIds) && report.systemIds.length < definitionDirs.length) {
  violations.push(
    `keepalive measurement covered ${report.systemIds.length} systems but src/systems has ${definitionDirs.length} definition directories (${definitionDirs
      .map((entry) => entry.name)
      .join(', ')}) — every system must be measured through the shared shell`
  );
}

if (violations.length > 0) {
  console.error('\nKeepalive budget violations:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  console.error('');
  process.exit(1);
}

const switches = report.switches.length;
const attributeMutations = Math.max(...report.switches.map((entry) => entry.attributeMutations));
console.log(
  `\nKeepalive budget passed: ${switches} measured surface switches across ${report.systemIds.length} systems; worst case ${attributeMutations} attribute writes, 0 structural DOM mutations, 0 remounts; switch cost constant from ${report.subtreeScaling.smallSubtreeNodes} to ${report.subtreeScaling.largeSubtreeNodes} keepalive nodes.\n`
);
