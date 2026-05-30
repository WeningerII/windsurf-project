import {
  buildDnd5e2024DocumentFromDraft,
  createDnd5e2024CreationDraft,
  type Dnd5e2024DraftApplicationResult,
} from '../systems/dnd5e-2024/creationDraft';
import type { CreationDraft } from '../types/core/creationDraft';
import type { AiCandidatePool, AiValidationIssue, CharacterConceptDraft } from './gatewayContracts';
import {
  hasBlockingAiDraftIssues,
  validateCharacterConceptDraftAgainstCandidatePool,
} from './draftValidation';

export interface ApplyDnd5e2024AiDraftOptions {
  draftId: string;
  documentId: string;
  now?: Date;
}

export interface Dnd5e2024AiDraftApplicationResult {
  aiIssues: AiValidationIssue[];
  creationDraft?: CreationDraft;
  application?: Dnd5e2024DraftApplicationResult;
}

const APPLIED_5E_2024_CHOICE_CATEGORIES = new Set(['class', 'species', 'background']);

export async function applyDnd5e2024AiConceptDraft(
  aiDraft: CharacterConceptDraft,
  candidatePool: AiCandidatePool,
  options: ApplyDnd5e2024AiDraftOptions
): Promise<Dnd5e2024AiDraftApplicationResult> {
  const aiIssues = [
    ...validateCharacterConceptDraftAgainstCandidatePool(aiDraft, candidatePool),
    ...getUnsupportedChoiceWarnings(aiDraft),
  ];

  if (hasBlockingAiDraftIssues(aiIssues)) {
    return { aiIssues };
  }

  const creationDraft = createDnd5e2024CreationDraft({
    id: options.draftId,
    name: aiDraft.nameSuggestion ? `${aiDraft.nameSuggestion} Draft` : undefined,
    data: {
      characterName: aiDraft.nameSuggestion,
      classId: getFirstChoice(aiDraft, 'class'),
      speciesId: getFirstChoice(aiDraft, 'species'),
      backgroundId: getFirstChoice(aiDraft, 'background'),
    },
    now: options.now,
  });

  const application = await buildDnd5e2024DocumentFromDraft(creationDraft, {
    documentId: options.documentId,
    now: options.now,
  });

  return { aiIssues, creationDraft, application };
}

function getFirstChoice(draft: CharacterConceptDraft, categoryId: string): string | undefined {
  return draft.choices.find((choice) => choice.categoryId === categoryId)?.candidateId;
}

function getUnsupportedChoiceWarnings(draft: CharacterConceptDraft): AiValidationIssue[] {
  return draft.choices.flatMap((choice, index) => {
    if (APPLIED_5E_2024_CHOICE_CATEGORIES.has(choice.categoryId)) {
      return [];
    }

    return [
      {
        code: 'ai-draft-choice-not-applied',
        severity: 'warning' as const,
        path: `choices.${index}`,
        message: `Choice category ${choice.categoryId} is valid but not applied by the first D&D 5e 2024 draft adapter.`,
        recoverable: true,
      },
    ];
  });
}
