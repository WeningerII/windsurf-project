import {
  type AiCandidatePool,
  type CharacterConceptDraft,
  hasBlockingAiDraftIssues,
  validateCharacterConceptDraftAgainstCandidatePool,
} from '../ai';

const candidatePool: AiCandidatePool = {
  systemId: 'dnd-5e-2024',
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
  ],
};

describe('AI draft validation', () => {
  it('accepts draft choices that reference candidate-pool ids', () => {
    const draft: CharacterConceptDraft = {
      systemId: 'dnd-5e-2024',
      conceptSummary: 'A sturdy defender.',
      choices: [
        { categoryId: 'class', candidateId: 'fighter' },
        { categoryId: 'species', candidateId: 'human' },
      ],
    };

    const issues = validateCharacterConceptDraftAgainstCandidatePool(draft, candidatePool);

    expect(issues).toEqual([]);
    expect(hasBlockingAiDraftIssues(issues)).toBe(false);
  });

  it('rejects invented categories and candidate ids', () => {
    const draft: CharacterConceptDraft = {
      systemId: 'dnd-5e-2024',
      conceptSummary: 'An impossible draft.',
      choices: [
        { categoryId: 'class', candidateId: 'gunslinger' },
        { categoryId: 'ancestry', candidateId: 'human' },
      ],
    };

    const issues = validateCharacterConceptDraftAgainstCandidatePool(draft, candidatePool);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'ai-draft-unknown-candidate',
          severity: 'error',
          path: 'choices.0.candidateId',
        }),
        expect.objectContaining({
          code: 'ai-draft-unknown-category',
          severity: 'error',
          path: 'choices.1.categoryId',
        }),
      ])
    );
    expect(hasBlockingAiDraftIssues(issues)).toBe(true);
  });

  it('surfaces repairable warnings for weak draft metadata', () => {
    const draft: CharacterConceptDraft = {
      systemId: 'dnd-5e-2014',
      conceptSummary: 'A duplicate draft.',
      choices: [
        { categoryId: 'class', candidateId: 'fighter', confidence: 1.5 },
        { categoryId: 'class', candidateId: 'fighter' },
      ],
    };

    const issues = validateCharacterConceptDraftAgainstCandidatePool(draft, candidatePool);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'ai-draft-system-mismatch', severity: 'error' }),
        expect.objectContaining({
          code: 'ai-draft-confidence-out-of-range',
          severity: 'warning',
        }),
        expect.objectContaining({ code: 'ai-draft-duplicate-choice', severity: 'warning' }),
      ])
    );
  });
});
