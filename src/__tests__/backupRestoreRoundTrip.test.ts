/**
 * Backup / disaster-recovery gate: the browser-local export→import round trip.
 *
 * For a local-first app the JSON export is the ONLY user-controlled backup of
 * the data of record (IndexedDB + localStorage). `docs/runbooks/
 * local-data-recovery.md` tells an operator to trust it. This suite is what
 * makes that instruction honest: it proves a full export→import cycle is
 * LOSSLESS — for every one of the seven systems, using each system's own
 * registered default data model, so no system is privileged.
 *
 * It also pins the two places the cycle is deliberately NOT a pure identity
 * (timestamp revival and image-URL sanitization) so a future change to either
 * is a conscious decision rather than silent data loss.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import { KNOWN_SYSTEM_IDS } from '../utils/systemCatalogShared';
import { exportDocuments, importDocumentsWithReport } from '../utils/documentStorage';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';

beforeAll(() => {
  registerAllSystems();
});

const CREATED_AT = new Date('2026-01-02T03:04:05.678Z');
const UPDATED_AT = new Date('2026-03-04T05:06:07.089Z');

/**
 * A document seeded from the system's OWN registered default data model, so the
 * round trip is exercised against real per-system shapes rather than a stand-in.
 */
function documentForSystem(systemId: string, index: number): CharacterDocument<SystemDataModel> {
  const definition = systemRegistry.get(systemId);
  if (!definition) {
    throw new Error(`system '${systemId}' is not registered`);
  }
  return {
    id: `doc-${systemId}-${index}`,
    // Non-ASCII on purpose: names carry player-chosen text in many scripts, and
    // a backup that mangles them is a backup that lost data.
    name: `Ríañ “Sparrow” 星影 ${index}`,
    systemId,
    system: definition.createDefaultData(),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    version: 3,
  };
}

function roundTrip(
  documents: CharacterDocument<SystemDataModel>[]
): ReturnType<typeof importDocumentsWithReport> {
  return importDocumentsWithReport(exportDocuments(documents));
}

