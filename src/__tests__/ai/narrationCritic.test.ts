import { describe, expect, it } from 'vitest';

import { checkNarrationFaithfulness } from '../../ai/narrationCritic';

/**
 * PHASE 13 (RFC 002): the deterministic narration critic. AI narration may only
 * restyle the factual recap, so a faithful narrative introduces no numbers or
 * proper nouns absent from those facts. The checker is the validator the flow
 * runs before surfacing prose; it is tuned for precision (no false alarms on
 * legitimate restyling) and never touches game state.
 */

const facts =
  'Combat: reached round 3; defeated Goblin and Ogre.\nChecks: Perception 18 vs DC 15 (success).';

describe('checkNarrationFaithfulness', () => {
  it('passes prose that only restyles the recap', () => {
    const narrative =
      'Over three brutal rounds the party cut down the goblin and the ogre. A keen Perception roll of 18 had warned them of the ambush.';
    const result = checkNarrationFaithfulness(facts, narrative);
    expect(result.faithful).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('flags an invented number (a false mechanical claim)', () => {
    const narrative = 'The ogre struck for 27 damage before it fell.';
    const result = checkNarrationFaithfulness(facts, narrative);
    expect(result.faithful).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({ kind: 'ungrounded-number', token: '27' }),
    ]);
  });

  it('allows numbers that appear in the recap', () => {
    const narrative = 'By round 3 the Perception check of 18 had paid off.';
    expect(checkNarrationFaithfulness(facts, narrative).faithful).toBe(true);
  });

  it('flags an invented mid-sentence proper noun', () => {
    const narrative = 'The goblin fell, and then Thrain cleaved the ogre in two.';
    const result = checkNarrationFaithfulness(facts, narrative);
    expect(result.faithful).toBe(false);
    expect(result.issues.map((issue) => issue.token)).toContain('Thrain');
    expect(result.issues.every((issue) => issue.kind === 'ungrounded-name')).toBe(true);
  });

  it('flags an invented place introduced for colour', () => {
    const narrative = 'The goblin and the ogre died deep in the Whispering Caverns.';
    const result = checkNarrationFaithfulness(facts, narrative);
    expect(result.issues.map((issue) => issue.token)).toEqual(
      expect.arrayContaining(['Whispering', 'Caverns'])
    );
  });

  it('does not flag sentence-initial capitalization or recap names', () => {
    // "Goblin"/"Ogre" are in the recap; "Suddenly"/"They" lead sentences.
    const narrative = 'Suddenly the Goblin lunged. They felled the Ogre moments later.';
    expect(checkNarrationFaithfulness(facts, narrative).faithful).toBe(true);
  });

  it('does not flag all-caps acronyms grounded in the recap (DC)', () => {
    const narrative = 'A clean roll beat the DC and the goblin and ogre were beaten.';
    expect(checkNarrationFaithfulness(facts, narrative).faithful).toBe(true);
  });

  it('dedupes repeated offenders and is deterministic', () => {
    const narrative = 'Borin and Borin again — Borin struck for 99, then 99 more.';
    const a = checkNarrationFaithfulness(facts, narrative);
    const b = checkNarrationFaithfulness(facts, narrative);
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
    expect(a.issues.filter((i) => i.token === 'Borin')).toHaveLength(1);
    expect(a.issues.filter((i) => i.token === '99')).toHaveLength(1);
  });
});
