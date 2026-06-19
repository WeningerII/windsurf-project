/**
 * Per-task prompt builders. Pure and SDK-free so they're unit-testable and so
 * the server adapter stays a thin SDK call. Following RFC 002, a prompt sends
 * only compact, loader-derived context — candidate ids/labels, party scale, the
 * user's request — never large raw rules text, and instructs the model to pick
 * from the supplied ids rather than invent names.
 */
import type { AiTask, EncounterDraftPayload } from './contracts';

export function buildPromptForTask(task: AiTask, payload: unknown): string {
  switch (task) {
    case 'encounter-draft':
      return buildEncounterDraftPrompt(payload as EncounterDraftPayload);
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
