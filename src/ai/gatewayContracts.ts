import type { GameSystemId } from '../types/game-systems';

export const AI_GATEWAY_SCHEMA_VERSION = 'ai-gateway-v1' as const;
export const AI_GATEWAY_ENDPOINT = '/.netlify/functions/ai-gateway' as const;
export const AI_GATEWAY_TASKS = ['character-concept-draft', 'character-draft-repair'] as const;

export type AiGatewaySchemaVersion = typeof AI_GATEWAY_SCHEMA_VERSION;
export type AiGatewayTask = (typeof AI_GATEWAY_TASKS)[number];

export type AiGatewayErrorCode =
  | 'invalid-request'
  | 'unsupported-task'
  | 'provider-not-configured'
  | 'provider-error'
  | 'timeout'
  | 'budget-exceeded'
  | 'fixture-unavailable'
  | 'unknown';

export type AiValidationSeverity = 'info' | 'warning' | 'error';

export interface AiCandidate {
  id: string;
  label: string;
  source?: string;
  summary?: string;
  tags?: string[];
  prerequisites?: string[];
}

export interface AiCandidateCategory {
  id: string;
  label: string;
  candidates: AiCandidate[];
}

export interface AiCandidatePool {
  systemId: GameSystemId;
  generatedAt?: string;
  categories: AiCandidateCategory[];
  constraints?: string[];
}

export interface AiValidationIssue {
  code: string;
  message: string;
  severity: AiValidationSeverity;
  path?: string;
  source?: string;
  recoverable?: boolean;
}

export interface CharacterConceptDraftPayload {
  systemId: GameSystemId;
  prompt: string;
  candidatePool: AiCandidatePool;
  currentDocumentSummary?: string;
  preferences?: string[];
  maxChoices?: number;
}

export interface CharacterDraftChoice {
  categoryId: string;
  candidateId: string;
  label?: string;
  rationale?: string;
  confidence?: number;
}

export interface CharacterConceptDraft {
  systemId: GameSystemId;
  conceptSummary: string;
  nameSuggestion?: string;
  choices: CharacterDraftChoice[];
  notes?: string[];
  manualBoundaries?: string[];
}

export interface CharacterDraftRepairPayload {
  originalDraft: CharacterConceptDraft;
  validationIssues: AiValidationIssue[];
  candidatePool: AiCandidatePool;
  prompt?: string;
}

export interface CharacterDraftRepairResult {
  draft: CharacterConceptDraft;
  repairedIssueCodes: string[];
  remainingIssues?: AiValidationIssue[];
  notes?: string[];
}

interface AiGatewayRequestBase<TTask extends AiGatewayTask, TPayload> {
  schemaVersion: AiGatewaySchemaVersion;
  task: TTask;
  payload: TPayload;
  requestId?: string;
  traceId?: string;
}

export type CharacterConceptDraftGatewayRequest = AiGatewayRequestBase<
  'character-concept-draft',
  CharacterConceptDraftPayload
>;

export type CharacterDraftRepairGatewayRequest = AiGatewayRequestBase<
  'character-draft-repair',
  CharacterDraftRepairPayload
>;

export type AiGatewayRequest =
  | CharacterConceptDraftGatewayRequest
  | CharacterDraftRepairGatewayRequest;

export type AiGatewayData = CharacterConceptDraft | CharacterDraftRepairResult;

export interface AiGatewayWarning {
  code: string;
  message: string;
}

export interface AiGatewayUsage {
  source: 'fixture' | 'provider' | 'none';
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
}

export interface AiGatewaySuccess<TData extends AiGatewayData = AiGatewayData> {
  ok: true;
  schemaVersion: AiGatewaySchemaVersion;
  task: AiGatewayTask;
  traceId: string;
  data: TData;
  warnings?: AiGatewayWarning[];
  usage?: AiGatewayUsage;
}

export interface AiGatewayFailure {
  ok: false;
  schemaVersion: AiGatewaySchemaVersion;
  task?: AiGatewayTask;
  traceId: string;
  error: {
    code: AiGatewayErrorCode;
    message: string;
    retryable: boolean;
    details?: Record<string, unknown>;
  };
}

export type AiGatewayResponse = AiGatewaySuccess | AiGatewayFailure;

export function isSupportedAiGatewayTask(task: string): task is AiGatewayTask {
  return AI_GATEWAY_TASKS.includes(task as AiGatewayTask);
}

export function isAiGatewayResponse(value: unknown): value is AiGatewayResponse {
  if (!isRecord(value)) {
    return false;
  }

  if (value.schemaVersion !== AI_GATEWAY_SCHEMA_VERSION || typeof value.ok !== 'boolean') {
    return false;
  }

  if (value.ok === true) {
    return (
      typeof value.traceId === 'string' &&
      typeof value.task === 'string' &&
      isSupportedAiGatewayTask(value.task) &&
      isRecord(value.data)
    );
  }

  return (
    typeof value.traceId === 'string' &&
    isRecord(value.error) &&
    typeof value.error.code === 'string' &&
    typeof value.error.message === 'string' &&
    typeof value.error.retryable === 'boolean' &&
    (value.task === undefined ||
      (typeof value.task === 'string' && isSupportedAiGatewayTask(value.task)))
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
