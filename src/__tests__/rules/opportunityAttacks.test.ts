import { describe, it, expect } from 'vitest';

import { runCombatRound, type EffectInstance, type RoundCombatant } from '../../rules';

/**
 * Opportunity attacks: a combatant that leaves an enemy's reach provokes a free
 * strike from that enemy. The auto-round detects it when a move crosses out of a
 * threatener's reach. 5e/3.5e/PF1e provoke; PF2e (conditional reaction) doesn't.
 */

let seq = 0;
const eff = (
  target: 'attack' | 'damage',
  op: 'add' | 'add-die',
  value: number
): EffectInstance => ({
  id: `${target}-${op}-${value}-${seq++}`,
  systemId: 'dnd-5e-2014',
  target,
  operation: op,
  value,
  stackPolicy: 'sum',
  source: { kind: 'custom', id: 'x', label: 'x' },
  label: target,
  category: 'other',
});

// A reach-2 giant that the mover starts beside, the mover, and a near-dead foe
// on the far side. The mover chases the wounded foe, leaving the giant's reach.
function setup(systemId: string) {
  const giant: RoundCombatant = {
    tokenId: 'giant',
    faction: 'monsters',
    position: { x: 0, y: 0 },
    armorClass: 12,
    hp: { current: 60, max: 60 },
    attackEffects: [eff('attack', 'add', 20)], // its OA reliably connects
    damageEffects: [eff('damage', 'add-die', 8), eff('damage', 'add', 6)],
    reach: 2,
  };
  const mover: RoundCombatant = {
    tokenId: 'mover',
    faction: 'party',
    position: { x: 2, y: 0 }, // within the giant's reach 2
    armorClass: 10, // low → the OA hits
    hp: { current: 30, max: 30 },
    attackEffects: [eff('attack', 'add', 10)],
    damageEffects: [eff('damage', 'add-die', 6), eff('damage', 'add', 3)],
    reach: 1,
    speed: 8,
  };
  const prey: RoundCombatant = {
    tokenId: 'prey',
    faction: 'monsters',
    position: { x: 6, y: 0 },
    armorClass: 10,
    hp: { current: 1, max: 30 }, // near-dead → scores highest, drawing the mover off
    attackEffects: [eff('attack', 'add', 0)],
    damageEffects: [eff('damage', 'add-die', 4)],
    reach: 1,
  };
  return { order: [mover, giant, prey], systemId };
}

describe('opportunity attacks in the auto-round', () => {
  it('the mover provokes the giant by leaving its reach, and takes the hit', () => {
    const { order, systemId } = setup('dnd-5e-2014');
    const result = runCombatRound({ order, seed: 'oa', round: 1, systemId });

    const moverTurn = result.turns.find((t) => t.tokenId === 'mover')!;
    expect(moverTurn.turn.moveTo).toBeDefined(); // it moved
    // It provoked an opportunity attack from the giant.
    expect(moverTurn.oaIntents).toBeDefined();
    const oa = moverTurn.oaIntents!.find((i) => i.type === 'apply-damage');
    expect(oa).toBeDefined();
    if (oa && oa.type === 'apply-damage') {
      expect(oa.actorId).toBe('giant');
      expect(oa.damages[0]).toMatchObject({ tokenId: 'mover' });
      expect(oa.damages[0].amount).toBeGreaterThan(0);
    }
    // The OA damage is folded into the mover's HP.
    expect(result.finalHp.mover).toBeLessThan(30);
  });

  it('PF2e does not provoke a universal opportunity attack', () => {
    const { order, systemId } = setup('pf2e');
    const result = runCombatRound({ order, seed: 'oa', round: 1, systemId });
    const moverTurn = result.turns.find((t) => t.tokenId === 'mover')!;
    expect(moverTurn.turn.moveTo).toBeDefined(); // still moved
    expect(moverTurn.oaIntents).toBeUndefined(); // but no OA
  });
});
