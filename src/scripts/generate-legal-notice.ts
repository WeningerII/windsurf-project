/**
 * Generates the root `NOTICE` file and the verbatim license texts under
 * `src/legal/texts/` from their canonical upstreams.
 *
 * WHY fetch-at-build-time instead of committing hand-typed text: the OGL 1.0a,
 * CC-BY-4.0, and DPCGL bodies are long and legally load-bearing (they must be
 * reproduced verbatim). Pulling them from canonical sources removes all
 * transcription risk and keeps them current. The fetched files are committed, so
 * the build, the app, and `check:legal-notices` never need the network — re-run
 * this only to refresh or re-verify the texts (`npm run legal:generate`).
 *
 * This script deliberately prints only metadata (byte counts + short hashes),
 * never the license bodies, so running it produces no verbatim-text output.
 *
 * raw.githubusercontent.com is this environment's reliable fetch channel
 * (see docs/srd-sources.md), so canonical raw-GitHub mirrors are tried first,
 * with the authoritative publisher pages as HTML fallbacks.
 */

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { legalAttributions } from '../legal/attributions';

const projectRoot = process.cwd();
const textsDir = path.join(projectRoot, 'src/legal/texts');
const noticePath = path.join(projectRoot, 'NOTICE');

interface FetchTarget {
  /** Matches a `LegalLicenseRef.id` and is the basename of the written text. */
  id: string;
  file: string;
  /** A required substring proving we fetched the right document. */
  marker: RegExp;
  /** Reject suspiciously short responses (truncation / error pages). */
  minLength: number;
  /** Candidate URLs in priority order; the first that validates wins. */
  sources: readonly string[];
}

const TARGETS: readonly FetchTarget[] = [
  {
    id: 'OGL-1.0a',
    file: 'OGL-1.0a.txt',
    marker: /OPEN GAME LICENSE\s+Version 1\.0a/i,
    minLength: 4000,
    sources: [
      'https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/basic-rules-and-legal/legal-information.md',
      'https://raw.githubusercontent.com/olimot/srd-v3.5-md/master/basic-rules-and-legal/legal-information.md',
      'https://opengamingfoundation.org/ogl.html',
      'https://www.d20srd.org/ogl.htm',
    ],
  },
  {
    id: 'CC-BY-4.0',
    file: 'CC-BY-4.0.txt',
    marker: /Creative Commons Attribution 4\.0 International/i,
    minLength: 8000,
    sources: [
      'https://raw.githubusercontent.com/spdx/license-list-data/main/text/CC-BY-4.0.txt',
      'https://creativecommons.org/licenses/by/4.0/legalcode.txt',
    ],
  },
  {
    // The full DPCGL body lives only on darringtonpress.com (which 403s automated
    // fetchers); the SRD repos carry the required short DPCGL *notice* instead,
    // which is exactly what the launch-blocker pack asks reproduced for Daggerheart.
    id: 'DPCGL',
    file: 'DPCGL-1.0.txt',
    marker: /Darrington Press Community Gaming|DPCGL/i,
    minLength: 300,
    sources: [
      'https://raw.githubusercontent.com/Batres3/daggerheart-srd/main/LICENSE',
      'https://raw.githubusercontent.com/Batres3/daggerheart-srd/master/LICENSE',
      'https://raw.githubusercontent.com/seansbox/daggerheart-srd/main/LICENSE',
      'https://darringtonpress.com/license/',
    ],
  },
];

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&mdash;': '—',
  '&ndash;': '–',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&copy;': '©',
};

function looksLikeHtml(body: string): boolean {
  return /<\s*(?:!doctype|html|head|body|p|div|br)\b/i.test(body);
}

function stripHtml(html: string): string {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/(?:p|div|h[1-6]|li|tr|blockquote)>/gi, '\n')
    .replace(/<br\s*\/?>(?:\s*)/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/gi, (match) => HTML_ENTITIES[match.toLowerCase()] ?? match)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function normalize(body: string): string {
  const cleaned = looksLikeHtml(body) ? stripHtml(body) : body;
  return `${cleaned.replace(/\r\n/g, '\n').trim()}\n`;
}

