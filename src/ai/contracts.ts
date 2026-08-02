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
export const AI_GATEWAY_TASKS = [
  'encounter-draft',
  'scene-narration',
  'identify-creature',
  'illustrate-scene',
  'character-draft',
  'analyze-map',
  'narration-critique',
  'dm-turn-intent',
] as const;
export type AiTask = (typeof AI_GATEWAY_TASKS)[number];

export function isAiTask(value: unknown): value is AiTask {
  return typeof value === 'string' && (AI_GATEWAY_TASKS as readonly string[]).includes(value);
}

/** Normalized failure reasons — every server/provider error collapses to one. */
export type AiFailureCode =
  | 'unsupported-task'
  | 'invalid-request'
  | 'unauthorized'
  | 'provider-not-configured'
  | 'provider-error'
  | 'invalid-provider-output'
  | 'timeout'
  | 'over-budget'
  | 'budget-exceeded';

/**
 * Coarse task classes for latency budgets (Phase 14): text generation, image
 * understanding (vision), and image generation have very different latency
 * profiles, so budgets are configured per class rather than per task.
 */
export type AiTaskClass = 'text' | 'vision' | 'image';

/** Which latency/cost class each task belongs to. Grows with the allowlist. */
export const AI_TASK_CLASS: Record<AiTask, AiTaskClass> = {
  'encounter-draft': 'text',
  'scene-narration': 'text',
  'identify-creature': 'vision',
  'illustrate-scene': 'image',
  'character-draft': 'text',
  'analyze-map': 'vision',
  'narration-critique': 'text',
  'dm-turn-intent': 'text',
};

/**
 * Deterministic per-request cost, in abstract budget units, charged against a
 * session's cap BEFORE the provider call (Phase 14 cost controls). Weights
 * reflect relative provider cost (image generation >> vision >> text) without
 * depending on post-hoc token counts, so caps trip deterministically and are
 * fixture-testable. Tune here, not at call sites.
 */
export const AI_TASK_UNIT_COST: Record<AiTask, number> = {
  'encounter-draft': 1,
  'scene-narration': 1,
  'identify-creature': 2,
  'illustrate-scene': 5,
  'character-draft': 1,
  // Vision, like identify-creature — but over a whole battle map rather than a
  // single creature, so the image is larger and the output structured.
  'analyze-map': 2,
  // A second text pass over one already-generated narration. Same class and
  // cost as the narration it reviews, so opting into the ADVISORY model review
  // doubles a session's narration spend rather than hiding a cost.
  'narration-critique': 1,
  // One text call per AI-DM actor turn (RFC 007). Deliberately the same weight
  // as any other text task: the AI-DM's cost control is the per-invocation
  // proposal cap in `DmPolicy`, not a discounted unit price.
  'dm-turn-intent': 1,
};

/**
 * Token counts a provider reported for one call. Every field is optional: a
 * provider may report none, some, or all of them, and the gateway never depends
 * on any of them — the deterministic per-task {@link AI_TASK_UNIT_COST} is what
 * the budget caps actually charge. This is observability, not accounting.
 */
export interface AiTokenUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

/** Where a successful result came from (lets the UI label provider vs replay). */
export interface AiUsage {
  source: 'provider' | 'fixture';
  provider?: string;
  model?: string;
  /** The prompt-template version used for the task (see `AI_PROMPT_VERSIONS`). */
  promptVersion?: string;
  /**
   * Provider-reported token counts, present only when the serving adapter
   * reported at least one usable figure. Absent on the fixture/replay path,
   * which spends no provider tokens.
   */
  tokens?: AiTokenUsage;
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
  /** Correlates this response with the gateway's structured log record. */
  traceId?: string;
  /** Non-fatal notes (e.g. the draft was repaired, or a field was dropped). */
  warnings?: string[];
}

export interface AiFailure {
  ok: false;
  task?: AiTask;
  code: AiFailureCode;
  message: string;
  /** Correlates this failure with the gateway's structured log record. */
  traceId?: string;
}

export type AiResponse<TData = unknown> = AiSuccess<TData> | AiFailure;

/**
 * A gateway call narrowed to a single task — the injectable seam every client
 * flow accepts so it can be unit-tested without a network. The browser's
 * `callAiGateway` satisfies it for any task.
 */
export type TaskGatewayCall<TTask extends AiTask> = <TData>(
  task: TTask,
  payload: unknown
) => Promise<AiResponse<TData>>;

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

/**
 * Validate a loader-derived candidate list (shared by the encounter-draft and
 * identify-creature payloads). The model picks ids from this pool, so each entry
 * needs at least an id and name; challengeRating is carried through when present.
 */
