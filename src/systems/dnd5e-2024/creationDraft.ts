import type { Background } from '../../types/character-options/backgrounds';
import type { CharacterClass } from '../../types/character-options/classes';
import type { Species } from '../../types/character-options/species';
import type { CreationDraft, CreationDraftCompletion } from '../../types/core/creationDraft';
import type { CharacterDocument } from '../../types/core/document';
import type { ValidationIssue } from '../../registry/types';
import { applyDnd5eBackgroundTemplate } from '../../utils/backgroundTemplate';
import { applyDnd5eClassTemplate, applyDnd5eSubclassTemplate } from '../../utils/classTemplate';
import { finalizeCreationDraft, createCreationDraft } from '../../utils/creationDraftStorage';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadSpeciesForSystem,
} from '../../utils/dataLoader';
import { applyDnd5eSpeciesTemplate } from '../../utils/speciesTemplate';
import { createDefaultDnd5e2024Data, type Dnd5e2024DataModel } from './data-model';
import { Dnd5e2024SystemDef } from './definition';

export interface Dnd5e2024CreationDraftData extends Record<string, unknown> {
  characterName?: string;
  classId?: string;
  classLevel?: number;
  subclassId?: string;
  speciesId?: string;
  backgroundId?: string;
  abilityScores?: Partial<Record<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', number>>;
}

export interface BuildDnd5e2024DocumentFromDraftOptions {
  documentId: string;
  now?: Date;
}

export interface Dnd5e2024DraftApplicationResult {
  document: CharacterDocument<Dnd5e2024DataModel>;
  issues: ValidationIssue[];
  completion?: CreationDraftCompletion<Dnd5e2024CreationDraftData, Dnd5e2024DataModel>;
}

const DND5E_2024_CREATION_STEPS = [
  { id: 'concept', label: 'Concept' },
  { id: 'class', label: 'Class' },
  { id: 'species', label: 'Species' },
  { id: 'background', label: 'Background' },
  { id: 'abilities', label: 'Ability Scores' },
  { id: 'review', label: 'Review' },
];

export function createDnd5e2024CreationDraft(params: {
  id?: string;
  name?: string;
  data?: Dnd5e2024CreationDraftData;
  now?: Date;
}): CreationDraft<Dnd5e2024CreationDraftData> {
  return createCreationDraft({
    id: params.id,
    systemId: 'dnd-5e-2024',
    name: params.name,
    steps: DND5E_2024_CREATION_STEPS,
    data: params.data ?? {},
    now: params.now,
  }) as CreationDraft<Dnd5e2024CreationDraftData>;
}

export async function buildDnd5e2024DocumentFromDraft(
  draft: CreationDraft<Dnd5e2024CreationDraftData>,
  options: BuildDnd5e2024DocumentFromDraftOptions
): Promise<Dnd5e2024DraftApplicationResult> {
  if (draft.systemId !== 'dnd-5e-2024') {
    throw new Error(`D&D 5e 2024 creation requires system dnd-5e-2024, got ${draft.systemId}.`);
  }

  const now = options.now ?? new Date();
  const [classes, species, backgrounds] = await Promise.all([
    loadClassesForSystem('dnd-5e-2024'),
    loadSpeciesForSystem('dnd-5e-2024'),
    loadBackgroundsForSystem('dnd-5e-2024'),
  ]);
  const issues: ValidationIssue[] = [];
  let document = createDraftDocument(draft, options.documentId, now);

  applyAbilityScores(document, draft.data.abilityScores);
  document = applyClassDraftChoices(document, draft, classes, issues);
  document = applySpeciesDraftChoices(document, draft, species, issues);
  document = applyBackgroundDraftChoices(document, draft, backgrounds, issues);

  const validationResult = await Dnd5e2024SystemDef.validator?.validateDocument(document, {
    systemId: 'dnd-5e-2024',
    reason: 'creation',
    source: 'creation-draft',
  });
  issues.push(...(validationResult?.issues ?? []));

  const completion = hasBlockingIssues(issues)
    ? undefined
    : finalizeCreationDraft(draft, document, now);

  return { document, issues, completion };
}

