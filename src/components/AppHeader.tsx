import {
  ArrowLeft,
  BookOpen,
  Copy,
  Download,
  Plus,
  Redo2,
  Trash2,
  Undo2,
  Upload,
} from 'lucide-react';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { SyncState } from '../hooks/useSync';
import { systemRegistry } from '../registry';
import { Button } from './ui/Button';
import { OverflowMenu } from './ui/OverflowMenu';
import { Select } from './ui/Select';
import { ThemeToggle } from './ui/ThemeToggle';
import { UserMenu } from './UserMenu';
import { type LibrarySegment, LIBRARY_SEGMENTS, librarySegmentLabel } from '../hooks/useAppNav';

interface AppHeaderProps {
  currentDoc: CharacterDocument<SystemDataModel> | null;
  currentDocId: string | null;
  documents: CharacterDocument<SystemDataModel>[];
  /** Active Library tab (list mode only). */
  librarySegment: LibrarySegment;
  onSelectSegment: (segment: LibrarySegment) => void;
  onNewCharacter: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReturnToList: () => void;
  onSelectCharacter: (id: string) => void;
  onClone: (document: CharacterDocument<SystemDataModel>) => void;
  onExport: (document: CharacterDocument<SystemDataModel>) => void;
  onImport: () => void;
  onDelete: (id: string) => void;
  syncState: SyncState;
  lastSyncedAt: Date | null;
  onSyncNow: () => void;
  pendingSyncCount: number;
}

/**
 * Sticky top toolbar. In list mode it carries the Library tab nav
 * (Characters / Campaigns / Scenes / Library) plus the primary New Character
 * and Import actions; in sheet mode it swaps to back/switcher and the current
 * character's clone / import controls, with Export and Delete in a '…'
 * overflow menu (Finding 18 re-home).
 */
export function AppHeader({
  currentDoc,
  currentDocId,
  documents,
  librarySegment,
  onSelectSegment,
  onNewCharacter,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReturnToList,
  onSelectCharacter,
  onClone,
  onExport,
  onImport,
  onDelete,
  syncState,
  lastSyncedAt,
  onSyncNow,
  pendingSyncCount,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {currentDoc ? (
              <Button
                variant="ghost"
                onClick={onReturnToList}
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

          {/* Library tab nav (list mode only) */}
          {!currentDoc && (
            <nav aria-label="Library" className="hidden md:flex items-center gap-1">
              {LIBRARY_SEGMENTS.map((segment) => {
                const active = librarySegment === segment;
                return (
                  <button
                    key={segment}
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onSelectSegment(segment)}
                    className={`h-9 rounded-lg px-3.5 text-sm transition-colors ${
                      active
                        ? 'bg-muted font-semibold text-foreground'
                        : 'font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    {librarySegmentLabel(segment)}
                  </button>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              aria-label="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
            {currentDoc ? (
              <>
                <Select
                  value={currentDocId || ''}
                  onChange={(e) => onSelectCharacter(e.target.value)}
                  className="w-40 md:w-56 hidden sm:flex"
                  aria-label="Switch character"
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
                  onClick={() => onClone(currentDoc)}
                  title="Clone character"
                  aria-label="Clone character"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onImport}
                  title="Import character"
                  aria-label="Import Character"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <OverflowMenu
                  label="Character actions"
                  items={[
                    {
                      label: 'Export character',
                      icon: <Download className="w-4 h-4" />,
                      onSelect: () => onExport(currentDoc),
                    },
                    {
                      label: 'Delete character',
                      icon: <Trash2 className="w-4 h-4" />,
                      destructive: true,
                      onSelect: () => {
                        if (currentDocId) onDelete(currentDocId);
                      },
                    },
                  ]}
                />
              </>
            ) : (
              <>
                <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
                <Button size="sm" onClick={onNewCharacter}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  New Character
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onImport}
                  title="Import character"
                  aria-label="Import Character"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </>
            )}
            <UserMenu
              syncState={syncState}
              lastSyncedAt={lastSyncedAt}
              onSyncNow={onSyncNow}
              pendingSyncCount={pendingSyncCount}
            />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