describe('backup/DR — export→import round trip', () => {
  it('registers all seven systems (the round trip is measured against all of them)', () => {
    expect(KNOWN_SYSTEM_IDS).toHaveLength(7);
    for (const systemId of KNOWN_SYSTEM_IDS) {
      expect(systemRegistry.get(systemId), `system '${systemId}' must be registered`).toBeDefined();
    }
  });

  it.each(KNOWN_SYSTEM_IDS)('%s: a document survives export→import unchanged', (systemId) => {
    const original = documentForSystem(systemId, 1);

    const { documents, droppedCount } = roundTrip([original]);

    expect(droppedCount).toBe(0);
    expect(documents).toHaveLength(1);
    // Deep structural equality across the whole envelope INCLUDING the
    // system-specific black box — the part a generic backup is most likely to
    // flatten.
    expect(documents[0]).toEqual(original);
    expect(documents[0]?.system).toEqual(original.system);
  });

  it.each(KNOWN_SYSTEM_IDS)('%s: timestamps come back as live Date values', (systemId) => {
    const original = documentForSystem(systemId, 2);

    const [restored] = roundTrip([original]).documents;

    // JSON has no date type; the import path must revive them or every restored
    // character silently re-dates itself to the moment of the restore.
    expect(restored?.createdAt).toBeInstanceOf(Date);
    expect(restored?.updatedAt).toBeInstanceOf(Date);
    expect(restored?.createdAt.getTime()).toBe(CREATED_AT.getTime());
    expect(restored?.updatedAt.getTime()).toBe(UPDATED_AT.getTime());
  });

  it('restores a mixed all-seven collection with nothing dropped or reordered', () => {
    const originals = KNOWN_SYSTEM_IDS.map((systemId, index) =>
      documentForSystem(systemId, index + 10)
    );

    const { documents, droppedCount } = roundTrip(originals);

    expect(droppedCount).toBe(0);
    expect(documents).toHaveLength(KNOWN_SYSTEM_IDS.length);
    expect(documents.map((doc) => doc.systemId)).toEqual([...KNOWN_SYSTEM_IDS]);
    expect(documents).toEqual(originals);
  });

  it('is idempotent — re-exporting a restored collection reproduces the same documents', () => {
    const originals = KNOWN_SYSTEM_IDS.map((systemId, index) =>
      documentForSystem(systemId, index + 20)
    );

    const once = roundTrip(originals).documents;
    const twice = roundTrip(once).documents;

    // A restore-of-a-restore must not drift. This is what makes a backup chain
    // (export → restore → export again) safe to keep.
    expect(twice).toEqual(once);
  });

  it('preserves hostile-but-legal system payloads (unicode, nesting, extremes, null)', () => {
    const original: CharacterDocument<SystemDataModel> = {
      id: 'doc-hostile',
      name: '',
      systemId: KNOWN_SYSTEM_IDS[0],
      system: {
        emoji: '🎲🐉 — “quotes” \\ backslash \t tab \n newline',
        deeplyNested: { a: [{ b: [{ c: [1, 2, 3] }] }] },
        emptyArray: [],
        emptyObject: {},
        zero: 0,
        negative: -12.5,
        bigInteger: Number.MAX_SAFE_INTEGER,
        false: false,
        nulled: null,
        longText: 'x'.repeat(5000),
        keyWithUnicode: { 'ключ 🔑': 'значение' },
      },
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    };

    const { documents, droppedCount } = roundTrip([original]);

    expect(droppedCount).toBe(0);
    expect(documents[0]).toEqual(original);
  });

  it('carries an https portrait through, and DELIBERATELY drops a non-https one', () => {
    const httpsDoc: CharacterDocument<SystemDataModel> = {
      ...documentForSystem(KNOWN_SYSTEM_IDS[0], 30),
      img: 'https://example.invalid/portrait.png',
    };
    const httpDoc: CharacterDocument<SystemDataModel> = {
      ...documentForSystem(KNOWN_SYSTEM_IDS[0], 31),
      img: 'http://example.invalid/portrait.png',
    };

    const { documents } = roundTrip([httpsDoc, httpDoc]);

    expect(documents[0]?.img).toBe('https://example.invalid/portrait.png');
    // Not a bug: `sanitizeImgUrl` admits only https and `data:image/*` so a
    // restore cannot reintroduce a mixed-content or javascript: URL. It IS the
    // one field a restore can lose, which is why the recovery runbook says so.
    expect(documents[1]?.img).toBeUndefined();
  });

  it('the export envelope is self-describing (version + document count + timestamp)', () => {
    const originals = KNOWN_SYSTEM_IDS.map((systemId, index) =>
      documentForSystem(systemId, index + 40)
    );

    const envelope = JSON.parse(exportDocuments(originals)) as {
      version?: unknown;
      documents?: unknown[];
      lastModified?: unknown;
    };

    // An operator following the runbook identifies a backup file by these three
    // fields before restoring it.
    expect(typeof envelope.version).toBe('string');
    expect(Array.isArray(envelope.documents)).toBe(true);
    expect(envelope.documents).toHaveLength(KNOWN_SYSTEM_IDS.length);
    expect(typeof envelope.lastModified).toBe('string');
    expect(Number.isNaN(Date.parse(envelope.lastModified as string))).toBe(false);
  });

  it('reports corruption instead of silently restoring a partial backup', () => {
    const good = documentForSystem(KNOWN_SYSTEM_IDS[0], 50);
    const payload = JSON.stringify({
      version: '2.0',
      documents: [good, { id: 'broken' }, null, 'not-a-document'],
      lastModified: new Date().toISOString(),
    });

    const { documents, droppedCount } = importDocumentsWithReport(payload);

    // The count is the operator's signal that the backup file is damaged — a
    // restore that quietly dropped three records would look like a success.
    expect(documents).toHaveLength(1);
    expect(droppedCount).toBe(3);
  });
});
