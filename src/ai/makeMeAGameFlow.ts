/**
 * "Make me a game" — the join flow that composes the shipped AI, creation, and
 * scene pieces into ONE seeded path from a prompt to a playable table:
 * a drafted party, a drafted encounter, and a scene with everyone on the grid
 * and initiative rolled.
 *
 * It ORCHESTRATES; it does not re-implement. Every step is an existing module:
 *
 * | step            | drafted by                        | decided by                              | applied by                                  |
 * | --------------- | --------------------------------- | --------------------------------------- | ------------------------------------------- |
 * | party           | `characterDraftFlow`              | `registry.validateDocument` (per system) | `creation/draftDocument` + the system's plan |
 * | encounter       | `encounterDraftFlow`              | `scene/encounterSpec` budget gate       | `scene/encounterBuilder`                    |
 * | scene           | — (deterministic)                 | `scene/runtime` intent validation       | `resolveSceneAction` + `appendSceneEvent`   |
 *
 * RFC 002's governing rule holds end to end: **the model proposes, deterministic
 * validators decide.** No AI output reaches a document, a scene, or storage
 * without passing the same validator a manual edit passes. Nothing here writes
 * to storage at all — the flow returns documents and a scene for the caller to
 * review and persist through its normal paths.
 *
 * All seven systems are handled by the SAME code, parameterized over the
 * registry: there is no per-system branch in this file. Where a system genuinely
 * cannot do a step (no cited encounter-budget model, no monster catalog, no
 * loader-driven creation steps) the flow records a per-system reason in
 * `steps[]` / `unroutedIds` and continues — it never substitutes another
 * system's data and never silently pretends the step happened.
 *
 * Bounded by construction: every gateway call in the flow — including the draft
 * flows' own bounded repairs — is metered against ONE {@link FlowBudget}, so the
 * WHOLE flow has a cost and attempt ceiling, not just each call.
 *
 * Default-off posture is inherited unchanged: with `VITE_AI_ENABLED` off or no
 * server key, the gateway answers `provider-not-configured`, the drafting steps
 * fail closed, and deterministic creation and scene building remain fully
 * available through their own surfaces.
 */
import { draftCharacterWithAi, type DocumentValidator } from './characterDraftFlow';
import { loadCharacterDraftPools } from './characterDraftPools';
import { draftEncounterWithAi } from './encounterDraftFlow';
import {
  createFlowBudget,
  DEFAULT_MAKE_GAME_FLOW_BUDGET,
  type AnyTaskGatewayCall,
  type FlowBudget,
  type FlowBudgetReport,
} from './flowBudget';
import { callAiGateway } from './gatewayClient';
import type {
  CharacterDraftCandidatePools,
  CharacterDraftData,
  EncounterDraftSelection,
} from './contracts';
import { buildDocumentFromPlanIds } from '../creation/draftDocument';
import type { CreationPlan } from '../creation/types';
import { systemRegistry } from '../registry';
import {
  buildEncounterSceneEvents,
  summarizeEncounterParty,
  MAX_MONSTERS_PER_SELECTION,
} from '../scene/encounterBuilder';
import { supportsEncounterBudget, type EncounterDifficulty } from '../scene/encounterDraft';
import { validateEncounterSpec, type EncounterSpecIssue } from '../scene/encounterSpec';
import { appendSceneEvent, createSceneDocument, resolveSceneAction } from '../scene/runtime';
import { buildPlacedToken } from '../scene/tokenPlacement';
import { loadMonstersForSystem } from '../utils/dataLoader';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Monster } from '../types/creatures/monsters';
import type { SceneDocument } from '../types/core/scene';
import type { GameSystemId } from '../types/game-systems';

/** One character the caller wants drafted. */
export interface MakeGamePartyMemberRequest {
  /** Free-text concept, e.g. "a cautious healer who used to be a soldier". */
  prompt: string;
}

export interface MakeGameParams {
  systemId: GameSystemId;
  /**
   * Drives EVERY seeded choice in the flow: document ids, scene id, token ids,
   * event ids, monster placement, and initiative. Same seed + same recorded
   * gateway transcript ⇒ the same game, byte for byte.
   */
  seed: string;
  sceneName?: string;
  /** One entry per character to draft (an empty party skips the party step). */
  party: readonly MakeGamePartyMemberRequest[];
  /** Omit to build a party and an empty scene with no fight in it. */
  encounter?: { prompt: string; difficulty: EncounterDifficulty };
}

export type MakeGameStepId = 'party' | 'encounter' | 'scene';

/** Per-step outcome. A `skipped` step always carries an honest, specific reason. */
export interface MakeGameStepOutcome {
  step: MakeGameStepId;
  status: 'applied' | 'skipped' | 'failed';
  reason?: string;
}