function parseCandidateList(raw: unknown): AiParse<EncounterDraftCandidate[]> {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: false, message: 'A non-empty candidate list is required.' };
  }
  const candidates: EncounterDraftCandidate[] = [];
  for (const candidate of raw) {
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
  return { ok: true, value: candidates };
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
    case 'identify-creature':
      return parseIdentifyCreaturePayload(payload);
    case 'illustrate-scene':
      return parseIllustrateScenePayload(payload);
    case 'character-draft':
      return parseCharacterDraftPayload(payload);
    case 'analyze-map':
      return parseAnalyzeMapPayload(payload);
    case 'narration-critique':
      return parseNarrationCritiquePayload(payload);
    case 'dm-turn-intent':
      return parseDmTurnIntentPayload(payload);
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
  const candidates = parseCandidateList(raw.candidates);
  if (!candidates.ok) return candidates;
  return {
    ok: true,
    value: {
      systemId: raw.systemId,
      prompt: raw.prompt,
      difficulty: raw.difficulty,
      partyLevels: raw.partyLevels as number[],
      candidates: candidates.value,
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
    case 'identify-creature':
      return parseIdentifyCreatureData(raw);
    case 'illustrate-scene':
      return parseGeneratedImageData(raw);
    case 'character-draft':
      return parseCharacterDraftData(raw);
    case 'analyze-map':
      return parseAnalyzeMapData(raw);
    case 'narration-critique':
      return parseNarrationCritiqueData(raw);
    case 'dm-turn-intent':
      return parseDmTurnIntentData(raw);
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

// --- Task: character-draft --------------------------------------------------

/** One loader-derived option the model may pick (it returns ids, never invents). */
export interface CharacterDraftCandidate {
  id: string;
  name: string;
}

/**
 * Loader-derived candidate pools for a target system (RFC 002 candidate pools).
 * Each pool is the set of LEGAL ids for that option category, built from the SAME
 * loaders the system's validator checks against, so the model picks real ids and
 * the flow rejects any invention before the deterministic validator ever runs.
 * Categories a system does not use are empty (e.g. mam3e has no classes;
 * daggerheart has no feats), which is a valid, expected shape.
 */
export interface CharacterDraftCandidatePools {
  classes: CharacterDraftCandidate[];
  ancestries: CharacterDraftCandidate[];
  backgrounds: CharacterDraftCandidate[];
  feats: CharacterDraftCandidate[];
  spells: CharacterDraftCandidate[];
}

/** The option categories a draft can reference, in a stable order for messages. */
export const CHARACTER_DRAFT_POOL_KEYS = [
  'classes',
  'ancestries',
  'backgrounds',
  'feats',
  'spells',
] as const satisfies ReadonlyArray<keyof CharacterDraftCandidatePools>;

export interface CharacterDraftPayload {
  systemId: string;
  /** Free-text description of the desired character. */
  prompt: string;
  /** The allowed options, by category. The model must choose ids from these. */
  pools: CharacterDraftCandidatePools;
  /** Structured validation issues from a prior attempt, for a bounded repair. */
  repairIssues?: string[];
}

/**
 * The model's structured character draft: a name plus option ids CHOSEN FROM the
 * pools. Every id is optional because systems use different subsets; the flow
 * validates each supplied id against its pool, then hands the draft to the
 * client's existing template/creation path — the model never decides RAW
 * legality, the deterministic validators do.
 */
export interface CharacterDraftData {
  name: string;
  classId?: string;
  ancestryId?: string;
  backgroundId?: string;
  featIds?: string[];
  spellIds?: string[];
  /** One-line in-character concept summary, optional. */
  rationale?: string;
}

export type CharacterDraftRequest = AiRequest<'character-draft', CharacterDraftPayload>;

/** Parse a candidate pool (may be empty); each entry needs a string id and name. */
function parseCandidatePool(raw: unknown, label: string): AiParse<CharacterDraftCandidate[]> {
  if (!Array.isArray(raw)) {
    return { ok: false, message: `The ${label} pool must be an array.` };
  }
  const pool: CharacterDraftCandidate[] = [];
  for (const entry of raw) {
    if (!isRecord(entry) || typeof entry.id !== 'string' || typeof entry.name !== 'string') {
      return { ok: false, message: `Each ${label} option needs a string id and name.` };
    }
    pool.push({ id: entry.id, name: entry.name });
  }
  return { ok: true, value: pool };
}

function parseCharacterDraftPools(raw: unknown): AiParse<CharacterDraftCandidatePools> {
  if (!isRecord(raw))
    return { ok: false, message: 'Character-draft payload needs candidate pools.' };
  const pools = {} as CharacterDraftCandidatePools;
  for (const key of CHARACTER_DRAFT_POOL_KEYS) {
    const parsed = parseCandidatePool(raw[key], key);
    if (!parsed.ok) return parsed;
    pools[key] = parsed.value;
  }
  return { ok: true, value: pools };
}

function parseCharacterDraftPayload(raw: unknown): AiParse<CharacterDraftPayload> {
  if (!isRecord(raw)) return { ok: false, message: 'Character-draft payload must be an object.' };
  if (typeof raw.systemId !== 'string' || !raw.systemId) {
    return { ok: false, message: 'Character-draft payload needs a systemId.' };
  }
  if (typeof raw.prompt !== 'string') {
    return { ok: false, message: 'Character-draft payload needs a prompt.' };
  }
  const pools = parseCharacterDraftPools(raw.pools);
  if (!pools.ok) return pools;
  return {
    ok: true,
    value: {
      systemId: raw.systemId,
      prompt: raw.prompt,
      pools: pools.value,
      ...(Array.isArray(raw.repairIssues)
        ? { repairIssues: raw.repairIssues.filter((s): s is string => typeof s === 'string') }
        : {}),
    },
  };
}

/** Validate a supplied optional id field (string when present), else omit it. */
function optionalId(raw: unknown): string | undefined {
  return typeof raw === 'string' && raw ? raw : undefined;
}

/** Validate a supplied optional id-list field (array of non-empty strings). */
function parseIdList(raw: unknown): AiParse<string[] | undefined> {
  if (raw === undefined) return { ok: true, value: undefined };
  if (!Array.isArray(raw) || !raw.every((id) => typeof id === 'string' && id)) {
    return { ok: false, message: 'Character draft id lists must be arrays of non-empty strings.' };
  }
  return { ok: true, value: raw as string[] };
}

function parseCharacterDraftData(raw: unknown): AiParse<CharacterDraftData> {
  if (!isRecord(raw)) return { ok: false, message: 'Output must be an object.' };
  if (typeof raw.name !== 'string' || !raw.name.trim()) {
    return { ok: false, message: 'Character draft needs a non-empty name.' };
  }
  const featIds = parseIdList(raw.featIds);
  if (!featIds.ok) return featIds;
  const spellIds = parseIdList(raw.spellIds);
  if (!spellIds.ok) return spellIds;
  const classId = optionalId(raw.classId);
  const ancestryId = optionalId(raw.ancestryId);
  const backgroundId = optionalId(raw.backgroundId);
  return {
    ok: true,
    value: {
      name: raw.name,
      ...(classId ? { classId } : {}),
      ...(ancestryId ? { ancestryId } : {}),
      ...(backgroundId ? { backgroundId } : {}),
      ...(featIds.value ? { featIds: featIds.value } : {}),
      ...(spellIds.value ? { spellIds: spellIds.value } : {}),
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

// --- Task: narration-critique ----------------------------------------------

/**
 * Upper bound on concerns one critique may carry. A narration is one or two
 * paragraphs; a dozen flagged spans is already more than a GM will read, and
 * the cap keeps one runaway response from producing a list the caller must walk
 * unboundedly.
 */
export const MAX_NARRATION_CRITIQUE_FINDINGS = 12;

export interface NarrationCritiquePayload {
  /** The generated narration under review. */
  narrative: string;
  /** The deterministic recap it was supposed to restate, and nothing else. */
  facts: string;
}

/**
 * One model-raised concern. `quote` is REQUIRED and is the reason this task can
 * exist at all: the flow checks that the span appears verbatim in the narration
 * and discards any finding that does not, so the second model pass cannot
 * invent the evidence for its own objection. Every surviving finding is still
 * ADVISORY — `src/ai/narrationCritic.ts` owns the verdict.
 */
export interface NarrationCritiqueFinding {
  /** A verbatim span of the narration this concern is about. */
  quote: string;
  /** What the model thinks the facts do not support about it. */
  concern: string;
}

export interface NarrationCritiqueData {
  findings: NarrationCritiqueFinding[];
}

export type NarrationCritiqueRequest = AiRequest<'narration-critique', NarrationCritiquePayload>;

function parseNarrationCritiquePayload(raw: unknown): AiParse<NarrationCritiquePayload> {
  if (!isRecord(raw))
    return { ok: false, message: 'Narration-critique payload must be an object.' };
  if (typeof raw.narrative !== 'string' || !raw.narrative.trim()) {
    return { ok: false, message: 'Narration-critique payload needs a non-empty narrative.' };
  }
  if (typeof raw.facts !== 'string' || !raw.facts.trim()) {
    return { ok: false, message: 'Narration-critique payload needs non-empty facts.' };
  }
  return { ok: true, value: { narrative: raw.narrative, facts: raw.facts } };
}

function parseNarrationCritiqueData(raw: unknown): AiParse<NarrationCritiqueData> {
  if (!isRecord(raw)) return { ok: false, message: 'Output must be an object.' };
  if (!Array.isArray(raw.findings)) {
    return { ok: false, message: 'Narration-critique output needs a findings array.' };
  }
  if (raw.findings.length > MAX_NARRATION_CRITIQUE_FINDINGS) {
    return { ok: false, message: 'Narration-critique output raises too many findings.' };
  }
  const findings: NarrationCritiqueFinding[] = [];
  for (const finding of raw.findings) {
    if (
      !isRecord(finding) ||
      typeof finding.quote !== 'string' ||
      !finding.quote.trim() ||
      typeof finding.concern !== 'string' ||
      !finding.concern.trim()
    ) {
      return { ok: false, message: 'Each finding needs a non-empty quote and concern.' };
    }
    findings.push({ quote: finding.quote, concern: finding.concern });
  }
  return { ok: true, value: { findings } };
}

// --- Shared: image input (multimodal tasks) --------------------------------

/**
 * Largest base64 data URL we accept. Sized so an image plus its request
 * envelope stays under the gateway's body cap (see MAX_GATEWAY_REQUEST_BYTES),
 * which itself sits below the host's ~6 MiB synchronous-function payload limit.
 */
export const MAX_AI_IMAGE_DATA_URL_LENGTH = 5_500_000;

/** A user-supplied image, carried as a base64 `data:` URL (no provider SDK type). */
export interface AiImageInput {
  /** A `data:image/...;base64,...` URL. */
  dataUrl: string;
  /** IANA media type, e.g. `image/png` (must be an image type). */
  mediaType: string;
}

function parseAiImageInput(raw: unknown): AiParse<AiImageInput> {
  if (!isRecord(raw)) return { ok: false, message: 'Image must be an object.' };
  if (typeof raw.dataUrl !== 'string' || !/^data:image\/[\w.+-]+;base64,/i.test(raw.dataUrl)) {
    return { ok: false, message: 'Image must be a base64 data: URL with an image media type.' };
  }
  if (raw.dataUrl.length > MAX_AI_IMAGE_DATA_URL_LENGTH) {
    return { ok: false, message: 'Image is too large; use a smaller picture.' };
  }
  if (typeof raw.mediaType !== 'string' || !/^image\//i.test(raw.mediaType)) {
    return { ok: false, message: 'Image needs an image/* media type.' };
  }
  return { ok: true, value: { dataUrl: raw.dataUrl, mediaType: raw.mediaType } };
}

// --- Task: identify-creature (vision) --------------------------------------

export interface IdentifyCreaturePayload {
  systemId: string;
  /** The catalog the model must choose from (it returns an id, never invents). */
  candidates: EncounterDraftCandidate[];
  /** The image to identify. */
  image: AiImageInput;
  /** Optional free-text disambiguation hint (e.g. "the larger one"). */
  hint?: string;
}

export interface IdentifyCreatureData {
  /** The chosen catalog id (validated against the candidate pool by the flow). */
  monsterId: string;
  /** Model self-reported confidence, clamped to 0..1. */
  confidence: number;
  /** One-line justification, optional. */
  reason?: string;
}

export type IdentifyCreatureRequest = AiRequest<'identify-creature', IdentifyCreaturePayload>;

function parseIdentifyCreaturePayload(raw: unknown): AiParse<IdentifyCreaturePayload> {
  if (!isRecord(raw)) return { ok: false, message: 'Identify-creature payload must be an object.' };
  if (typeof raw.systemId !== 'string' || !raw.systemId) {
    return { ok: false, message: 'Identify-creature payload needs a systemId.' };
  }
  const candidates = parseCandidateList(raw.candidates);
  if (!candidates.ok) return candidates;
  const image = parseAiImageInput(raw.image);
  if (!image.ok) return image;
  return {
    ok: true,
    value: {
      systemId: raw.systemId,
      candidates: candidates.value,
      image: image.value,
      ...(typeof raw.hint === 'string' && raw.hint ? { hint: raw.hint } : {}),
    },
  };
}

function parseIdentifyCreatureData(raw: unknown): AiParse<IdentifyCreatureData> {
  if (!isRecord(raw)) return { ok: false, message: 'Output must be an object.' };
  if (typeof raw.monsterId !== 'string' || !raw.monsterId) {
    return { ok: false, message: 'Identify output needs a monsterId.' };
  }
  const confidenceRaw = typeof raw.confidence === 'number' ? raw.confidence : 0;
  const confidence = Number.isFinite(confidenceRaw) ? Math.min(1, Math.max(0, confidenceRaw)) : 0;
  return {
    ok: true,
    value: {
      monsterId: raw.monsterId,
      confidence,
      ...(typeof raw.reason === 'string' && raw.reason ? { reason: raw.reason } : {}),
    },
  };
}

// --- Task: illustrate-scene (image generation) -----------------------------

/** Largest free-text prompt accepted for an image (keeps requests bounded). */
export const MAX_ILLUSTRATION_PROMPT_LENGTH = 1_000;

export interface IllustrateScenePayload {
  /** Free-text description of the desired illustration. */
  prompt: string;
  /** Optional art-style hint (e.g. 'painterly', 'ink', 'photoreal'). */
  style?: string;
}

/**
 * A generated image, carried as a base64 data URL. Structurally identical to an
 * {@link AiImageInput} (same envelope, opposite direction) and validated by the
 * same checks — unlike the text tasks, the deterministic layer here can only
 * vouch for the envelope (a real, bounded image); a human judges the content.
 */
export type GeneratedImageData = AiImageInput;

export type IllustrateSceneRequest = AiRequest<'illustrate-scene', IllustrateScenePayload>;

function parseIllustrateScenePayload(raw: unknown): AiParse<IllustrateScenePayload> {
  if (!isRecord(raw)) return { ok: false, message: 'Illustrate-scene payload must be an object.' };
  if (typeof raw.prompt !== 'string' || !raw.prompt.trim()) {
    return { ok: false, message: 'Illustrate-scene payload needs a non-empty prompt.' };
  }
  if (raw.prompt.length > MAX_ILLUSTRATION_PROMPT_LENGTH) {
    return { ok: false, message: 'Illustration prompt is too long.' };
  }
  return {
    ok: true,
    value: {
      prompt: raw.prompt,
      ...(typeof raw.style === 'string' && raw.style ? { style: raw.style } : {}),
    },
  };
}

/** The model's image output uses the same envelope (and validation) as input. */
function parseGeneratedImageData(raw: unknown): AiParse<GeneratedImageData> {
  return parseAiImageInput(raw);
}

// --- Task: analyze-map (vision) --------------------------------------------

/**
 * Upper bound on boxes a single proposal may carry. A battle map has tens of
 * regions, not thousands; the cap keeps one malformed response from producing a
 * proposal the validator must walk unboundedly.
 */
export const MAX_ANALYZE_MAP_BOXES = 64;

export interface AnalyzeMapPayload {
  /** The battle-map image to analyze. */
  image: AiImageInput;
  /**
   * The image's true pixel dimensions, MEASURED BY THE CLIENT from the decoded
   * asset. Sent so the model can reason in the same coordinate space, but the
   * flow re-stamps them onto the proposal rather than trusting the echo — a
   * model that misreports the image size cannot make an off-image box look
   * in-bounds.
   */
  imageSize: { widthPx: number; heightPx: number };
  /** Optional free-text steer (e.g. "the stairs are difficult terrain"). */
  hint?: string;
}

/**
 * What the model returns. Deliberately NARROWER than `GridGeometryProposal`
 * (`src/scene/gridGeometryProposal.ts`): the envelope `version` and the `image`
 * dimensions are NOT model-supplied — the flow stamps both. The model proposes
 * only the geometry it can actually see, and `validateGridGeometryProposal`
 * decides whether any of it may become scene state.
 */
export interface AnalyzeMapData {
  registration: { offsetX: number; offsetY: number; cellSizePx: number };
  boxes: Array<{
    kind: string;
    rect: { x: number; y: number; width: number; height: number };
    label?: string;
    suggestedPreset?: string;
  }>;
  /** One-line account of how the grid was located, optional. */
  reason?: string;
}

export type AnalyzeMapRequest = AiRequest<'analyze-map', AnalyzeMapPayload>;

function parseAnalyzeMapPayload(raw: unknown): AiParse<AnalyzeMapPayload> {
  if (!isRecord(raw)) return { ok: false, message: 'Analyze-map payload must be an object.' };
  const image = parseAiImageInput(raw.image);
  if (!image.ok) return image;
  if (!isRecord(raw.imageSize)) {
    return { ok: false, message: 'Analyze-map payload needs an imageSize.' };
  }
  const { widthPx, heightPx } = raw.imageSize;
  if (!isPositiveInt(widthPx) || !isPositiveInt(heightPx)) {
    return { ok: false, message: 'Analyze-map imageSize needs positive integer pixel dimensions.' };
  }
  return {
    ok: true,
    value: {
      image: image.value,
      imageSize: { widthPx, heightPx },
      ...(typeof raw.hint === 'string' && raw.hint ? { hint: raw.hint } : {}),
    },
  };
}

function isPositiveInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function isFiniteNum(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Envelope-only validation. Every field is checked for SHAPE, never for
 * plausibility — whether a registration is usable, a preset legal, or a box on
 * the grid is `validateGridGeometryProposal`'s job, and duplicating any of it
 * here would create a second, quieter opinion about legality.
 */
function parseAnalyzeMapData(raw: unknown): AiParse<AnalyzeMapData> {
  if (!isRecord(raw)) return { ok: false, message: 'Output must be an object.' };
  if (!isRecord(raw.registration)) {
    return { ok: false, message: 'Analyze-map output needs a registration.' };
  }
  const { offsetX, offsetY, cellSizePx } = raw.registration;
  if (!isFiniteNum(offsetX) || !isFiniteNum(offsetY) || !isFiniteNum(cellSizePx)) {
    return { ok: false, message: 'Registration needs finite offsetX, offsetY and cellSizePx.' };
  }
  if (!Array.isArray(raw.boxes)) {
    return { ok: false, message: 'Analyze-map output needs a boxes array.' };
  }
  if (raw.boxes.length > MAX_ANALYZE_MAP_BOXES) {
    return { ok: false, message: 'Analyze-map output proposes too many boxes.' };
  }
  const boxes: AnalyzeMapData['boxes'] = [];
  for (const box of raw.boxes) {
    if (!isRecord(box) || typeof box.kind !== 'string' || !isRecord(box.rect)) {
      return { ok: false, message: 'Each box needs a kind and a rect.' };
    }
    const { x, y, width, height } = box.rect;
    if (!isFiniteNum(x) || !isFiniteNum(y) || !isFiniteNum(width) || !isFiniteNum(height)) {
      return { ok: false, message: 'Each box rect needs finite x, y, width and height.' };
    }
    boxes.push({
      kind: box.kind,
      rect: { x, y, width, height },
      ...(typeof box.label === 'string' && box.label ? { label: box.label } : {}),
      ...(typeof box.suggestedPreset === 'string' && box.suggestedPreset
        ? { suggestedPreset: box.suggestedPreset }
        : {}),
    });
  }
  return {
    ok: true,
    value: {
      registration: { offsetX, offsetY, cellSizePx },
      boxes,
      ...(typeof raw.reason === 'string' && raw.reason ? { reason: raw.reason } : {}),
    },
  };
}

// --- Task: dm-turn-intent (RFC 007 AI-DM runtime) ---------------------------

/**
 * The CLOSED verb vocabulary an AI-DM turn proposal may draw on. It exists so
 * the model can never name a `SceneActionIntent` type: it picks an OPTION id
 * from a pool the caller built, and `src/ai/dmTurn.ts` maps that option's verb
 * to the one intent shape it is allowed to become. Adding a verb here is a
 * deliberate widening of what the AI-DM may ask for, and requires a new mapping
 * case plus the deterministic gate that bounds it.
 *
 * Every verb below reaches the event log through `resolveSceneAction`, and none
 * of them carries model-computed arithmetic:
 *   - `move`  — reposition the acting token. The model chooses a destination
 *               cell; the option carries the caller's Chebyshev reach, and the
 *               scene runtime still owns bounds and footprint overlap.
 *   - `check` — roll the check the OPTION describes. Label, modifier and DC come
 *               from the option (system-derived), never from the response, and
 *               the d20 is rolled inside `resolveSceneAction` from the event id.
 *   - `hold`  — do nothing and pass the turn.
 */
export const DM_TURN_VERBS = ['move', 'check', 'hold'] as const;
export type DmTurnVerb = (typeof DM_TURN_VERBS)[number];

export function isDmTurnVerb(value: unknown): value is DmTurnVerb {
  return typeof value === 'string' && (DM_TURN_VERBS as readonly string[]).includes(value);
}

/**
 * Upper bound on the options one turn may offer and the proposals one response
 * may carry. A single actor's turn has a handful of choices, not hundreds; the
 * caps keep a malformed request or response from producing a list the validator
 * must walk unboundedly. The per-invocation autonomy cap is separate and lives
 * in `DmPolicy.maxProposalsPerTurn`.
 */
export const MAX_DM_TURN_OPTIONS = 32;
export const MAX_DM_TURN_PROPOSALS = 8;

/**
 * A token's combat side, inlined rather than imported from
 * `src/types/core/scene.ts` so this module stays dependency-free for the server
 * gateway. Structurally identical to `SceneAllegiance`; the flow narrows the
 * real type onto it.
 */
export type DmTurnAllegiance = 'party' | 'hostile' | 'neutral';

/** A token as the model sees it: identity, side and where it stands. */
export interface DmTurnTokenRef {
  id: string;
  name: string;
  allegiance: DmTurnAllegiance;
  position: { x: number; y: number };
}

/**
 * The deterministic parameters of a `check` option. These ride the REQUEST, not
 * the response: the system engine (or the caller) decides what a check is worth,
 * and the model only decides whether to take it.
 */
export interface DmTurnCheckParams {
  label: string;
  modifier: number;
  dc?: number;
}

/** One action the model is permitted to choose this turn, by id. */
export interface DmTurnActionOption {
  /** Stable id the model echoes back. Never parsed for meaning. */
  id: string;
  verb: DmTurnVerb;
  /** Human-readable description for the prompt. */
  label: string;
  /** `move` only: furthest Chebyshev distance this option may travel (>= 1). */
  maxDistance?: number;
  /** `check` only: the roll this option performs. */
  check?: DmTurnCheckParams;
}

export interface DmTurnIntentPayload {
  systemId: string;
  /** The deterministic scene recap — the only situational facts on offer. */
  facts: string;
  /** Current round number, for pacing context. */
  round: number;
  /** The token whose turn it is. Its id is stamped onto every built intent. */
  actor: DmTurnTokenRef;
  /** Every other token on the grid, fold-derived. May be empty. */
  tokens: DmTurnTokenRef[];
  /** The ONLY actions the model may choose from. */
  options: DmTurnActionOption[];
  /** Structured validation issues from a prior attempt, for a bounded repair. */
  repairIssues?: string[];
}

/**
 * One proposed action. Deliberately NARROWER than `SceneActionIntent`: there is
 * no intent type, no token id, no modifier and no damage figure here, because
 * none of those is the model's to choose. It picks an option and, for a `move`,
 * a destination cell — everything else is stamped from the option and the
 * folded scene.
 */
export interface DmTurnProposal {
  optionId: string;
  /** `move` options only: the destination cell in grid coordinates. */
  destination?: { x: number; y: number };
  /** One-line justification, optional, presentation-only. */
  reason?: string;
}

export interface DmTurnIntentData {
  proposals: DmTurnProposal[];
  /** One-line account of the actor's plan, optional, presentation-only. */
  rationale?: string;
}

export type DmTurnIntentRequest = AiRequest<'dm-turn-intent', DmTurnIntentPayload>;

function parseDmTurnTokenRef(raw: unknown, label: string): AiParse<DmTurnTokenRef> {
  if (!isRecord(raw)) return { ok: false, message: `The ${label} must be an object.` };
  if (typeof raw.id !== 'string' || !raw.id) {
    return { ok: false, message: `The ${label} needs a non-empty id.` };
  }
  if (typeof raw.name !== 'string' || !raw.name) {
    return { ok: false, message: `The ${label} needs a non-empty name.` };
  }
  if (raw.allegiance !== 'party' && raw.allegiance !== 'hostile' && raw.allegiance !== 'neutral') {
    return { ok: false, message: `The ${label} needs a recognized allegiance.` };
  }
  if (!isRecord(raw.position) || !isFiniteNum(raw.position.x) || !isFiniteNum(raw.position.y)) {
    return { ok: false, message: `The ${label} needs a finite x/y position.` };
  }
  return {
    ok: true,
    value: {
      id: raw.id,
      name: raw.name,
      allegiance: raw.allegiance,
      position: { x: raw.position.x, y: raw.position.y },
    },
  };
}

/**
 * Per-verb option validation. The required extras are checked HERE so a
 * malformed pool is rejected at the gateway boundary rather than surfacing as a
 * dropped proposal later — an option the flow could never map is a request bug,
 * not a model failure.
 */
function parseDmTurnActionOption(raw: unknown): AiParse<DmTurnActionOption> {
  if (!isRecord(raw)) return { ok: false, message: 'Each dm-turn option must be an object.' };
  if (typeof raw.id !== 'string' || !raw.id) {
    return { ok: false, message: 'Each dm-turn option needs a non-empty id.' };
  }
  if (!isDmTurnVerb(raw.verb)) {
    return { ok: false, message: `'${String(raw.verb)}' is not a recognized AI-DM verb.` };
  }
  if (typeof raw.label !== 'string' || !raw.label) {
    return { ok: false, message: 'Each dm-turn option needs a non-empty label.' };
  }
  if (raw.verb === 'move') {
    if (!isPositiveInt(raw.maxDistance)) {
      return { ok: false, message: "A 'move' option needs a positive integer maxDistance." };
    }
    return {
      ok: true,
      value: { id: raw.id, verb: 'move', label: raw.label, maxDistance: raw.maxDistance },
    };
  }
  if (raw.verb === 'check') {
    if (!isRecord(raw.check)) {
      return { ok: false, message: "A 'check' option needs check parameters." };
    }
    const { label, modifier, dc } = raw.check;
    if (typeof label !== 'string' || !label.trim()) {
      return { ok: false, message: "A 'check' option needs a non-empty check label." };
    }
    if (!isFiniteNum(modifier)) {
      return { ok: false, message: "A 'check' option needs a finite modifier." };
    }
    if (dc !== undefined && !isFiniteNum(dc)) {
      return { ok: false, message: "A 'check' option's dc must be finite when set." };
    }
    return {
      ok: true,
      value: {
        id: raw.id,
        verb: 'check',
        label: raw.label,
        check: { label, modifier, ...(dc !== undefined ? { dc } : {}) },
      },
    };
  }
  return { ok: true, value: { id: raw.id, verb: 'hold', label: raw.label } };
}

function parseDmTurnIntentPayload(raw: unknown): AiParse<DmTurnIntentPayload> {
  if (!isRecord(raw)) return { ok: false, message: 'Dm-turn-intent payload must be an object.' };
  if (typeof raw.systemId !== 'string' || !raw.systemId) {
    return { ok: false, message: 'Dm-turn-intent payload needs a systemId.' };
  }
  if (typeof raw.facts !== 'string' || !raw.facts.trim()) {
    return { ok: false, message: 'Dm-turn-intent payload needs non-empty facts.' };
  }
  if (!isPositiveInt(raw.round)) {
    return { ok: false, message: 'Dm-turn-intent payload needs a positive integer round.' };
  }
  const actor = parseDmTurnTokenRef(raw.actor, 'dm-turn actor');
  if (!actor.ok) return actor;
  if (!Array.isArray(raw.tokens)) {
    return { ok: false, message: 'Dm-turn-intent payload needs a tokens array.' };
  }
  const tokens: DmTurnTokenRef[] = [];
  for (const token of raw.tokens) {
    const parsed = parseDmTurnTokenRef(token, 'dm-turn token');
    if (!parsed.ok) return parsed;
    tokens.push(parsed.value);
  }
  if (!Array.isArray(raw.options) || raw.options.length === 0) {
    return { ok: false, message: 'Dm-turn-intent payload needs a non-empty options list.' };
  }
  if (raw.options.length > MAX_DM_TURN_OPTIONS) {
    return { ok: false, message: 'Dm-turn-intent payload offers too many options.' };
  }
  const options: DmTurnActionOption[] = [];
  for (const option of raw.options) {
    const parsed = parseDmTurnActionOption(option);
    if (!parsed.ok) return parsed;
    options.push(parsed.value);
  }
  return {
    ok: true,
    value: {
      systemId: raw.systemId,
      facts: raw.facts,
      round: raw.round,
      actor: actor.value,
      tokens,
      options,
      ...(Array.isArray(raw.repairIssues)
        ? { repairIssues: raw.repairIssues.filter((s): s is string => typeof s === 'string') }
        : {}),
    },
  };
}

/**
 * Envelope-only validation, exactly as `parseAnalyzeMapData` is. Whether an
 * `optionId` exists, whether a destination is in reach, and whether the
 * resulting intent is legal are all decided downstream (`src/ai/dmTurn.ts` and
 * `resolveSceneAction`); re-deciding any of it here would create a second,
 * quieter opinion about legality.
 */
function parseDmTurnIntentData(raw: unknown): AiParse<DmTurnIntentData> {
  if (!isRecord(raw)) return { ok: false, message: 'Output must be an object.' };
  if (!Array.isArray(raw.proposals)) {
    return { ok: false, message: 'Dm-turn-intent output needs a proposals array.' };
  }
  if (raw.proposals.length > MAX_DM_TURN_PROPOSALS) {
    return { ok: false, message: 'Dm-turn-intent output proposes too many actions.' };
  }
  const proposals: DmTurnProposal[] = [];
  for (const proposal of raw.proposals) {
    if (!isRecord(proposal) || typeof proposal.optionId !== 'string' || !proposal.optionId) {
      return { ok: false, message: 'Each proposal needs a non-empty optionId.' };
    }
    let destination: { x: number; y: number } | undefined;
    if (proposal.destination !== undefined) {
      if (
        !isRecord(proposal.destination) ||
        !isFiniteNum(proposal.destination.x) ||
        !isFiniteNum(proposal.destination.y)
      ) {
        return { ok: false, message: 'A proposal destination needs finite x and y.' };
      }
      destination = { x: proposal.destination.x, y: proposal.destination.y };
    }
    proposals.push({
      optionId: proposal.optionId,
      ...(destination ? { destination } : {}),
      ...(typeof proposal.reason === 'string' && proposal.reason
        ? { reason: proposal.reason }
        : {}),
    });
  }
  return {
    ok: true,
    value: {
      proposals,
      ...(typeof raw.rationale === 'string' && raw.rationale ? { rationale: raw.rationale } : {}),
    },
  };
}
