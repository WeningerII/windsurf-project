import { afterEach, describe, expect, it } from 'vitest';

import { createCreationDraft } from '../../creation/creationDraft';
import {
  CREATION_DRAFT_STORAGE_KEY,
  clearCreationDraft,
  loadCreationDraft,
  saveCreationDraft,
} from '../../creation/creationDraftStorage';

/**
 * PHASE 4A: the draft is resumable and local-first — save/load round-trips, a
 * corrupt stored draft is dropped, and clearing removes it. No Supabase.
 */

afterEach(() => localStorage.clear());

function draft() {
  return createCreationDraft({
    id: 'draft-1',
    systemId: 'dnd-5e-2024',
    steps: ['class', 'review'],
    system: { classLevels: [] },
  });
}

describe('creation draft storage', () => {
  it('saves and resumes a draft', () => {
    const d = draft();
    saveCreationDraft(d);
    expect(loadCreationDraft()).toEqual(d);
  });

  it('returns null when there is no saved draft', () => {
    expect(loadCreationDraft()).toBeNull();
  });

  it('drops a corrupt stored draft instead of throwing', () => {
    localStorage.setItem(CREATION_DRAFT_STORAGE_KEY, '{ not json');
    expect(loadCreationDraft()).toBeNull();
    localStorage.setItem(CREATION_DRAFT_STORAGE_KEY, JSON.stringify({ id: 'd' })); // invalid shape
    expect(loadCreationDraft()).toBeNull();
  });

  it('clears a saved draft', () => {
    saveCreationDraft(draft());
    clearCreationDraft();
    expect(loadCreationDraft()).toBeNull();
  });
});
