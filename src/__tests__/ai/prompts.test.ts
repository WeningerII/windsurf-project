import { describe, expect, it } from 'vitest';
import {
  AI_PROMPT_VERSIONS,
  buildEncounterDraftPrompt,
  buildIdentifyCreaturePrompt,
  buildIllustrateScenePrompt,
  buildPromptForTask,
  buildSceneNarrationPrompt,
  promptVersionForTask,
} from '../../ai/prompts';
import { AI_GATEWAY_TASKS, type AiTask } from '../../ai/contracts';
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

describe('AI_PROMPT_VERSIONS (Phase 14 template versioning)', () => {
  it("covers every task with a '<task>.v<n>' version id", () => {
    for (const task of AI_GATEWAY_TASKS) {
      expect(promptVersionForTask(task)).toMatch(new RegExp(`^${task}\\.v\\d+$`));
    }
  });
});

/** FNV-1a 32-bit, hex — a tiny stable fingerprint for template text. */
function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/**
 * Fixed payloads exercising every optional branch of each template (repair
 * guidance, tone, hint, style), so any wording change shifts the fingerprint.
 */
const CANONICAL_PAYLOADS: Record<AiTask, unknown> = {
  'encounter-draft': {
    systemId: 'canonical-system',
    partyLevels: [1, 2],
    difficulty: 'moderate',
    prompt: 'canonical encounter request',
    candidates: [
      { id: 'alpha', name: 'Alpha', challengeRating: 1 },
      { id: 'beta', name: 'Beta' },
    ],
    repairIssues: ['canonical prior issue'],
  },
  'scene-narration': { facts: 'Canonical fact one. Canonical fact two.', tone: 'grim' },
  'identify-creature': {
    systemId: 'canonical-system',
    candidates: [
      { id: 'alpha', name: 'Alpha', challengeRating: 1 },
      { id: 'beta', name: 'Beta' },
    ],
    image: { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
    hint: 'canonical hint',
  },
  'illustrate-scene': { prompt: 'canonical illustration request', style: 'ink' },
};

/**
 * Template fingerprints, PINNED PER VERSION. When a builder's wording changes,
 * the hash here mismatches and this test fails — that is the version gate: bump
 * the task's entry in `AI_PROMPT_VERSIONS` and re-pin the fingerprint under the
 * NEW version key in the same change, so a template never silently drifts under
 * an old version id.
 */
const TEMPLATE_FINGERPRINTS: Record<string, string> = {
  'encounter-draft.v1': '32cca743',
  'scene-narration.v1': '1531d36e',
  'identify-creature.v1': '07f756fe',
  'illustrate-scene.v1': 'd34f4528',
};

describe('template fingerprints (change a template => bump its version)', () => {
  it('pins exactly the current version set — no stale or missing entries', () => {
    expect(Object.keys(TEMPLATE_FINGERPRINTS).sort()).toEqual(
      Object.values(AI_PROMPT_VERSIONS).sort()
    );
  });

  it.each(AI_GATEWAY_TASKS)('%s template matches its pinned fingerprint', (task) => {
    const version = AI_PROMPT_VERSIONS[task];
    expect(fnv1a(buildPromptForTask(task, CANONICAL_PAYLOADS[task]))).toBe(
      TEMPLATE_FINGERPRINTS[version]
    );
  });
});