export interface MakeGameCharacter {
  document: CharacterDocument<SystemDataModel>;
  rationale?: string;
  /**
   * Ids the model legally chose from this system's candidate pools that the
   * system's guided-creation plan has NO step to apply (e.g. Daggerheart offers
   * class/ancestry/community pools but declares no loader-driven creation steps
   * yet). Reported, never silently discarded.
   */
  unroutedIds: string[];
}

export interface MakeGameEncounter {
  selections: EncounterDraftSelection[];
  rationale?: string;
  /** Budget headroom from the deterministic gate that accepted the draft. */
  budget: number;
  totalXp: number;
  /** Non-blocking (warning-severity) notes the gate raised. */
  warnings: EncounterSpecIssue[];
}

export interface MakeGameResult {
  /** True when at least one step applied and no step failed. */
  ok: boolean;
  systemId: GameSystemId;
  party: MakeGameCharacter[];
  encounter?: MakeGameEncounter;
  /** The built scene, with party + monster tokens placed and initiative set. */
  scene?: SceneDocument;
  steps: MakeGameStepOutcome[];
  errors: string[];
  /** Whole-flow spend against the cap (see {@link FlowBudget}). */
  budget: FlowBudgetReport;
}

/** The registry-derived pieces the party step needs for a system. */
export interface MakeGameSystemBinding {
  plan: CreationPlan<SystemDataModel>;
  createDefaultData: () => SystemDataModel;
}

export interface MakeGameSeams {
  /** Gateway call. Defaults to the browser client (default-off, key-less safe). */
  call?: AnyTaskGatewayCall;
  /** Whole-flow meter. Defaults to {@link DEFAULT_MAKE_GAME_FLOW_BUDGET}. */
  budget?: FlowBudget;
  loadPools?: (systemId: GameSystemId) => Promise<CharacterDraftCandidatePools>;
  loadMonsters?: (systemId: GameSystemId) => Promise<Monster[]>;
  /** Resolve a system's creation plan + default data from the registry. */
  resolveSystem?: (systemId: GameSystemId) => Promise<MakeGameSystemBinding | undefined>;
  /** Deterministic document gate. Defaults to `registry.validateDocument`. */
  validateDocument?: DocumentValidator;
  /** Wall clock for document/scene/event timestamps. */
  now?: () => Date;
  /** Cap per candidate-pool category (keeps the drafting prompt bounded). */
  poolLimit?: number;
}

/** Cap per candidate-pool category offered to the model. */
const DEFAULT_POOL_LIMIT = 32;

/**
 * The registry validator, filtered to BLOCKING issues. Identical to the gate the
 * shipped character-draft surface uses, routed by `document.systemId`, so every
 * system's own rules decide its own drafts.
 */
const defaultValidateDocument: DocumentValidator = async (document) => {
  const { issues } = await systemRegistry.validateDocument(document, { reason: 'ai-draft' });
  return issues.filter((issue) => issue.severity === 'error');
};

const defaultResolveSystem = async (
  systemId: GameSystemId
): Promise<MakeGameSystemBinding | undefined> => {
  const definition = systemRegistry.get(systemId);
  if (!definition) return undefined;
  const plan = await systemRegistry.getCreationPlan<SystemDataModel>(systemId);
  if (!plan) return undefined;
  return { plan, createDefaultData: definition.createDefaultData };
};

/** Every option id a character draft chose, in a stable order. */
function draftOptionIds(draft: CharacterDraftData): string[] {
  return [
    ...(draft.classId ? [draft.classId] : []),
    ...(draft.ancestryId ? [draft.ancestryId] : []),
    ...(draft.backgroundId ? [draft.backgroundId] : []),
    ...(draft.featIds ?? []),
    ...(draft.spellIds ?? []),
  ];
}

export async function makeMeAGame(
  params: MakeGameParams,
  seams: MakeGameSeams = {}
): Promise<MakeGameResult> {
  const { systemId } = params;
  const budget = seams.budget ?? createFlowBudget(DEFAULT_MAKE_GAME_FLOW_BUDGET);
  const call = budget.meter(seams.call ?? (callAiGateway as AnyTaskGatewayCall));
  const limitPerPool = seams.poolLimit ?? DEFAULT_POOL_LIMIT;
  const loadPools = seams.loadPools ?? ((id) => loadCharacterDraftPools(id, { limitPerPool }));
  const loadMonsters = seams.loadMonsters ?? loadMonstersForSystem;
  const resolveSystem = seams.resolveSystem ?? defaultResolveSystem;
  const validateDocument = seams.validateDocument ?? defaultValidateDocument;
  const now = seams.now ?? (() => new Date());

  const steps: MakeGameStepOutcome[] = [];
  const errors: string[] = [];

  const party = await draftParty(params, {
    call,
    loadPools,
    resolveSystem,
    validateDocument,
    steps,
    errors,
  });

  const encounter = await draftEncounter(params, party, {
    call,
    loadMonsters,
    steps,
    errors,
  });

  const scene = buildScene(params, party, encounter.selections, encounter.monsters, {
    now,
    steps,
    errors,
  });

  return {
    ok: errors.length === 0 && steps.some((step) => step.status === 'applied'),
    systemId,
    party,
    ...(encounter.result ? { encounter: encounter.result } : {}),
    ...(scene ? { scene } : {}),
    steps,
    errors,
    budget: budget.report(),
  };
}

