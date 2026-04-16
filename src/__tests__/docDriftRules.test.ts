import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  extractDocumentedNpmCommands,
  extractRepoCodePaths,
  runDocDriftCheck,
  validateDocumentedNpmCommands,
  validateHistoricalHeader,
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

  it('passes the real repo doc-drift audit', async () => {
    await expect(runDocDriftCheck(process.cwd())).resolves.toEqual([]);
  });
});

function readmeWithGuideLink(): string {
  return '# Root\n\nSee [Guide](docs/guide.md#missing).\n';
}
