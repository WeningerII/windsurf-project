/**
 * Client orchestration for AI character drafting (RFC 002/003 capstone). Mirrors
 * the encounter-draft flow exactly: the model proposes, deterministic validators
 * decide. The flow:
 *   1. ask the gateway for a draft (the model picks ids from loader-derived pools),
 *   2. reject any id outside the offered pools (the model never invents ids),
 *   3. hand the draft to the client's EXISTING template/creation path to build a
 *      normal `CharacterDocument`,
 *   4. run the injected deterministic validator (per-system `registry.validateDocument`),
 *   5. on blocking issues, feed the machine-readable `ValidationIssue[]` back for a
 *      BOUNDED repair (default max 2), else give up.
 * The accepted document is returned for the user to review and persist through the
 * same path a manual creation uses. The model never decides RAW legality — the
 * validators do.
 */
import { callAiGateway } from './gatewayClient';
import {
  CHARACTER_DRAFT_POOL_KEYS,
  type CharacterDraftCandidatePools,
  type CharacterDraftData,
  type TaskGatewayCall,
} from './contracts';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';

export interface DraftCharacterParams {
  systemId: string;
  prompt: string;
  /** Loader-derived legal ids the model must choose from (never invents). */
  pools: CharacterDraftCandidatePools;
}

export type DraftCharacterResult<T extends SystemDataModel = SystemDataModel> =
  | { ok: true; document: CharacterDocument<T>; rationale?: string }
  | { ok: false; error: string; issues?: ValidationIssue[] };

/**
 * Build a `CharacterDocument` from an accepted draft through the client's EXISTING
 * template/creation path (e.g. `createDefaultData` + `buildNewCharacterDocument` +
 * the system's `apply*Template` helpers). Injected so the flow never imports the
 * systems layer and stays unit-testable. May be async (templates load catalogs).
 */
export type CharacterDraftApplier<T extends SystemDataModel = SystemDataModel> = (
  draft: CharacterDraftData
) => CharacterDocument<T> | Promise<CharacterDocument<T>>;

/**
 * Validate a built document and return the BLOCKING issues (empty = accept). The
 * caller decides the severity policy per system — typically wrapping
 * `registry.validateDocument(document, { reason: 'ai-draft' })` and filtering to
 * `severity === 'error'` (or including `'warning'` for systems whose data checks
 * are warning-only). May be async (validators load catalogs).
 */
export type DocumentValidator<T extends SystemDataModel = SystemDataModel> = (
  document: CharacterDocument<T>
) => ValidationIssue[] | Promise<ValidationIssue[]>;

/** Injectable gateway call so the flow is unit-testable without a network. */
export type GatewayCall = TaskGatewayCall<'character-draft'>;

/** The draft-id field on `CharacterDraftData` that each pool category validates. */
const POOL_SINGLE_FIELDS: Partial<
  Record<keyof CharacterDraftCandidatePools, 'classId' | 'ancestryId' | 'backgroundId'>
> = {
  classes: 'classId',
  ancestries: 'ancestryId',
  backgrounds: 'backgroundId',
};

/** The draft-id LIST field on `CharacterDraftData` that each pool category validates. */
const POOL_LIST_FIELDS: Partial<
  Record<keyof CharacterDraftCandidatePools, 'featIds' | 'spellIds'>
> = {
  feats: 'featIds',
  spells: 'spellIds',
};

/**
 * Reject any id the model chose that is not in the offered pool for its category.
 * This runs BEFORE the deterministic validator so an invented id is caught by the
 * pool gate (a clear "choose from the list" repair hint) rather than surfacing as
 * an opaque validator error. Returns machine-readable issues (empty = all valid).
 */
function collectUnknownIdIssues(
  draft: CharacterDraftData,
  pools: CharacterDraftCandidatePools
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const key of CHARACTER_DRAFT_POOL_KEYS) {
    const allowed = new Set(pools[key].map((candidate) => candidate.id));
    const singleField = POOL_SINGLE_FIELDS[key];
    if (singleField) {
      const id = draft[singleField];
      if (typeof id === 'string' && !allowed.has(id)) {
        issues.push(unknownIdIssue(id, key, singleField));
      }
    }
    const listField = POOL_LIST_FIELDS[key];
    if (listField) {
      for (const id of draft[listField] ?? []) {
        if (!allowed.has(id)) issues.push(unknownIdIssue(id, key, listField));
      }
    }
  }
  return issues;
}

function unknownIdIssue(id: string, category: string, path: string): ValidationIssue {
  return {
    code: 'ai-draft-unknown-id',
    severity: 'error',
    path,
    message: `'${id}' is not one of the offered ${category}; choose from the list.`,
    recoverable: true,
    source: 'ai-draft',
  };
}

export async function draftCharacterWithAi<T extends SystemDataModel = SystemDataModel>(
  params: DraftCharacterParams,
  apply: CharacterDraftApplier<T>,
  validate: DocumentValidator<T>,
  options: { call?: GatewayCall; maxRepairs?: number } = {}
): Promise<DraftCharacterResult<T>> {
  const call = options.call ?? (callAiGateway as GatewayCall);
  // Bounded repair: default TWO repair attempts (three gateway calls total).
  const maxRepairs = options.maxRepairs ?? 2;

  let repairIssues: string[] | undefined;
  let lastIssues: ValidationIssue[] | undefined;
  for (let attempt = 0; attempt <= maxRepairs; attempt += 1) {
    const response = await call<CharacterDraftData>('character-draft', {
      systemId: params.systemId,
      prompt: params.prompt,
      pools: params.pools,
      ...(repairIssues ? { repairIssues } : {}),
    });
    if (!response.ok) return { ok: false, error: response.message };

    const draft = response.data;
    // The model must choose from the supplied pools — reject inventions first, so
    // an invented id never reaches (or is misattributed to) the rules validator,
    // and we never waste the template/creation path on a doomed draft.
    const unknownIdIssues = collectUnknownIdIssues(draft, params.pools);
    if (unknownIdIssues.length > 0) {
      lastIssues = unknownIdIssues;
      repairIssues = unknownIdIssues.map((issue) => issue.message);
      continue;
    }

    // Build the document through the client's existing template/creation path,
    // then run the deterministic validator on it.
    const document = await apply(draft);
    const issues = await validate(document);
    if (issues.length === 0) {
      return { ok: true, document, ...(draft.rationale ? { rationale: draft.rationale } : {}) };
    }
    lastIssues = issues;
    repairIssues = issues.map((issue) => issue.message);
  }

  return {
    ok: false,
    error: 'The AI could not produce a valid character. Adjust the request or build it manually.',
    ...(lastIssues ? { issues: lastIssues } : {}),
  };
}
