import { Users } from 'lucide-react';
import { systemRegistry } from '../registry';
import type { CharacterDocument } from '../types/core/document';

/**
 * Browse-only party roster tab (Phase 3). Renders the App `documents` list —
 * the same character-document source SceneManager's roster is backed by, and
 * the load-bearing source the Phase-4 party-drag 1-choice gate will consume.
 *
 * Phase 3 is deliberately inert here: NO click-to-add verb (you do not add a
 * character to a character) and NO drag handle (the drag-to-scene source is
 * wired in Phase 4). It does NOT go through `useDockResources`.
 */
interface PartyDockTabProps {
  documents: CharacterDocument[];
}

export function PartyDockTab({ documents }: PartyDockTabProps) {
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
        return (
          <li
            key={doc.id}
            className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 text-sm"
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
