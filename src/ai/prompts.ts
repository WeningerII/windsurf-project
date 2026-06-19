/**
 * Per-task prompt builders. Pure and SDK-free so they're unit-testable and so
 * the server adapter stays a thin SDK call. Following RFC 002, a prompt sends
 * only compact, loader-derived context — candidate ids/labels, party scale, the
 * user's request — never large raw rules text, and instructs the model to pick
 * from the supplied ids rather than invent names.
 */
import type {
  AiTask,
  EncounterDraftPayload,
  IdentifyCreaturePayload,
  SceneNarrationPayload,
} from './contracts';

export function buildPromptForTask(task: AiTask, payload: unknown): string {
  switch (task) {
    case 'encounter-draft':
      return buildEncounterDraftPrompt(payload as EncounterDraftPayload);
    case 'scene-narration':
      return buildSceneNarrationPrompt(payload as SceneNarrationPayload);
    case 'identify-creature':
      return buildIdentifyCreaturePrompt(payload as IdentifyCreaturePayload);
    default:
      throw new Error(`No prompt builder for task '${task}'.`);
  }
}

export function buildEncounterDraftPrompt(payload: EncounterDraftPayload): string {
  const roster = payload.candidates
    .map((candidate) => {
      const cr = candidate.challengeRating !== undefined ? `, CR ${candidate.challengeRating}` : '';
      return `- ${candidate.id} (${candidate.name}${cr})`;
    })
    .join('\n');
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
  const roster = payload.candidates
    .map((candidate) => {
      const cr = candidate.challengeRating !== undefined ? `, CR ${candidate.challengeRating}` : '';
      return `- ${candidate.id} (${candidate.name}${cr})`;
    })
    .join('\n');
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
