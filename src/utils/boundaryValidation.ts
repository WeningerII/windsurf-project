import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Campaign } from '../types/core/campaign';
import type { SceneDocument } from '../types/core/scene';
import type { ValidationIssue } from '../registry/types';

/**
 * Result of parsing untrusted input into a typed value.
 *
 * `ok` discriminates success (a fully-typed value) from failure (structured
 * issues). This is the dependency-free "parse, don't cast" primitive used at
 * every untrusted persistence boundary — imported JSON, browser storage, and
 * Supabase rows — so malformed data is rejected with an explanation instead of
 * being cast and silently trusted.
 *
 * Each parser validates only the universal envelope that the core app owns
 * (ids, names, container shape, timestamps). Deep system/scene-specific
 * payloads remain the responsibility of the registry `SystemValidator` and the
 * scene runtime; the goal here is narrow: guarantee that what the app treats as
 * a document/campaign/scene is structurally one, so a malformed record cannot
 * masquerade as one and poison storage, sync, or rendering.
 */
export type ParseResult<T> = { ok: true; value: T } | { ok: false; issues: ValidationIssue[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function coerceDate(value: unknown, fallback: Date): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return fallback;
}

function coerceStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
}

function issue(source: string, code: string, message: string, path?: string): ValidationIssue {
  return { code, message, severity: 'error', path, source, recoverable: false };
}

/**
 * Allowlist the `img` field of an untrusted document: only `https:` URLs and
 * `data:image/*` payloads are kept. Everything else — `javascript:`,
 * `vbscript:`, `http:`, `blob:`, `file:`, relative paths, unparseable
 * strings — is dropped (the field, not the document): the value is rendered
 * as an `<img src>`, so a hostile import/synced row must not be able to point
 * it at an attacker-chosen scheme or trigger plaintext beacon requests.
 * Uses the URL parser (mirroring browser behavior, e.g. tab/newline stripping
 * inside schemes) rather than a substring check.
 */
function sanitizeImgUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }
  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  } catch {
    return undefined;
  }
  if (parsed.protocol === 'https:') {
    return value;
  }
  if (parsed.protocol === 'data:' && parsed.pathname.toLowerCase().startsWith('image/')) {
    return value;
  }
  return undefined;
}

/**
 * Validate the universal `CharacterDocument` envelope from untrusted input.
 * Timestamps are coerced leniently (missing/invalid -> `now`) because import
 * and sync paths re-stamp them; an unusable timestamp is not a reason to drop
 * an otherwise-valid character.
 */
export function parseCharacterDocument(
  value: unknown,
  now: Date = new Date()
): ParseResult<CharacterDocument<SystemDataModel>> {
  const src = 'document-envelope';
  if (!isRecord(value)) {
    return { ok: false, issues: [issue(src, 'document-not-object', 'Document is not an object.')] };
  }

  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(value.id)) {
    issues.push(issue(src, 'document-invalid-id', 'Document id must be a non-empty string.', 'id'));
  }
  if (typeof value.name !== 'string') {
    issues.push(issue(src, 'document-invalid-name', 'Document name must be a string.', 'name'));
  }
  if (!isNonEmptyString(value.systemId)) {
    issues.push(
      issue(
        src,
        'document-invalid-system-id',
        'Document systemId must be a non-empty string.',
        'systemId'
      )
    );
  }
  if (!isRecord(value.system)) {
    issues.push(
      issue(src, 'document-invalid-system', 'Document system data must be an object.', 'system')
    );
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const img = sanitizeImgUrl(value.img);
  const document: CharacterDocument<SystemDataModel> = {
    id: value.id as string,
    name: value.name as string,
    systemId: value.systemId as string,
    system: value.system as SystemDataModel,
    createdAt: coerceDate(value.createdAt, now),
    updatedAt: coerceDate(value.updatedAt, now),
    ...(img !== undefined ? { img } : {}),
    ...(typeof value.version === 'number' ? { version: value.version } : {}),
  };

  return { ok: true, value: document };
}

/**
 * Validate a `Campaign` envelope from untrusted input. `characterIds` and
 * `notes` are coerced to safe defaults rather than rejected, since a campaign
 * with garbage in those fields is still a usable campaign once cleaned.
 */
export function parseCampaign(value: unknown, now: Date = new Date()): ParseResult<Campaign> {
  const src = 'campaign-envelope';
  if (!isRecord(value)) {
    return { ok: false, issues: [issue(src, 'campaign-not-object', 'Campaign is not an object.')] };
  }

  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(value.id)) {
    issues.push(issue(src, 'campaign-invalid-id', 'Campaign id must be a non-empty string.', 'id'));
  }
  if (typeof value.name !== 'string') {
    issues.push(issue(src, 'campaign-invalid-name', 'Campaign name must be a string.', 'name'));
  }
  if (value.systemId !== undefined && typeof value.systemId !== 'string') {
    issues.push(
      issue(
        src,
        'campaign-invalid-system-id',
        'Campaign systemId must be a string when present.',
        'systemId'
      )
    );
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const campaign: Campaign = {
    id: value.id as string,
    name: value.name as string,
    ...(isNonEmptyString(value.systemId) ? { systemId: value.systemId } : {}),
    characterIds: coerceStringArray(value.characterIds),
    notes: typeof value.notes === 'string' ? value.notes : '',
    createdAt: coerceDate(value.createdAt, now),
    updatedAt: coerceDate(value.updatedAt, now),
  };

  return { ok: true, value: campaign };
}

/**
 * Validate a `SceneDocument` envelope from untrusted input. The grid/token/
 * marker/initiative substructure and the event log are required to be the right
 * shape so downstream hydration and the event fold cannot crash on a malformed
 * scene; deep per-event validation stays with the scene runtime.
 */
export function parseSceneDocument(
  value: unknown,
  now: Date = new Date()
): ParseResult<SceneDocument> {
  const src = 'scene-envelope';
  if (!isRecord(value)) {
    return { ok: false, issues: [issue(src, 'scene-not-object', 'Scene is not an object.')] };
  }

  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(value.id)) {
    issues.push(issue(src, 'scene-invalid-id', 'Scene id must be a non-empty string.', 'id'));
  }
  if (typeof value.name !== 'string') {
    issues.push(issue(src, 'scene-invalid-name', 'Scene name must be a string.', 'name'));
  }
  if (!isNonEmptyString(value.systemId)) {
    issues.push(
      issue(
        src,
        'scene-invalid-system-id',
        'Scene systemId must be a non-empty string.',
        'systemId'
      )
    );
  }

  const initialState = value.initialState;
  if (
    !isRecord(initialState) ||
    !isRecord(initialState.grid) ||
    !isRecord(initialState.tokens) ||
    !isRecord(initialState.markers) ||
    !Array.isArray(initialState.initiative)
  ) {
    issues.push(
      issue(
        src,
        'scene-invalid-initial-state',
        'Scene initialState must include grid, tokens, markers, and initiative.',
        'initialState'
      )
    );
  }
  if (!Array.isArray(value.events)) {
    issues.push(issue(src, 'scene-invalid-events', 'Scene events must be an array.', 'events'));
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const scene: SceneDocument = {
    id: value.id as string,
    name: value.name as string,
    systemId: value.systemId as string,
    ...(isNonEmptyString(value.campaignId) ? { campaignId: value.campaignId } : {}),
    initialState: value.initialState as SceneDocument['initialState'],
    events: value.events as SceneDocument['events'],
    createdAt: coerceDate(value.createdAt, now),
    updatedAt: coerceDate(value.updatedAt, now),
    version: 1,
  };

  return { ok: true, value: scene };
}
