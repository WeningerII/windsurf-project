/**
 * Per-task prompt builders. Pure and SDK-free so they're unit-testable and so
 * the server adapter stays a thin SDK call. Following RFC 002, a prompt sends
 * only compact, loader-derived context — candidate ids/labels, party scale, the
 * user's request — never large raw rules text, and instructs the model to pick
 * from the supplied ids rather than invent names.
 */
import {
  CHARACTER_DRAFT_POOL_KEYS,
  type AiTask,
  type CharacterDraftCandidate,
  type CharacterDraftPayload,
  type EncounterDraftCandidate,
  type EncounterDraftPayload,
  type AnalyzeMapPayload,
  type DmTurnIntentPayload,
  type IdentifyCreaturePayload,
  type NarrationCritiquePayload,
  type IllustrateScenePayload,
  type SceneNarrationPayload,
} from './contracts';

/**
 * Prompt-template versions (Phase 14 observability). Every task's template
 * carries an explicit version that the gateway stamps into the structured log
 * record and the response metadata (`usage.promptVersion`), so a trace always
 * says WHICH template produced an output. Bump the version whenever the
 * corresponding builder's wording changes — the template-fingerprint test in
 * `src/__tests__/ai/prompts.test.ts` fails if a template changes without a bump.
 */
export const AI_PROMPT_VERSIONS = {
  'encounter-draft': 'encounter-draft.v1',
  'scene-narration': 'scene-narration.v1',
  'identify-creature': 'identify-creature.v1',
  'illustrate-scene': 'illustrate-scene.v1',
  'character-draft': 'character-draft.v1',
  'analyze-map': 'analyze-map.v1',
  'narration-critique': 'narration-critique.v1',
  'dm-turn-intent': 'dm-turn-intent.v1',
} as const satisfies Record<AiTask, string>;

/** The template version for a task (total over the allowlist by construction). */
export function promptVersionForTask(task: AiTask): string {
  return AI_PROMPT_VERSIONS[task];
}

/** Compact one-per-line roster of candidate ids the model must choose among. */
function formatCandidateRoster(candidates: EncounterDraftCandidate[]): string {
  return candidates
    .map((candidate) => {
      const cr = candidate.challengeRating !== undefined ? `, CR ${candidate.challengeRating}` : '';
      return `- ${candidate.id} (${candidate.name}${cr})`;
    })
    .join('\n');
}

export function buildPromptForTask(task: AiTask, payload: unknown): string {
  switch (task) {
    case 'encounter-draft':
      return buildEncounterDraftPrompt(payload as EncounterDraftPayload);
    case 'scene-narration':
      return buildSceneNarrationPrompt(payload as SceneNarrationPayload);
    case 'identify-creature':
      return buildIdentifyCreaturePrompt(payload as IdentifyCreaturePayload);
    case 'illustrate-scene':
      return buildIllustrateScenePrompt(payload as IllustrateScenePayload);
    case 'character-draft':
      return buildCharacterDraftPrompt(payload as CharacterDraftPayload);
    case 'analyze-map':
      return buildAnalyzeMapPrompt(payload as AnalyzeMapPayload);
    case 'narration-critique':
      return buildNarrationCritiquePrompt(payload as NarrationCritiquePayload);
    case 'dm-turn-intent':
      return buildDmTurnIntentPrompt(payload as DmTurnIntentPayload);
    default:
      throw new Error(`No prompt builder for task '${task}'.`);
  }
}

export function buildEncounterDraftPrompt(payload: EncounterDraftPayload): string {
  const roster = formatCandidateRoster(payload.candidates);
  const party = payload.partyLevels.length
    ? `a party of ${payload.partyLevels.length} at level(s) ${payload.partyLevels.join(', ')}`
    : 'an unspecified party';
  const repair =
    payload.repairIssues && payload.repairIssues.length > 0
      ? `\n\nYour previous attempt was rejected for these reasons:\n${payload.repairIssues
          .map((issue) => `- ${issue}`)
          .join('\n')}\nReturn a corrected encounter that resolves them.`
      : '';

  return [
    `Design a ${payload.difficulty} combat encounter for ${party}.`,
    ``,
    `Request: ${payload.prompt}`,
    ``,
    `Choose only from these creatures, using the exact id shown:`,
    roster,
    ``,
    `Return the chosen creatures and how many of each. Every monsterId MUST be one of the ids above; do not invent creatures.${repair}`,
  ].join('\n');
}

