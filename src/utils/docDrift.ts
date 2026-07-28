import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import packageJson from '../../package.json';
import roadmapMetrics from '../../docs/generated/roadmap-metrics.json';
import verificationBaseline from '../../docs/generated/verification-baseline.json';
import {
  CAPABILITY_PHRASE_RULES,
  capitalizeSupportLevel,
  COMMAND_RUNTIME_RULES,
  COUNT_RULES,
  type DocDriftTruth,
  RUNTIME_COPY_RULES,
  SUPPORT_MATRIX_RULES,
  VERIFICATION_RULES,
} from '../../docs/doc-drift.rules';
import { DOC_DRIFT_MANIFEST, type DocDriftRuleType } from '../../docs/doc-drift.manifest';
import { DaggerheartSystemDef } from '../systems/daggerheart/definition';
import { Dnd35eSystemDef } from '../systems/dnd35e/definition';
import { Dnd5e2024SystemDef } from '../systems/dnd5e-2024/definition';
import { Dnd5eSystemDef } from '../systems/dnd5e/definition';
import { Mam3eSystemDef } from '../systems/mam3e/definition';
import { Pf1eSystemDef } from '../systems/pf1e/definition';
import { Pf2eSystemDef } from '../systems/pf2e/definition';
import type { GameSystemId } from '../types/game-systems';
import { SYSTEM_SUPPORT_NOTES } from './documentationCopy';

const SYSTEM_DEFINITIONS = [
  Dnd5e2024SystemDef,
  Dnd5eSystemDef,
  Pf2eSystemDef,
  Dnd35eSystemDef,
  Pf1eSystemDef,
  Mam3eSystemDef,
  DaggerheartSystemDef,
] as const;

const ROOT_DOC_FILES = new Set(['README.md', 'CONTRIBUTING.md']);
const DATA_LOCAL_READMES = new Set([
  'src/data/mutants-and-masterminds/3e/conditions/README.md',
  'src/data/mutants-and-masterminds/3e/powers/README.md',
]);
const GENERATED_JSON_FILES = new Set([
  'docs/generated/roadmap-metrics.json',
  'docs/generated/verification-baseline.json',
]);
const BUILTIN_NPM_COMMANDS = new Set(['install', 'ci', 'test']);
const EXTERNAL_LINK_PREFIXES = ['http://', 'https://', 'mailto:'];
const HISTORICAL_BANNER_PATTERN = /Historical [^\n]+/;
const CURRENT_TRUTH_NOTE_PATTERN = /Current repo truth note \([A-Za-z]+ \d{1,2}, \d{4}\):/;

export interface DocDriftIssue {
  path: string;
  rule: DocDriftRuleType | 'manifest_rule';
  message: string;
}

