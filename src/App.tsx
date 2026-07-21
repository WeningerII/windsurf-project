import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { SystemStatusDashboard } from './components/SystemStatusDashboard';
import { GameSystemId } from './types/game-systems';
import { systemRegistry } from './registry';
import { Button } from './components/ui/Button';
import { AlertCircle, Download, X } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSync } from './hooks/useSync';
import { useCampaignSync } from './hooks/useCampaignSync';
import { generateUUID, initBrowserCompat } from './utils/browserCompat';
import { SystemSheetRenderer } from './components/SystemSheetRenderer';
import { CharacterDocument, SystemDataModel } from './types/core/document';
import { useDocuments } from './hooks/useDocuments';
import { exportDocuments, importDocumentsWithReport } from './utils/documentStorage';
import { downloadTextFile, pickTextFile } from './utils/fileTransfer';
import { CURRENT_DOCUMENT_VERSION } from './utils/documentMigrations';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { Skeleton } from './components/ui/Skeleton';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { ToastProvider, useToast } from './components/ui/Toast';
import { ServiceWorkerUpdateBanner } from './components/ServiceWorkerUpdateBanner';
import { useCampaigns } from './hooks/useCampaigns';
import { addSessionEntry, createSessionEntry } from './utils/campaignStory';
import { CampaignManager } from './components/CampaignManager';
// Lazy-loaded: the scene/VTT view is the app's heaviest feature component. It
// stays out of the eager app shell AND is only mounted the first time the user
// opens the Scenes tab (never at boot), so users who never open a scene never
// pay for its chunk or its event-folding.
const SceneManager = lazy(() =>
  import('./components/SceneManager').then((m) => ({ default: m.SceneManager }))
);
// Lazy-loaded: the Legal notices view bundles ~26 KB of verbatim license text
// (OGL 1.0a / CC-BY-4.0 / DPCGL) imported with `?raw`, so it stays in its own
// chunk off the app's first-paint budget — only fetched when a user opens it.
const LegalNotices = lazy(() =>
  import('./components/LegalNotices').then((m) => ({ default: m.LegalNotices }))
);
import { useScenes } from './hooks/useScenes';
import { prefetchSystemAssetsForIds } from './utils/systemAssetPrefetch';
import { usePwaInstallPrompt } from './hooks/usePwaInstallPrompt';
import { combineSyncStates, getMostRecentSyncDate, getPendingSyncCount } from './utils/syncStatus';
import { getDocumentLevelValue } from './utils/characterPresenter';
import { CharacterListView, type CharacterSortOption } from './components/CharacterListView';
import { LibraryScenesView } from './components/LibraryScenesView';
import { LibraryBestiaryView } from './components/LibraryBestiaryView';
import { AppHeader } from './components/AppHeader';
import { SurfaceStage } from './components/SurfaceStage';
import { NewCharacterDialog } from './components/NewCharacterDialog';
import { GuidedCreatorDialog } from './components/GuidedCreatorDialog';
import { useAppNav } from './hooks/useAppNav';
import { ShellProvider } from './contexts/ShellContext';
import { useSurfaceSwitchMetrics } from './hooks/useSurfaceSwitchMetrics';

const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;
const STORAGE_WARNING_THRESHOLD = Math.floor(STORAGE_LIMIT_BYTES * 0.8);
// Trailing debounce for the pending-sync-count recomputation: reading the
// queues re-parses full collection snapshots from localStorage, which must
// not happen on every keystroke of a controlled sheet/notes field.
const PENDING_SYNC_COUNT_DEBOUNCE_MS = 2000;

