import { describe, it, expect } from 'vitest';

import { resolveCheck, resolveSkillChallenge, type ChallengeParticipant } from '../../rules';
import { createSeededRng } from '../../scene/seededRng';

/**
 * System-agnostic checks (the non-combat resolution primitive) and N-participant
 * skill challenges. Outcomes are pinned with extreme modifiers so they hold for
 * any roll the seeded stream produces.
 */

const rng = (seed: string) => createSeededRng(seed);

describe('resolveCheck — per-system mechanics', () => {
  it('d20 family (5e/3.5e/PF1e): binary pass/fail vs DC', () => {
    const pass = resolveCheck({ systemId: 'dnd-5e-2024', modifier: 100, dc: 10, rng: rng('a') });
    expect(pass.success).toBe(true);
    expect(pass.outcome).toBe('success');
    expect(pass.dice).toHaveLength(1);

    const fail = resolveCheck({ systemId: 'dnd-3.5e', modifier: -100, dc: 10, rng: rng('a') });
    expect(fail.success).toBe(false);
    expect(fail.outcome).toBe('failure');
  });

  it('advantage rolls two d20 and keeps the higher', () => {
    const result = resolveCheck({
      systemId: 'dnd-5e-2024',
      modifier: 0,
      dc: 10,
      rng: rng('adv'),
      rollMode: 'advantage',
    });
    expect(result.dice).toHaveLength(2);
    expect(result.total - result.modifier).toBe(Math.max(...result.dice));
  });

  it('Pathfinder 2e grades the check (degrees), pass/fail still universal', () => {
    const crit = resolveCheck({ systemId: 'pf2e', modifier: 100, dc: 10, rng: rng('p') });
    expect(crit.success).toBe(true);
    expect(['success', 'critical-success']).toContain(crit.outcome);

    const fail = resolveCheck({ systemId: 'pf2e', modifier: -100, dc: 30, rng: rng('p') });
    expect(fail.success).toBe(false);
    expect(['failure', 'critical-failure']).toContain(fail.outcome);
  });

  it('Mutants & Masterminds grades by 5s: +10 over the DC is a critical success', () => {
    const crit = resolveCheck({ systemId: 'mam3e', modifier: 100, dc: 10, rng: rng('m') });
    expect(crit.outcome).toBe('critical-success'); // total >= dc + 10, no nat shift in M&M
    const dramatic = resolveCheck({ systemId: 'mam3e', modifier: -100, dc: 10, rng: rng('m') });
    expect(dramatic.outcome).toBe('critical-failure');
  });

  it('Daggerheart rolls 2d12 duality with a Hope/Fear flag', () => {
    const result = resolveCheck({ systemId: 'daggerheart', modifier: 100, dc: 10, rng: rng('d') });
    expect(result.dice).toHaveLength(2); // Hope + Fear
    expect(result.success).toBe(true);
    expect(typeof result.withHope).toBe('boolean');
    expect(result.total).toBe(result.dice[0] + result.dice[1] + 100);
  });

  it('is deterministic for a fixed (system, seed)', () => {
    const a = resolveCheck({ systemId: 'pf2e', modifier: 3, dc: 15, rng: rng('fixed') });
    const b = resolveCheck({ systemId: 'pf2e', modifier: 3, dc: 15, rng: rng('fixed') });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe('resolveSkillChallenge — the party contributes checks (N participants)', () => {
  const party: ChallengeParticipant[] = [
    { id: 'rogue', modifier: 100 },
    { id: 'bard', modifier: 100 },
    { id: 'ranger', modifier: 100 },
  ];

  it('succeeds when the party accrues enough successes before failures', () => {
    const result = resolveSkillChallenge({
      systemId: 'dnd-5e-2024',
      dc: 15,
      successesNeeded: 3,
      failuresAllowed: 3,
      participants: party,
      seed: 'explore',
      skill: 'survival',
    });
    expect(result.outcome).toBe('success');
    expect(result.successes).toBeGreaterThanOrEqual(3);
    expect(result.failures).toBe(0);
    // The whole party took part, cycling in order.
    expect(result.attempts.map((a) => a.participantId)).toEqual(['rogue', 'bard', 'ranger']);
  });

  it('fails when the party racks up failures first', () => {
    const doomed = party.map((p) => ({ ...p, modifier: -100 }));
    const result = resolveSkillChallenge({
      systemId: 'dnd-5e-2024',
      dc: 15,
      successesNeeded: 3,
      failuresAllowed: 3,
      participants: doomed,
      seed: 'explore',
    });
    expect(result.outcome).toBe('failure');
    expect(result.failures).toBeGreaterThanOrEqual(3);
  });

  it('a critical result counts double (degree systems)', () => {
    // PF2e party with huge bonuses → each attempt crits → 2 successes apiece,
    // so two attempts (not three) clear a 3-success challenge.
    const result = resolveSkillChallenge({
      systemId: 'pf2e',
      dc: 10,
      successesNeeded: 3,
      failuresAllowed: 3,
      participants: party,
      seed: 'crit',
    });
    expect(result.outcome).toBe('success');
    expect(result.attempts.every((a) => a.delta === 2)).toBe(true);
    expect(result.attempts.length).toBeLessThanOrEqual(2);
  });

  it('is deterministic and order-stable for a fixed seed', () => {
    const run = () =>
      JSON.stringify(
        resolveSkillChallenge({
          systemId: 'mam3e',
          dc: 15,
          successesNeeded: 4,
          failuresAllowed: 4,
          participants: [
            { id: 'a', modifier: 5 },
            { id: 'b', modifier: 5 },
          ],
          seed: 'stable',
        })
      );
    expect(run()).toBe(run());
  });

  it('an empty party cannot succeed; a zero-success goal is already met', () => {
    expect(
      resolveSkillChallenge({
        systemId: 'dnd-5e-2024',
        dc: 10,
        successesNeeded: 3,
        failuresAllowed: 3,
        participants: [],
        seed: 's',
      }).outcome
    ).toBe('failure');
    expect(
      resolveSkillChallenge({
        systemId: 'dnd-5e-2024',
        dc: 10,
        successesNeeded: 0,
        failuresAllowed: 3,
        participants: party,
        seed: 's',
      }).outcome
    ).toBe('success');
  });
});
