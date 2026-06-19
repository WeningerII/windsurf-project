/**
 * Client orchestration for AI encounter drafting (RFC 002, MASTER_PLAN Phase 8).
 * The model proposes; deterministic validators decide. The flow:
 *   1. ask the gateway for selections (the model picks from candidate ids),
 *   2. reject any id outside the candidate pool,
 *   3. run the injected deterministic validator (the shipped encounter-spec gate),
 *   4. on issues, send them back for ONE bounded repair, else give up.
 * The accepted selections are handed back for the user to review and then build
 * through the SAME deterministic encounter builder a manual selection uses.
 */
import { callAiGateway } from './gatewayClient';
import type {
  AiResponse,
  EncounterDraftCandidate,
  EncounterDraftData,
  EncounterDraftSelection,
} from './contracts';

export interface DraftEncounterParams {
  systemId: string;
  partyLevels: number[];
  difficulty: string;
  prompt: string;
  candidates: EncounterDraftCandidate[];
}

export type DraftEncounterResult =
  | { ok: true; selections: EncounterDraftSelection[]; rationale?: string }
  | { ok: false; error: string };

/** Validate proposed selections; return error strings (empty array = valid). */
export type SelectionValidator = (selections: EncounterDraftSelection[]) => string[];

/** Injectable gateway call so the flow is unit-testable without a network. */
export type GatewayCall = <TData>(
  task: 'encounter-draft',
  payload: unknown
) => Promise<AiResponse<TData>>;

export async function draftEncounterWithAi(
  params: DraftEncounterParams,
  validate: SelectionValidator,
  options: { call?: GatewayCall; maxRepairs?: number } = {}
): Promise<DraftEncounterResult> {
  const call = options.call ?? (callAiGateway as GatewayCall);
  const maxRepairs = options.maxRepairs ?? 1;
  const candidateIds = new Set(params.candidates.map((candidate) => candidate.id));

  let repairIssues: string[] | undefined;
  for (let attempt = 0; attempt <= maxRepairs; attempt += 1) {
    const response = await call<EncounterDraftData>('encounter-draft', {
      systemId: params.systemId,
      partyLevels: params.partyLevels,
      difficulty: params.difficulty,
      prompt: params.prompt,
      candidates: params.candidates,
      ...(repairIssues ? { repairIssues } : {}),
    });
    if (!response.ok) return { ok: false, error: response.message };

    const { selections, rationale } = response.data;
    // The model must choose from the supplied pool — reject inventions first.
    const unknown = selections
      .filter((selection) => !candidateIds.has(selection.monsterId))
      .map((selection) => selection.monsterId);
    const issues =
      unknown.length > 0
        ? unknown.map((id) => `'${id}' is not one of the offered creatures; choose from the list.`)
        : validate(selections);

    if (issues.length === 0) {
      return { ok: true, selections, ...(rationale ? { rationale } : {}) };
    }
    repairIssues = issues;
  }

  return {
    ok: false,
    error: 'The AI could not produce a valid encounter. Adjust the request or build it manually.',
  };
}
