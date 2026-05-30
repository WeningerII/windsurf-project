import {
  clearCreationDrafts,
  createCreationDraft,
  deleteCreationDraft,
  finalizeCreationDraft,
  loadCreationDraft,
  loadCreationDrafts,
  setCreationDraftValidationIssues,
  updateCreationDraftStep,
  upsertCreationDraft,
} from '../../utils/creationDraftStorage';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');
const NEXT_DATE = new Date('2026-05-01T00:05:00.000Z');

function createTestDocument(systemId = 'dnd-5e-2024'): CharacterDocument<SystemDataModel> {
  return {
    id: 'doc-1',
    name: 'Created Character',
    systemId,
    system: { level: 1 },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

describe('creation draft storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('creates, saves, loads, and deletes resumable local drafts', () => {
    const draft = createCreationDraft({
      id: 'draft-1',
      systemId: 'dnd-5e-2024',
      name: 'Fighter Draft',
      now: TEST_DATE,
      steps: [
        { id: 'concept', label: 'Concept' },
        { id: 'class', label: 'Class' },
      ],
      data: { concept: 'Shield fighter' },
    });

    const draftsAfterSave = upsertCreationDraft(draft);
    const loadedDraft = loadCreationDraft('draft-1');

    expect(draftsAfterSave).toHaveLength(1);
    expect(loadedDraft).toEqual(
      expect.objectContaining({
        id: 'draft-1',
        systemId: 'dnd-5e-2024',
        name: 'Fighter Draft',
        currentStepId: 'concept',
        status: 'draft',
        data: { concept: 'Shield fighter' },
      })
    );
    expect(loadedDraft?.createdAt).toEqual(TEST_DATE);
    expect(loadedDraft?.steps).toEqual([
      { id: 'concept', label: 'Concept', status: 'active', data: undefined, issues: undefined },
      { id: 'class', label: 'Class', status: 'pending', data: undefined, issues: undefined },
    ]);

    expect(deleteCreationDraft('draft-1')).toEqual([]);
    expect(loadCreationDrafts()).toEqual([]);

    upsertCreationDraft(draft);
    clearCreationDrafts();
    expect(loadCreationDrafts()).toEqual([]);
  });

  it('updates step state and validation readiness without mutating the original draft', () => {
    const draft = createCreationDraft({
      id: 'draft-2',
      systemId: 'dnd-5e-2024',
      now: TEST_DATE,
      steps: [
        { id: 'concept', label: 'Concept' },
        { id: 'class', label: 'Class' },
      ],
    });

    const steppedDraft = updateCreationDraftStep(
      draft,
      'class',
      { status: 'active', data: { classId: 'fighter' } },
      NEXT_DATE
    );
    const warningReadyDraft = setCreationDraftValidationIssues(
      steppedDraft,
      [
        {
          code: 'creation-warning',
          severity: 'warning',
          message: 'Optional equipment is incomplete.',
        },
      ],
      NEXT_DATE
    );
    const blockedDraft = setCreationDraftValidationIssues(
      warningReadyDraft,
      [
        {
          code: 'creation-error',
          severity: 'error',
          message: 'Class is missing.',
        },
      ],
      NEXT_DATE
    );

    expect(draft.currentStepId).toBe('concept');
    expect(steppedDraft.currentStepId).toBe('class');
    expect(steppedDraft.steps[1]).toEqual(
      expect.objectContaining({
        id: 'class',
        status: 'active',
        data: { classId: 'fighter' },
      })
    );
    expect(warningReadyDraft.status).toBe('ready');
    expect(blockedDraft.status).toBe('draft');
  });

  it('finalizes drafts only when the output document uses the same system', () => {
    const draft = createCreationDraft({
      id: 'draft-3',
      systemId: 'dnd-5e-2024',
      now: TEST_DATE,
      steps: [{ id: 'concept', label: 'Concept' }],
    });
    const document = createTestDocument();

    const completion = finalizeCreationDraft(draft, document, NEXT_DATE);

    expect(completion.document).toBe(document);
    expect(completion.draft).toEqual(
      expect.objectContaining({
        id: 'draft-3',
        status: 'completed',
        finalDocumentId: 'doc-1',
        updatedAt: NEXT_DATE,
      })
    );
    expect(() => finalizeCreationDraft(draft, createTestDocument('pf2e'), NEXT_DATE)).toThrow(
      "Creation draft system 'dnd-5e-2024' does not match document system 'pf2e'."
    );
  });
});
