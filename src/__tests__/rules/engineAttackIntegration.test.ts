import { describe, it, expect } from 'vitest';

import type { CharacterDocument } from '../../types/core/document';
import { Dnd35eEngine } from '../../systems/dnd35e/engine';
import { Pf1eEngine } from '../../systems/pf1e/engine';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { createDefaultPf1eData } from '../../systems/pf1e/data-model';

/**
 * PHASE 1c (RFC 003): equipping a magic weapon raises the attack roll's
 * deterministic modifier in the d20-legacy engines that expose an attack roll.
 * We assert via the formula string (which encodes the modifier) so the random
 * d20 does not affect the check.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function doc(systemId: string, system: any): CharacterDocument {
  return {
    id: `test-${systemId}`,
    systemId,
    name: 'Test',
    system,
    createdAt: new Date('2026-05-31T00:00:00.000Z'),
    updatedAt: new Date('2026-05-31T00:00:00.000Z'),
  };
}

function modifierFromFormula(formula: string): number {
  // formula looks like "1d20 + 2"
  const match = formula.match(/1d20 \+ (-?\d+)/);
  if (!match) throw new Error(`Unexpected attack formula: ${formula}`);
  return Number(match[1]);
}

describe('3.5e attack resolution — equipped +1 weapon raises the attack modifier', () => {
  it('a +1 longsword adds exactly 1 to the attack roll modifier', async () => {
    const engine = new Dnd35eEngine();
    const base = createDefaultDnd35eData();
    base.baseAttributes = { str: 12, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    const baseline = modifierFromFormula(
      (await engine.rollCheck(doc('dnd-3.5e', base), 'attack')).formula
    );

    const armed = createDefaultDnd35eData();
    armed.baseAttributes = { str: 12, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (armed as any).equipment = [
      { itemId: 'longsword-1', name: '+1 Longsword', equipped: true, attackBonus: 1 },
    ];
    const armedMod = modifierFromFormula(
      (await engine.rollCheck(doc('dnd-3.5e', armed), 'attack')).formula
    );

    expect(armedMod - baseline).toBe(1);
  });

  it('an unequipped weapon contributes nothing to the attack roll', async () => {
    const engine = new Dnd35eEngine();
    const base = createDefaultDnd35eData();
    const baseline = modifierFromFormula(
      (await engine.rollCheck(doc('dnd-3.5e', base), 'attack')).formula
    );

    const carried = createDefaultDnd35eData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (carried as any).equipment = [
      { itemId: 'longsword-1', name: '+1 Longsword', equipped: false, attackBonus: 1 },
    ];
    const carriedMod = modifierFromFormula(
      (await engine.rollCheck(doc('dnd-3.5e', carried), 'attack')).formula
    );
    expect(carriedMod).toBe(baseline);
  });
});

describe('PF1e attack resolution — equipped +1 weapon raises the attack modifier', () => {
  it('a +1 weapon adds exactly 1 to the attack roll modifier', async () => {
    const engine = new Pf1eEngine();
    const base = createDefaultPf1eData();
    base.baseAttributes = { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    const baseline = modifierFromFormula(
      (await engine.rollCheck(doc('pf1e', base), 'attack')).formula
    );

    const armed = createDefaultPf1eData();
    armed.baseAttributes = { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (armed as any).equipment = [
      { itemId: 'mace-1', name: '+1 Mace', equipped: true, attackBonus: 1 },
    ];
    const armedMod = modifierFromFormula(
      (await engine.rollCheck(doc('pf1e', armed), 'attack')).formula
    );
    expect(armedMod - baseline).toBe(1);
  });
});