function readText(rootDir: string, relativePath: string): string {
  return readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function readOptionalText(rootDir: string, relativePath: string): string | null {
  const absolutePath = path.join(rootDir, relativePath);
  if (!existsSync(absolutePath)) {
    return null;
  }

  return readFileSync(absolutePath, 'utf8');
}

function normalizeSlashes(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function walkDirectory(rootDir: string, relativeDir: string): string[] {
  const absoluteDir = path.join(rootDir, relativeDir);
  if (!existsSync(absoluteDir)) {
    return [];
  }

  const results: string[] = [];
  for (const entry of readdirSync(absoluteDir)) {
    const absoluteEntry = path.join(absoluteDir, entry);
    const relativeEntry = normalizeSlashes(path.relative(rootDir, absoluteEntry));
    const stats = statSync(absoluteEntry);
    if (stats.isDirectory()) {
      results.push(...walkDirectory(rootDir, relativeEntry));
      continue;
    }

    results.push(relativeEntry);
  }

  return results;
}

export function collectManifestCoverageTargets(rootDir: string): string[] {
  const docsFiles = walkDirectory(rootDir, 'docs').filter(
    (filePath) =>
      (filePath.endsWith('.md') || GENERATED_JSON_FILES.has(filePath)) && !filePath.endsWith('.ts')
  );
  const workflowFiles = walkDirectory(rootDir, '.github/workflows').filter(
    (filePath) => filePath.endsWith('.yml') || filePath.endsWith('.yaml')
  );
  const rootFiles = [...ROOT_DOC_FILES].filter((filePath) =>
    existsSync(path.join(rootDir, filePath))
  );
  const dataReadmes = [...DATA_LOCAL_READMES].filter((filePath) =>
    existsSync(path.join(rootDir, filePath))
  );

  return [...new Set([...rootFiles, ...docsFiles, ...dataReadmes, ...workflowFiles])].sort();
}

export function formatSupportedNodeRange(enginesValue: string): string {
  const exactMatches = [...enginesValue.matchAll(/\^(\d+)\.(\d+)\.\d+/g)];
  const minimumMatch = enginesValue.match(/>=\s*(\d+)\.(\d+)\.\d+/);

  const parts = exactMatches.map(([, major, minor]) => `${major}.${minor}+`);
  if (minimumMatch) {
    parts.push(`${minimumMatch[1]}+`);
  }

  if (parts.length === 0) {
    return enginesValue;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} (or ${parts.slice(1).join(' / ')})`;
}

function buildDocDriftTruth(rootDir: string): DocDriftTruth {
  const nvmVersion = readText(rootDir, '.nvmrc').trim();
  const nodeVersionFileVersion = readOptionalText(rootDir, '.node-version')?.trim() ?? null;
  const workflowText = readText(rootDir, '.github/workflows/ci.yml');
  const workflowNodeVersion =
    workflowText.match(/node-version:\s*['"]?([^'"\n]+)['"]?/)?.[1] ?? null;
  const workflowNodeVersionFile =
    workflowText.match(/node-version-file:\s*['"]?([^'"\n]+)['"]?/)?.[1] ?? null;
  const workflowVerifyCommand = workflowText.match(/run:\s*(npm run [^\n]+)/)?.[1] ?? null;
  const systemLabels = Object.fromEntries(
    SYSTEM_DEFINITIONS.map((definition) => [definition.id, definition.label])
  ) as Record<GameSystemId, string>;
  const systemSupportLevels = Object.fromEntries(
    SYSTEM_DEFINITIONS.map((definition) => [definition.id, definition.supportLevel])
  ) as Record<GameSystemId, 'full' | 'partial' | 'scaffold'>;

  return {
    registeredSystemCount: SYSTEM_DEFINITIONS.length,
    nvmVersion,
    nodeVersionFileVersion,
    pinnedNodeVersion: nvmVersion,
    supportedNodeRangeLabel: formatSupportedNodeRange(packageJson.engines.node),
    workflowNodeVersion,
    workflowNodeVersionFile,
    workflowUsesNetlify: workflowText.includes('Netlify'),
    workflowVerifyCommand,
    verificationBaseline,
    spellCounts: {
      'dnd-5e-2014': roadmapMetrics.productReachableSummary['dnd-5e-2014'].spells,
      'dnd-5e-2024': roadmapMetrics.productReachableSummary['dnd-5e-2024'].spells,
      'dnd-3.5e': roadmapMetrics.productReachableSummary['dnd-3.5e'].spells,
      pf1e: roadmapMetrics.productReachableSummary.pf1e.spells,
      pf2e: roadmapMetrics.productReachableSummary.pf2e.spells,
      mam3e: roadmapMetrics.productReachableSummary.mam3e.spells,
      daggerheart: roadmapMetrics.productReachableSummary.daggerheart.spells,
    },
    systemSupportLevels,
    systemLabels,
  };
}

export function extractDocumentedNpmCommands(contents: string): string[] {
  const commands = new Set<string>();
  const commandPattern = /\bnpm(?:\s+run)?\s+([a-z0-9:-]+)/gi;

  for (const match of contents.matchAll(commandPattern)) {
    const prefix = match[0].startsWith('npm run') ? 'npm run' : 'npm';
    commands.add(`${prefix} ${match[1]}`);
  }

  return [...commands];
}

export function validateDocumentedNpmCommands(
  contents: string,
  scripts: Record<string, string>
): string[] {
  const issues: string[] = [];

  for (const command of extractDocumentedNpmCommands(contents)) {
    const scriptName = command.replace(/^npm(?:\s+run)?\s+/, '');
    if (BUILTIN_NPM_COMMANDS.has(scriptName)) {
      continue;
    }

    if (!(scriptName in scripts)) {
      issues.push(`Unknown documented npm command: \`${command}\``);
    }
  }

  return issues;
}

