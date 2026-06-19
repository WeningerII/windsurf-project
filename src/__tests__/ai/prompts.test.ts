import { describe, expect, it } from 'vitest';
import { buildEncounterDraftPrompt, buildPromptForTask } from '../../ai/prompts';
import type { EncounterDraftPayload } from '../../ai/contracts';

const payload: EncounterDraftPayload = {
  systemId: 'dnd-5e-2024',
  partyLevels: [3, 3, 4],
  difficulty: 'hard',
  prompt: 'a riverside ambush',
  candidates: [
    { id: 'goblin', name: 'Goblin', challengeRating: 0.25 },
    { id: 'bugbear', name: 'Bugbear' },
  ],
};

describe('buildEncounterDraftPrompt', () => {
  it('includes difficulty, party scale, the request, and the candidate ids', () => {
    const prompt = buildEncounterDraftPrompt(payload);
    expect(prompt).toContain('hard combat encounter');
    expect(prompt).toContain('level(s) 3, 3, 4');
    expect(prompt).toContain('a riverside ambush');
    expect(prompt).toContain('goblin (Goblin, CR 0.25)');
    expect(prompt).toContain('bugbear (Bugbear)');
    expect(prompt).toMatch(/do not invent creatures/i);
  });

  it('appends repair guidance only when prior issues are supplied', () => {
    expect(buildEncounterDraftPrompt(payload)).not.toMatch(/previous attempt was rejected/i);
    const repaired = buildEncounterDraftPrompt({
      ...payload,
      repairIssues: ['over budget by 200 XP', "unknown monster 'dragon'"],
    });
    expect(repaired).toMatch(/previous attempt was rejected/i);
    expect(repaired).toContain('over budget by 200 XP');
  });
});

describe('buildPromptForTask', () => {
  it('dispatches encounter-draft', () => {
    expect(buildPromptForTask('encounter-draft', payload)).toContain('combat encounter');
  });
});
