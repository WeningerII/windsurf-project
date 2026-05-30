import type { ValidationIssue } from '../../registry/types';
import type { CharacterDocument, SystemDataModel } from './document';

export type CreationDraftStepStatus = 'pending' | 'active' | 'complete' | 'blocked';
export type CreationDraftStatus = 'draft' | 'ready' | 'completed';

export interface CreationDraftStepState {
  id: string;
  label: string;
  status: CreationDraftStepStatus;
  data?: Record<string, unknown>;
  issues?: ValidationIssue[];
}

export interface CreationDraft<
  TDraftData extends Record<string, unknown> = Record<string, unknown>,
> {
  id: string;
  systemId: string;
  name: string;
  status: CreationDraftStatus;
  currentStepId: string;
  steps: CreationDraftStepState[];
  data: TDraftData;
  validationIssues: ValidationIssue[];
  createdAt: Date;
  updatedAt: Date;
  finalDocumentId?: string;
  version: 1;
}

export interface CreationDraftCompletion<
  TDraftData extends Record<string, unknown> = Record<string, unknown>,
  TSystemData extends SystemDataModel = SystemDataModel,
> {
  draft: CreationDraft<TDraftData>;
  document: CharacterDocument<TSystemData>;
}