export function slugifyMarkdownHeading(heading: string): string {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractMarkdownHeadings(contents: string): Set<string> {
  const headings = new Set<string>();
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^#{1,6}\s+(.+)$/);
    if (match) {
      headings.add(slugifyMarkdownHeading(match[1]));
    }
  }
  return headings;
}

function resolveMarkdownLinkPath(currentFilePath: string, linkTarget: string): string {
  const filePath = linkTarget.split('#')[0];
  return normalizeSlashes(path.normalize(path.join(path.dirname(currentFilePath), filePath)));
}

function isExternalLink(target: string): boolean {
  return EXTERNAL_LINK_PREFIXES.some((prefix) => target.startsWith(prefix));
}

function resolveMarkdownAnchorIssues(
  rootDir: string,
  sourcePath: string,
  targetPath: string,
  anchor: string
): string[] {
  if (!anchor) {
    return [];
  }

  const targetContents = readText(rootDir, targetPath);
  const headings = extractMarkdownHeadings(targetContents);
  const normalizedAnchor = slugifyMarkdownHeading(anchor.replace(/^#/, ''));

  return headings.has(normalizedAnchor)
    ? []
    : [`Broken markdown anchor in ${sourcePath}: \`${targetPath}#${normalizedAnchor}\``];
}

export function validateMarkdownLinks(
  rootDir: string,
  relativePath: string,
  contents: string
): string[] {
  const issues: string[] = [];
  const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

  for (const match of contents.matchAll(markdownLinkPattern)) {
    const target = match[1];
    if (!target || isExternalLink(target)) {
      continue;
    }

    const [fileTarget, anchor] = target.split('#');
    const resolvedPath =
      fileTarget.length === 0 ? relativePath : resolveMarkdownLinkPath(relativePath, target);

    if (!existsSync(path.join(rootDir, resolvedPath))) {
      issues.push(`Broken markdown link in ${relativePath}: \`${target}\``);
      continue;
    }

    if (target.includes('#')) {
      issues.push(
        ...resolveMarkdownAnchorIssues(rootDir, relativePath, resolvedPath, `#${anchor}`)
      );
    }
  }

  return issues;
}

export function extractRepoCodePaths(contents: string): Array<{ raw: string; path: string }> {
  const paths = new Map<string, string>();
  const codeSpanPattern = /`([^`]+)`/g;
  const looksLikeRepoPath =
    /^(README\.md|CONTRIBUTING\.md|docs\/[^\s`]+|src\/[^\s`]+|scripts\/[^\s`]+|netlify\/[^\s`]+|supabase\/[^\s`]+|package\.json|\.nvmrc|\.node-version|\.github\/[^\s`]+)$/;

  for (const match of contents.matchAll(codeSpanPattern)) {
    const candidate = match[1].trim();
    if (candidate.includes('*') || candidate.includes('<') || candidate.includes('>')) {
      continue;
    }

    const normalizedCandidate = candidate
      .replace(/#L\d+(?:C\d+)?$/, '')
      .replace(/:\d+(?::\d+)?(?:-\d+)?$/, '');
    const pathMatch = normalizedCandidate.match(looksLikeRepoPath);
    if (pathMatch) {
      paths.set(candidate, pathMatch[1]);
    }
  }

  return [...paths.entries()].map(([raw, resolvedPath]) => ({ raw, path: resolvedPath }));
}

export function validateRepoCodePaths(
  rootDir: string,
  relativePath: string,
  contents: string
): string[] {
  const issues: string[] = [];

  for (const repoPath of extractRepoCodePaths(contents)) {
    if (!existsSync(path.join(rootDir, repoPath.path))) {
      issues.push(`Broken repo path reference in ${relativePath}: \`${repoPath.raw}\``);
    }
  }

  return issues;
}

