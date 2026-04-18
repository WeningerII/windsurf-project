import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameSystemSelector } from './components/GameSystemSelector';
import { SystemStatusDashboard } from './components/SystemStatusDashboard';
import { GameSystemId } from './types/game-systems';
import { systemRegistry } from './registry';
import { Button } from './components/ui/Button';
import { Select } from './components/ui/Select';
import {
  BookOpen,
  Plus,
  Trash2,
  ArrowLeft,
  Download,
  Upload,
  AlertCircle,
  X,
  Copy,
  Undo2,
  Redo2,
} from 'lucide-react';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserMenu } from './components/UserMenu';
import { useSync } from './hooks/useSync';
import { useCampaignSync } from './hooks/useCampaignSync';
import { generateUUID, initBrowserCompat } from './utils/browserCompat';
import { SystemSheetRenderer } from './components/SystemSheetRenderer';
import { CharacterDocument, SystemDataModel } from './types/core/document';
import { useDocuments } from './hooks/useDocuments';
import { exportDocuments, importDocuments } from './utils/documentStorage';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { Skeleton } from './components/ui/Skeleton';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { ToastProvider, useToast } from './components/ui/Toast';
import { ServiceWorkerUpdateBanner } from './components/ServiceWorkerUpdateBanner';
import { useCampaigns } from './hooks/useCampaigns';
import { CampaignManager } from './components/CampaignManager';
import { prefetchSystemAssetsForIds } from './utils/systemAssetPrefetch';
import { usePwaInstallPrompt } from './hooks/usePwaInstallPrompt';

type CharacterSortOption =
  | 'updated-desc'
  | 'updated-asc'
  | 'name-asc'
  | 'name-desc'
  | 'level-desc'
  | 'level-asc';

const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;
const STORAGE_WARNING_THRESHOLD = Math.floor(STORAGE_LIMIT_BYTES * 0.8);

