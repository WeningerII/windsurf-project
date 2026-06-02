import { describe, it, expect } from 'vitest';

import { attitudeSwayDC, resolveSocialAction, shiftAttitude, type SocialNpc } from '../../rules';

/**
 * Social resolution: one action addressed to N NPCs, each reacting on its own.
 * The N-participant principle in a conversation — a friendly NPC is easier to
 * sway than a hostile one, and re-ordering the NPCs never changes any reaction.
 */

describe('attitude track', () => {
  it('shiftAttitude moves along the track and clamps at the ends', () => {
    expect(shiftAttitude('indifferent', 1)).toBe('friendly');
    expect(shiftAttitude('indifferent', 2)).toBe('helpful');
    expect(shiftAttitude('friendly', 5)).toBe('helpful'); // clamps
    expect(shiftAttitude('unfriendly', -5)).toBe('hostile'); // clamps
  });

  it('attitudeSwayDC makes hostile NPCs harder and friendly ones easier', () => {
    expect(attitudeSwayDC(15, 'hostile')).toBe(25);
    expect(attitudeSwayDC(15, 'indifferent')).toBe(15);
    expect(attitudeSwayDC(15, 'friendly')).toBe(10);
    expect(attitudeSwayDC(15, 'helpful')).toBe(5);
  });
});

describe('resolveSocialAction — one speech, N independent reactions', () => {
  const crowd: SocialNpc[] = [
    { id: 'guard', attitude: 'hostile' },
    { id: 'clerk', attitude: 'indifferent' },
    { id: 'friend', attitude: 'friendly' },
  ];

  it('addresses every NPC, each against its own attitude-adjusted DC', () => {
    const result = resolveSocialAction({
      systemId: 'dnd-5e-2024',
      speakerId: 'bard',
      modifier: 5,
      baseDC: 15,
      targets: crowd,
      seed: 'speech',
      approach: 'persuasion',
    });
    expect(result.outcomes.map((o) => o.npcId)).toEqual(['guard', 'clerk', 'friend']);
    expect(result.outcomes.find((o) => o.npcId === 'guard')!.effectiveDC).toBe(25);
    expect(result.outcomes.find((o) => o.npcId === 'friend')!.effectiveDC).toBe(10);
  });

  it('a compelling speech (high modifier) shifts every NPC up the track', () => {
    const result = resolveSocialAction({
      systemId: 'dnd-5e-2024',
      speakerId: 'bard',
      modifier: 100, // beats even the hostile guard's DC
      baseDC: 15,
      targets: crowd,
      seed: 'rousing',
    });
    expect(result.outcomes.every((o) => o.result.success)).toBe(true);
    expect(result.outcomes.every((o) => o.steps >= 1)).toBe(true);
    expect(result.outcomes.find((o) => o.npcId === 'clerk')!.after).not.toBe('indifferent');
  });

  it('a botched approach (very low modifier) backfires without dropping below hostile', () => {
    const result = resolveSocialAction({
      systemId: 'dnd-5e-2024',
      speakerId: 'bard',
      modifier: -100,
      baseDC: 15,
      targets: crowd,
      seed: 'botch',
    });
    expect(result.outcomes.every((o) => o.steps <= 0)).toBe(true);
    // The already-hostile guard cannot get worse than hostile.
    expect(result.outcomes.find((o) => o.npcId === 'guard')!.after).toBe('hostile');
  });

  it('is order-independent: each NPC reacts the same regardless of list order', () => {
    const forward = resolveSocialAction({
      systemId: 'pf2e',
      speakerId: 'bard',
      modifier: 8,
      baseDC: 15,
      targets: crowd,
      seed: 'order',
    });
    const reversed = resolveSocialAction({
      systemId: 'pf2e',
      speakerId: 'bard',
      modifier: 8,
      baseDC: 15,
      targets: [...crowd].reverse(),
      seed: 'order',
    });
    for (const npc of crowd) {
      const a = forward.outcomes.find((o) => o.npcId === npc.id)!;
      const b = reversed.outcomes.find((o) => o.npcId === npc.id)!;
      expect(a.after).toBe(b.after);
      expect(a.result.total).toBe(b.result.total);
    }
  });

  it('is deterministic for a fixed seed', () => {
    const run = () =>
      JSON.stringify(
        resolveSocialAction({
          systemId: 'daggerheart',
          speakerId: 'rogue',
          modifier: 3,
          baseDC: 12,
          targets: crowd,
          seed: 'fixed',
          approach: 'deception',
        })
      );
    expect(run()).toBe(run());
  });
});