export function validateHistoricalHeader(contents: string): string[] {
  const issues: string[] = [];
  const headerSlice = contents.split(/\r?\n/).slice(0, 20).join('\n');

  if (!HISTORICAL_BANNER_PATTERN.test(headerSlice)) {
    issues.push('Missing historical snapshot banner.');
  }

  if (!CURRENT_TRUTH_NOTE_PATTERN.test(headerSlice)) {
    issues.push('Missing current repo truth note with absolute date.');
  }

  return issues;
}

/** Markers that mean a plan section has been resolved and is no longer a gate. */
const RESOLVED_SECTION_MARKERS =
  /\b(DECIDED|DONE|RESOLVED|MOOT|CUT|CLOSED|SHIPPED|UNBLOCKED|NOT WORK)\b/;

/**
 * A "BLOCKED on §X" that outlives §X's resolution parks work that is already
 * free to start, which is the most expensive kind of stale plan text: it is
 * invisible (nothing is wrong, work simply never gets scheduled) and it reads
 * as authoritative.
 *
 * Finds every `BLOCKED on <section ref>` in a plan, resolves the referenced
 * section's own heading in the same file, and fails if that heading is marked
 * resolved — struck through, or carrying DECIDED / DONE / MOOT / CUT etc.
 *
 * Deliberately same-file only. A cross-document dependency graph is a bigger
 * design than this is worth, and every observed instance was intra-file.
 */
