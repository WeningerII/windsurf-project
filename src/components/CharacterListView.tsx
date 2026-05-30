import { Download, Trash2 } from 'lucide-react';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';
import { systemRegistry } from '../registry';
import { Button } from './ui/Button';
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
  storageWarning,
}: CharacterListViewProps) {
  if (documents.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Your Characters</h3>
          <p className="text-sm text-muted-foreground">
            {filteredDocuments.length === documents.length
              ? `${documents.length} character${documents.length !== 1 ? 's' : ''} saved`
              : `Showing ${filteredDocuments.length} of ${documents.length} characters`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <CharacterCard
            key={doc.id}
            document={doc}
            onOpen={onOpenCharacter}
            onClone={onCloneCharacter}
          />
        ))}
      </div>
    </section>
  );
}
