import { describe, expect, it, afterEach } from 'vitest';
import { CURRENT_DOCUMENT_VERSION, migrateDocument } from '../../utils/documentMigrations';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { clearDocumentStorage, loadDocuments, saveDocuments } from '../../utils/documentStorage';

function makeDoc(version?: number): CharacterDocument<SystemDataModel> {
  return {
    id: 'migration-test',
    name: 'Migration Test',
    systemId: 'dnd-5e-2014',
    system: createDefaultDnd5eData(),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...(version != null ? { version } : {}),
  };
}

describe('document schema migrations (review M-1)', () => {
  afterEach(() => {
    clearDocumentStorage();
  });

  it('stamps unversioned (pre-versioning era) documents to the current version', () => {
    const migrated = migrateDocument(makeDoc());
    expect(migrated.version).toBe(CURRENT_DOCUMENT_VERSION);
  });

  it('leaves documents from a NEWER app version untouched (no downgrade)', () => {
    const future = makeDoc(CURRENT_DOCUMENT_VERSION + 5);
    expect(migrateDocument(future)).toBe(future);
  });

  it('is idempotent at the current version', () => {
    const current = migrateDocument(makeDoc());
    expect(migrateDocument(current)).toBe(current);
  });

  it('migrates on the storage load path', () => {
    // Persist an unversioned document the way the pre-versioning app did.
    saveDocuments([makeDoc()]);
    const [loaded] = loadDocuments();
    expect(loaded.version).toBe(CURRENT_DOCUMENT_VERSION);
  });
});
