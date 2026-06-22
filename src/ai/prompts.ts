/**
 * Per-task prompt builders. Pure and SDK-free so they're unit-testable and so
 * the server adapter stays a thin SDK call. Following RFC 002, a prompt sends
 * only compact, loader-derived context — candidate ids/labels, party scale, the
 * user's request — never large raw rules text, and instructs the model to pick
 * from the supplied ids rather than invent names.
 */
import type {
  AiTask,
  EncounterDraftCandidate,
  EncounterDraftPayload,
  IdentifyCreaturePayload,
  IllustrateScenePayload,
  SceneNarrationPayload,
  StrategyHintsPayload,
} from './contracts';

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
    case 'strategy-hints':
      return buildStrategyHintsPrompt(payload as StrategyHintsPayload);
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
  return `${payload.prompt.trim()}${style}. Fantasy tabletop RPG illustration, high detail, no text or watermarks.`;
}

export function buildStrategyHintsPrompt(payload: StrategyHintsPayload): string {
  const roster = payload.combatants
    .map((c) => `- ${c.tokenId} (${c.name}, ${c.faction}, ${Math.round(c.hpFraction * 100)}% hp)`)
    .join('\n');
  const directive = payload.prompt ? `\n\nGM directive: ${payload.prompt}` : '';
  const repair =
    payload.repairIssues && payload.repairIssues.length > 0
      ? `\n\nYour previous attempt was rejected for these reasons:\n${payload.repairIssues
          .map((issue) => `- ${issue}`)
          .join('\n')}\nReturn corrected hints that resolve them.`
      : '';

  return [
    `You are the tactical strategist for the '${payload.side}' side in round ${payload.round} of a turn-based combat.`,
    `Advise which enemies each of your side's combatants should prioritise. You do NOT move or attack — a`,
    `deterministic engine does that; you only nudge target preference.`,
    ``,
    `Combatants (use the exact tokenId shown):`,
    roster,
    ``,
    `Return a list of hints. Each hint is { actorId, targetId, bias, reason }, where actorId is one of your`,
    `'${payload.side}' combatants, targetId is an enemy, and bias is roughly -100..100 (positive = focus this`,
    `target, negative = avoid). Only reference tokenIds from the list above; do not invent combatants. If you`,
    `have no special advice, return an empty list.${directive}${repair}`,
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
