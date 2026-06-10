import { StrictMode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDocuments } from '../../hooks/useDocuments';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import { createDefaultDaggerheartData } from '../../systems/daggerheart/data-model';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import * as documentStorage from '../../utils/documentStorage';
import { DEFAULT_PERSISTENCE_DEBOUNCE_MS } from '../../hooks/useDebouncedPersistence';

function makeDoc(id = 'doc-1', name = 'Hook Hero'): CharacterDocument<SystemDataModel> {
  return {
    id,
    name,
    systemId: 'dnd-5e-2024',
    system: createDefaultDnd5e2024Data(),
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T00:00:00.000Z'),
  };
}

function readStoredDocs(): Array<Record<string, unknown>> {
  const raw = localStorage.getItem('rpg-documents-v2');
  if (!raw) return [];
  const parsed = JSON.parse(raw) as { documents?: Array<Record<string, unknown>> };
  return parsed.documents || [];
}

describe('useDocuments', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('loads persisted documents on mount', async () => {
    const storedDoc = makeDoc('persisted-doc', 'Persisted Hook Hero');
    localStorage.setItem(
      'rpg-documents-v2',
      JSON.stringify({
        version: '2.0',
        documents: [storedDoc],
        lastModified: new Date().toISOString(),
      })
    );

    const { result } = renderHook(() => useDocuments());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.documents).toHaveLength(1);
    });
    expect(result.current.documents[0].name).toBe('Persisted Hook Hero');
  });

  it('prepares persisted documents through their system engine during load', async () => {
    const storedDoc: CharacterDocument<SystemDataModel> = {
      id: 'persisted-daggerheart-doc',
      name: 'Legacy Hopebound',
      systemId: 'daggerheart',
      system: {
        ...createDefaultDaggerheartData(),
        class: 'daggerheart-bard',
        subclass: 'bard-troubadour',
        heritage: 'human',
        community: 'wanderborne',
        inventory: [
          {
            itemId: 'legacy-potion',
            name: 'Minor Health Potion',
            quantity: 2,
            description: '',
          },
        ],
      },
      createdAt: new Date('2026-02-24T00:00:00.000Z'),
      updatedAt: new Date('2026-02-24T00:00:00.000Z'),
    };

    localStorage.setItem(
      'rpg-documents-v2',
      JSON.stringify({
        version: '2.0',
        documents: [storedDoc],
        lastModified: new Date().toISOString(),
      })
    );

    const { result } = renderHook(() => useDocuments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.documents).toHaveLength(1);
      expect(result.current.documents[0].systemId).toBe('daggerheart');
      expect((result.current.documents[0].system as Record<string, unknown>).class).toBe('Bard');
    });

    const system = result.current.documents[0].system as Record<string, unknown>;
    const inventory = system.inventory as Array<Record<string, unknown>>;
    expect(system.subclass).toBe('Troubadour');
    expect(system.heritage).toBe('Human');
    expect(system.community).toBe('Wanderborne');
    expect(inventory[0]?.itemId).toBe('daggerheart-consumable-minor-health-potion');

    const persistedDocs = readStoredDocs();
    const persistedSystem = persistedDocs[0]?.system as Record<string, unknown>;
    const persistedInventory = persistedSystem?.inventory as Array<Record<string, unknown>>;
    expect(persistedSystem.class).toBe('Bard');
    expect(persistedInventory[0]?.itemId).toBe('daggerheart-consumable-minor-health-potion');
  });

  it('adds, updates, and deletes a document while persisting storage', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const doc = makeDoc('mutable-doc', 'Mutable Hook Hero');
    act(() => {
      result.current.addDocument(doc);
    });
    await waitFor(() => expect(readStoredDocs()).toHaveLength(1));

    act(() => {
      result.current.updateDocument({ ...doc, name: 'Updated Hook Hero' });
    });
    await waitFor(() => expect(readStoredDocs()[0].name).toBe('Updated Hook Hero'));

    act(() => {
      result.current.deleteDocument(doc.id);
    });
    await waitFor(() => expect(readStoredDocs()).toHaveLength(0));
  });

  it('clears all documents and removes storage key', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.addDocument(makeDoc('clear-doc-a', 'Clear A'));
      result.current.addDocument(makeDoc('clear-doc-b', 'Clear B'));
      result.current.clearAllDocuments();
    });

    expect(result.current.documents).toHaveLength(0);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, DEFAULT_PERSISTENCE_DEBOUNCE_MS + 50));
    });
    expect(localStorage.getItem('rpg-documents-v2')).toBeNull();
  });

  it('supports undo and redo with persisted snapshots', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const doc = makeDoc('history-doc', 'History Hero');
    act(() => {
      result.current.addDocument(doc);
    });
    expect(result.current.documents).toHaveLength(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    act(() => {
      result.current.updateDocument({ ...doc, name: 'History Hero Updated' });
    });
    expect(result.current.documents[0].name).toBe('History Hero Updated');

    act(() => {
      result.current.undo();
    });
    expect(result.current.documents[0].name).toBe('History Hero');
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(result.current.documents).toHaveLength(0);

    act(() => {
      result.current.redo();
    });
    expect(result.current.documents).toHaveLength(1);
    expect(result.current.documents[0].name).toBe('History Hero');

    act(() => {
      result.current.redo();
    });
    expect(result.current.documents[0].name).toBe('History Hero Updated');
    await waitFor(() => expect(readStoredDocs()[0].name).toBe('History Hero Updated'));
  });

  it('coalesces rapid same-document updates into a single undo step', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const doc = makeDoc('coalesce-doc', 'Base Name');
    act(() => {
      result.current.addDocument(doc);
    });

    act(() => {
      result.current.updateDocument({ ...doc, name: 'First Edit' });
      result.current.updateDocument({ ...doc, name: 'Second Edit' });
    });

    expect(result.current.documents[0].name).toBe('Second Edit');

    act(() => {
      result.current.undo();
    });

    expect(result.current.documents[0].name).toBe('Base Name');
  });

  it('creates a separate undo step for a later edit burst', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const doc = makeDoc('burst-doc', 'New Character');
    act(() => {
      result.current.addDocument(doc);
    });

    act(() => {
      result.current.updateDocument({ ...doc, name: 'Undo Hero' });
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    act(() => {
      result.current.updateDocument({ ...doc, name: 'Undo Hero!' });
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.documents[0].name).toBe('Undo Hero');
  });

  it('does not let async IndexedDB load overwrite local edits made after mount', async () => {
    const staleAsyncDoc = makeDoc('stale-idb-doc', 'IndexedDB Hero');
    let resolveAsyncLoad: ((docs: CharacterDocument<SystemDataModel>[]) => void) | undefined;

    vi.spyOn(documentStorage, 'loadDocuments').mockReturnValue([]);
    vi.spyOn(documentStorage, 'loadDocumentsAsync').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAsyncLoad = resolve;
        })
    );

    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.addDocument(makeDoc('local-doc', 'Local Hero'));
    });
    expect(result.current.documents.map((doc) => doc.name)).toEqual(['Local Hero']);

    await act(async () => {
      resolveAsyncLoad?.([staleAsyncDoc]);
      await Promise.resolve();
    });

    expect(result.current.documents.map((doc) => doc.name)).toEqual(['Local Hero']);
  });

  it('flushes pending debounced document saves on unmount', async () => {
    const { result, unmount } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const doc = makeDoc('flush-doc', 'Flush Hero');
    act(() => {
      result.current.addDocument(doc);
      result.current.updateDocument({ ...doc, name: 'Flushed Hook Hero' });
    });

    unmount();

    expect(readStoredDocs()).toMatchObject([{ name: 'Flushed Hook Hero' }]);
  });

  it('flushes pending document saves on pagehide', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const doc = makeDoc('pagehide-doc', 'Pagehide Hero');
    act(() => {
      result.current.addDocument(doc);
      result.current.updateDocument({ ...doc, name: 'Pagehide Flush Hero' });
    });

    act(() => {
      window.dispatchEvent(new Event('pagehide'));
    });

    expect(readStoredDocs()).toMatchObject([{ name: 'Pagehide Flush Hero' }]);
  });

  // H2 regression: a no-op update arriving inside the debounce window (e.g. a
  // sync merge that changes nothing) must not invalidate the pending save of
  // a real edit made moments earlier.
  it('does not drop a pending save when a no-op update lands within the debounce window', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const doc = makeDoc('noop-doc', 'Original');
    act(() => {
      result.current.addDocument(doc);
    });
    act(() => {
      result.current.flushPendingSaves();
    });
    expect(readStoredDocs()).toMatchObject([{ name: 'Original' }]);

    // Real edit: schedules a debounced save.
    act(() => {
      result.current.updateDocument({ ...doc, name: 'Edited' });
    });
    // Within the debounce window, a merge arrives that changes nothing.
    act(() => {
      result.current.addDocuments(result.current.documents);
    });
    // Flush whatever save is still pending — the edit must be in it.
    act(() => {
      result.current.flushPendingSaves();
    });

    expect(readStoredDocs()).toMatchObject([{ name: 'Edited' }]);
  });

  // M2: a failed storage clear must surface instead of claiming success.
  it('propagates a failed storage clear into the error state', async () => {
    vi.spyOn(documentStorage, 'clearDocumentStorage').mockRejectedValue(
      new Error('IndexedDB clear failed')
    );

    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.addDocument(makeDoc('doomed-doc', 'Doomed'));
    });
    act(() => {
      result.current.clearAllDocuments();
    });

    expect(result.current.documents).toHaveLength(0);
    await waitFor(() => expect(result.current.error).toBe('IndexedDB clear failed'));
  });

  // M8: corrupted storage surfaces an error state instead of silently
  // rendering an empty collection, and the payload is stashed first.
  it('surfaces an error and stashes the payload when stored documents are corrupt', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('rpg-documents-v2', '{corrupt payload');

    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.documents).toEqual([]);
    expect(result.current.error).toMatch(/could not be read/);
    expect(localStorage.getItem('rpg-documents-v2.corrupt')).toBe('{corrupt payload');
  });

  // M3: cross-tab reconciliation via storage events.
  it("merges another tab's snapshot from a storage event without losing local-only docs", async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.addDocument(makeDoc('local-only', 'Local Only'));
    });

    const otherTabDoc = {
      ...makeDoc('other-tab-doc', 'From Other Tab'),
      version: 2,
      createdAt: '2026-02-24T00:00:00.000Z',
      updatedAt: '2026-02-24T06:00:00.000Z',
    };
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'rpg-documents-v2',
          newValue: JSON.stringify({
            version: '2.0',
            documents: [otherTabDoc],
            lastModified: new Date().toISOString(),
          }),
        })
      );
    });

    const ids = result.current.documents.map((d) => d.id).sort();
    expect(ids).toEqual(['local-only', 'other-tab-doc']);
  });

  it('ignores an identical cross-tab snapshot without state churn (loop safety)', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.addDocument(makeDoc('stable-doc', 'Stable'));
    });
    act(() => {
      result.current.flushPendingSaves();
    });

    const echoPayload = localStorage.getItem('rpg-documents-v2');
    expect(echoPayload).toBeTruthy();
    const before = result.current.documents;

    // The other tab "echoes" exactly what we wrote: the merge must be a
    // no-op, preserving state identity and scheduling no further write.
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'rpg-documents-v2',
          newValue: echoPayload!,
        })
      );
    });

    expect(result.current.documents).toBe(before);
  });

  // L1: StrictMode double-invokes updaters; history must not double-push.
  describe('StrictMode history integrity', () => {
    it('a single add creates exactly one undo step', async () => {
      const { result } = renderHook(() => useDocuments(), { wrapper: StrictMode });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.addDocument(makeDoc('sm-add-doc', 'StrictMode Hero'));
      });
      expect(result.current.documents).toHaveLength(1);
      expect(result.current.canUndo).toBe(true);

      act(() => {
        result.current.undo();
      });
      expect(result.current.documents).toHaveLength(0);
      // With the double-push bug, a second (duplicate) past entry remains.
      expect(result.current.canUndo).toBe(false);
    });

    it('one undo pushes exactly one future entry', async () => {
      const { result } = renderHook(() => useDocuments(), { wrapper: StrictMode });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const doc = makeDoc('sm-undo-doc', 'Original');
      act(() => {
        result.current.addDocument(doc);
      });
      act(() => {
        result.current.updateDocument({ ...doc, name: 'Edited' });
      });

      act(() => {
        result.current.undo();
      });
      expect(result.current.documents[0].name).toBe('Original');
      expect(result.current.canRedo).toBe(true);

      act(() => {
        result.current.redo();
      });
      expect(result.current.documents[0].name).toBe('Edited');
      // With the double-push bug, a duplicate future entry would remain.
      expect(result.current.canRedo).toBe(false);
    });

    it('redo pushes exactly one past entry', async () => {
      const { result } = renderHook(() => useDocuments(), { wrapper: StrictMode });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const doc = makeDoc('sm-redo-doc', 'Original');
      act(() => {
        result.current.addDocument(doc);
      });
      act(() => {
        result.current.updateDocument({ ...doc, name: 'Edited' });
      });
      act(() => {
        result.current.undo();
      });
      act(() => {
        result.current.redo();
      });
      expect(result.current.documents[0].name).toBe('Edited');

      // Past must be exactly [empty, [Original]]: undoing twice lands on the
      // empty collection, with no duplicate intermediate states.
      act(() => {
        result.current.undo();
      });
      expect(result.current.documents[0].name).toBe('Original');
      act(() => {
        result.current.undo();
      });
      expect(result.current.documents).toHaveLength(0);
      expect(result.current.canUndo).toBe(false);
    });
  });
});
