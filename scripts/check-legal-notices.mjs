#!/usr/bin/env node

/**
 * Launch-blocker gate (LEGAL-1): the open-content legal notices must exist, be
 * complete, and be reachable in-app.
 *
 * This is a presence-AND-content-AND-static-reachability check that runs fully
 * offline against committed files. Runtime reachability (the rendered DOM
 * actually containing the OGL text and disclaimers) is proven separately by
 * `e2e/legal-notices.spec.ts`.
 *
 * It reads files only to test for short marker phrases (license titles, system
 * labels, disclaimer fragments) and never prints any file body.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
const failures = [];

function fileText(relPath) {
  const absolute = path.join(root, relPath);
  return existsSync(absolute) ? readFileSync(absolute, 'utf8') : null;
}

function check(label, condition) {
  const ok = Boolean(condition);
  checks.push({ label, ok });
  if (!ok) {
    failures.push(label);
  }
}

// 1. Root LICENSE (application code) ------------------------------------------
const license = fileText('LICENSE');
check('LICENSE exists', license !== null);
check('LICENSE is non-trivial', license && license.length > 500);
check('LICENSE defers third-party content to NOTICE', license && /NOTICE/.test(license));

// 2. Verbatim third-party license texts ---------------------------------------
const ogl = fileText('src/legal/texts/OGL-1.0a.txt');
const ccBy = fileText('src/legal/texts/CC-BY-4.0.txt');
const dpcgl = fileText('src/legal/texts/DPCGL-1.0.txt');
check(
  'OGL 1.0a verbatim text present and complete',
  ogl &&
    ogl.length >= 4000 &&
    /OPEN GAME LICENSE\s+Version 1\.0a/i.test(ogl) &&
    /COPYRIGHT NOTICE/i.test(ogl)
);
check(
  'CC-BY-4.0 verbatim text present and complete',
  ccBy && ccBy.length >= 8000 && /Creative Commons Attribution 4\.0 International/i.test(ccBy)
);
check('DPCGL notice present', dpcgl && /Darrington Press Community Gaming|DPCGL/i.test(dpcgl));

// 3. Assembled NOTICE content -------------------------------------------------
const notice = fileText('NOTICE');
check('NOTICE exists', notice !== null);

const noticeMarkers = [
  ['verbatim OGL 1.0a', /OPEN GAME LICENSE\s+Version 1\.0a/i],
  ['OGL §15 chain of title', /Chain of Title/i],
  ['CC-BY-4.0 license', /Creative Commons Attribution 4\.0 International/i],
  ['SRD 5.1 (CC-BY) attribution', /System Reference Document 5\.1/],
  ['SRD 5.2 (CC-BY) attribution', /System Reference Document 5\.2/],
  ['DPCGL notice', /Darrington Press Community Gaming/i],
  ['not-affiliated disclaimer', /not affiliated with/i],
  ['AI-generated-content disclaimer', /AI-generated content/i],
  // LEGAL-2 resolved: M&M provenance is asserted as Open Game Content AND its sole
  // Product Identity carve-out is disclosed honestly, rather than hedged.
  [
    'M&M attributed as Open Game Content',
    /Mutants & Masterminds 3e content is drawn from the Open Game Content/,
  ],
  ['M&M Product Identity carve-out disclosed', /Hero Points.{0,15}Power Points/],
];
for (const [label, pattern] of noticeMarkers) {
  check(`NOTICE contains ${label}`, notice && pattern.test(notice));
}

const systemLabels = [
  'D&D 5e (2014)',
  'D&D 5e (2024)',
  'D&D 3.5e',
  'Pathfinder 1e',
  'Pathfinder 2e',
  'Mutants & Masterminds 3e',
  'Daggerheart',
];
for (const label of systemLabels) {
  check(`NOTICE attributes ${label}`, notice && notice.includes(`## ${label}`));
}

// 4. In-app reachability (static wiring) --------------------------------------
const component = fileText('src/components/LegalNotices.tsx');
check('Legal view component exists', component !== null);
check(
  'Legal view embeds the three verbatim texts',
  component &&
    /OGL-1\.0a\.txt\?raw/.test(component) &&
    /CC-BY-4\.0\.txt\?raw/.test(component) &&
    /DPCGL-1\.0\.txt\?raw/.test(component)
);
const app = fileText('src/App.tsx');
check('App wires the Legal view', app && /LegalNotices/.test(app));
// Phase 1 replaced the showLegal boolean with the nav union's legal overlay.
check('App exposes a control to open the Legal view', app && /openOverlay\('legal'\)/.test(app));

// Report ----------------------------------------------------------------------
for (const { label, ok } of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} of ${checks.length} legal-notice check(s) failed:`);
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  console.error(
    '\nRegenerate the texts/NOTICE with `npm run legal:generate` and ensure the ' +
      'Legal view stays wired in src/App.tsx, then re-run `npm run check:legal-notices`.'
  );
  process.exit(1);
}

console.log(`\nAll ${checks.length} legal-notice checks passed.`);