// --- step 1: party ---------------------------------------------------------

async function draftParty(
  params: MakeGameParams,
  ctx: {
    call: AnyTaskGatewayCall;
    loadPools: (systemId: GameSystemId) => Promise<CharacterDraftCandidatePools>;
    resolveSystem: (systemId: GameSystemId) => Promise<MakeGameSystemBinding | undefined>;
    validateDocument: DocumentValidator;
    steps: MakeGameStepOutcome[];
    errors: string[];
  }
): Promise<MakeGameCharacter[]> {
  const { systemId, seed } = params;
  if (params.party.length === 0) {
    ctx.steps.push({
      step: 'party',
      status: 'skipped',
      reason: 'No party members were requested.',
    });
    return [];
  }

  const binding = await ctx.resolveSystem(systemId);
  if (!binding) {
    ctx.steps.push({
      step: 'party',
      status: 'skipped',
      reason: `'${systemId}' is not registered with a guided-creation plan, so a drafted character cannot be built through its own creation path.`,
    });
    return [];
  }

  const pools = await ctx.loadPools(systemId);
  const party: MakeGameCharacter[] = [];

  for (const [index, request] of params.party.entries()) {
    let unroutedIds: string[] = [];
    const result = await draftCharacterWithAi(
      { systemId, prompt: request.prompt, pools },
      async (draft) => {
        // Apply through the system's OWN guided-creation plan (its template
        // applicators), exactly as the wizard does. No per-system branch here.
        const built = await buildDocumentFromPlanIds(
          binding.plan,
          binding.createDefaultData,
          draft.name,
          draftOptionIds(draft)
        );
        unroutedIds = built.unrouted;
        // Seeded, stable document id so the same seed rebuilds the same game.
        return { ...built.document, id: `${seed}:pc:${index + 1}` };
      },
      ctx.validateDocument,
      { call: ctx.call }
    );

    if (!result.ok) {
      ctx.errors.push(`Party member ${index + 1}: ${result.error}`);
      continue;
    }
    party.push({
      document: result.document,
      ...(result.rationale ? { rationale: result.rationale } : {}),
      unroutedIds,
    });
  }

  if (party.length === 0) {
    ctx.steps.push({
      step: 'party',
      status: 'failed',
      reason: 'No party member survived deterministic validation.',
    });
    return [];
  }
  ctx.steps.push({
    step: 'party',
    status: 'applied',
    reason: `${party.length} of ${params.party.length} drafted characters passed the ${systemId} validator.`,
  });
  return party;
}

// --- step 2: encounter -----------------------------------------------------

