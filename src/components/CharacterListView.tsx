import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';
import { systemRegistry } from '../registry';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { CharacterCard } from './CharacterCard';

export type CharacterSortOption =
  | 'updated-desc'
  | 'updated-asc'
  | 'name-asc'
  | 'name-desc'
  | 'level-desc'
  | 'level-asc';

interface CharacterListViewProps {
  documents: CharacterDocument<SystemDataModel>[];
  filteredDocuments: CharacterDocument<SystemDataModel>[];
  systemFilter: 'all' | GameSystemId;
  onSystemFilterChange: (value: 'all' | GameSystemId) => void;
  sortOption: CharacterSortOption;
  onSortOptionChange: (value: CharacterSortOption) => void;
  onExportAll: () => void;
  onClearAll: () => void;
  onOpenCharacter: (id: string) => void;
  onCloneCharacter: (document: CharacterDocument<SystemDataModel>) => void;
  onExportCharacter: (id: string) => void;
  onDeleteCharacter: (id: string) => void;
  storageWarning: { percent: number; mb: string } | null;
}

/** The "Your Characters" section: count, filter/sort controls, and the card grid. */
export function CharacterListView({
  documents,
  filteredDocuments,
  systemFilter,
  onSystemFilterChange,
  sortOption,
  onSortOptionChange,
  onExportAll,
  onClearAll,
  onOpenCharacter,
  onCloneCharacter,
  onExportCharacter,
  onDeleteCharacter,
  storageWarning,
}: CharacterListViewProps) {
  // Name search is view-local: it narrows on top of the App-owned system
  // filter + sort without re-running that memoized pipeline per keystroke.
  const [searchQuery, setSearchQuery] = useState('');

  if (documents.length === 0) return null;

  const query = searchQuery.trim().toLowerCase();
  const visibleDocuments = query
    ? filteredDocuments.filter((doc) => doc.name.toLowerCase().includes(query))
    : filteredDocuments;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Your Characters</h3>
          <p className="text-sm text-muted-foreground">
            {visibleDocuments.length === documents.length
              ? `${documents.length} character${documents.length !== 1 ? 's' : ''} saved`
              : `Showing ${visibleDocuments.length} of ${documents.length} characters`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="search"
            title="Search characters"
            aria-label="Search characters"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-44"
          />
          <Select
            title="Filter by system"
            value={systemFilter}
            onChange={(e) =>
              onSystemFilterChange(
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
            onChange={(e) => onSortOptionChange(e.target.value as CharacterSortOption)}
            className="w-44"
          >
            <option value="updated-desc">Recently updated</option>
            <option value="updated-asc">Oldest updated</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="level-desc">Highest level</option>
            <option value="level-asc">Lowest level</option>
          </Select>
          <Button variant="outline" size="sm" onClick={onExportAll}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export All Characters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onClearAll}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear All Characters
          </Button>
        </div>
      </div>

      {storageWarning && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          Storage usage is at {storageWarning.percent}% ({storageWarning.mb} MB of ~5 MB). Export
          and remove unused characters to avoid save failures.
        </div>
      )}

      {visibleDocuments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No characters match the current filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleDocuments.map((doc) => (
            <CharacterCard
              key={doc.id}
              document={doc}
              onOpen={onOpenCharacter}
              onClone={onCloneCharacter}
              onExport={onExportCharacter}
              onDelete={onDeleteCharacter}
            />
          ))}
        </div>
      )}
    </section>
  );
}
