import { describe, expect, it } from 'vitest';
import {
  buildEncounterDraftPrompt,
  buildIdentifyCreaturePrompt,
  buildIllustrateScenePrompt,
  buildPromptForTask,
  buildSceneNarrationPrompt,
} from '../../ai/prompts';
import type { EncounterDraftPayload, IdentifyCreaturePayload } from '../../ai/contracts';

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

describe('buildSceneNarrationPrompt', () => {
  it('embeds the facts and forbids invention', () => {
    const prompt = buildSceneNarrationPrompt({ facts: 'Combat: defeated the ogre.' });
    expect(prompt).toContain('Combat: defeated the ogre.');
    expect(prompt).toMatch(/use ONLY the facts/i);
    expect(prompt).toMatch(/do not invent/i);
  });

  it('includes the tone only when supplied', () => {
    expect(buildSceneNarrationPrompt({ facts: 'x' })).not.toMatch(/tone/i);
    expect(buildSceneNarrationPrompt({ facts: 'x', tone: 'gritty' })).toMatch(/gritty tone/i);
  });
});

describe('buildIdentifyCreaturePrompt', () => {
  const visionPayload: IdentifyCreaturePayload = {
    systemId: 'dnd-5e-2024',
    candidates: [
      { id: 'goblin', name: 'Goblin', challengeRating: 0.25 },
      { id: 'ogre', name: 'Ogre' },
    ],
    image: { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
  };

  it('references the attached image, the candidate ids, and confidence', () => {
    const prompt = buildIdentifyCreaturePrompt(visionPayload);
    expect(prompt).toMatch(/attached image/i);
    expect(prompt).toContain('goblin (Goblin, CR 0.25)');
    expect(prompt).toContain('ogre (Ogre)');
    expect(prompt).toMatch(/confidence/i);
  });

  it('includes the hint only when supplied', () => {
    expect(buildIdentifyCreaturePrompt(visionPayload)).not.toMatch(/hint from the user/i);
    expect(buildIdentifyCreaturePrompt({ ...visionPayload, hint: 'the green one' })).toMatch(
      /the green one/
    );
  });
});

describe('buildIllustrateScenePrompt', () => {
  it('includes the prompt and a genre anchor; folds in the style when given', () => {
    const plain = buildIllustrateScenePrompt({ prompt: 'a torchlit crypt' });
    expect(plain).toContain('a torchlit crypt');
    expect(plain).toMatch(/tabletop RPG illustration/i);
    expect(plain).not.toMatch(/style/i);
    expect(buildIllustrateScenePrompt({ prompt: 'a crypt', style: 'ink' })).toMatch(/ink style/i);
  });
});

describe('buildPromptForTask', () => {
  it('dispatches encounter-draft', () => {
    expect(buildPromptForTask('encounter-draft', payload)).toContain('combat encounter');
  });

  it('dispatches illustrate-scene', () => {
    expect(buildPromptForTask('illustrate-scene', { prompt: 'a dragon' })).toContain('a dragon');
  });

  it('dispatches scene-narration', () => {
    expect(buildPromptForTask('scene-narration', { facts: 'The ogre fell.' })).toContain(
      'The ogre fell.'
    );
  });

  it('dispatches identify-creature', () => {
    expect(
      buildPromptForTask('identify-creature', {
        systemId: 'dnd-5e-2024',
        candidates: [{ id: 'goblin', name: 'Goblin' }],
        image: { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
      })
    ).toMatch(/attached image/i);
  });
});