export function validateBlockedReferences(contents: string): string[] {
  const issues: string[] = [];
  const lines = contents.split(/\r?\n/);

  // Index every section heading by its leading number, e.g. "### 0.2 …" -> "0.2".
  const headingByRef = new Map<string, string>();
  for (const line of lines) {
    const heading = /^#{2,4}\s+§?(\d+(?:\.\d+)*)[.\s]/.exec(line);
    if (heading) headingByRef.set(heading[1], line);
  }

  const seen = new Set<string>();
  for (const line of lines) {
    // Skip the heading lines themselves: a heading may legitimately say
    // "~~BLOCKED on 0.3~~ DONE" while recording that it *used* to be blocked.
    if (/^#{2,4}\s/.test(line) && RESOLVED_SECTION_MARKERS.test(line)) continue;

    for (const match of line.matchAll(/BLOCKED on\s+§?(\d+(?:\.\d+)*)/gi)) {
      const ref = match[1];
      const heading = headingByRef.get(ref);
      if (!heading || seen.has(ref)) continue;
      if (RESOLVED_SECTION_MARKERS.test(heading) || /~~/.test(heading)) {
        seen.add(ref);
        issues.push(
          `Says "BLOCKED on ${ref}", but §${ref} is already resolved: "${heading.trim()}". ` +
            'Update the blocker or remove it — a stale block parks work that can start.'
        );
      }
    }
  }

  return issues;
}

/**
 * The gap ledger is the machine-readable half of the plan, so a status there
 * that contradicts its own cited evidence is worse than stale prose — the
 * generated `master-gap-ledger.md` republishes it as fact.
 *
 * Two checks, both drawn from real contradictions rather than invented:
 *   1. An item whose `detail` announces closure must not carry a non-done
 *      `status`. Self-contradiction inside one record.
 *   2. An item still open whose `evidence` cites `srd-coverage.md` must be
 *      supported by that report actually listing something missing. This is the
 *      `p1.single-entry-gaps` case: it sat at `status: 'missing'` naming four
 *      entries while the independent networked denominator reported
 *      "complete (0 missing)" for every category owning them.
 */
export function validateLedgerStatus(rootDir: string): string[] {
  const issues: string[] = [];
  const sourcePath = 'docs/master-gap-ledger.source.ts';
  if (!existsSync(path.join(rootDir, sourcePath))) return issues;
  const source = readText(rootDir, sourcePath);

  const coveragePath = 'docs/generated/srd-coverage.md';
  const coverage = existsSync(path.join(rootDir, coveragePath))
    ? readText(rootDir, coveragePath)
    : '';
  // "…/spells — complete (0 missing)." vs "…/feats — 721 missing: …"
  const coverageReportsAnyMissing = /—\s*\d+\s+missing:/.test(coverage);

  const OPEN_STATUSES = new Set(['missing', 'pending', 'blocked', 'in-progress']);

  // Anchored to the START of the detail, deliberately. The first draft matched
  // these words anywhere and immediately produced two false positives:
  // `p5.infra-gaps` and `p1.provenance-over-inclusion-audit` both describe
  // SUB-parts closing ("Observability closed 2026-07-25 … Backup/DR closed …")
  // while the item itself is legitimately still in progress. That is normal and
  // correct prose, so matching it is the gate crying wolf — which is worse than
  // no gate, because it trains the next person to weaken or ignore it.
  //
  // The convention this encodes: if a detail declares the WHOLE item closed, it
  // says so first. Mid-sentence mentions of a closed sub-part are untouched.
  const CLOSURE_IN_DETAIL = /^\s*(CLOSED|RESOLVED|DONE)\b/i;

  for (const block of source.split(/\n\s*\{\s*\n/).slice(1)) {
    const id = /id:\s*'([^']+)'/.exec(block)?.[1];
    const status = /status:\s*'([^']+)'/.exec(block)?.[1];
    if (!id || !status || !OPEN_STATUSES.has(status)) continue;

    const detail = /detail:\s*\n?\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/.exec(block);
    const detailText = detail ? (detail[1] ?? detail[2] ?? detail[3] ?? '') : '';
    if (CLOSURE_IN_DETAIL.test(detailText)) {
      issues.push(
        `Ledger item "${id}" has status '${status}' but its own detail announces closure. ` +
          'Set status to done, or state what remains.'
      );
    }

    const evidence = /evidence:\s*\n?\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/.exec(block);
    const evidenceText = evidence ? (evidence[1] ?? evidence[2] ?? evidence[3] ?? '') : '';
    if (/srd-coverage\.md/.test(evidenceText) && coverage && !coverageReportsAnyMissing) {
      issues.push(
        `Ledger item "${id}" has status '${status}' and cites ${coveragePath}, but that report ` +
          'lists no missing entries at all. The cited evidence contradicts the status.'
      );
    }
  }

  return issues;
}

function pushExpectedTextIssues(
  issues: DocDriftIssue[],
  contents: string,
  pathName: string,
  rule: DocDriftRuleType,
  expectedText: string,
  description: string
): void {
  if (!contents.includes(expectedText)) {
    issues.push({
      path: pathName,
      rule,
      message: `Missing ${description}: \`${expectedText}\``,
    });
  }
}

