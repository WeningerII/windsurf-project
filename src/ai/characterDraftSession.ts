/**
 * Registry binding for AI character drafting (RFC 002 task 5) — the seam a UI
 * surface uses to get from a free-text concept to a REVIEWABLE
 * `CharacterDocument`, without re-deciding anything the flow already decides.
 *
 * It composes shipped pieces and adds no rules of its own:
 *
 * | step    | done by                                                     |
 * | ------- | ----------------------------------------------------------- |
 * | pools   | `characterDraftPools` — loader-derived LEGAL ids             |
 * | propose | `characterDraftFlow` — model picks ids; inventions rejected  |
 * | apply   | `creation/draftDocument` — through the system's OWN plan     |
 * | decide  | `registry.validateDocument`, filtered to blocking issues     |
 *
 * RFC 002's governing rule holds: the model proposes, deterministic validators
 * decide. Nothing here writes to storage, and nothing here mutates an existing
 * document. The returned proposal is a DETACHED document the caller shows the
 * user and then persists through the SAME create path a manual character takes
 * — accepting a draft is the user's action, never the model's.
 *
 * Default-off posture is inherited, not re-implemented: with `VITE_AI_ENABLED`
 * off or no server key, `callAiGateway` answers `provider-not-configured`, this
 * returns a typed failure, and the caller falls back to manual creation. Every
 * failure mode — flag off, no key, unreachable gateway, catalog load error,
 * unregistered system, validator rejection — comes back as `{ ok: false }`;
 * this module never throws.
 */
import {
  draftCharacterWithAi,
  type DocumentValidator,
  type GatewayCall,
} from './characterDraftFlow';
import { loadCharacterDraftPools } from './characterDraftPools';
import {
  CHARACTER_DRAFT_POOL_KEYS,
  type CharacterDraftCandidatePools,
  type CharacterDraftData,
} from './contracts';
import { buildDocumentFromPlanIds } from '../creation/draftDocument';
import type { CreationPlan } from '../creation/types';
import { systemRegistry } from '../registry';
import type { ValidationIssue } from '../registry/types';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';

/** Cap per candidate-pool category offered to the model (bounds the prompt). */
export const DEFAULT_CHARACTER_DRAFT_POOL_LIMIT = 32;

/** The registry-derived pieces needed to build a drafted document for a system. */
export interface CharacterDraftBinding {
  plan: CreationPlan<SystemDataModel>;
  createDefaultData: () => SystemDataModel;
}

/** One option id the model picked, resolved to its offered name for review. */
export interface CharacterDraftChoice {
  category: (typeof CHARACTER_DRAFT_POOL_KEYS)[number];
  id: string;
  name: string;
  /**
   * Whether this system's creation plan had a step that actually applied the
   * id. False means the model legally chose it but the plan has no step for it
   * (e.g. Daggerheart declares no loader-driven steps yet) — reported, never
   * silently presented as applied.
   */
  applied: boolean;
}

/** What the model proposed, built and validated, for the user to review. */
export interface CharacterDraftProposal {
  /** Detached, validated document. NOT persisted — the caller does that. */
  document: CharacterDocument<SystemDataModel>;
  rationale?: string;
  /** Every id the model chose, resolved to names, with applied/unapplied flags. */
  choices: CharacterDraftChoice[];
}

export type CharacterDraftOutcome =
  | { ok: true; proposal: CharacterDraftProposal }
  | { ok: false; error: string; issues?: ValidationIssue[] };

/** Which draft field holds the ids for each candidate-pool category. */
const DRAFT_IDS_BY_CATEGORY: Record<
  (typeof CHARACTER_DRAFT_POOL_KEYS)[number],
  (draft: CharacterDraftData) => string[]
> = {
  classes: (draft) => (draft.classId ? [draft.classId] : []),
  ancestries: (draft) => (draft.ancestryId ? [draft.ancestryId] : []),
  backgrounds: (draft) => (draft.backgroundId ? [draft.backgroundId] : []),
  feats: (draft) => draft.featIds ?? [],
  spells: (draft) => draft.spellIds ?? [],
};

/** Every option id a character draft chose, in a stable category order. */
export function draftOptionIds(draft: CharacterDraftData): string[] {
  return CHARACTER_DRAFT_POOL_KEYS.flatMap((key) => DRAFT_IDS_BY_CATEGORY[key](draft));
}

/**
 * Resolve the ids a draft chose against the pools they were offered from, so a
 * review surface can show NAMES rather than raw ids. Ids reach this only after
 * the flow's pool gate accepted them, so a lookup miss is impossible in
 * practice; if one ever occurred the id itself is shown rather than dropped.
 */
function describeDraftChoices(
  draft: CharacterDraftData,
  pools: CharacterDraftCandidatePools,
  unroutedIds: readonly string[]
): CharacterDraftChoice[] {
  const unrouted = new Set(unroutedIds);
  return CHARACTER_DRAFT_POOL_KEYS.flatMap((category) =>
    DRAFT_IDS_BY_CATEGORY[category](draft).map((id) => ({
      category,
      id,
      name: pools[category].find((candidate) => candidate.id === id)?.name ?? id,
      applied: !unrouted.has(id),
    }))
  );
}

