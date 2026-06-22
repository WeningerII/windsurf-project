/**
 * Local-first persistence for the in-progress creation draft (Phase 4A —
 * "resumable local drafts"). One draft at a time: starting the wizard saves a
 * draft; resuming reads it back; finalising or cancelling clears it. Never
 * touches Supabase, and every access goes through the throw-safe storage helpers
 * so a hostile storage environment degrades to a no-op. Reads run through
 * `parseCreationDraft`, so a corrupt stored draft is dropped, not crashed on.
 */
import { safeGetItem, safeRemoveItem, safeSetItem } from '../utils/safeStorage';
import { parseCreationDraft, serializeCreationDraft, type CreationDraft } from './creationDraft';

export const CREATION_DRAFT_STORAGE_KEY = 'rpg-creation-draft-v1';

export function saveCreationDraft(draft: CreationDraft): void {
  safeSetItem(CREATION_DRAFT_STORAGE_KEY, serializeCreationDraft(draft));
}

export function loadCreationDraft(): CreationDraft | null {
  const raw = safeGetItem(CREATION_DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return parseCreationDraft(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearCreationDraft(): void {
  safeRemoveItem(CREATION_DRAFT_STORAGE_KEY);
}
