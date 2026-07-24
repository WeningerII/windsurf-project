import { Users } from 'lucide-react';
import { systemRegistry } from '../registry';
import type { CharacterDocument } from '../types/core/document';
import type { DragSourceHandlers } from '../components/drag/dragTypes';

/**
 * Party roster tab. Renders the App `documents` list — the same
 * character-document source SceneManager's roster is backed by, and the
 * load-bearing source the Phase-4 party-drag 1-choice gate consumes.
 *
 * Still NO click-to-add verb (you do not add a character to a character). In
 * Phase 4 each entry becomes a drag SOURCE: when `makeDragHandlers` is provided
 * (the flag is on and a DragProvider is mounted) it yields the {documentId}
 * drag payload the scene grid resolves to a place-token. When absent (flag off /
 * standalone) the roster renders exactly as in Phase 3.
 */
interface PartyDockTabProps {
  documents: CharacterDocument[];
  /** Per-entry drag handlers; absent = no drag (browse-only, as in Phase 3). */
  makeDragHandlers?: (documentId: string, label: string) => DragSourceHandlers;
}

export function PartyDockTab({ documents, makeDragHandlers }: PartyDockTabProps) {
  if (documents.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No characters yet. Create a character to populate your party roster.
      </div>
    );
  }

  return (
    <ul className="space-y-2" aria-label="Party roster">
      {documents.map((doc) => {
        const systemLabel = systemRegistry.get(doc.systemId)?.label ?? doc.systemId;
        const dragHandlers = makeDragHandlers?.(doc.id, doc.name);
        return (
          <li
            key={doc.id}
            {...dragHandlers}
            className={`flex items-center gap-3 rounded-lg border bg-card px-3 py-2 text-sm${
              dragHandlers ? ' cursor-grab' : ''
            }`}
          >
            <span className="rounded-md bg-primary/10 p-1.5 text-primary">
              <Users className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{doc.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{systemLabel}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