/**
 * The registry validator, filtered to BLOCKING issues, routed by
 * `document.systemId` so every system's own rules decide its own drafts. This
 * is the same gate a manual edit passes.
 */
export const validateDraftedDocument: DocumentValidator = async (document) => {
  const { issues } = await systemRegistry.validateDocument(document, { reason: 'ai-draft' });
  return issues.filter((issue) => issue.severity === 'error');
};

/**
 * The system's guided-creation plan + default data, or undefined when the system
 * is unregistered or declares no plan (a drafted character could then not be
 * built through its own creation path, so drafting is refused rather than faked).
 */
export async function resolveCharacterDraftBinding(
  systemId: GameSystemId
): Promise<CharacterDraftBinding | undefined> {
  const definition = systemRegistry.get(systemId);
  if (!definition) return undefined;
  const plan = await systemRegistry.getCreationPlan<SystemDataModel>(systemId);
  if (!plan) return undefined;
  return { plan, createDefaultData: definition.createDefaultData };
}

export interface DraftThroughPlanParams {
  systemId: GameSystemId;
  prompt: string;
  pools: CharacterDraftCandidatePools;
  binding: CharacterDraftBinding;
  /** Pin the built document's id (seeded replay). Omit for a fresh uuid. */
  documentId?: string;
  /** Fixed clock for reproducible timestamps. Defaults to wall time. */
  now?: () => Date;
}

export interface DraftThroughPlanSeams {
  call?: GatewayCall;
  /** Deterministic document gate. Defaults to {@link validateDraftedDocument}. */
  validateDocument?: DocumentValidator;
}

/**
 * Draft ONE character against an already-resolved binding and pool set. Split
 * from {@link draftCharacterForSystem} so a caller drafting a whole party
 * resolves the registry and loads the catalogs once.
 */
export async function draftCharacterThroughPlan(
  params: DraftThroughPlanParams,
  seams: DraftThroughPlanSeams = {}
): Promise<CharacterDraftOutcome> {
  const { binding, documentId, now } = params;
  let unroutedIds: string[] = [];
  let accepted: CharacterDraftData | undefined;

  const result = await draftCharacterWithAi(
    { systemId: params.systemId, prompt: params.prompt, pools: params.pools },
    async (draft) => {
      // Apply through the system's OWN guided-creation plan (its template
      // applicators), exactly as the wizard does. No per-system branch here.
      const built = await buildDocumentFromPlanIds(
        binding.plan,
        binding.createDefaultData,
        draft.name,
        draftOptionIds(draft),
        now
      );
      unroutedIds = built.unrouted;
      accepted = draft;
      return documentId ? { ...built.document, id: documentId } : built.document;
    },
    seams.validateDocument ?? validateDraftedDocument,
    seams.call ? { call: seams.call } : {}
  );

  if (!result.ok) {
    return { ok: false, error: result.error, ...(result.issues ? { issues: result.issues } : {}) };
  }
  return {
    ok: true,
    proposal: {
      document: result.document,
      ...(result.rationale ? { rationale: result.rationale } : {}),
      choices: accepted ? describeDraftChoices(accepted, params.pools, unroutedIds) : [],
    },
  };
}

export interface DraftForSystemSeams extends DraftThroughPlanSeams {
  loadPools?: (systemId: GameSystemId) => Promise<CharacterDraftCandidatePools>;
  resolveBinding?: (systemId: GameSystemId) => Promise<CharacterDraftBinding | undefined>;
  poolLimit?: number;
}

/**
 * Draft a single character for a system, end to end: resolve the system's
 * creation plan, load its candidate pools, ask the model, and gate the built
 * document through the deterministic validator. Returns a proposal to REVIEW,
 * never a persisted character.
 */
export async function draftCharacterForSystem(
  params: { systemId: GameSystemId; prompt: string },
  seams: DraftForSystemSeams = {}
): Promise<CharacterDraftOutcome> {
  const { systemId } = params;
  const resolveBinding = seams.resolveBinding ?? resolveCharacterDraftBinding;
  const limitPerPool = seams.poolLimit ?? DEFAULT_CHARACTER_DRAFT_POOL_LIMIT;
  const loadPools = seams.loadPools ?? ((id) => loadCharacterDraftPools(id, { limitPerPool }));

  let binding: CharacterDraftBinding | undefined;
  let pools: CharacterDraftCandidatePools;
  try {
    binding = await resolveBinding(systemId);
    if (!binding) {
      return {
        ok: false,
        error: `'${systemId}' has no guided-creation plan, so a drafted character cannot be built through its own creation path. Build this one manually instead.`,
      };
    }
    pools = await loadPools(systemId);
  } catch {
    // A catalog that fails to load is a degraded AI affordance, never a broken
    // creation surface — the manual path is untouched.
    return {
      ok: false,
      error:
        'Could not load this system’s option catalogs, so no draft was requested. Build this character manually instead.',
    };
  }

  return draftCharacterThroughPlan({ ...params, pools, binding }, seams);
}
