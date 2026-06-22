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

import { isMapRegionKind, type MapAnalysis, type MapRegion } from '../scene/mapAnalysis';

export const AI_GATEWAY_SCHEMA_VERSION = 'ai-gateway-v1' as const;
export const AI_GATEWAY_ENDPOINT = '/.netlify/functions/ai-gateway' as const;

/** Task allowlist. Grows one entry at a time as each task surface lands. */
export const AI_GATEWAY_TASKS = [
  'encounter-draft',
  'scene-narration',
  'identify-creature',
  'illustrate-scene',
  'strategy-hints',
  'analyze-map',
] as const;
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
    case 'strategy-hints':
      return parseStrategyHintsPayload(payload);
    case 'analyze-map':
      return parseAnalyzeMapPayload(payload);
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
    case 'strategy-hints':
      return parseStrategyHintsData(raw);
    case 'analyze-map':
      return parseAnalyzeMapData(raw);
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
  /**
   * Faithfulness issues from a prior draft (the critic's findings), for ONE
   * bounded rewrite. When present the prompt asks the model to drop these
   * ungrounded details and use only the facts.
   */
  critique?: string[];
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
      ...(Array.isArray(raw.critique)
        ? { critique: raw.critique.filter((s): s is string => typeof s === 'string') }
        : {}),
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

// --- Task: strategy-hints (Phase 12 strategist blackboard) -----------------

/**
 * A compact, per-combatant snapshot the strategist reasons over. Intentionally
 * minimal (no positions, no rules): the strategist sets TARGET PRIORITY only;
 * the deterministic executor owns movement, legality, and resolution. The model
 * sees who is on which side and how hurt they are, and advises whom to focus.
 */
export interface StrategyCombatantView {
  tokenId: string;
  name: string;
  /** Combat side (e.g. 'party' | 'hostile' | 'neutral'). */
  faction: string;
  /** Current HP fraction, 0..1. */
  hpFraction: number;
}

export interface StrategyHintsPayload {
  /** The round the advice is for (stamps the resulting blackboard's freshness). */
  round: number;
  /** The side being advised — only its combatants may receive hints. */
  side: string;
  /** Every combatant in the fight (both sides), for the model to weigh. */
  combatants: StrategyCombatantView[];
  /** Optional DM directive (e.g. "the cultists protect their leader"). */
  prompt?: string;
  /** Structured issues from a prior attempt, for a bounded repair. */
  repairIssues?: string[];
}

/** One advisory bias the model proposes: actor → target, with a magnitude. */
export interface StrategyHintItem {
  actorId: string;
  targetId: string;
  /** Advisory bias; the executor clamps it to ±STRATEGY_BIAS_CAP on apply. */
  bias: number;
  reason?: string;
}

export interface StrategyHintsData {
  /** May be empty: "no special advice this round" is a valid answer. */
  hints: StrategyHintItem[];
}

export type StrategyHintsRequest = AiRequest<'strategy-hints', StrategyHintsPayload>;

function parseStrategyCombatantView(raw: unknown): AiParse<StrategyCombatantView> {
  if (!isRecord(raw)) return { ok: false, message: 'Each combatant must be an object.' };
  if (typeof raw.tokenId !== 'string' || !raw.tokenId) {
    return { ok: false, message: 'Each combatant needs a tokenId.' };
  }
  if (typeof raw.name !== 'string') {
    return { ok: false, message: 'Each combatant needs a name.' };
  }
  if (typeof raw.faction !== 'string' || !raw.faction) {
    return { ok: false, message: 'Each combatant needs a faction.' };
  }
  const fractionRaw = typeof raw.hpFraction === 'number' ? raw.hpFraction : 1;
  const hpFraction = Number.isFinite(fractionRaw) ? Math.min(1, Math.max(0, fractionRaw)) : 1;
  return {
    ok: true,
    value: { tokenId: raw.tokenId, name: raw.name, faction: raw.faction, hpFraction },
  };
}

function parseStrategyHintsPayload(raw: unknown): AiParse<StrategyHintsPayload> {
  if (!isRecord(raw)) return { ok: false, message: 'Strategy-hints payload must be an object.' };
  if (!Number.isFinite(raw.round)) {
    return { ok: false, message: 'Strategy-hints payload needs a numeric round.' };
  }
  if (typeof raw.side !== 'string' || !raw.side) {
    return { ok: false, message: 'Strategy-hints payload needs a side.' };
  }
  if (!Array.isArray(raw.combatants) || raw.combatants.length === 0) {
    return { ok: false, message: 'Strategy-hints payload needs a non-empty combatants list.' };
  }
  const combatants: StrategyCombatantView[] = [];
  for (const entry of raw.combatants) {
    const parsed = parseStrategyCombatantView(entry);
    if (!parsed.ok) return parsed;
    combatants.push(parsed.value);
  }
  return {
    ok: true,
    value: {
      round: raw.round as number,
      side: raw.side,
      combatants,
      ...(typeof raw.prompt === 'string' && raw.prompt ? { prompt: raw.prompt } : {}),
      ...(Array.isArray(raw.repairIssues)
        ? { repairIssues: raw.repairIssues.filter((s): s is string => typeof s === 'string') }
        : {}),
    },
  };
}

