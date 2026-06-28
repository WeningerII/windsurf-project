#!/usr/bin/env node
/**
 * fetch-legal-texts.mjs — GENERATOR (run manually, like the encoders).
 *
 * Fetches the canonical verbatim license texts from open sources and assembles
 * the repo's Legal Compliance Pack:
 *   - LICENSE                  (OGL 1.0a — the primary license for the SRD content)
 *   - NOTICE                   (OGL 1.0a + CC-BY-4.0 + per-system attributions + AI disclaimer)
 *   - src/legal/legalText.ts   (the same texts as typed string constants the in-app
 *                               <LegalNotices/> route renders — so no license text is
 *                               hand-authored in component source)
 *
 * Run this whenever the license sources change:
 *     node scripts/fetch-legal-texts.mjs
 * The generated files are committed; the build never needs the network.
 *
 * Sources:
 *   - OGL 1.0a (incl. SRD 5.0 Section-15 chain of title): BTMorton/dnd-5e-srd LICENSE
 *   - CC-BY-4.0 legal code: spdx/license-list-data
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const OGL_SOURCE = 'https://raw.githubusercontent.com/BTMorton/dnd-5e-srd/master/LICENSE';
const CCBY_SOURCE = 'https://raw.githubusercontent.com/spdx/license-list-data/main/text/CC-BY-4.0.txt';

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  return await res.text();
}

/** Keep only the OGL/SRD portion; the upstream file appends an MIT code license. */
function extractOgl(raw) {
  const mitIdx = raw.indexOf('MIT License');
  const ogl = (mitIdx === -1 ? raw : raw.slice(0, mitIdx)).trim();
  if (!ogl.includes('OPEN GAME LICENSE') || !ogl.includes('Version 1.0a')) {
    throw new Error('Fetched OGL text is missing expected markers (OPEN GAME LICENSE / Version 1.0a)');
  }
  return ogl;
}

const SYSTEM_ATTRIBUTIONS = `
================================================================================
OPEN-CONTENT ATTRIBUTIONS BY GAME SYSTEM
================================================================================

This product uses only open-game / open-content material. Each system's content
is used under the license noted, with the Section-15 / attribution chain below.

--- D&D 5e (2014) — SRD 5.1, under OGL 1.0a ---
System Reference Document 5.1 Copyright 2023, Wizards of the Coast LLC; Authors
Mike Mearls, Jeremy Crawford, Chris Perkins, Rodney Thompson, Peter Lee, James
Wyatt, Robert J. Schwalb, Bruce R. Cordell, Chris Sims, and Steve Townshend,
based on original material by E. Gary Gygax and Dave Arneson. The SRD 5.1 is also
available under CC-BY-4.0; this product relies on the OGL 1.0a grant for 2014 content.

--- D&D 5e (2024) — SRD 5.2 / 5.2.1, under Creative Commons Attribution 4.0 (CC-BY-4.0) ---
System Reference Document 5.2.1 Copyright 2024, Wizards of the Coast LLC,
licensed under Creative Commons Attribution 4.0 International (CC-BY-4.0).
Full CC-BY-4.0 legal code is reproduced below.

--- D&D 3.5e — SRD 3.5, under OGL 1.0a ---
System Reference Document 3.5 Copyright 2000-2003, Wizards of the Coast, Inc.;
Authors Jonathan Tweet, Monte Cook, Skip Williams, Rich Baker, Andy Collins,
David Noonan, Rich Redman, Bruce R. Cordell, John D. Rateliff, Thomas Reid,
James Wyatt, based on original material by E. Gary Gygax and Dave Arneson.

--- Pathfinder 1e — Core Rulebook OGC, under OGL 1.0a ---
Pathfinder Roleplaying Game Core Rulebook. Copyright 2009, Paizo Publishing, LLC;
Author: Jason Bulmahn, based on the 3.5 System Reference Document.

--- Pathfinder 2e — Core Rulebook OGC, under OGL 1.0a ---
Pathfinder Core Rulebook (Second Edition). Copyright 2019, Paizo Inc.;
Authors: Logan Bonner, Jason Bulmahn, Stephen Radney-MacFarland, Mark Seifter.

--- Mutants & Masterminds 3e — SRD OGC (d20herosrd), under OGL 1.0a ---
Mutants & Masterminds open-game content used under OGL 1.0a via the d20herosrd
open-content designation. NOTE (LEGAL-2, provenance under review): the product's
source whitelist currently references a commercial title; this attribution must be
re-pointed to the precise d20herosrd OGC designation before public release.

--- Daggerheart — SRD 1.0, under the Darrington Press Community Gaming License (DPCGL) ---
Daggerheart content is used under the Darrington Press Community Gaming License
(DPCGL). Daggerheart and all related marks are trademarks of Darrington Press LLC.
This product is an independent work and is not affiliated with, endorsed,
sponsored, or approved by Darrington Press LLC.
`;

