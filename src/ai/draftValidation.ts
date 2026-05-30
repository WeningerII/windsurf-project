import type {
  AiCandidatePool,
  AiValidationIssue,
  CharacterConceptDraft,
  CharacterDraftChoice,
} from './gatewayContracts';

export function validateCharacterConceptDraftAgainstCandidatePool(
  draft: CharacterConceptDraft,
  candidatePool: AiCandidatePool
): AiValidationIssue[] {
  const issues: AiValidationIssue[] = [];

  if (draft.systemId !== candidatePool.systemId) {
    issues.push({
      code: 'ai-draft-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Draft system ${draft.systemId} does not match candidate pool system ${candidatePool.systemId}.`,
      recoverable: true,
    });
  }

  if (draft.choices.length === 0) {
    issues.push({
      code: 'ai-draft-empty-choices',
      severity: 'warning',
      path: 'choices',
      message: 'Draft did not select any candidate ids.',
      recoverable: true,
    });
  }

  const categoryIds = new Set(candidatePool.categories.map((category) => category.id));
  const candidateIdsByCategory = new Map(
    candidatePool.categories.map((category) => [
      category.id,
      new Set(category.candidates.map((candidate) => candidate.id)),
    ])
  );
  const seenChoices = new Set<string>();

  draft.choices.forEach((choice, index) => {
    issues.push(...validateChoice(choice, index, categoryIds, candidateIdsByCategory));

    const choiceKey = `${choice.categoryId}:${choice.candidateId}`;
    if (seenChoices.has(choiceKey)) {
      issues.push({
        code: 'ai-draft-duplicate-choice',
        severity: 'warning',
        path: `choices.${index}`,
        message: `Draft repeats candidate ${choice.candidateId} in category ${choice.categoryId}.`,
        recoverable: true,
      });
    }
    seenChoices.add(choiceKey);
  });

  return issues;
}

export function hasBlockingAiDraftIssues(issues: AiValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === 'error');
}

function validateChoice(
  choice: CharacterDraftChoice,
  index: number,
  categoryIds: Set<string>,
  candidateIdsByCategory: Map<string, Set<string>>
): AiValidationIssue[] {
  const issues: AiValidationIssue[] = [];

  if (!categoryIds.has(choice.categoryId)) {
    issues.push({
      code: 'ai-draft-unknown-category',
      severity: 'error',
      path: `choices.${index}.categoryId`,
      message: `Draft chose unknown category ${choice.categoryId}.`,
      recoverable: true,
    });
    return issues;
  }

  const candidateIds = candidateIdsByCategory.get(choice.categoryId);
  if (!candidateIds?.has(choice.candidateId)) {
    issues.push({
      code: 'ai-draft-unknown-candidate',
      severity: 'error',
      path: `choices.${index}.candidateId`,
      message: `Draft chose unknown candidate ${choice.candidateId} for category ${choice.categoryId}.`,
      recoverable: true,
    });
  }

  if (choice.confidence !== undefined && (choice.confidence < 0 || choice.confidence > 1)) {
    issues.push({
      code: 'ai-draft-confidence-out-of-range',
      severity: 'warning',
      path: `choices.${index}.confidence`,
      message: 'Draft confidence should be between 0 and 1 when provided.',
      recoverable: true,
    });
  }

  return issues;
}
