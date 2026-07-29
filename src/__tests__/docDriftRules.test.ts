import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  extractDocumentedNpmCommands,
  extractRepoCodePaths,
  runDocDriftCheck,
  validateBlockedReferences,
  validateDocumentedNpmCommands,
  validateHistoricalHeader,
  validateLedgerReferences,
  validateLedgerStatus,
  validateMarkdownLinks,
  validateRepoCodePaths,
} from '../utils/docDrift';

const tempDirs: string[] = [];

function makeTempDir(): string {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'doc-drift-'));
  tempDirs.push(tempDir);
  return tempDir;
}

afterEach(() => {
  for (const tempDir of tempDirs.splice(0)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

describe('docDrift helpers', () => {
  it('extracts documented npm commands and ignores duplicates', () => {
    const commands = extractDocumentedNpmCommands(`
      Run \`npm run verify\` after \`npm run check:doc-drift\`.
      You can also call npm test during local work.
      npm run verify
    `);

    expect(commands).toEqual(['npm run verify', 'npm run check:doc-drift', 'npm test']);
  });

  it('fails when a documented npm command is missing from package scripts', () => {
    const issues = validateDocumentedNpmCommands(
      'Run `npm run verify` and `npm run imaginary-task`.',
      { verify: 'npm test' }
    );

    expect(issues).toContain('Unknown documented npm command: `npm run imaginary-task`');
  });

  it('requires historical banners and current repo truth notes', () => {
    expect(
      validateHistoricalHeader(
        [
          '# Historical File',
          '',
          '> Historical execution record: preserved for context.',
          '',
          'Current repo truth note (March 14, 2026): use the live docs instead.',
        ].join('\n')
      )
    ).toEqual([]);

    expect(validateHistoricalHeader('# Missing banner')).toEqual([
      'Missing historical snapshot banner.',
      'Missing current repo truth note with absolute date.',
    ]);
  });

  it('detects broken markdown links and anchors', () => {
    const rootDir = makeTempDir();
    mkdirSync(path.join(rootDir, 'docs'), { recursive: true });
    writeFileSync(
      path.join(rootDir, 'README.md'),
      '# Root\n\nSee [Guide](docs/guide.md#missing).\n'
    );
    writeFileSync(path.join(rootDir, 'docs', 'guide.md'), '# Guide\n\n## Present Heading\n');

    expect(validateMarkdownLinks(rootDir, 'README.md', readmeWithGuideLink())).toEqual([
      'Broken markdown anchor in README.md: `docs/guide.md#missing`',
    ]);
  });

  it('resolves repo code paths with line suffixes', () => {
    const rootDir = makeTempDir();
    writeFileSync(path.join(rootDir, 'README.md'), '# Root\n');
    const issues = validateRepoCodePaths(
      rootDir,
      'README.md',
      'See `README.md#L1` and `src/missing.ts:10` for details.'
    );

    expect(extractRepoCodePaths('See `README.md#L1` and `src/missing.ts:10`.')).toEqual([
      { raw: 'README.md#L1', path: 'README.md' },
      { raw: 'src/missing.ts:10', path: 'src/missing.ts' },
    ]);
    expect(issues).toEqual(['Broken repo path reference in README.md: `src/missing.ts:10`']);
  });

  it('gates deploy-surface paths under netlify/ and supabase/', () => {
    const rootDir = makeTempDir();
    mkdirSync(path.join(rootDir, 'netlify', 'functions'), { recursive: true });
    mkdirSync(path.join(rootDir, 'supabase', 'migrations'), { recursive: true });
    writeFileSync(path.join(rootDir, 'netlify', 'functions', 'ai-gateway.mts'), '');

    expect(
      validateRepoCodePaths(
        rootDir,
        'docs/rfc/002-ai-control-plane.md',
        'The gateway is `netlify/functions/ai-gateway.mts`; migrations live in `supabase/migrations/`.'
      )
    ).toEqual([]);

    expect(
      validateRepoCodePaths(
        rootDir,
        'docs/rfc/002-ai-control-plane.md',
        'See `netlify/functions/gone.mts` and `supabase/functions/gone.sql`.'
      )
    ).toEqual([
      'Broken repo path reference in docs/rfc/002-ai-control-plane.md: `netlify/functions/gone.mts`',
      'Broken repo path reference in docs/rfc/002-ai-control-plane.md: `supabase/functions/gone.sql`',
    ]);
  });

  /**
   * Both cases below are the ACTUAL defects these rules were written for, not
   * invented ones — §5 sat "BLOCKED on 0.2" for two days after §0.2 was decided,
   * and `p1.single-entry-gaps` sat at status 'missing' while every entry it
   * named already shipped.
   */
  it('flags a BLOCKED reference whose target section is already resolved', () => {
    const plan = [
      '### 0.2 ~~Which shelf branches are live?~~ — **DECIDED 2026-07-26: delete deliberately**',
      'Body text.',
      '',
      '## 5. AI and scene runtime — all BLOCKED on 0.2',
      'Do not schedule any of these before the shelf-branch verdict.',
    ].join('\n');

    const issues = validateBlockedReferences(plan);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toContain('BLOCKED on 0.2');
    expect(issues[0]).toContain('already resolved');
  });

  it('leaves a BLOCKED reference alone while its target is genuinely open', () => {
    const plan = [
      '### 0.1 Open-content licensing — **OPEN — owner**',
      '',
      '## 8. Release — **BLOCKED on 0.1**',
    ].join('\n');

    expect(validateBlockedReferences(plan)).toEqual([]);
  });

  it('does not flag a heading that records having BEEN blocked', () => {
    // "~~BLOCKED on 0.3~~ **DONE**" is a correct historical note, not a stale gate.
    const plan = [
      '### 0.3 Cold-start microtask — ~~DECIDE~~ **MOOT 2026-07-28**',
      '',
      '### 6.1 Finish the eager-bundle reclaim — ~~BLOCKED on 0.3~~ **DONE 2026-07-28**',
    ].join('\n');

    expect(validateBlockedReferences(plan)).toEqual([]);
  });

  it('flags a ledger item whose detail announces closure while its status is open', () => {
    const rootDir = makeTempDir();
    mkdirSync(path.join(rootDir, 'docs'), { recursive: true });
    writeFileSync(
      path.join(rootDir, 'docs/master-gap-ledger.source.ts'),
      [
        'export const ITEMS = [',
        '  {',
        "    id: 'p1.single-entry-gaps',",
        "    detail: 'CLOSED 2026-07-28 — all four ship, verified against the loaders.',",
        "    status: 'missing',",
        "    evidence: 'docs/generated/srd-coverage.md',",
        '  },',
        '];',
      ].join('\n')
    );

    const issues = validateLedgerStatus(rootDir);
    expect(issues.some((issue) => issue.includes('p1.single-entry-gaps'))).toBe(true);
    expect(issues.some((issue) => issue.includes('announces closure'))).toBe(true);
  });

  it('does not flag an open item whose detail merely mentions a closed sub-part', () => {
    // The first draft of this rule matched CLOSED anywhere and fired on
    // `p5.infra-gaps` and `p1.provenance-over-inclusion-audit`, both of which
    // legitimately describe sub-parts closing while the item stays open. A gate
    // that cries wolf gets weakened, so the marker must lead the detail.
    const rootDir = makeTempDir();
    mkdirSync(path.join(rootDir, 'docs'), { recursive: true });
    writeFileSync(
      path.join(rootDir, 'docs/master-gap-ledger.source.ts'),
      [
        'export const ITEMS = [',
        '  {',
        "    id: 'p5.infra-gaps',",
        "    detail: 'Rate-limiting is built. Observability closed 2026-07-25. Sentry release wiring remains.',",
        "    status: 'in-progress',",
        "    evidence: 'docs/runbooks/sentry-alerts.md',",
        '  },',
        '];',
      ].join('\n')
    );

    expect(validateLedgerStatus(rootDir)).toEqual([]);
  });

  /**
   * The drift these three pin is the one that actually cost time:
   * `p1.single-entry-gaps` sat in WORK_PLAN §2.5 as "small, itemised, good
   * filler. **CHEAP**" while the ledger already recorded it CLOSED. Neither
   * existing rule could see it — `ledger_status_rule` checks the ledger against
   * itself, `blocked_ref_rule` resolves section refs inside the plan.
   */
  function ledgerFixture(rootDir: string, planLine: string): void {
    mkdirSync(path.join(rootDir, 'docs'), { recursive: true });
    writeFileSync(
      path.join(rootDir, 'docs/master-gap-ledger.source.ts'),
      [
        'export const ITEMS = [',
        '  {',
        "    id: 'p1.single-entry-gaps',",
        "    detail: 'CLOSED 2026-07-28 — all four ship.',",
        "    status: 'done',",
        '  },',
        '  {',
        "    id: 'p1.monster-denominator-fix',",
        "    detail: 'Container-like rows still inflate the denominator.',",
        "    status: 'missing',",
        '  },',
        '];',
      ].join('\n')
    );
    writeFileSync(path.join(rootDir, 'docs/WORK_PLAN.md'), `# Plan\n\n${planLine}\n`);
  }

  it('flags plan prose that queues work the ledger records as done', () => {
    const rootDir = makeTempDir();
    ledgerFixture(rootDir, '- `p1.single-entry-gaps` — small, itemised, good filler. **CHEAP**');

    const issues = validateLedgerReferences(rootDir, 'docs/WORK_PLAN.md');
    expect(issues.some((issue) => issue.includes('p1.single-entry-gaps'))).toBe(true);
  });

  it('accepts a done item the plan has struck through or marked resolved', () => {
    const struck = makeTempDir();
    ledgerFixture(struck, '- ~~`p1.single-entry-gaps`~~ — all four verified against the loaders.');
    expect(validateLedgerReferences(struck, 'docs/WORK_PLAN.md')).toEqual([]);

    const marked = makeTempDir();
    ledgerFixture(marked, '- `p1.single-entry-gaps` — **DONE 2026-07-28.** Four entries verified.');
    expect(validateLedgerReferences(marked, 'docs/WORK_PLAN.md')).toEqual([]);
  });

  it('leaves open ledger items alone — listing those is what a plan is for', () => {
    const rootDir = makeTempDir();
    ledgerFixture(
      rootDir,
      "- `p1.monster-denominator-fix` — 3.5e's denominator is still inflated."
    );

    expect(validateLedgerReferences(rootDir, 'docs/WORK_PLAN.md')).toEqual([]);
  });

  it('passes the real repo doc-drift audit', async () => {
    await expect(runDocDriftCheck(process.cwd())).resolves.toEqual([]);
  });
});

function readmeWithGuideLink(): string {
  return '# Root\n\nSee [Guide](docs/guide.md#missing).\n';
}
