import { describe, expect, it } from 'vitest';
import type { SceneState, SceneToken } from '../../types/core/scene';
import {
  checkNarrationAgainstFacts,
  verdictFor,
  type NarrationCritiqueIssue,
} from '../../ai/narrationCritic';
import {
  narrationFactsFromScene,
  narrationFactsFromText,
  type NarrationFacts,
} from '../../ai/narrationFacts';

function token(id: string, name: string, current: number, max = 10): SceneToken {
  return { id, name, kind: 'monster', position: { x: 0, y: 0 }, size: 1, hp: { current, max } };
}

function makeState(overrides: Partial<SceneState> = {}): SceneState {
  return {
    sceneId: 's1',
    name: 'The Crypt',
    systemId: 'dnd-5e-2024',
    grid: { type: 'square', width: 6, height: 6, cellSize: 70 },
    tokens: {},
    markers: {},
    initiative: [],
    round: 1,
    seed: 'seed',
    checkLog: [],
    oracleLog: [],
    ...overrides,
  };
}

/** The shipped recap for a scene where the Goblin died and the Hero did not. */
const scene = makeState({
  round: 3,
  tokens: {
    a: token('a', 'Goblin', 0),
    b: token('b', 'Hero', 8),
  },
});
const facts: NarrationFacts = narrationFactsFromScene(scene);

