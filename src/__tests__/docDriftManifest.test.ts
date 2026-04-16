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

    expect(liveDocs).toHaveLength(4);
    expect(liveDocs.every((surface) => surface.rules.length > 0)).toBe(true);
  });
});