export function buildIdentifyCreaturePrompt(payload: IdentifyCreaturePayload): string {
  const roster = formatCandidateRoster(payload.candidates);
  const hint = payload.hint ? `\n\nHint from the user: ${payload.hint}` : '';
  return [
    `Look at the attached image and decide which of the following creatures it best depicts.`,
    `Choose exactly one, using the exact id shown. If none is a good match, pick the closest`,
    `and report low confidence (0 to 1).`,
    ``,
    `Creatures:`,
    roster,
    ``,
    `Return the chosen monsterId (one of the ids above), a confidence from 0 to 1, and a brief reason.${hint}`,
  ].join('\n');
}

export function buildIllustrateScenePrompt(payload: IllustrateScenePayload): string {
  const style = payload.style ? `, ${payload.style} style` : '';
  // Image models take a single descriptive line; keep it focused and add a
  // genre anchor so results read as tabletop RPG art.
  // Genre-neutral anchor: the panel serves every system's scenes (M&M is
  // superhero, not fantasy), and no systemId rides the payload to specialize.
  return `${payload.prompt.trim()}${style}. Tabletop RPG illustration, high detail, no text or watermarks.`;
}

/** Compact one-per-line roster for a character-draft option pool. */
function formatOptionRoster(candidates: CharacterDraftCandidate[]): string {
  return candidates.map((candidate) => `- ${candidate.id} (${candidate.name})`).join('\n');
}

export function buildCharacterDraftPrompt(payload: CharacterDraftPayload): string {
  // Only offer pools the system actually populates, using the stable key order.
  const pools = CHARACTER_DRAFT_POOL_KEYS.filter((key) => payload.pools[key].length > 0).map(
    (key) => `${key}:\n${formatOptionRoster(payload.pools[key])}`
  );
  const rosters = pools.length > 0 ? pools.join('\n\n') : '(this system uses no id-based options)';
  const repair =
    payload.repairIssues && payload.repairIssues.length > 0
      ? `\n\nYour previous attempt was rejected for these reasons:\n${payload.repairIssues
          .map((issue) => `- ${issue}`)
          .join('\n')}\nReturn a corrected character that resolves them.`
      : '';

  return [
    `Draft a tabletop RPG character for the ${payload.systemId} system.`,
    ``,
    `Request: ${payload.prompt}`,
    ``,
    `Choose only from these options, using the exact id shown:`,
    rosters,
    ``,
    `Return a character name and the chosen ids (classId, ancestryId, backgroundId,` +
      ` and any featIds/spellIds). Every id MUST be one of the ids above; do not invent` +
      ` options. Omit a field when the system does not use it.${repair}`,
  ].join('\n');
}

export function buildSceneNarrationPrompt(payload: SceneNarrationPayload): string {
  const tone = payload.tone ? ` in a ${payload.tone} tone` : '';
  return [
    `Retell the following tabletop session facts as a short, vivid prose recap${tone}.`,
    `Write one or two paragraphs in the past tense for the group's session log.`,
    ``,
    `Rules: use ONLY the facts below. Do not invent characters, monsters, places,`,
    `outcomes, or events that are not stated. Do not add dialogue or motivations`,
    `not implied by the facts. If the facts are sparse, keep the recap brief.`,
    ``,
    `Facts:`,
    payload.facts,
  ].join('\n');
}

/**
 * The ADVISORY second pass. Two things this template deliberately does NOT ask
 * for: a score, and a verdict. Scores over prose are invented precision, and the
 * verdict belongs to `checkNarrationAgainstFacts`. It asks only for spans plus a
 * reason, because a span is the one part of a model critique the flow can check
 * — a quote that is not verbatim in the narration is discarded there.
 */
export function buildNarrationCritiquePrompt(payload: NarrationCritiquePayload): string {
  return [
    `You are reviewing a session recap that was written from a fixed set of facts.`,
    `Find statements in the recap that the facts do not support: people, creatures,`,
    `places, events, outcomes or numbers that are asserted but not stated in the facts.`,
    ``,
    `For each one, quote the offending span EXACTLY as it appears in the recap and say`,
    `in one line what the facts do not support. Quote nothing you did not copy from the`,
    `recap verbatim. Report no findings if every statement is supported. Do not comment`,
    `on style, tone or pacing, and do not rewrite the recap.`,
    ``,
    `Facts:`,
    payload.facts,
    ``,
    `Recap:`,
    payload.narrative,
  ].join('\n');
}