function codes(issues: NarrationCritiqueIssue[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('narrationFactsFromScene', () => {
  it('carries the shipped recap text plus the structured facts behind it', () => {
    expect(facts.text).toContain('Combat: reached round 3; defeated Goblin.');
    expect([...facts.names].sort()).toEqual(['Goblin', 'Hero']);
    expect(facts.defeated).toEqual(['Goblin']);
    expect(facts.round).toBe(3);
  });

  it('accepts an explicit narrated text (an edited recap) over the derived one', () => {
    expect(narrationFactsFromScene(scene, { text: 'Something else.' }).text).toBe(
      'Something else.'
    );
  });
});

describe('checkNarrationAgainstFacts — supported prose passes', () => {
  it('accepts a retelling that stays inside the facts', () => {
    const critique = checkNarrationAgainstFacts(
      'The fight ran three rounds before it broke. By the end the Goblin lay dead on the stones.',
      facts
    );
    expect(critique.issues).toEqual([]);
    expect(critique.verdict).toBe('supported');
  });

  it('does not flag ordinary sentence-initial capitals', () => {
    const critique = checkNarrationAgainstFacts(
      'Steel rang. Then it stopped. Silence held the room. Goblin blood cooled on the floor.',
      facts
    );
    expect(codes(critique.issues)).toEqual([]);
  });
});

describe('checkNarrationAgainstFacts — deterministic refutations', () => {
  it('refutes a creature the facts never mention', () => {
    const critique = checkNarrationAgainstFacts(
      'The Goblin fell, and then a Beholder drifted out of the dark.',
      facts
    );
    expect(codes(critique.issues)).toContain('unsupported-name');
    expect(critique.verdict).toBe('refuted');
    const issue = critique.issues.find((i) => i.code === 'unsupported-name')!;
    expect(issue.message).toContain('Beholder');
    expect(issue.deterministic).toBe(true);
  });

  it('refutes a death the scene does not record', () => {
    const critique = checkNarrationAgainstFacts(
      'The Goblin fell. Moments later the Hero died beside it.',
      facts
    );
    expect(codes(critique.issues)).toContain('unrecorded-defeat');
    expect(critique.verdict).toBe('refuted');
    expect(critique.issues.find((i) => i.code === 'unrecorded-defeat')!.message).toContain('Hero');
  });

  it('attributes a defeat term to the nearest name before it, not to the sentence', () => {
    // The Goblin IS recorded defeated; the Hero is not, and is not the subject.
    const clean = checkNarrationAgainstFacts('The Goblin fell while the Hero pressed on.', facts);
    expect(codes(clean.issues)).not.toContain('unrecorded-defeat');

    // Reverse the roles and the same sentence shape is refuted.
    const dirty = checkNarrationAgainstFacts('The Hero fell while the Goblin pressed on.', facts);
    expect(codes(dirty.issues)).toContain('unrecorded-defeat');
  });

  it('does not refute a true defeat because a shorter token name sits inside the subject', () => {
    // 'Goblin' is a substring of 'Goblin Chief'. A naive indexOf finds the live
    // 'Goblin' inside the dead 'Goblin Chief' and refutes a faithful report.
    const state = makeState({
      tokens: { a: token('a', 'Goblin Chief', 0), b: token('b', 'Goblin', 8) },
    });
    const critique = checkNarrationAgainstFacts(
      'The Goblin Chief fell to the blade.',
      narrationFactsFromScene(state)
    );
    expect(codes(critique.issues)).not.toContain('unrecorded-defeat');
    expect(critique.verdict).toBe('supported');
  });

  it('attributes a defeat the same way regardless of token insertion order', () => {
    // Same scene, same narration, keys inserted in the opposite order. If
    // attribution reads `Object.values(state.tokens)` order, the verdict flips.
    const forward = makeState({
      tokens: { a: token('a', 'Goblin Chief', 0), b: token('b', 'Goblin', 8) },
    });
    const reverse = makeState({
      tokens: { b: token('b', 'Goblin', 8), a: token('a', 'Goblin Chief', 0) },
    });
    const narrative = 'The Goblin Chief fell to the blade.';
    expect(checkNarrationAgainstFacts(narrative, narrationFactsFromScene(forward)).verdict).toBe(
      checkNarrationAgainstFacts(narrative, narrationFactsFromScene(reverse)).verdict
    );
  });

  it('does not treat a token name buried inside a longer word as a mention', () => {
    const state = makeState({ tokens: { a: token('a', 'Gob', 8) } });
    const critique = checkNarrationAgainstFacts(
      'The goblet fell from the table.',
      narrationFactsFromScene(state)
    );
    expect(codes(critique.issues)).not.toContain('unrecorded-defeat');
  });

  it('refutes a figure the facts do not state', () => {
    const critique = checkNarrationAgainstFacts(
      'The Goblin took 17 wounds before it fell in round 3.',
      facts
    );
    const issue = critique.issues.find((i) => i.code === 'unsupported-number')!;
    expect(issue.message).toContain('17');
    expect(critique.verdict).toBe('refuted');
    // '3' IS in the facts ("reached round 3"), so it is not flagged.
    expect(critique.issues.filter((i) => i.code === 'unsupported-number')).toHaveLength(1);
  });

  it('treats an empty narration as refuted rather than supported', () => {
    const critique = checkNarrationAgainstFacts('   ', facts);
    expect(critique.verdict).toBe('refuted');
    expect(codes(critique.issues)).toEqual(['empty-narration']);
  });
});

describe('checkNarrationAgainstFacts — graded, not binary', () => {
  it('marks a real scene name the recap never mentioned for review, not rejection', () => {
    // The Hero is a real token but the recap only names the defeated Goblin.
    expect(facts.text).not.toContain('Hero');
    const critique = checkNarrationAgainstFacts('The Goblin fell to the Hero.', facts);
    expect(codes(critique.issues)).toEqual(['off-facts-name']);
    expect(critique.verdict).toBe('needs-review');
  });

  it('flags a recorded defeat the narration silently dropped', () => {
    const critique = checkNarrationAgainstFacts('The fight ended in round 3.', facts);
    expect(codes(critique.issues)).toContain('omitted-defeat');
    expect(critique.verdict).toBe('needs-review');
  });
});

describe('checkNarrationAgainstFacts — honest about its own limits', () => {
  it('cannot refute an unsupported claim carrying no name, number or defeat term', () => {
    // Nothing in the facts mentions a ritual. This is exactly the class the
    // deterministic layer does not decide, and the test says so rather than
    // pretending a scorer would catch it.
    const critique = checkNarrationAgainstFacts(
      'The Goblin fell as the ritual guttered out and the air went cold.',
      facts
    );
    expect(critique.verdict).toBe('supported');
  });

  it('runs every text-derived check with no scene attached, and no others', () => {
    const textOnly = narrationFactsFromText('Combat: reached round 3; defeated Goblin.');
    const critique = checkNarrationAgainstFacts('A Beholder ate the 17 torches.', textOnly);
    expect(codes(critique.issues).sort()).toEqual(['unsupported-name', 'unsupported-number']);
    // No scene => no defeat attribution and no omission check, rather than a
    // silent pass on those questions.
    expect(codes(critique.issues)).not.toContain('unrecorded-defeat');
  });

  it('is pure: the same narration and facts always produce the same critique', () => {
    const narrative = 'The Goblin fell in round 3, and a Beholder watched.';
    expect(checkNarrationAgainstFacts(narrative, facts)).toEqual(
      checkNarrationAgainstFacts(narrative, facts)
    );
  });
});

describe('verdictFor', () => {
  const advisory: NarrationCritiqueIssue = {
    code: 'model-concern',
    severity: 'advisory',
    message: 'The model dislikes this.',
    deterministic: false,
  };

  it('never lets an advisory issue decide anything', () => {
    expect(verdictFor([advisory])).toBe('supported');
    expect(verdictFor([advisory, advisory, advisory])).toBe('supported');
  });

  it('ranks reject over review over clean', () => {
    const review: NarrationCritiqueIssue = {
      code: 'off-facts-name',
      severity: 'review',
      message: 'x',
      deterministic: true,
    };
    const reject: NarrationCritiqueIssue = {
      code: 'unsupported-name',
      severity: 'reject',
      message: 'x',
      deterministic: true,
    };
    expect(verdictFor([])).toBe('supported');
    expect(verdictFor([review, advisory])).toBe('needs-review');
    expect(verdictFor([review, reject, advisory])).toBe('refuted');
  });
});
