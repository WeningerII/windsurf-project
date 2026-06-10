import { describe, it, expect } from 'vitest';

import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';

import { Dnd5eEngine } from '../../systems/dnd5e/engine';
import { Dnd5e2024Engine } from '../../systems/dnd5e-2024/engine';
import { Dnd35eEngine } from '../../systems/dnd35e/engine';
import { Pf1eEngine } from '../../systems/pf1e/engine';
import { Pf2eEngine } from '../../systems/pf2e/engine';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { createDefaultPf1eData } from '../../systems/pf1e/data-model';
import { createDefaultPf2eData } from '../../systems/pf2e/data-model';

/**
 * PHASE 1b INTEGRATION PROOF (RFC 003):
 * For every d20-family system, equipping a +1 magic item or gaining a feat that
 * grants an AC bonus raises the AC that the engine's own `prepareData` computes —
 * because each engine now routes those effects through the ONE shared resolver.
 *
 * Each case asserts the DELTA (with-bonus minus baseline) is exactly the bonus,
 * which simultaneously proves the wiring is additive (baseline unchanged when no
 * bonus-bearing gear/modifiers are present).
 *
 * (M&M 3e resolves defense via Powers and Daggerheart via item passiveBonuses —
 * neither has an "AC from equipped gear" concept — so they are proven at the
 * shared compile/resolve layer in equipParity.test.ts rather than faked here.)
 */

// A runtime equipment object carrying every field any d20-family system reads,
// so one literal works across all of them (typed loosely on purpose; the
// per-system equipment shapes diverge).
function acItem(): Record<string, unknown> {
  return {
    itemId: 'ring-of-protection-1',
    name: 'Ring of Protection +1',
    customName: 'Ring of Protection +1',
    slot: 'ring1',
    attuned: true,
    equipped: true,
    bulk: 0,
    acBonus: 1,
  };
}

// A feat carrying an armor-class modifier (runtime shape accepted by every
// system's feats array).
function acFeat(): Record<string, unknown> {
  return {
    id: 'defensive-training',
    name: 'Defensive Training',
    description: '+1 to AC.',
    source: 'test',
    modifiers: [{ value: 1, type: 'armor-class', source: 'Defensive Training' }],
  };
}

interface EngineCase {
  systemId: GameSystemId;
  engine: { prepareData: (d: CharacterDocument<any>) => CharacterDocument<any> };
  makeSystem: () => any;
  ac: (system: any) => number;
}

function doc<T extends SystemDataModel>(systemId: GameSystemId, system: T): CharacterDocument<T> {
  return {
    id: `test-${systemId}`,
    systemId,
    name: 'Test',
    system,
    createdAt: new Date('2026-05-31T00:00:00.000Z'),
    updatedAt: new Date('2026-05-31T00:00:00.000Z'),
  };
}

const CASES: EngineCase[] = [
  {
    systemId: 'dnd-5e-2014',
    engine: new Dnd5eEngine(),
    makeSystem: () => ({
      ...createDefaultDnd5eData(),
      classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [10] }],
    }),
    ac: (s) => s.armorClass as number,
  },
  {
    systemId: 'dnd-5e-2024',
    engine: new Dnd5e2024Engine(),
    makeSystem: () => ({
      ...createDefaultDnd5e2024Data(),
      classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [10] }],
    }),
    ac: (s) => s.armorClass as number,
  },
  {
    systemId: 'dnd-3.5e',
    engine: new Dnd35eEngine(),
    makeSystem: () => createDefaultDnd35eData(),
    ac: (s) => s.armorClass.total as number,
  },
  {
    systemId: 'pf1e',
    engine: new Pf1eEngine(),
    makeSystem: () => createDefaultPf1eData(),
    ac: (s) => s.armorClass.total as number,
  },
  {
    systemId: 'pf2e',
    engine: new Pf2eEngine(),
    makeSystem: () => createDefaultPf2eData(),
    ac: (s) => s.armorClass as number,
  },
];

describe('engine AC integration — a +1 magic item raises computed AC by 1 in every d20-family system', () => {
  it.each(CASES)('$systemId', ({ systemId, engine, makeSystem, ac }) => {
    const baseline = ac(engine.prepareData(doc(systemId, makeSystem())).system);

    const withItemSystem = makeSystem();
    withItemSystem.equipment = [acItem()];
    const withItem = ac(engine.prepareData(doc(systemId, withItemSystem)).system);

    expect(withItem - baseline).toBe(1);
  });
});

describe('engine AC integration — a feat AC modifier raises computed AC by 1 in every d20-family system', () => {
  it.each(CASES)('$systemId', ({ systemId, engine, makeSystem, ac }) => {
    const baseline = ac(engine.prepareData(doc(systemId, makeSystem())).system);

    const withFeatSystem = makeSystem();
    withFeatSystem.feats = [acFeat()];
    const withFeat = ac(engine.prepareData(doc(systemId, withFeatSystem)).system);

    expect(withFeat - baseline).toBe(1);
  });
});

describe('engine AC integration — wiring is additive (baseline stable across repeated prepareData)', () => {
  it.each(CASES)('$systemId', ({ systemId, engine, makeSystem, ac }) => {
    const once = ac(engine.prepareData(doc(systemId, makeSystem())).system);
    const twice = ac(engine.prepareData(engine.prepareData(doc(systemId, makeSystem()))).system);
    expect(twice).toBe(once);
  });
});

describe('engine AC integration — 3.5e enhancement AC bonuses do not double-stack', () => {
  it('two enhancement AC items contribute only the largest (+2, not +3)', () => {
    const engine = new Dnd35eEngine();
    const baseSystem = createDefaultDnd35eData();
    const baseline = engine.prepareData(doc('dnd-3.5e', baseSystem)).system.armorClass.total;

    const withTwo = createDefaultDnd35eData();
    (withTwo as any).equipment = [
      { itemId: 'cloak-1', name: 'Cloak', equipped: true, acBonus: 1, bonusType: 'enhancement' },
      { itemId: 'cloak-2', name: 'Cloak', equipped: true, acBonus: 2, bonusType: 'enhancement' },
    ];
    const total = engine.prepareData(doc('dnd-3.5e', withTwo)).system.armorClass.total;
    expect(total - baseline).toBe(2);
  });
});

describe('engine AC integration — unequipped magic items do not contribute (d20-legacy/PF2e)', () => {
  it('an unequipped +1 ring grants no AC in PF1e', () => {
    const engine = new Pf1eEngine();
    const baseline = engine.prepareData(doc('pf1e', createDefaultPf1eData())).system.armorClass
      .total;

    const withUnequipped = createDefaultPf1eData();
    (withUnequipped as any).equipment = [
      { itemId: 'ring-1', name: 'Ring', equipped: false, acBonus: 1 },
    ];
    const total = engine.prepareData(doc('pf1e', withUnequipped)).system.armorClass.total;
    expect(total).toBe(baseline);
  });
});