async function fetchValidated(target: FetchTarget): Promise<{ url: string; text: string }> {
  const failures: string[] = [];
  for (const url of target.sources) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': 'rpg-toolkit-legal-notice-generator' },
      });
      if (!response.ok) {
        failures.push(`${url} -> HTTP ${response.status}`);
        continue;
      }
      const text = normalize(await response.text());
      if (text.length < target.minLength) {
        failures.push(`${url} -> too short (${text.length} < ${target.minLength})`);
        continue;
      }
      if (!target.marker.test(text)) {
        failures.push(`${url} -> expected marker not found`);
        continue;
      }
      return { url, text };
    } catch (error) {
      failures.push(`${url} -> ${(error as Error).message}`);
    }
  }
  throw new Error(`All sources failed for ${target.id}:\n  ${failures.join('\n  ')}`);
}

function shortHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 12);
}

const RULE = '='.repeat(80);
const SUBRULE = '-'.repeat(80);

function buildNotice(verbatim: Map<string, string>): string {
  const { intro, updated, systems, licenses, disclaimers } = legalAttributions;
  const lines: string[] = [];

  lines.push('RPG Character Sheet & VTT Toolkit — Third-Party Notices');
  lines.push(`Last reviewed: ${updated}`);
  lines.push('');
  lines.push(intro);
  lines.push('');
  lines.push(
    'NOTE: This file is generated by `npm run legal:generate` from ' +
      'src/legal/attributions.ts plus the verbatim license texts in ' +
      'src/legal/texts/. Edit those sources, not this file.'
  );
  lines.push('');
  lines.push(RULE);
  lines.push('1. OPEN-CONTENT ATTRIBUTIONS BY GAME SYSTEM');
  lines.push(RULE);
  for (const system of systems) {
    const license = licenses.find((entry) => entry.id === system.licenseId);
    lines.push('');
    lines.push(`## ${system.systemLabel}`);
    lines.push(`Content: ${system.content}`);
    lines.push(`License: ${license ? `${license.name} (${license.url})` : system.licenseId}`);
    lines.push('');
    lines.push(system.attribution);
    if (system.section15.length > 0) {
      lines.push('');
      lines.push('Open Game License §15 — Chain of Title:');
      for (const entry of system.section15) {
        lines.push(`  - ${entry}`);
      }
    }
    if (system.provenanceStatus === 'under-review' && system.provenanceNote) {
      lines.push('');
      lines.push(`PROVENANCE UNDER REVIEW: ${system.provenanceNote}`);
    }
  }

  lines.push('');
  lines.push(RULE);
  lines.push('2. DISCLAIMERS');
  lines.push(RULE);
  lines.push('');
  lines.push(`Affiliation: ${disclaimers.notAffiliated}`);
  lines.push('');
  lines.push(`Trademarks: ${disclaimers.trademarks}`);
  lines.push('');
  lines.push(`AI-generated content: ${disclaimers.ai}`);

  lines.push('');
  lines.push(RULE);
  lines.push('3. VERBATIM LICENSE TEXTS & NOTICES');
  lines.push(RULE);
  for (const license of licenses) {
    const text = verbatim.get(license.id);
    if (!text) {
      continue;
    }
    lines.push('');
    lines.push(SUBRULE);
    lines.push(license.name);
    lines.push(SUBRULE);
    lines.push('');
    lines.push(text.trimEnd());
  }

  return `${lines.join('\n')}\n`;
}

async function main(): Promise<void> {
  mkdirSync(textsDir, { recursive: true });
  const verbatim = new Map<string, string>();
  const failures: string[] = [];

  // Attempt every target independently so a single failing license does not
  // hide the status of the others — one run reports the full picture.
  for (const target of TARGETS) {
    try {
      const { url, text } = await fetchValidated(target);
      writeFileSync(path.join(textsDir, target.file), text, 'utf8');
      verbatim.set(target.id, text);
      console.log(
        `✓ ${target.id.padEnd(12)} ${String(text.length).padStart(7)} bytes  ` +
          `sha256=${shortHash(text)}  <- ${url}`
      );
    } catch (error) {
      console.error(`✗ ${target.id}\n  ${(error as Error).message}`);
      failures.push(target.id);
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Could not fetch verbatim text for: ${failures.join(', ')}. ` +
        'NOTICE not regenerated; existing committed texts left untouched.'
    );
  }

  // Re-read from disk so the NOTICE is assembled from exactly what was written.
  for (const target of TARGETS) {
    verbatim.set(target.id, readFileSync(path.join(textsDir, target.file), 'utf8'));
  }

  const notice = buildNotice(verbatim);
  writeFileSync(noticePath, notice, 'utf8');
  console.log(`✓ NOTICE       ${String(notice.length).padStart(7)} bytes  (assembled)`);
}

main().catch((error: unknown) => {
  console.error((error as Error).message);
  process.exitCode = 1;
});
