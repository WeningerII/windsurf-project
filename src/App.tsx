import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { GameSystemSelector } from './components/GameSystemSelector';
import { SystemStatusDashboard } from './components/SystemStatusDashboard';
import { GameSystemId } from './types/game-systems';
import { systemRegistry } from './registry';
import { Button } from './components/ui/Button';
import { Plus, Download, Upload, AlertCircle, X } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSync } from './hooks/useSync';
import { useCampaignSync } from './hooks/useCampaignSync';
import { generateUUID, initBrowserCompat } from './utils/browserCompat';
import { SystemSheetRenderer } from './components/SystemSheetRenderer';
import { CharacterDocument, SystemDataModel } from './types/core/document';
import { useDocuments } from './hooks/useDocuments';
import { exportDocuments, importDocumentsWithReport } from './utils/documentStorage';
import { CURRENT_DOCUMENT_VERSION } from './utils/documentMigrations';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { Skeleton } from './components/ui/Skeleton';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { ToastProvider, useToast } from './components/ui/Toast';
import { ServiceWorkerUpdateBanner } from './components/ServiceWorkerUpdateBanner';
import { useCampaigns } from './hooks/useCampaigns';
import { CampaignManager } from './components/CampaignManager';
// Lazy-loaded: the scene/VTT view is the app's heaviest feature component and
// is only used in the dashboard branch, so it stays out of the eager app shell
// (keeps the index chunk well under its first-paint budget). Matches the
// Suspense pattern used by SystemSheetRenderer.
const SceneManager = lazy(() =>
  import('./components/SceneManager').then((m) => ({ default: m.SceneManager }))
);
import { useScenes } from './hooks/useScenes';
import { prefetchSystemAssetsForIds } from './utils/systemAssetPrefetch';
import { usePwaInstallPrompt } from './hooks/usePwaInstallPrompt';
import { combineSyncStates, getMostRecentSyncDate, getPendingSyncCount } from './utils/syncStatus';
import { getDocumentLevelValue } from './utils/characterPresenter';
import { CharacterListView, type CharacterSortOption } from './components/CharacterListView';
import { AppHeader } from './components/AppHeader';

const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;
const STORAGE_WARNING_THRESHOLD = Math.floor(STORAGE_LIMIT_BYTES * 0.8);
// Trailing debounce for the pending-sync-count recomputation: reading the
// queues re-parses full collection snapshots from localStorage, which must
// not happen on every keystroke of a controlled sheet/notes field.
const PENDING_SYNC_COUNT_DEBOUNCE_MS = 2000;

function cloneSystemData(system: SystemDataModel): SystemDataModel {
  if (typeof structuredClone === 'function') {
    return structuredClone(system);
  }
  return JSON.parse(JSON.stringify(system)) as SystemDataModel;
}

