/**
 * AI gateway contracts — the typed request/response surface shared by the
 * browser client and the server gateway. Pure and dependency-free (no provider
 * SDKs, no secrets), so it is safe to import on either side.
 *
 * Design (see docs/rfc/002-ai-control-plane.md): the client sends only a task
 * id plus the data that task needs (loader-derived candidate ids, a prompt,
 * context); the gateway returns STRUCTURED data that the client then validates
 * with the deterministic rules validators before anything is applied. The model
 * never owns legality or state — it drafts; the rules decide.
 */

export const AI_GATEWAY_SCHEMA_VERSION = 'ai-gateway-v1' as const;
export const AI_GATEWAY_ENDPOINT = '/.netlify/functions/ai-gateway' as const;

/** Task allowlist. Grows one entry at a time as each task surface lands. */
export const AI_GATEWAY_TASKS = ['encounter-draft', 'scene-narration'] as const;
export type AiTask = (typeof AI_GATEWAY_TASKS)[number];

export function isAiTask(value: unknown): value is AiTask {
  return typeof value === 'string' && (AI_GATEWAY_TASKS as readonly string[]).includes(value);
}

/** Normalized failure reasons — every server/provider error collapses to one. */
export type AiFailureCode =
  | 'unsupported-task'
  | 'invalid-request'
  | 'provider-not-configured'
  | 'provider-error'
  | 'invalid-provider-output'
  | 'timeout'
  | 'over-budget';

/** Where a successful result came from (lets the UI label provider vs replay). */
export interface AiUsage {
  source: 'provider' | 'fixture';
  provider?: string;
  model?: string;
}

export interface AiRequest<TTask extends AiTask = AiTask, TPayload = unknown> {
  schemaVersion: typeof AI_GATEWAY_SCHEMA_VERSION;
  task: TTask;
  payload: TPayload;
}

export interface AiSuccess<TData = unknown> {
  ok: true;
  task: AiTask;
  data: TData;
  usage: AiUsage;
  /** Non-fatal notes (e.g. the draft was repaired, or a field was dropped). */
  warnings?: string[];
}

export interface AiFailure {
  ok: false;
  task?: AiTask;
  code: AiFailureCode;
  message: string;
}

export type AiResponse<TData = unknown> = AiSuccess<TData> | AiFailure;

export function aiFailure(code: AiFailureCode, message: string, task?: AiTask): AiFailure {
  return { ok: false, code, message, ...(task ? { task } : {}) };
}

export function isAiResponse(value: unknown): value is AiResponse {
  if (!value || typeof value !== 'object') return false;
  const v = value as { ok?: unknown };
  if (v.ok === true) {
    const s = value as Partial<AiSuccess>;
    return isAiTask(s.task) && 'data' in s && typeof s.usage === 'object' && s.usage !== null;
  }
  if (v.ok === false) {
    const f = value as Partial<AiFailure>;
    return typeof f.code === 'string' && typeof f.message === 'string';
  }
  return false;
}

// --- Task: encounter-draft -------------------------------------------------

/** A loader-derived creature the model may choose from (it picks ids, never invents). */
export interface EncounterDraftCandidate {
  id: string;
  name: string;
  challengeRating?: number;
}

export interface EncounterDraftPayload {
  systemId: string;
  /** Party member levels, for the model to gauge scale. */
  partyLevels: number[];
  /** Difficulty label (matches the deterministic drafter's vocabulary). */
  difficulty: string;
  /** Free-text description of the desired fight. */
  prompt: string;
  /** The allowed creatures (ids + names). The model must choose from these. */
  candidates: EncounterDraftCandidate[];
  /** Structured validation issues from a prior attempt, for a bounded repair. */
  repairIssues?: string[];
}

export interface EncounterDraftSelection {
  monsterId: string;
  count: number;
}

export interface EncounterDraftData {
  selections: EncounterDraftSelection[];
  /** One-line in-character justification, optional. */
  rationale?: string;
}

export type EncounterDraftRequest = AiRequest<'encounter-draft', EncounterDraftPayload>;

/** Parse result for the strict request/output validators below. */
export type AiParse<T> = { ok: true; value: T } | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Validate a raw gateway request envelope and its per-task payload. */
export function parseAiRequest(raw: unknown): AiParse<AiRequest> {
  if (!isRecord(raw)) return { ok: false, message: 'Request must be an object.' };
  if (raw.schemaVersion !== AI_GATEWAY_SCHEMA_VERSION) {
    return { ok: false, message: `Unsupported schema version.` };
  }
  if (!isAiTask(raw.task)) {
    return { ok: false, message: `Unsupported task '${String(raw.task)}'.` };
  }
  const payloadResult = parseTaskPayload(raw.task, raw.payload);
  if (!payloadResult.ok) return payloadResult;
  return {
    ok: true,
    value: {
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: raw.task,
      payload: payloadResult.value,
    },
  };
}

