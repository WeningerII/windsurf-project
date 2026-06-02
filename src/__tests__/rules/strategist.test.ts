import { describe, it, expect } from 'vitest';

import {
  executeTacticalTurn,
  makeEffectId,
  type EffectInstance,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';

/**
 * The strategist seam (RFC 003): a caller may bias the target choice among the
 * enumerated LEGAL targets; an illegal or absent pick falls back to the
 * deterministic highest-score default, so the AI never authors an illegal move.
 */

const atk: EffectInstance = {
  id: makeEffectId('dnd-5e-2014', 'attack', 'base', 5),
  systemId: 'dnd-5e-2014',
  target: 'attack',
  operation: 'add',
  value: 5,
  stackPolicy: 'sum',
  source: { kind: 'system', label: 'attack' },
  label: 'attack',
};

const actor: TacticalActor = {
  tokenId: 'A',
  faction: 'party',
  position: { x: 1, y: 0 },
  attackEffects: [atk],
  damageEffects: [],
  reach: 1,
};
// Two reachable foes; the wounded one scores higher and is the default pick.
const wounded: TacticalTarget = {
  tokenId: 'wounded',
  faction: 'monsters',
  position: { x: 0, y: 0 },
  armorClass: 12,
  hp: { current: 1, max: 20 },
};
const healthy: TacticalTarget = {
  tokenId: 'healthy',
  faction: 'monsters',
  position: { x: 2, y: 0 },
  armorClass: 12,
  hp: { current: 20, max: 20 },
};

describe('executeTacticalTurn — strategist seam', () => {
  const base = { actor, targets: [wounded, healthy], seed: 's', systemId: 'dnd-5e-2014' as const };

  it('defaults to the highest-scored legal target', () => {
    const turn = executeTacticalTurn(base);
    expect(turn.chosenTargetId).toBe('wounded');
  });

  it('honors a strategist that picks a different legal target', () => {
    const turn = executeTacticalTurn({
      ...base,
      chooseTarget: (legal) => legal.find((t) => t.tokenId === 'healthy')?.tokenId,
    });
    expect(turn.chosenTargetId).toBe('healthy');
  });

  it('falls back to the default when the strategist picks an illegal id', () => {
    const turn = executeTacticalTurn({ ...base, chooseTarget: () => 'not-a-target' });
    expect(turn.chosenTargetId).toBe('wounded');
  });

  it('the strategist only ever sees legal (in-reach, visible) candidates', () => {
    let seen: string[] = [];
    executeTacticalTurn({
      ...base,
      chooseTarget: (legal) => {
        seen = legal.map((t) => t.tokenId);
        return undefined;
      },
    });
    expect(new Set(seen)).toEqual(new Set(['wounded', 'healthy']));
  });
});