export function buildAnalyzeMapPrompt(payload: AnalyzeMapPayload): string {
  const { widthPx, heightPx } = payload.imageSize;
  const hint = payload.hint ? `\n\nHint from the user: ${payload.hint}` : '';
  // Every coordinate is asked for in IMAGE PIXELS, the same space the shipped
  // manual registration already uses, so an accepted proposal and a hand-dialed
  // one are the same kind of value. The vocabularies below are the validator's
  // (`src/scene/gridGeometryProposal.ts`); a proposal outside them is rejected
  // there rather than being quietly coerced here.
  return [
    `Look at the attached top-down tabletop battle map, which is ${widthPx} by ${heightPx} pixels.`,
    ``,
    `First, locate the square grid. Report where cell (0,0)'s top-left corner sits, as`,
    `offsetX/offsetY in image pixels, plus cellSizePx — the width of one cell in image pixels.`,
    `Keep each offset within one cell (0 <= offset < cellSizePx). If the map has no drawn grid,`,
    `infer a cell size from the scale of doors, tiles and furniture.`,
    ``,
    `Then list the notable regions as boxes, each an image-pixel rect {x, y, width, height}`,
    `with a kind and an optional label:`,
    `- "spawn"   — open areas where a group could start. No preset.`,
    `- "terrain" — ground that changes movement. suggestedPreset: "difficult", "high-ground-1" or "none".`,
    `- "cover"   — walls, pillars, crates. suggestedPreset REQUIRED: "cover-2" (half) or "cover-5" (three-quarters).`,
    `- "hazard"  — pits, fire, spikes. No preset.`,
    ``,
    `Report only regions you can actually see. Fewer, accurate boxes are better than`,
    `speculative ones, and a box you are unsure of is worse than a box you omit.${hint}`,
  ].join('\n');
}

/**
 * The AI-DM turn prompt (RFC 007). Two properties are structural rather than
 * stylistic:
 *
 * 1. **It is written once, for every system.** The only system-specific thing it
 *    ever says is `payload.systemId` and whatever the caller put in the
 *    fold-derived facts and option labels. There is no rules vocabulary here, so
 *    a Daggerheart turn and a Pathfinder turn use the identical template.
 * 2. **It offers ids, not verbs.** The model is asked for `optionId`s from the
 *    supplied list; it is never told the names of scene intents, and an id it
 *    invents is rejected by `src/ai/dmTurn.ts` before any intent is built.
 */
export function buildDmTurnIntentPrompt(payload: DmTurnIntentPayload): string {
  const roster = payload.tokens.length
    ? payload.tokens
        .map(
          (token) =>
            `- ${token.name} (${token.allegiance}) at (${token.position.x}, ${token.position.y})`
        )
        .join('\n')
    : '- (no other tokens on the map)';
  const options = payload.options
    .map((option) => {
      const reach =
        option.verb === 'move' && option.maxDistance !== undefined
          ? ` [needs a destination within ${option.maxDistance} squares]`
          : '';
      return `- ${option.id}: ${option.label}${reach}`;
    })
    .join('\n');
  const repair =
    payload.repairIssues && payload.repairIssues.length > 0
      ? `\n\nYour previous attempt was rejected for these reasons:\n${payload.repairIssues
          .map((issue) => `- ${issue}`)
          .join('\n')}\nReturn corrected proposals that resolve them.`
      : '';

  return [
    `You are running one creature's turn in a ${payload.systemId} tabletop scene, in round ${payload.round}.`,
    ``,
    `Acting now: ${payload.actor.name} (${payload.actor.allegiance}) at (${payload.actor.position.x}, ${payload.actor.position.y}).`,
    ``,
    `Others on the map:`,
    roster,
    ``,
    `What has happened so far:`,
    payload.facts,
    ``,
    `Choose what this creature does, using only these option ids:`,
    options,
    ``,
    `Return proposals, each naming one optionId from the list above and, for a move,`,
    `a destination as integer grid coordinates. Do not invent option ids, do not name`,
    `actions that are not listed, and do not state damage, rolls or outcomes — the game`,
    `resolves those. Propose the fewest actions that make the turn sensible.${repair}`,
  ].join('\n');
}