async function draftEncounter(
  params: MakeGameParams,
  party: MakeGameCharacter[],
  ctx: {
    call: AnyTaskGatewayCall;
    loadMonsters: (systemId: GameSystemId) => Promise<Monster[]>;
    steps: MakeGameStepOutcome[];
    errors: string[];
  }
): Promise<{
  selections: EncounterDraftSelection[];
  monsters: Monster[];
  result?: MakeGameEncounter;
}> {
  const { systemId } = params;
  const skip = (reason: string) => {
    ctx.steps.push({ step: 'encounter', status: 'skipped', reason });
    return { selections: [], monsters: [] };
  };

  if (!params.encounter) return skip('No encounter was requested.');
  // Honest per-system capability, from the single source of truth the drafter
  // and the spec validator already share — never a fallback to another system.
  if (!supportsEncounterBudget(systemId)) {
    return skip(
      `'${systemId}' has no cited encounter-budget model in this repo (see ENCOUNTER_BUDGET_SYSTEMS in src/scene/encounterDraft.ts), so an encounter cannot be sized or deterministically validated for it. The party and scene were still built.`
    );
  }

  const monsters = await ctx.loadMonsters(systemId);
  if (monsters.length === 0) {
    return skip(`'${systemId}' has no loader-backed creature catalog to draft an encounter from.`);
  }

  const partyLevels = summarizeEncounterParty(party.map((member) => member.document)).members.map(
    (member) => member.level
  );
  if (partyLevels.length === 0) {
    return skip(
      `No drafted ${systemId} character exposes a level, so the encounter budget cannot be sized.`
    );
  }

  const { prompt, difficulty } = params.encounter;
  const spec = (selections: EncounterDraftSelection[]) =>
    validateEncounterSpec({ systemId, difficulty, partyLevels, selections }, { monsters });

  const result = await draftEncounterWithAi(
    {
      systemId,
      partyLevels,
      difficulty,
      prompt,
      candidates: monsters.map((monster) => ({
        id: monster.id,
        name: monster.name,
        challengeRating: monster.challengeRating,
      })),
    },
    // The SAME deterministic gate the manual encounter panel uses.
    (selections) =>
      spec(selections)
        .issues.filter((issue) => issue.severity === 'error')
        .map((issue) => issue.message),
    { call: ctx.call }
  );

  if (!result.ok) {
    ctx.errors.push(`Encounter: ${result.error}`);
    ctx.steps.push({ step: 'encounter', status: 'failed', reason: result.error });
    return { selections: [], monsters };
  }

  const selections = result.selections.map((selection) => ({
    monsterId: selection.monsterId,
    count: Math.min(MAX_MONSTERS_PER_SELECTION, selection.count),
  }));
  const validation = spec(selections);
  ctx.steps.push({
    step: 'encounter',
    status: 'applied',
    reason: `${selections.length} accepted selection(s) spending ${validation.totalXp} of a ${validation.budget} ${difficulty} budget.`,
  });
  return {
    selections,
    monsters,
    result: {
      selections,
      ...(result.rationale ? { rationale: result.rationale } : {}),
      budget: validation.budget,
      totalXp: validation.totalXp,
      warnings: validation.issues.filter((issue) => issue.severity === 'warning'),
    },
  };
}

// --- step 3: scene ---------------------------------------------------------

function buildScene(
  params: MakeGameParams,
  party: MakeGameCharacter[],
  selections: EncounterDraftSelection[],
  monsters: Monster[],
  ctx: { now: () => Date; steps: MakeGameStepOutcome[]; errors: string[] }
): SceneDocument | undefined {
  const { systemId, seed } = params;
  if (party.length === 0 && selections.length === 0) {
    ctx.steps.push({
      step: 'scene',
      status: 'skipped',
      reason: 'Nothing was drafted to put in a scene.',
    });
    return undefined;
  }

  const createdAt = ctx.now();
  let scene = createSceneDocument({
    id: `${seed}:scene`,
    name: params.sceneName?.trim() || 'A New Game',
    systemId,
    seed,
    now: createdAt,
  });

  // Party tokens go on through the SAME intent → validate → event path a GM's
  // click uses; a rejected placement is a recorded issue, never a direct write.
  party.forEach((member, index) => {
    const token = buildPlacedToken({
      position: { x: index, y: 0 },
      linkedDoc: member.document,
      nameInput: '',
      tokenKind: 'character',
      tokenAllegiance: 'party',
      idFactory: () => `${seed}:token:pc:${index + 1}`,
    });
    if (!token) return;
    const resolved = resolveSceneAction(
      scene,
      { type: 'place-token', token },
      { eventId: `${seed}:event:${scene.events.length + 1}`, createdAt }
    );
    if (!resolved.event) {
      ctx.errors.push(
        ...resolved.issues.map(
          (issue) => `Scene: could not place ${member.document.name}: ${issue.message}`
        )
      );
      return;
    }
    scene = appendSceneEvent(scene, resolved.event);
  });

  if (selections.length > 0) {
    // The SAME deterministic builder manual encounter application uses: it
    // places the monsters, rolls seeded initiative for everyone on the grid,
    // and returns typed events — it never mutates the scene itself.
    let nextEventOrdinal = scene.events.length;
    const built = buildEncounterSceneEvents({
      scene,
      monsters,
      selections,
      documents: party.map((member) => member.document),
      seed: `${seed}:encounter`,
      createdAt,
      eventIdFactory: () => {
        nextEventOrdinal += 1;
        return `${seed}:event:${nextEventOrdinal}`;
      },
    });
    if (built.issues.length > 0) {
      ctx.errors.push(...built.issues.map((issue) => `Scene: ${issue.message}`));
      ctx.steps.push({
        step: 'scene',
        status: 'failed',
        reason: 'The encounter could not be placed on the grid.',
      });
      return scene;
    }
    for (const event of built.events) scene = appendSceneEvent(scene, event);
  }

  ctx.steps.push({
    step: 'scene',
    status: 'applied',
    reason: `${scene.events.length} validated scene event(s) applied.`,
  });
  return scene;
}