const AI_DISCLAIMER = `
================================================================================
AI-GENERATED CONTENT & AFFILIATION DISCLAIMER
================================================================================

Some assistive features of this application can generate text or imagery using
AI models. AI-generated content is clearly gated behind an opt-in control and is
not represented as official rules content. This application is an independent,
fan-made tool. It is not affiliated with, endorsed, sponsored, or approved by
Wizards of the Coast, Paizo Inc., Green Ronin Publishing, or Darrington Press LLC.
All trademarks are the property of their respective owners.
`;

async function main() {
  console.log('Fetching canonical license texts...');
  const oglRaw = await fetchText(OGL_SOURCE);
  const ogl = extractOgl(oglRaw);
  const ccby = (await fetchText(CCBY_SOURCE)).trim();
  if (!/creative commons/i.test(ccby)) {
    throw new Error('Fetched CC-BY text is missing the "Creative Commons" marker');
  }
  console.log(`  OGL 1.0a: ${ogl.length} chars`);
  console.log(`  CC-BY-4.0: ${ccby.length} chars`);

  const licenseText = `${ogl}\n`;
  writeFileSync(resolve(ROOT, 'LICENSE'), licenseText);

  const noticeText = [
    'THIRD-PARTY OPEN-CONTENT NOTICES',
    '================================================================================',
    '',
    'This file aggregates the open-game / open-content licenses and attributions for',
    'every game system whose System Reference Document content this product uses.',
    '',
    '--------------------------------------------------------------------------------',
    'PART A — OPEN GAME LICENSE Version 1.0a (verbatim)',
    '--------------------------------------------------------------------------------',
    '',
    ogl,
    '',
    SYSTEM_ATTRIBUTIONS.trim(),
    '',
    '--------------------------------------------------------------------------------',
    'PART B — CREATIVE COMMONS ATTRIBUTION 4.0 INTERNATIONAL (CC-BY-4.0, verbatim)',
    '  Applies to: D&D 5e 2024 content (SRD 5.2.1).',
    '--------------------------------------------------------------------------------',
    '',
    ccby,
    '',
    AI_DISCLAIMER.trim(),
    '',
  ].join('\n');
  writeFileSync(resolve(ROOT, 'NOTICE'), noticeText);

  const legalDir = resolve(ROOT, 'src/legal');
  mkdirSync(legalDir, { recursive: true });
  const tsEscape = (s) => '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
  const legalTs = `// GENERATED by scripts/fetch-legal-texts.mjs — DO NOT EDIT BY HAND.
// Canonical license texts fetched from open sources (OGL 1.0a: BTMorton/dnd-5e-srd;
// CC-BY-4.0: spdx/license-list-data) so the in-app Legal route renders verbatim,
// authentic license text without it being hand-authored in component source.

export const OGL_1_0A_TEXT: string = ${tsEscape(ogl)};

export const CC_BY_4_0_TEXT: string = ${tsEscape(ccby)};

export const SYSTEM_ATTRIBUTIONS_TEXT: string = ${tsEscape(SYSTEM_ATTRIBUTIONS.trim())};

export const AI_DISCLAIMER_TEXT: string = ${tsEscape(AI_DISCLAIMER.trim())};

/** Section headings for the in-app Legal page, in render order. */
export const LEGAL_SECTIONS: ReadonlyArray<{ id: string; title: string; body: string }> = [
  { id: 'ogl', title: 'Open Game License v1.0a', body: OGL_1_0A_TEXT },
  { id: 'attributions', title: 'Open-Content Attributions by System', body: SYSTEM_ATTRIBUTIONS_TEXT },
  { id: 'cc-by', title: 'Creative Commons Attribution 4.0 (SRD 5.2)', body: CC_BY_4_0_TEXT },
  { id: 'ai-disclaimer', title: 'AI-Generated Content & Affiliation Disclaimer', body: AI_DISCLAIMER_TEXT },
];
`;
  writeFileSync(resolve(legalDir, 'legalText.ts'), legalTs);

  execSync(`npx prettier --write ${JSON.stringify(resolve(legalDir, 'legalText.ts'))}`, {
    cwd: ROOT,
    stdio: 'inherit',
  });

  console.log('Wrote: LICENSE, NOTICE, src/legal/legalText.ts');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
