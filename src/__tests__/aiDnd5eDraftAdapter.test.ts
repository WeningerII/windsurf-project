import {
  applyDnd5e2024AiConceptDraft,
  type AiCandidatePool,
  type CharacterConceptDraft,
} from '../ai';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

const candidatePool: AiCandidatePool = {
  systemId: 'dnd-5e-2024',
  generatedAt: TEST_DATE.toISOString(),
  categories: [
    {
      id: 'class',
      label: 'Classes',
      candidates: [{ id: 'fighter', label: 'Fighter' }],
    },
    {
      id: 'species',
      label: 'Species',
      candidates: [{ id: 'human', label: 'Human' }],
    },
    {
      id: 'background',
      label: 'Backgrounds',
      candidates: [{ id: 'soldier-2024', label: 'Soldier' }],
    },
    {
      id: 'feat',
      label: 'Feats',
      candidates: [{ id: 'tough', label: 'Tough' }],
    },
  ],
};

describe('D&D 5e AI draft adapter', () => {
  it('turns a candidate-validated AI concept draft into the deterministic 2024 creation path', async () => {
    const aiDraft: CharacterConceptDraft = {
      systemId: 'dnd-5e-2024',
      conceptSummary: 'A disciplined front-line defender.',
      nameSuggestion: 'Avery',
      choices: [
        { categoryId: 'class', candidateId: 'fighter' },
        { categoryId: 'species', candidateId: 'human' },
        { categoryId: 'background', candidateId: 'soldier-2024' },
      ],
    };

    const result = await applyDnd5e2024AiConceptDraft(aiDraft, candidatePool, {
      draftId: 'ai-draft-1',
      documentId: 'doc-from-ai-draft',
      now: TEST_DATE,
    });

    expect(result.aiIssues).toEqual([]);
    expect(result.creationDraft).toEqual(
      expect.objectContaining({
        id: 'ai-draft-1',
        systemId: 'dnd-5e-2024',
        data: expect.objectContaining({
          characterName: 'Avery',
          classId: 'fighter',
          speciesId: 'human',
          backgroundId: 'soldier-2024',
        }),
      })
    );
    expect(result.application?.completion?.draft.status).toBe('completed');
    expect(result.application?.document).toEqual(
      expect.objectContaining({
        id: 'doc-from-ai-draft',
        name: 'Avery',
        systemId: 'dnd-5e-2024',
      })
    );
  });

  it('blocks invented AI draft choices before deterministic application', async () => {
    const aiDraft: CharacterConceptDraft = {
      systemId: 'dnd-5e-2024',
      conceptSummary: 'An invented class.',
      choices: [{ categoryId: 'class', candidateId: 'gunslinger' }],
    };

    const result = await applyDnd5e2024AiConceptDraft(aiDraft, candidatePool, {
      draftId: 'ai-draft-2',
      documentId: 'bad-doc',
      now: TEST_DATE,
    });

    expect(result.creationDraft).toBeUndefined();
    expect(result.application).toBeUndefined();
    expect(result.aiIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'ai-draft-unknown-candidate',
          severity: 'error',
          path: 'choices.0.candidateId',
        }),
      ])
    );
  });

  it('warns when valid AI choices are outside the first deterministic applicator scope', async () => {
    const aiDraft: CharacterConceptDraft = {
      systemId: 'dnd-5e-2024',
      conceptSummary: 'A resilient defender.',
      choices: [
        { categoryId: 'class', candidateId: 'fighter' },
        { categoryId: 'feat', candidateId: 'tough' },
      ],
    };

    const result = await applyDnd5e2024AiConceptDraft(aiDraft, candidatePool, {
      draftId: 'ai-draft-3',
      documentId: 'partial-doc',
      now: TEST_DATE,
    });

    expect(result.aiIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'ai-draft-choice-not-applied',
          severity: 'warning',
          path: 'choices.1',
        }),
      ])
    );
    expect(result.application?.completion).toBeDefined();
  });
});