function validateWorkflowRuntime(rootDir: string): DocDriftIssue[] {
  const issues: DocDriftIssue[] = [];
  const truth = buildDocDriftTruth(rootDir);

  if (truth.workflowVerifyCommand !== truth.verificationBaseline.verifyCommand) {
    issues.push({
      path: '.github/workflows/ci.yml',
      rule: 'command_rule',
      message: `Workflow verify command drifted to \`${truth.workflowVerifyCommand ?? 'missing'}\`. Expected \`${truth.verificationBaseline.verifyCommand}\`.`,
    });
  }

  if (!truth.workflowUsesNetlify) {
    issues.push({
      path: '.github/workflows/ci.yml',
      rule: 'command_rule',
      message: 'Workflow no longer contains the documented Netlify deployment path.',
    });
  }

  if (!truth.nodeVersionFileVersion) {
    issues.push({
      path: '.github/workflows/ci.yml',
      rule: 'command_rule',
      message: 'Pinned runtime drift: .node-version is missing.',
    });
  } else if (truth.nodeVersionFileVersion !== truth.nvmVersion) {
    issues.push({
      path: '.github/workflows/ci.yml',
      rule: 'command_rule',
      message: `.nvmrc (\`${truth.nvmVersion}\`) no longer matches .node-version (\`${truth.nodeVersionFileVersion}\`).`,
    });
  }

  if (truth.workflowNodeVersionFile !== '.nvmrc') {
    issues.push({
      path: '.github/workflows/ci.yml',
      rule: 'command_rule',
      message: `Workflow must use \`node-version-file: '.nvmrc'\`; found \`${truth.workflowNodeVersionFile ?? truth.workflowNodeVersion ?? 'missing'}\`.`,
    });
  }

  return issues;
}

function validateRuntimeCopySource(rootDir: string, relativePath: string): DocDriftIssue[] {
  const issues: DocDriftIssue[] = [];
  const contents = readText(rootDir, relativePath);

  for (const rule of RUNTIME_COPY_RULES.filter((entry) => entry.path === relativePath)) {
    if (rule.kind === 'definition-note') {
      const sourceText = readText(rootDir, relativePath);
      const expectedValue =
        SYSTEM_SUPPORT_NOTES[rule.systemId as keyof typeof SYSTEM_SUPPORT_NOTES];
      const actualValue =
        rule.systemId === 'dnd-3.5e'
          ? Dnd35eSystemDef.supportNotes
          : rule.systemId === 'pf1e'
            ? Pf1eSystemDef.supportNotes
            : DaggerheartSystemDef.supportNotes;

      if (actualValue !== expectedValue) {
        issues.push({
          path: relativePath,
          rule: 'runtime_copy_rule',
          message: `Support note drift for ${rule.systemId}.`,
        });
      }

      if (!sourceText.includes(rule.sourceToken)) {
        issues.push({
          path: relativePath,
          rule: 'runtime_copy_rule',
          message: `Runtime-copy source token missing: \`${rule.sourceToken}\``,
        });
      }

      continue;
    }

    for (const token of rule.requiredTokens) {
      if (!contents.includes(token)) {
        issues.push({
          path: relativePath,
          rule: 'runtime_copy_rule',
          message: `Canonical runtime-copy token missing: \`${token}\``,
        });
      }
    }
  }

  return issues;
}

