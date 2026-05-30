import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';

/**
 * Result of parsing untrusted input into a typed value.
 *
 * `ok` discriminates success (a fully-typed value) from failure (structured
 * issues). This is the dependency-free "parse, don't cast" primitive used at
 * the app's untrusted boundaries (imported JSON, persisted storage, remote
 * rows) so malformed data is rejected with an explanation instead of being
 * cast and silently trusted.
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

function envelopeIssue(code: string, message: string, path?: string): ValidationIssue {
  return {
    code,
    message,
    severity: 'error',
    path,
    source: 'document-envelope',
    recoverable: false,
  };
}

/**
 * Validate the universal `CharacterDocument` envelope from untrusted input.
 *
 * This intentionally validates only the container the core app owns
 * (id/name/systemId/system/timestamps). The system-specific `system` payload
 * is NOT deeply validated here — that is the per-system registry
 * `SystemValidator`'s responsibility. The goal is narrow: guarantee that what
 * the app treats as a document is structurally a document, so a malformed
 * record cannot masquerade as one and poison storage, sync, or rendering.
 *
 * Timestamps are coerced leniently (missing/invalid -> `now`) because import
 * and sync paths re-stamp them; an unusable timestamp is not a reason to drop
 * an otherwise-valid character.
 */
export function parseCharacterDocument(
  value: unknown,
  now: Date = new Date()
): ParseResult<CharacterDocument<SystemDataModel>> {
  if (!isRecord(value)) {
    return {
      ok: false,
      issues: [envelopeIssue('document-not-object', 'Document is not an object.')],
    };
  }

  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(value.id)) {
    issues.push(
      envelopeIssue('document-invalid-id', 'Document id must be a non-empty string.', 'id')
    );
  }
  if (typeof value.name !== 'string') {
    issues.push(envelopeIssue('document-invalid-name', 'Document name must be a string.', 'name'));
  }
  if (!isNonEmptyString(value.systemId)) {
    issues.push(
      envelopeIssue(
        'document-invalid-system-id',
        'Document systemId must be a non-empty string.',
        'systemId'
      )
    );
  }
  if (!isRecord(value.system)) {
    issues.push(
      envelopeIssue('document-invalid-system', 'Document system data must be an object.', 'system')
    );
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const document: CharacterDocument<SystemDataModel> = {
    id: value.id as string,
    name: value.name as string,
    systemId: value.systemId as string,
    system: value.system as SystemDataModel,
    createdAt: coerceDate(value.createdAt, now),
    updatedAt: coerceDate(value.updatedAt, now),
    ...(typeof value.img === 'string' ? { img: value.img } : {}),
    ...(typeof value.version === 'number' ? { version: value.version } : {}),
  };

  return { ok: true, value: document };
}