function parseTaskPayload(task: AiTask, payload: unknown): AiParse<unknown> {
  switch (task) {
    case 'encounter-draft':
      return parseEncounterDraftPayload(payload);
    case 'scene-narration':
      return parseSceneNarrationPayload(payload);
    default:
      return { ok: false, message: `No validator for task '${task}'.` };
  }
}

function parseEncounterDraftPayload(raw: unknown): AiParse<EncounterDraftPayload> {
  if (!isRecord(raw)) return { ok: false, message: 'Encounter-draft payload must be an object.' };
  if (typeof raw.systemId !== 'string' || !raw.systemId) {
    return { ok: false, message: 'Encounter-draft payload needs a systemId.' };
  }
  if (typeof raw.prompt !== 'string') {
    return { ok: false, message: 'Encounter-draft payload needs a prompt.' };
  }
  if (typeof raw.difficulty !== 'string') {
    return { ok: false, message: 'Encounter-draft payload needs a difficulty.' };
  }
  if (!Array.isArray(raw.partyLevels) || !raw.partyLevels.every((n) => Number.isFinite(n))) {
    return { ok: false, message: 'Encounter-draft payload needs numeric partyLevels.' };
  }
  if (!Array.isArray(raw.candidates) || raw.candidates.length === 0) {
    return { ok: false, message: 'Encounter-draft payload needs a non-empty candidate list.' };
  }
  const candidates: EncounterDraftCandidate[] = [];
  for (const candidate of raw.candidates) {
    if (
      !isRecord(candidate) ||
      typeof candidate.id !== 'string' ||
      typeof candidate.name !== 'string'
    ) {
      return { ok: false, message: 'Each candidate needs a string id and name.' };
    }
    candidates.push({
      id: candidate.id,
      name: candidate.name,
      ...(typeof candidate.challengeRating === 'number'
        ? { challengeRating: candidate.challengeRating }
        : {}),
    });
  }
  return {
    ok: true,
    value: {
      systemId: raw.systemId,
      prompt: raw.prompt,
      difficulty: raw.difficulty,
      partyLevels: raw.partyLevels as number[],
      candidates,
      ...(Array.isArray(raw.repairIssues)
        ? { repairIssues: raw.repairIssues.filter((s): s is string => typeof s === 'string') }
        : {}),
    },
  };
}

/** Validate structured model output for a task into the typed data shape. */
export function parseTaskData(task: AiTask, raw: unknown): AiParse<unknown> {
  switch (task) {
    case 'encounter-draft':
      return parseEncounterDraftData(raw);
    case 'scene-narration':
      return parseSceneNarrationData(raw);
    default:
      return { ok: false, message: `No output validator for task '${task}'.` };
  }
}

function parseEncounterDraftData(raw: unknown): AiParse<EncounterDraftData> {
  if (!isRecord(raw)) return { ok: false, message: 'Output must be an object.' };
  if (!Array.isArray(raw.selections)) {
    return { ok: false, message: 'Output needs a selections array.' };
  }
  const selections: EncounterDraftSelection[] = [];
  for (const selection of raw.selections) {
    if (
      !isRecord(selection) ||
      typeof selection.monsterId !== 'string' ||
      !Number.isInteger(selection.count) ||
      (selection.count as number) <= 0
    ) {
      return {
        ok: false,
        message: 'Each selection needs a monsterId and a positive integer count.',
      };
    }
    selections.push({ monsterId: selection.monsterId, count: selection.count as number });
  }
  return {
    ok: true,
    value: {
      selections,
      ...(typeof raw.rationale === 'string' ? { rationale: raw.rationale } : {}),
    },
  };
}

// --- Task: scene-narration -------------------------------------------------

export interface SceneNarrationPayload {
  /**
   * The deterministic scene recap — the ONLY source material for the prose.
   * The model restyles these facts; it must not introduce events of its own.
   */
  facts: string;
  /** Optional style hint (e.g. 'cinematic', 'gritty', 'lighthearted'). */
  tone?: string;
}

export interface SceneNarrationData {
  /** A prose retelling of the facts, for the GM to review and edit before use. */
  narrative: string;
}

export type SceneNarrationRequest = AiRequest<'scene-narration', SceneNarrationPayload>;

function parseSceneNarrationPayload(raw: unknown): AiParse<SceneNarrationPayload> {
  if (!isRecord(raw)) return { ok: false, message: 'Scene-narration payload must be an object.' };
  if (typeof raw.facts !== 'string' || !raw.facts.trim()) {
    return { ok: false, message: 'Scene-narration payload needs non-empty facts.' };
  }
  return {
    ok: true,
    value: {
      facts: raw.facts,
      ...(typeof raw.tone === 'string' && raw.tone ? { tone: raw.tone } : {}),
    },
  };
}

function parseSceneNarrationData(raw: unknown): AiParse<SceneNarrationData> {
  if (!isRecord(raw)) return { ok: false, message: 'Output must be an object.' };
  if (typeof raw.narrative !== 'string' || !raw.narrative.trim()) {
    return { ok: false, message: 'Narration output needs a non-empty narrative string.' };
  }
  return { ok: true, value: { narrative: raw.narrative } };
}