function buildNewCharacterDocument(
  systemId: GameSystemId,
  system: SystemDataModel,
  name: string
): CharacterDocument<SystemDataModel> {
  return {
    id: generateUUID(),
    name: name.trim() || 'New Character',
    systemId,
    system,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: CURRENT_DOCUMENT_VERSION,
  };
}

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

  // Total shell-nav model: one discriminated union replaces the old
  // currentDocId / selectedSystem / showLegal flags. Phase 2 moved the
  // reducer into ShellContext (src/contexts/shell-context.ts); this call
  // site — a thin context read — is unchanged, as planned. It is read BEFORE
  // the sync hooks so `nav.surface` can gate their subscriptions (below).
  const {
    nav,
    openSheet,
    closeSheet,
    setSurface,
    setLibrarySegment,
    selectScene,
    openOverlay,
    closeOverlay,
  } = useAppNav();
  // Surface-switch user timing (marks + measures): the recorded baseline the
  // Phase-7 interaction-budget gate is calibrated against later.
  useSurfaceSwitchMetrics(nav.surface);

  // Per-surface sync quiescence (Phase 2 pause/resume-with-reconcile). Each
  // entity table's realtime subscription is kept open only while a surface
  // that DISPLAYS that data is visible; local edits always push regardless,
  // and returning to the surface runs one reconciling sync() to catch up on
  // events missed while paused. Documents back both the Sheet and the Library
  // Characters segment, so they stay active for either; campaigns back only
  // the Library Campaigns segment. (Mapping per build-specs Open Question — the
  // spec's proposed default.)
  const documentsSyncActive =
    nav.surface === 'sheet' || (nav.surface === 'library' && nav.librarySegment === 'characters');
  const campaignsSyncActive = nav.surface === 'library' && nav.librarySegment === 'campaigns';

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
    active: documentsSyncActive,
  });
  const [newCharacterDialogOpen, setNewCharacterDialogOpen] = useState(false);
  // System id whose guided creator modal is open (null = none). Set instead of
  // creating immediately when the picked system provides a CreatorComponent.
  const [creatorSystemId, setCreatorSystemId] = useState<GameSystemId | null>(null);

  const isLibrary = nav.surface === 'library';

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
    addCampaigns,
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
    reloadScenes,
    flushPendingSaves: flushPendingSceneSaves,
  } = useScenes();

  // Scenes have no realtime channel to quiesce (they are localStorage-backed
  // with an UNGATED cross-tab storage listener). Phase 2's reconcile for the
  // Scene surface is instead a re-read on its hidden->visible transition, so a
  // tab that missed a storage event while the keepalive Scene surface was
  // hidden picks up other tabs' edits on return. The initial mount load in
  // useScenes covers the first visit; this fires only on genuine reactivations.
  const isSceneSurface = nav.surface === 'scene';
  const prevSceneSurfaceRef = useRef(isSceneSurface);
  useEffect(() => {
    const wasActive = prevSceneSurfaceRef.current;
    prevSceneSurfaceRef.current = isSceneSurface;
    if (!wasActive && isSceneSurface) {
      reloadScenes();
    }
  }, [isSceneSurface, reloadScenes]);

  // Bridge a scene back to its linked campaign: append a factual recap as a
  // session-log entry. Campaign mutation stays here (the owner of useCampaigns)
  // rather than inside SceneManager.
  const handleLogSceneToCampaign = useCallback(
    (campaignId: string, title: string, body: string) => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign) return;
      const entry = createSessionEntry(generateUUID(), title, body, new Date());
      updateCampaign(addSessionEntry(campaign, entry));
      toast(`Recap added to ${campaign.name}`, 'success');
    },
    [campaigns, updateCampaign, toast]
  );
  const {
    syncState: campaignSyncState,
    lastSyncedAt: lastCampaignSyncedAt,
    sync: syncCampaigns,
  } = useCampaignSync({
    campaigns,
    // Replace, not upsert — see the documents onMerge above.
    onMerge: applyMergedCampaigns,
    active: campaignsSyncActive,
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
    closeSheet();
  }, [flushPendingCampaignSaves, flushPendingDocumentSaves, flushPendingSceneSaves, closeSheet]);

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

  // Only the Characters library segment renders the storage warning, so skip
  // the full-collection serialization entirely otherwise — it must not re-run
  // on every keystroke in a controlled sheet field.
  const isCharacterListVisible = isLibrary && nav.librarySegment === 'characters';
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

  // Initialize browser compatibility checks on mount
  useEffect(() => {
    initBrowserCompat();
  }, []);

  useEffect(() => {
    const activeSystemIds = new Set<GameSystemId>();
    documents.forEach((doc) => activeSystemIds.add(doc.systemId as GameSystemId));
    prefetchSystemAssetsForIds(activeSystemIds);
  }, [documents]);

  const handleCreateCharacter = useCallback(
    (systemId: GameSystemId) => {
      const sysDef = systemRegistry.get(systemId);
      if (!sysDef) return;

      // Systems that ship a guided creator open it in a modal first; the modal's
      // onCreate builds and persists the character. Others create immediately
      // from the SRD default template.
      if (sysDef.CreatorComponent) {
        setCreatorSystemId(systemId);
        return;
      }

      const doc = buildNewCharacterDocument(systemId, sysDef.createDefaultData(), 'New Character');
      addDocument(doc);
      openSheet(doc.id);
    },
    [addDocument, openSheet]
  );

  const handleGuidedCreate = useCallback(
    (system: SystemDataModel, name: string) => {
      if (!creatorSystemId) return;
      const doc = buildNewCharacterDocument(creatorSystemId, system, name);
      addDocument(doc);
      openSheet(doc.id);
      setCreatorSystemId(null);
    },
    [creatorSystemId, addDocument, openSheet]
  );

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    // Destructive: route through the same confirm flow as "Clear All
    // Characters" / "Delete Campaign" instead of deleting on a single click.
    showConfirm('Delete Character', `This will permanently delete "${doc.name}".`, () => {
      deleteDocument(id);
      if (nav.sheetDocId === id) closeSheet();
      toast(`Deleted "${doc.name}"`, 'success');
    });
  };

  const handleExportDocument = (doc: CharacterDocument<SystemDataModel>) => {
    try {
      const dataStr = exportDocuments([doc]);
      const filename = `${doc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_character.json`;
      downloadTextFile(dataStr, filename);
      toast(`Exported "${doc.name}"`, 'success');
    } catch {
      toast('Failed to export character.', 'error');
    }
  };

  const handleExportAllDocuments = () => {
    try {
      const payload = exportDocuments(documents);
      const filename = `all_characters_${new Date().toISOString().slice(0, 10)}.json`;
      downloadTextFile(payload, filename);
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
      openSheet(clone.id);
      toast(`Cloned "${doc.name}"`, 'success');
    },
    [addDocument, openSheet, toast]
  );

  const handleImportDocument = useCallback(() => {
    pickTextFile((jsonString) => {
      try {
        const { documents: imported, droppedCount } = importDocumentsWithReport(jsonString);
        if (imported.length > 0) {
          const normalized = imported.map((d) => ({
            ...d,
            id: generateUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          addDocuments(normalized);
          openSheet(normalized[0].id);
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
    });
  }, [addDocuments, openSheet, toast]);

  const openNewCharacterDialog = useCallback(() => setNewCharacterDialogOpen(true), []);

  // Keyboard shortcuts
  useKeyboardNavigation([
    {
      key: 'Escape',
      callback: () => {
        if (nav.surface === 'sheet') handleReturnToList();
      },
      description: 'Back to character list',
    },
    {
      // Alt+N, not Ctrl+N: Chromium never delivers Ctrl/Cmd+N to the page
      // (it opens a new window). Now opens the New Character dialog.
      key: 'n',
      alt: true,
      callback: () => {
        if (nav.surface !== 'sheet') openNewCharacterDialog();
      },
      description: 'Create new character',
    },
    {
      key: 'i',
      ctrl: true,
      callback: () => {
        if (nav.surface !== 'sheet') handleImportDocument();
      },
      description: 'Import character',
    },
    {
      // Alt+1/2/3 mirror the header's Library / Sheet / Scene navigation.
      key: '1',
      alt: true,
      callback: () => setSurface('library'),
      description: 'Switch to Library',
    },
    {
      key: '2',
      alt: true,
      callback: () => {
        // A sheet surface with no open document renders nothing, so the
        // switch only fires once a sheet has been opened.
        if (nav.sheetDocId !== null) setSurface('sheet');
      },
      description: 'Switch to character sheet',
    },
    {
      // Unguarded: the Scene surface mounts on first visit and shows its
      // "No scene selected" empty state when nothing is picked yet.
      key: '3',
      alt: true,
      callback: () => setSurface('scene'),
      description: 'Switch to Scene',
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

  const currentDoc = documents.find((d) => d.id === nav.sheetDocId);
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
        currentDocId={nav.sheetDocId}
        documents={documents}
        librarySegment={nav.librarySegment}
        onSelectSegment={setLibrarySegment}
        onNewCharacter={openNewCharacterDialog}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onReturnToList={handleReturnToList}
        onSelectCharacter={openSheet}
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
        {nav.overlay === 'legal' ? (
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LegalNotices onBack={closeOverlay} />
          </Suspense>
        ) : isLoading || scenesLoading ? (
          <div className="max-w-6xl mx-auto space-y-6 pt-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          /* Keepalive stage (Phase 2): Library, Sheet and Scene are mounted
             peers — each mounts on first visit, then survives surface
             switches hidden via visibility:hidden + off-screen transform
             (mechanism and rationale live in SurfaceStage.tsx). */
          <SurfaceStage
            sheet={
              currentDoc ? (
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
                          <h2 className="text-lg font-semibold">
                            This character sheet failed to load
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            The sheet may have failed to download (for example after an update or
                            while offline). Reloading usually fixes it — your character data is
                            safe.
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
              ) : null
            }
            library={
              <div className="relative max-w-6xl mx-auto space-y-10">
                {/* Characters segment. Segment views still mount per segment —
                keepalive is surface-granular; only the surface as a whole
                stays alive while hidden. */}
                {nav.librarySegment === 'characters' && canInstall && (
                  <section className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-primary/10 p-3 text-primary">
                          <Download className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold tracking-tight">Install the app</h3>
                          <p className="text-sm text-muted-foreground">
                            Add it to your home screen for faster launches and offline-friendly
                            access.
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
                {/* First-run empty state: CharacterListView renders nothing when no
                characters exist, so an empty roster needs an explicit path into
                the dialog-first creation flow. */}
                {nav.librarySegment === 'characters' && documents.length === 0 && (
                  <section className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center space-y-4">
                    <h3 className="text-2xl font-semibold tracking-tight">No characters yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Create your first character to get started, or bring one back with Import in
                      the header.
                    </p>
                    <Button onClick={openNewCharacterDialog}>Create Your First Character</Button>
                  </section>
                )}
                {nav.librarySegment === 'characters' && (
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
                          closeSheet();
                          toast('All characters deleted', 'success');
                        }
                      )
                    }
                    onOpenCharacter={openSheet}
                    onCloneCharacter={handleCloneDocument}
                    onExportCharacter={(id) => {
                      const doc = documents.find((d) => d.id === id);
                      if (doc) handleExportDocument(doc);
                    }}
                    onDeleteCharacter={handleDeleteDocument}
                    storageWarning={
                      isNearStorageLimit
                        ? { percent: storageUsagePercent, mb: storageUsageMb }
                        : null
                    }
                  />
                )}

                {/* Campaigns segment */}
                {nav.librarySegment === 'campaigns' && (
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
                    onOpenCharacter={openSheet}
                    onImportCampaigns={addCampaigns}
                  />
                )}

                {/* Bestiary library segment: read-only monster catalog (RFC-004) */}
                {nav.librarySegment === 'bestiary' && <LibraryBestiaryView />}

                {/* Content library segment */}
                {nav.librarySegment === 'content' && <SystemStatusDashboard />}

                {/* Scenes segment: the select-only picker (create/import included).
                Selecting a scene flips to the Scene surface. */}
                {nav.librarySegment === 'scenes' && (
                  <LibraryScenesView
                    scenes={scenes}
                    campaigns={campaigns}
                    selectedSceneId={nav.sceneId}
                    onSelectScene={selectScene}
                    onAddScene={addScene}
                    onAddScenes={addScenes}
                  />
                )}
              </div>
            }
            scene={
              /* The operating canvas: SceneManager stays a lazy chunk, so a
                 user who never opens a scene never fetches it. */
              <div className="relative max-w-6xl mx-auto">
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <SceneManager
                    scenes={scenes}
                    documents={documents}
                    campaigns={campaigns}
                    selectedSceneId={nav.sceneId}
                    onSelectScene={selectScene}
                    onAppendSceneEvent={appendSceneEvent}
                    onLogToCampaign={handleLogSceneToCampaign}
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
              </div>
            }
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-2">
          <p>
            Built for tabletop RPG enthusiasts &bull; Supports D&amp;D, Pathfinder, M&amp;M, and
            more
          </p>
          <p>
            <button
              type="button"
              onClick={() => openOverlay('legal')}
              className="underline underline-offset-2 hover:text-foreground"
            >
              Legal &amp; Open-Content Notices
            </button>
            <span className="mx-2">&bull;</span>
            <span>Independent fan project — not affiliated with any rights holder.</span>
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
      <NewCharacterDialog
        open={newCharacterDialogOpen}
        onClose={() => setNewCharacterDialogOpen(false)}
        onCreate={handleCreateCharacter}
      />
      <GuidedCreatorDialog open={creatorSystemId !== null} onClose={() => setCreatorSystemId(null)}>
        {creatorSystemId !== null &&
          (() => {
            const CreatorComponent = systemRegistry.get(creatorSystemId)?.CreatorComponent;
            return CreatorComponent ? (
              <Suspense
                fallback={
                  <div className="p-8">
                    <Skeleton className="h-72 w-full" />
                  </div>
                }
              >
                <CreatorComponent onCreate={handleGuidedCreate} />
              </Suspense>
            ) : null;
          })()}
      </GuidedCreatorDialog>
    </div>
  );
}

// Root crash protection lives in main.tsx (a single ErrorBoundary around
// AuthProvider + App); wrapping again here was redundant. This component only
// provides the toast context.
function App() {
  return (
    <ToastProvider>
      <ShellProvider>
        <AppContent />
      </ShellProvider>
      <ServiceWorkerUpdateBanner />
    </ToastProvider>
  );
}

export default App;
