import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDocuments } from '../../hooks/useDocuments';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import { createDefaultDaggerheartData } from '../../systems/daggerheart/data-model';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import * as documentStorage from '../../utils/documentStorage';

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
      await new Promise((resolve) => setTimeout(resolve, 350));
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
});