function AppContent() {
  const {
    documents,
    isLoading,
    error,
    clearError,
    addDocument,
    addDocuments,
    applyMergedDocuments,
    updateDocument,
    deleteDocument,
    clearAllDocuments,
    undo,
    redo,
    canUndo,
    canRedo,
    flushPendingSaves: flushPendingDocumentSaves,
  } = useDocuments();

  const {
    syncState: documentSyncState,
    lastSyncedAt: lastDocumentSyncedAt,
    sync: syncDocuments,
  } = useSync({
    documents,
    // The sync merge is authoritative (it already applied tombstones), so it
    // must replace the collection — an upsert-only merge could never remove
    // an entity deleted on another device.
    onMerge: applyMergedDocuments,
  });
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<GameSystemId | null>(null);

  const [systemFilter, setSystemFilter] = useState<GameSystemId | 'all'>('all');
  const [sortOption, setSortOption] = useState<CharacterSortOption>('updated-desc');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: '', description: '', onConfirm: () => {} });
  const { toast } = useToast();
  const {
    campaigns,
    error: campaignError,
    clearError: clearCampaignError,
    addCampaign,
    applyMergedCampaigns,
    updateCampaign,
    deleteCampaign,
    addCharacterToCampaign,
    removeCharacterFromCampaign,
    flushPendingSaves: flushPendingCampaignSaves,
  } = useCampaigns();
  const {
    scenes,
    isLoading: scenesLoading,
    error: sceneError,
    clearError: clearSceneError,
    addScene,
    addScenes,
    appendSceneEvent,
    deleteScene,
    flushPendingSaves: flushPendingSceneSaves,
  } = useScenes();
  const {
    syncState: campaignSyncState,
    lastSyncedAt: lastCampaignSyncedAt,
    sync: syncCampaigns,
  } = useCampaignSync({
    campaigns,
    // Replace, not upsert — see the documents onMerge above.
    onMerge: applyMergedCampaigns,
  });
  const syncState = combineSyncStates([documentSyncState, campaignSyncState]);
  const lastSyncedAt = getMostRecentSyncDate([lastDocumentSyncedAt, lastCampaignSyncedAt]);
  // `getPendingSyncCount` reads the four localStorage queues directly, so the
  // value is impure with respect to React state.  We re-derive it whenever a
  // sync transition or an entity-collection edit fires (those are the only
  // events that grow or drain the queues) and stash the result so the
  // dropdown does not need to know about the storage layer.  The read is
  // debounced (trailing) because `documents`/`campaigns` change per keystroke
  // in controlled fields, and each read re-parses the queued snapshots.
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => getPendingSyncCount());
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPendingSyncCount(getPendingSyncCount());
    }, PENDING_SYNC_COUNT_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [syncState, documents, campaigns]);
  const syncAll = useCallback(() => {
    void syncDocuments();
    void syncCampaigns();
  }, [syncCampaigns, syncDocuments]);
  const handleAppInstalled = useCallback(() => {
    toast('App installed for offline-friendly access.', 'success');
  }, [toast]);
  const { canInstall, dismissInstallPrompt, isInstalling, promptInstall } = usePwaInstallPrompt({
    onInstalled: handleAppInstalled,
  });

  const showConfirm = useCallback((title: string, description: string, onConfirm: () => void) => {
    setConfirmDialog({ open: true, title, description, onConfirm });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  }, []);

  const handleReturnToList = useCallback(() => {
    flushPendingDocumentSaves();
    flushPendingCampaignSaves();
    flushPendingSceneSaves();
    setCurrentDocId(null);
  }, [flushPendingCampaignSaves, flushPendingDocumentSaves, flushPendingSceneSaves]);

  const filteredAndSortedDocuments = useMemo(() => {
    const filtered =
      systemFilter === 'all'
        ? [...documents]
        : documents.filter((doc) => doc.systemId === systemFilter);

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'updated-asc':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'level-desc':
          return getDocumentLevelValue(b) - getDocumentLevelValue(a);
        case 'level-asc':
          return getDocumentLevelValue(a) - getDocumentLevelValue(b);
        case 'updated-desc':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [documents, sortOption, systemFilter]);

  // Only the character-list view renders the storage warning, so skip the
  // full-collection serialization entirely while a sheet is open — otherwise
  // it would re-run on every keystroke in a controlled sheet field.
  const isCharacterListVisible = currentDocId === null;
  const storageUsageBytes = useMemo(() => {
    if (!isCharacterListVisible) {
      return 0;
    }
    try {
      const serialized = JSON.stringify({
        version: '2.0',
        documents,
        lastModified: new Date().toISOString(),
      });
      return new Blob([serialized]).size;
    } catch {
      return 0;
    }
  }, [documents, isCharacterListVisible]);

  const storageUsagePercent = Math.min(
    100,
    Math.round((storageUsageBytes / STORAGE_LIMIT_BYTES) * 100)
  );
  const isNearStorageLimit = storageUsageBytes >= STORAGE_WARNING_THRESHOLD;
  const storageUsageMb = (storageUsageBytes / (1024 * 1024)).toFixed(2);

  const triggerJsonDownload = useCallback((jsonPayload: string, filename: string) => {
    // Blob URLs avoid Chromium's ~2 MB cap on data: anchors — "Export All"
    // must keep working exactly when storage is near the ~5 MB limit.
    const blob = new Blob([jsonPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  // Initialize browser compatibility checks on mount
  useEffect(() => {
    initBrowserCompat();
  }, []);

  useEffect(() => {
    const activeSystemIds = new Set<GameSystemId>();
    documents.forEach((doc) => activeSystemIds.add(doc.systemId as GameSystemId));
    if (selectedSystem) {
      activeSystemIds.add(selectedSystem);
    }
    prefetchSystemAssetsForIds(activeSystemIds);
  }, [documents, selectedSystem]);

  const handleCreateCharacter = () => {
    if (!selectedSystem) return;
    const sysDef = systemRegistry.get(selectedSystem);
    if (!sysDef) return;

    const doc: CharacterDocument<SystemDataModel> = {
      id: generateUUID(),
      name: 'New Character',
      systemId: selectedSystem,
      system: sysDef.createDefaultData(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: CURRENT_DOCUMENT_VERSION,
    };
    addDocument(doc);
    setCurrentDocId(doc.id);
  };

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    // Destructive: route through the same confirm flow as "Clear All
    // Characters" / "Delete Campaign" instead of deleting on a single click.
    showConfirm('Delete Character', `This will permanently delete "${doc.name}".`, () => {
      deleteDocument(id);
      if (currentDocId === id) setCurrentDocId(null);
      toast(`Deleted "${doc.name}"`, 'success');
    });
  };

  const handleExportDocument = (doc: CharacterDocument<SystemDataModel>) => {
    try {
      const dataStr = exportDocuments([doc]);
      const filename = `${doc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_character.json`;
      triggerJsonDownload(dataStr, filename);
      toast(`Exported "${doc.name}"`, 'success');
    } catch {
      toast('Failed to export character.', 'error');
    }
  };

  const handleExportAllDocuments = () => {
    try {
      const payload = exportDocuments(documents);
      const filename = `all_characters_${new Date().toISOString().slice(0, 10)}.json`;
      triggerJsonDownload(payload, filename);
      toast(
        `Exported ${documents.length} character${documents.length !== 1 ? 's' : ''}`,
        'success'
      );
    } catch {
      toast('Failed to export all characters.', 'error');
    }
  };

  const handleCloneDocument = useCallback(
    (doc: CharacterDocument<SystemDataModel>) => {
      const clone: CharacterDocument<SystemDataModel> = {
        ...doc,
        id: generateUUID(),
        name: `${doc.name} (Copy)`,
        system: cloneSystemData(doc.system),
        createdAt: new Date(),
        updatedAt: new Date(),
        version: CURRENT_DOCUMENT_VERSION,
      };
      addDocument(clone);
      setCurrentDocId(clone.id);
      toast(`Cloned "${doc.name}"`, 'success');
    },
    [addDocument, toast]
  );

  const handleImportDocument = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string;
          const { documents: imported, droppedCount } = importDocumentsWithReport(jsonString);
          if (imported.length > 0) {
            const normalized = imported.map((d) => ({
              ...d,
              id: generateUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            }));
            addDocuments(normalized);
            setCurrentDocId(normalized[0].id);
            toast(
              droppedCount > 0
                ? `Imported ${normalized.length} of ${normalized.length + droppedCount} characters — ${droppedCount} invalid ${droppedCount === 1 ? 'entry' : 'entries'} skipped`
                : `Imported ${normalized.length} character${normalized.length !== 1 ? 's' : ''}`,
              droppedCount > 0 ? 'warning' : 'success'
            );
          } else {
            toast(
              droppedCount > 0
                ? `Nothing imported — all ${droppedCount} ${droppedCount === 1 ? 'entry was' : 'entries were'} invalid.`
                : 'Nothing imported — the file contains no characters.',
              'error'
            );
          }
        } catch {
          toast('Failed to import character. Please ensure the file is a valid export.', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Keyboard shortcuts
  useKeyboardNavigation([
    {
      key: 'Escape',
      callback: () => {
        if (currentDocId) handleReturnToList();
      },
      description: 'Back to character list',
    },
    {
      // Alt+N, not Ctrl+N: Chromium never delivers Ctrl/Cmd+N to the page
      // (it opens a new window).
      key: 'n',
      alt: true,
      callback: () => {
        if (selectedSystem && !currentDocId) handleCreateCharacter();
      },
      description: 'Create new character',
    },
    {
      key: 'i',
      ctrl: true,
      callback: () => {
        if (!currentDocId) handleImportDocument();
      },
      description: 'Import character',
    },
    {
      key: 'z',
      ctrl: true,
      callback: () => {
        if (canUndo) undo();
      },
      description: 'Undo last change',
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      callback: () => {
        if (canRedo) redo();
      },
      description: 'Redo last undone change',
    },
  ]);

  const currentDoc = documents.find((d) => d.id === currentDocId);
  const appError = error ?? campaignError ?? sceneError;
  const clearAppError = error ? clearError : campaignError ? clearCampaignError : clearSceneError;

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:shadow-md"
      >
        Skip to main content
      </a>
      {/* Header */}
      <AppHeader
        currentDoc={currentDoc ?? null}
        currentDocId={currentDocId}
        documents={documents}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onReturnToList={handleReturnToList}
        onSelectCharacter={setCurrentDocId}
        onClone={handleCloneDocument}
        onExport={handleExportDocument}
        onImport={handleImportDocument}
        onDelete={handleDeleteDocument}
        syncState={syncState}
        lastSyncedAt={lastSyncedAt}
        onSyncNow={syncAll}
        pendingSyncCount={pendingSyncCount}
      />

      {/* Error Banner */}
      {appError && (
        <div className="border-b border-destructive/30 bg-destructive/10 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{appError}</span>
            </div>
            <button
              onClick={clearAppError}
              className="text-destructive hover:text-destructive/80 transition-colors"
              title="Dismiss"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-8">
        {isLoading || scenesLoading ? (
          <div className="max-w-6xl mx-auto space-y-6 pt-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        ) : currentDoc ? (
          <div className="max-w-7xl mx-auto">
            {/* Scoped boundary: a lazy sheet chunk that fails to load (stale
                deploy, flaky offline cache) must not take down the whole app.
                Keyed by document id so switching characters retries cleanly. */}
            <ErrorBoundary
              key={currentDoc.id}
              fallback={
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-4">
                  <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">This character sheet failed to load</h2>
                    <p className="text-sm text-muted-foreground">
                      The sheet may have failed to download (for example after an update or while
                      offline). Reloading usually fixes it — your character data is safe.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => window.location.reload()}>Reload sheet</Button>
                    <Button variant="outline" onClick={handleReturnToList}>
                      Back to list
                    </Button>
                  </div>
                </div>
              }
            >
              <SystemSheetRenderer document={currentDoc} onUpdate={updateDocument} />
            </ErrorBoundary>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Hero Section */}
            <div className="text-center space-y-3 pt-4">
              <h2 className="text-4xl font-bold tracking-tight">Choose a Game System</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select from 7 registered RPG systems with full or partial SRD-backed support
              </p>
            </div>

            {canInstall && (
              <section className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <Download className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold tracking-tight">Install the app</h3>
                      <p className="text-sm text-muted-foreground">
                        Add it to your home screen for faster launches and offline-friendly access.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={dismissInstallPrompt}>
                      Not now
                    </Button>
                    <Button onClick={() => void promptInstall()} disabled={isInstalling}>
                      <Download className="mr-2 h-4 w-4" />
                      {isInstalling ? 'Opening Prompt...' : 'Install App'}
                    </Button>
                  </div>
                </div>
              </section>
            )}

            {/* System Selector */}
            <GameSystemSelector selectedSystem={selectedSystem} onSelect={setSelectedSystem} />

            {/* Action Bar */}
            {selectedSystem && (
              <div className="flex justify-center gap-3 animate-in fade-in-0">
                <Button variant="outline" size="lg" onClick={handleImportDocument}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Character
                </Button>
                <Button onClick={handleCreateCharacter} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Character
                </Button>
              </div>
            )}

            {/* Characters Section */}
            <CharacterListView
              documents={documents}
              filteredDocuments={filteredAndSortedDocuments}
              systemFilter={systemFilter}
              onSystemFilterChange={setSystemFilter}
              sortOption={sortOption}
              onSortOptionChange={setSortOption}
              onExportAll={handleExportAllDocuments}
              onClearAll={() =>
                showConfirm(
                  'Delete All Characters',
                  'This will permanently delete all saved characters. This action cannot be undone.',
                  () => {
                    clearAllDocuments();
                    setCurrentDocId(null);
                    toast('All characters deleted', 'success');
                  }
                )
              }
              onOpenCharacter={setCurrentDocId}
              onCloneCharacter={handleCloneDocument}
              storageWarning={
                isNearStorageLimit ? { percent: storageUsagePercent, mb: storageUsageMb } : null
              }
            />

            {/* Campaigns */}
            <CampaignManager
              campaigns={campaigns}
              documents={documents}
              onAddCampaign={addCampaign}
              onUpdateCampaign={updateCampaign}
              onDeleteCampaign={(id) =>
                showConfirm(
                  'Delete Campaign',
                  'This will delete the campaign. Characters in it will not be affected.',
                  () => {
                    deleteCampaign(id);
                    toast('Campaign deleted', 'success');
                  }
                )
              }
              onAddCharacter={(cid, charId) => {
                addCharacterToCampaign(cid, charId);
                const doc = documents.find((d) => d.id === charId);
                if (doc) toast(`Added ${doc.name} to campaign`, 'success');
              }}
              onRemoveCharacter={(cid, charId) => {
                removeCharacterFromCampaign(cid, charId);
                const doc = documents.find((d) => d.id === charId);
                if (doc) toast(`Removed ${doc.name} from campaign`, 'success');
              }}
              onOpenCharacter={(charId) => setCurrentDocId(charId)}
            />

            {/* Scenes */}
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <SceneManager
                scenes={scenes}
                documents={documents}
                campaigns={campaigns}
                onAddScene={addScene}
                onAddScenes={addScenes}
                onAppendSceneEvent={appendSceneEvent}
                onDeleteScene={(id) =>
                  showConfirm(
                    'Delete Scene',
                    'This will delete the scene and its event log. Characters and campaigns will not be affected.',
                    () => {
                      deleteScene(id);
                      toast('Scene deleted', 'success');
                    }
                  )
                }
              />
            </Suspense>

            {/* System Dashboard */}
            <SystemStatusDashboard />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built for tabletop RPG enthusiasts &bull; Supports D&amp;D, Pathfinder, M&amp;M, and
            more
          </p>
        </div>
      </footer>
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant="destructive"
        confirmLabel="Delete"
        onConfirm={() => {
          confirmDialog.onConfirm();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />
    </div>
  );
}

// Root crash protection lives in main.tsx (a single ErrorBoundary around
// AuthProvider + App); wrapping again here was redundant. This component only
// provides the toast context.
function App() {
  return (
    <ToastProvider>
      <AppContent />
      <ServiceWorkerUpdateBanner />
    </ToastProvider>
  );
}

export default App;
