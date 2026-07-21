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