function createDraftDocument(
  draft: CreationDraft<Dnd5e2024CreationDraftData>,
  documentId: string,
  now: Date
): CharacterDocument<Dnd5e2024DataModel> {
  return {
    id: documentId,
    name: draft.data.characterName?.trim() || draft.name || 'New Character',
    systemId: 'dnd-5e-2024',
    system: createDefaultDnd5e2024Data(),
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

function applyAbilityScores(
  document: CharacterDocument<Dnd5e2024DataModel>,
  abilityScores: Dnd5e2024CreationDraftData['abilityScores']
): void {
  if (!abilityScores) {
    return;
  }

  Object.entries(abilityScores).forEach(([abilityId, score]) => {
    if (typeof score === 'number' && Number.isFinite(score)) {
      document.system.baseAttributes[abilityId] = score;
    }
  });
}

function applyClassDraftChoices(
  document: CharacterDocument<Dnd5e2024DataModel>,
  draft: CreationDraft<Dnd5e2024CreationDraftData>,
  classes: CharacterClass[],
  issues: ValidationIssue[]
): CharacterDocument<Dnd5e2024DataModel> {
  if (!draft.data.classId) {
    return document;
  }

  const classData = classes.find((entry) => entry.id === draft.data.classId);
  if (!classData) {
    pushDraftIssue(issues, {
      code: 'creation-draft-unknown-class',
      path: 'data.classId',
      message: `Class '${draft.data.classId}' is not available for D&D 5e 2024 creation.`,
      details: { classId: draft.data.classId },
    });
    return document;
  }

  let nextDocument = applyDnd5eClassTemplate(document, classData, draft.data.classLevel ?? 1);

  if (draft.data.subclassId) {
    try {
      nextDocument = applyDnd5eSubclassTemplate(nextDocument, classData.id, draft.data.subclassId);
    } catch (error) {
      pushDraftIssue(issues, {
        code: 'creation-draft-invalid-subclass',
        path: 'data.subclassId',
        message:
          error instanceof Error
            ? error.message
            : `Subclass '${draft.data.subclassId}' cannot be applied.`,
        details: { classId: classData.id, subclassId: draft.data.subclassId },
      });
    }
  }

  return nextDocument;
}

function applySpeciesDraftChoices(
  document: CharacterDocument<Dnd5e2024DataModel>,
  draft: CreationDraft<Dnd5e2024CreationDraftData>,
  species: Species[],
  issues: ValidationIssue[]
): CharacterDocument<Dnd5e2024DataModel> {
  if (!draft.data.speciesId) {
    return document;
  }

  const speciesData = species.find((entry) => entry.id === draft.data.speciesId);
  if (!speciesData) {
    pushDraftIssue(issues, {
      code: 'creation-draft-unknown-species',
      path: 'data.speciesId',
      message: `Species '${draft.data.speciesId}' is not available for D&D 5e 2024 creation.`,
      details: { speciesId: draft.data.speciesId },
    });
    return document;
  }

  return applyDnd5eSpeciesTemplate(document, speciesData);
}

function applyBackgroundDraftChoices(
  document: CharacterDocument<Dnd5e2024DataModel>,
  draft: CreationDraft<Dnd5e2024CreationDraftData>,
  backgrounds: Background[],
  issues: ValidationIssue[]
): CharacterDocument<Dnd5e2024DataModel> {
  if (!draft.data.backgroundId) {
    return document;
  }

  const background = backgrounds.find((entry) => entry.id === draft.data.backgroundId);
  if (!background) {
    pushDraftIssue(issues, {
      code: 'creation-draft-unknown-background',
      path: 'data.backgroundId',
      message: `Background '${draft.data.backgroundId}' is not available for D&D 5e 2024 creation.`,
      details: { backgroundId: draft.data.backgroundId },
    });
    return document;
  }

  return applyDnd5eBackgroundTemplate(document, background);
}

function pushDraftIssue(
  issues: ValidationIssue[],
  issue: Omit<ValidationIssue, 'severity' | 'source' | 'recoverable'>
): void {
  issues.push({
    ...issue,
    severity: 'error',
    source: 'creation-draft',
    recoverable: true,
  });
}

function hasBlockingIssues(issues: ValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === 'error');
}