export async function runDocDriftCheck(rootDir = process.cwd()): Promise<DocDriftIssue[]> {
  const truth = buildDocDriftTruth(rootDir);
  const issues: DocDriftIssue[] = [];
  const manifestPaths = new Set(DOC_DRIFT_MANIFEST.map((surface) => surface.path));
  const coverageTargets = collectManifestCoverageTargets(rootDir);

  for (const relativePath of coverageTargets) {
    if (!manifestPaths.has(relativePath)) {
      issues.push({
        path: relativePath,
        rule: 'manifest_rule',
        message: 'In-scope document is missing from docs/doc-drift.manifest.ts.',
      });
    }
  }

  for (const surface of DOC_DRIFT_MANIFEST) {
    const absolutePath = path.join(rootDir, surface.path);
    if (!existsSync(absolutePath)) {
      issues.push({
        path: surface.path,
        rule: 'manifest_rule',
        message: 'Manifest entry points to a missing file.',
      });
      continue;
    }

    const contents = readText(rootDir, surface.path);

    if (surface.rules.includes('count_rule')) {
      for (const rule of COUNT_RULES.filter((entry) => entry.path === surface.path)) {
        pushExpectedTextIssues(
          issues,
          contents,
          surface.path,
          'count_rule',
          rule.expectedText(truth),
          rule.description
        );
      }
    }

    if (surface.rules.includes('support_matrix_rule')) {
      for (const rule of SUPPORT_MATRIX_RULES.filter((entry) => entry.path === surface.path)) {
        for (const expectedRow of rule.expectedRows(truth)) {
          pushExpectedTextIssues(
            issues,
            contents,
            surface.path,
            'support_matrix_rule',
            expectedRow,
            rule.description
          );
        }
      }
    }

    if (surface.rules.includes('verification_rule')) {
      for (const rule of VERIFICATION_RULES.filter((entry) => entry.path === surface.path)) {
        pushExpectedTextIssues(
          issues,
          contents,
          surface.path,
          'verification_rule',
          rule.expectedText(truth),
          rule.description
        );
      }
    }

    if (surface.rules.includes('command_rule')) {
      for (const rule of COMMAND_RUNTIME_RULES.filter((entry) => entry.path === surface.path)) {
        pushExpectedTextIssues(
          issues,
          contents,
          surface.path,
          'command_rule',
          rule.expectedText(truth),
          rule.description
        );
      }

      for (const commandIssue of validateDocumentedNpmCommands(
        contents,
        packageJson.scripts as Record<string, string>
      )) {
        issues.push({
          path: surface.path,
          rule: 'command_rule',
          message: commandIssue,
        });
      }
    }

    if (surface.rules.includes('path_ref_rule') && surface.path.endsWith('.md')) {
      for (const message of validateMarkdownLinks(rootDir, surface.path, contents)) {
        issues.push({ path: surface.path, rule: 'path_ref_rule', message });
      }

      if (surface.kind !== 'historical') {
        for (const message of validateRepoCodePaths(rootDir, surface.path, contents)) {
          issues.push({ path: surface.path, rule: 'path_ref_rule', message });
        }
      }
    }

    if (surface.rules.includes('historical_banner_rule')) {
      for (const message of validateHistoricalHeader(contents)) {
        issues.push({ path: surface.path, rule: 'historical_banner_rule', message });
      }
    }

    if (surface.rules.includes('blocked_ref_rule')) {
      for (const message of validateBlockedReferences(contents)) {
        issues.push({ path: surface.path, rule: 'blocked_ref_rule', message });
      }
    }

    if (surface.rules.includes('ledger_status_rule')) {
      for (const message of validateLedgerStatus(rootDir)) {
        issues.push({
          path: 'docs/master-gap-ledger.source.ts',
          rule: 'ledger_status_rule',
          message,
        });
      }
    }

    if (surface.rules.includes('runtime_copy_rule')) {
      issues.push(...validateRuntimeCopySource(rootDir, surface.path));
    }

    if (surface.rules.includes('capability_phrase_rule')) {
      for (const rule of CAPABILITY_PHRASE_RULES.filter((entry) => entry.path === surface.path)) {
        pushExpectedTextIssues(
          issues,
          contents,
          surface.path,
          'capability_phrase_rule',
          rule.expected,
          rule.description
        );
      }
    }
  }

  issues.push(...validateWorkflowRuntime(rootDir));
  return issues;
}

export function formatDocDriftIssues(issues: DocDriftIssue[]): string {
  const grouped = new Map<string, DocDriftIssue[]>();

  for (const issue of issues) {
    const bucket = grouped.get(issue.rule) ?? [];
    bucket.push(issue);
    grouped.set(issue.rule, bucket);
  }

  const lines = ['Document drift checks failed.'];
  for (const [rule, ruleIssues] of grouped.entries()) {
    lines.push('');
    lines.push(`${rule}:`);
    for (const issue of ruleIssues) {
      lines.push(`- ${issue.path}: ${issue.message}`);
    }
  }

  return lines.join('\n');
}

export function getExpectedSupportMatrixRows(): string[] {
  return SYSTEM_DEFINITIONS.map(
    (definition) =>
      `| ${definition.label} | ${capitalizeSupportLevel(definition.supportLevel ?? 'full')} |`
  );
}