// --- Task: analyze-map (vision → grid + region geometry; Phase 10) ---------

export interface AnalyzeMapPayload {
  /** The map image to analyse. */
  image: AiImageInput;
  /** The image's natural pixel dimensions (so a proposal can be bounds-checked). */
  imageWidth: number;
  imageHeight: number;
  /** The scene grid the proposal must fit, in cells. */
  gridWidth: number;
  gridHeight: number;
  /** Structured issues from a prior attempt, for a bounded repair. */
  repairIssues?: string[];
}

/** The model's proposed geometry — validated against the image/grid by the flow. */
export type AnalyzeMapData = MapAnalysis;

export type AnalyzeMapRequest = AiRequest<'analyze-map', AnalyzeMapPayload>;

function parseAnalyzeMapPayload(raw: unknown): AiParse<AnalyzeMapPayload> {
  if (!isRecord(raw)) return { ok: false, message: 'Analyze-map payload must be an object.' };
  const image = parseAiImageInput(raw.image);
  if (!image.ok) return image;
  const dims = ['imageWidth', 'imageHeight', 'gridWidth', 'gridHeight'] as const;
  for (const key of dims) {
    if (!Number.isFinite(raw[key]) || (raw[key] as number) <= 0) {
      return { ok: false, message: `Analyze-map payload needs a positive ${key}.` };
    }
  }
  return {
    ok: true,
    value: {
      image: image.value,
      imageWidth: raw.imageWidth as number,
      imageHeight: raw.imageHeight as number,
      gridWidth: raw.gridWidth as number,
      gridHeight: raw.gridHeight as number,
      ...(Array.isArray(raw.repairIssues)
        ? { repairIssues: raw.repairIssues.filter((s): s is string => typeof s === 'string') }
        : {}),
    },
  };
}

function parseAnalyzeMapData(raw: unknown): AiParse<AnalyzeMapData> {
  if (!isRecord(raw)) return { ok: false, message: 'Output must be an object.' };
  if (
    typeof raw.pixelsPerCell !== 'number' ||
    typeof raw.offsetX !== 'number' ||
    typeof raw.offsetY !== 'number'
  ) {
    return { ok: false, message: 'Map analysis needs numeric pixelsPerCell and offsets.' };
  }
  if (!Array.isArray(raw.regions)) {
    return { ok: false, message: 'Map analysis needs a regions array (may be empty).' };
  }
  const regions: MapRegion[] = [];
  for (const region of raw.regions) {
    if (
      !isRecord(region) ||
      !isMapRegionKind(region.kind) ||
      typeof region.label !== 'string' ||
      typeof region.x !== 'number' ||
      typeof region.y !== 'number' ||
      typeof region.width !== 'number' ||
      typeof region.height !== 'number'
    ) {
      return {
        ok: false,
        message: 'Each region needs a known kind, a label, and numeric x/y/width/height.',
      };
    }
    regions.push({
      kind: region.kind,
      label: region.label,
      x: region.x,
      y: region.y,
      width: region.width,
      height: region.height,
    });
  }
  return {
    ok: true,
    value: {
      pixelsPerCell: raw.pixelsPerCell,
      offsetX: raw.offsetX,
      offsetY: raw.offsetY,
      regions,
    },
  };
}

function parseStrategyHintsData(raw: unknown): AiParse<StrategyHintsData> {
  if (!isRecord(raw)) return { ok: false, message: 'Output must be an object.' };
  if (!Array.isArray(raw.hints)) {
    return { ok: false, message: 'Strategy output needs a hints array (may be empty).' };
  }
  const hints: StrategyHintItem[] = [];
  for (const hint of raw.hints) {
    if (
      !isRecord(hint) ||
      typeof hint.actorId !== 'string' ||
      !hint.actorId ||
      typeof hint.targetId !== 'string' ||
      !hint.targetId ||
      typeof hint.bias !== 'number' ||
      !Number.isFinite(hint.bias)
    ) {
      return {
        ok: false,
        message: 'Each hint needs string actorId/targetId and a finite numeric bias.',
      };
    }
    hints.push({
      actorId: hint.actorId,
      targetId: hint.targetId,
      bias: hint.bias,
      ...(typeof hint.reason === 'string' && hint.reason ? { reason: hint.reason } : {}),
    });
  }
  return { ok: true, value: { hints } };
}
