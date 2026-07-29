import { describe, expect, it } from 'vitest';
import { DOC_DRIFT_MANIFEST } from '../../docs/doc-drift.manifest';
import { RUNTIME_COPY_RULES } from '../../docs/doc-drift.rules';
import { collectManifestCoverageTargets } from '../utils/docDrift';

describe('docDrift manifest', () => {
  it('classifies every in-scope markdown, generated-json, and workflow surface', () => {
    const manifestPaths = new Set(DOC_DRIFT_MANIFEST.map((surface) => surface.path));
    const expectedPaths = collectManifestCoverageTargets(process.cwd());

    expect(expectedPaths.every((filePath) => manifestPaths.has(filePath))).toBe(true);
  });

  it('registers every audited runtime-copy module in the manifest', () => {
    const runtimeManifestPaths = new Set(
      DOC_DRIFT_MANIFEST.filter((surface) => surface.kind === 'runtime-copy').map(
        (surface) => surface.path
      )
    );

    expect(RUNTIME_COPY_RULES.every((rule) => runtimeManifestPaths.has(rule.path))).toBe(true);
  });

  it('keeps all live docs under explicit rule coverage', () => {
    const liveDocs = DOC_DRIFT_MANIFEST.filter((surface) => surface.kind === 'live');

    expect(liveDocs.length).toBeGreaterThan(0);
    expect(liveDocs.every((surface) => surface.rules.length > 0)).toBe(true);
  });

  /**
   * CLAUDE.md is loaded as project instructions at the start of every agent
   * session, so its errors get ACTED ON, not merely read. It was outside the
   * gate's scope entirely until 2026-07-28 and had drifted twice (`505 files`
   * against 512, and RFCs `001–006` when 007 exists).
   *
   * Pinned here rather than left to the manifest-coverage test above, because
   * that test only asserts in-scope files are listed — it would stay green if
   * CLAUDE.md were quietly dropped back out of `ROOT_DOC_FILES`, since an
   * out-of-scope file is not "in scope and unlisted".
   */
  it('keeps CLAUDE.md in scope and under the rules that check its claims', () => {
    expect(collectManifestCoverageTargets(process.cwd())).toContain('CLAUDE.md');

    const claudeMd = DOC_DRIFT_MANIFEST.find((surface) => surface.path === 'CLAUDE.md');
    expect(claudeMd).toBeDefined();
    expect(claudeMd?.rules).toEqual(
      expect.arrayContaining(['count_rule', 'command_rule', 'path_ref_rule'])
    );
  });
});