function humanizeToken(value: string): string {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null;
  return value as Record<string, unknown>;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function getDocumentLevelValue(doc: CharacterDocument<SystemDataModel>): number {
  const sys = doc.system as Record<string, unknown>;
  return asNumber(sys.level) ?? asNumber(sys.powerLevel) ?? 0;
}

function getLevelLabel(doc: CharacterDocument<SystemDataModel>): string | null {
  const sys = doc.system as Record<string, unknown>;
  const level = asNumber(sys.level);
  if (level !== null) return `Level ${level}`;

  const powerLevel = asNumber(sys.powerLevel);
  if (powerLevel !== null) return `Power Level ${powerLevel}`;

  return null;
}

function getClassLabel(system: SystemDataModel): string | null {
  const data = system as Record<string, unknown>;
  const classLevels = data.classLevels;
  if (Array.isArray(classLevels) && classLevels.length > 0) {
    const first = asRecord(classLevels[0]);
    const classId = first ? asString(first.classId) : null;
    if (classId) {
      const extraClasses = classLevels.length - 1;
      return `${humanizeToken(classId)}${extraClasses > 0 ? ` +${extraClasses}` : ''}`;
    }
  }

  const classId = asString(data.classId);
  return classId ? humanizeToken(classId) : null;
}

function getSpeciesLabel(system: SystemDataModel): string | null {
  const data = system as Record<string, unknown>;
  const speciesId = asString(data.speciesId);
  if (speciesId) return humanizeToken(speciesId);

  const ancestryId = asString(data.ancestryId);
  if (ancestryId) return humanizeToken(ancestryId);

  return null;
}

function getHitPointLabel(system: SystemDataModel): string | null {
  const data = system as Record<string, unknown>;
  const hp = asRecord(data.hitPoints);
  if (!hp) return null;

  const current = asNumber(hp.current);
  const max = asNumber(hp.max);
  if (current === null || max === null) return null;

  return `${current}/${max} HP`;
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
    updateDocument,
    deleteDocument,
    clearAllDocuments,
    undo,
    redo,
    canUndo,
    canRedo,
    flushPendingSaves: flushPendingDocumentSaves,
  } = useDocuments();

  const { syncState, lastSyncedAt, sync } = useSync({
    documents,
    onMerge: addDocuments,
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
    addCampaign,
    addCampaigns,
    updateCampaign,
    deleteCampaign,
    addCharacterToCampaign,
    removeCharacterFromCampaign,
    flushPendingSaves: flushPendingCampaignSaves,
  } = useCampaigns();
  useCampaignSync({
    campaigns,
    onMerge: addCampaigns,
  });
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
    setCurrentDocId(null);
  }, [flushPendingCampaignSaves, flushPendingDocumentSaves]);

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

  const storageUsageBytes = useMemo(() => {
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
  }, [documents]);

  const storageUsagePercent = Math.min(
    100,
    Math.round((storageUsageBytes / STORAGE_LIMIT_BYTES) * 100)
  );
  const isNearStorageLimit = storageUsageBytes >= STORAGE_WARNING_THRESHOLD;
  const storageUsageMb = (storageUsageBytes / (1024 * 1024)).toFixed(2);

  const triggerJsonDownload = useCallback((jsonPayload: string, filename: string) => {
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonPayload)}`;
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    link.click();
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
    };
    addDocument(doc);
    setCurrentDocId(doc.id);
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    if (currentDocId === id) setCurrentDocId(null);
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
          const imported = importDocuments(jsonString);
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
              `Imported ${normalized.length} character${normalized.length !== 1 ? 's' : ''}`,
              'success'
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
      key: 'n',
      ctrl: true,
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

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:shadow-md"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {currentDoc ? (
                <Button
                  variant="ghost"
                  onClick={handleReturnToList}
                  title="Back to character list"
                  className="shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
              ) : (
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-lg font-bold truncate">
                  {currentDoc ? currentDoc.name : 'RPG Character Sheet'}
                </h1>
                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                  {currentDoc
                    ? systemRegistry.get(currentDoc.systemId)?.label
                    : 'Multi-system tabletop character manager'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Shift+Z)"
                aria-label="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
              {currentDoc && (
                <>
                  <Select
                    value={currentDocId || ''}
                    onChange={(e) => setCurrentDocId(e.target.value)}
                    className="w-40 md:w-56 hidden sm:flex"
                  >
                    <option value="">Switch character...</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({systemRegistry.get(doc.systemId)?.label})
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCloneDocument(currentDoc)}
                    title="Clone character"
                    aria-label="Clone character"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleExportDocument(currentDoc)}
                    title="Export character"
                    aria-label="Export character"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleImportDocument}
                    title="Import character"
                    aria-label="Import Character"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => currentDocId && handleDeleteDocument(currentDocId)}
                    title="Delete character"
                    aria-label="Delete character"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              <UserMenu syncState={syncState} lastSyncedAt={lastSyncedAt} onSyncNow={sync} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="border-b border-destructive/30 bg-destructive/10 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
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
        {isLoading ? (
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
            <SystemSheetRenderer document={currentDoc} onUpdate={updateDocument} />
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
            {documents.length > 0 && (
              <section className="space-y-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">Your Characters</h3>
                    <p className="text-sm text-muted-foreground">
                      {filteredAndSortedDocuments.length === documents.length
                        ? `${documents.length} character${documents.length !== 1 ? 's' : ''} saved`
                        : `Showing ${filteredAndSortedDocuments.length} of ${documents.length} characters`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      title="Filter by system"
                      value={systemFilter}
                      onChange={(e) =>
                        setSystemFilter(
                          e.target.value === 'all' ? 'all' : (e.target.value as GameSystemId)
                        )
                      }
                      className="w-44"
                    >
                      <option value="all">All systems</option>
                      {systemRegistry.getAll().map((sys) => (
                        <option key={sys.id} value={sys.id}>
                          {sys.label}
                        </option>
                      ))}
                    </Select>
                    <Select
                      title="Sort characters"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as CharacterSortOption)}
                      className="w-44"
                    >
                      <option value="updated-desc">Recently updated</option>
                      <option value="updated-asc">Oldest updated</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="level-desc">Highest level</option>
                      <option value="level-asc">Lowest level</option>
                    </Select>
                    <Button variant="outline" size="sm" onClick={handleExportAllDocuments}>
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Export All Characters
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() =>
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
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Clear All Characters
                    </Button>
                  </div>
                </div>

                {isNearStorageLimit && (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
                    Storage usage is at {storageUsagePercent}% ({storageUsageMb} MB of ~5 MB).
                    Export and remove unused characters to avoid save failures.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAndSortedDocuments.map((doc) => {
                    const sys = systemRegistry.get(doc.systemId);
                    const levelLabel = getLevelLabel(doc);
                    const classLabel = getClassLabel(doc.system);
                    const speciesLabel = getSpeciesLabel(doc.system);
                    const hitPointLabel = getHitPointLabel(doc.system);
                    return (
                      <div key={doc.id} className="group relative">
                        <button
                          className="w-full h-full p-5 rounded-xl border bg-card text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/50"
                          onClick={() => setCurrentDocId(doc.id)}
                        >
                          <div className="flex items-start justify-between mb-2 pr-9">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {doc.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                              {sys?.label}
                            </span>
                          </div>
                          <h4 className="font-semibold text-lg leading-tight mb-1">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {levelLabel ?? 'New character'}
                          </p>
                          {(classLabel || speciesLabel || hitPointLabel) && (
                            <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                              {classLabel && (
                                <p>
                                  Class: <span className="text-foreground">{classLabel}</span>
                                </p>
                              )}
                              {speciesLabel && (
                                <p>
                                  Species: <span className="text-foreground">{speciesLabel}</span>
                                </p>
                              )}
                              {hitPointLabel && (
                                <p>
                                  HP: <span className="text-foreground">{hitPointLabel}</span>
                                </p>
                              )}
                            </div>
                          )}
                          <div className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all pointer-events-none" />
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloneDocument(doc);
                          }}
                          title={`Clone ${doc.name}`}
                          aria-label={`Clone ${doc.name}`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

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

// Wrap entire app in ErrorBoundary + ToastProvider for crash protection and notifications
function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
        <ServiceWorkerUpdateBanner />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
