import { SystemRegistry } from '../registry';
import { Pf2eSystemDef } from '../systems/pf2e/definition';
import { createDefaultPf2eData, type Pf2eDataModel } from '../systems/pf2e/data-model';
import type { LegalActionList } from '../registry/types';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(Pf2eSystemDef);
  return registry;
}

function createDocument(system: Pf2eDataModel): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-doc',
    name: 'PF2e Legal-Actions Fixture',
    systemId: 'pf2e',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

/** A level-1 fighter wielding a longsword with a raised steel shield. */
function createFighter(overrides: Partial<Pf2eDataModel> = {}): Pf2eDataModel {
  return {
    ...createDefaultPf2eData(),
    level: 1,
    classId: 'fighter',
    speed: 25,
    equipment: [
      {
        itemId: 'longsword',
        name: 'Longsword',
        bulk: 1,
        equipped: true,
        slot: 'mainHand',
        weaponDamage: { count: 1, die: 8 },
      },
      {
        itemId: 'steel-shield',
        name: 'Steel Shield',
        bulk: 1,
        equipped: true,
        shieldBonus: 2,
        raised: true,
      },
    ],
    ...overrides,
  };
}

function byId(result: LegalActionList, id: string) {
  return result.actions.find((action) => action.id === id);
}

describe('PF2e legal actions', () => {
  it('models the three-action economy — action counts plus a reaction pool', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createFighter()), {
      phase: 'combat',
    });

    expect(result.systemId).toBe('pf2e');

    const resources = new Set(
      result.actions.flatMap((action) => action.costs.map((cost) => cost.resource))
    );
    // PF2e's own resources: `action` (of 3) and `reaction` (of 1). Never a
    // Daggerheart spotlight/Hope — the seam privileges neither model.
    expect(resources).toEqual(new Set(['action', 'reaction']));

    const actionAmounts = new Set(
      result.actions
        .flatMap((action) => action.costs)
        .filter((cost) => cost.resource === 'action')
        .map((cost) => cost.amount)
    );
    // Single-action (Strike/Stride) and two-action (Ready) costs both appear.
    expect(actionAmounts).toEqual(new Set([1, 2]));
  });

  it('derives strikes from equipped weapons plus an always-available unarmed strike', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createFighter()));

    expect(byId(result, 'pf2e:strike:unarmed')).toMatchObject({
      kind: 'strike',
      costs: [{ resource: 'action', amount: 1 }],
      manualBoundary: false,
    });
    expect(byId(result, 'pf2e:strike:longsword')).toMatchObject({
      eligibility: 'available',
      manualBoundary: false,
      costs: [{ resource: 'action', amount: 1 }],
      details: { weaponDamage: { count: 1, die: 8 }, multipleAttackPenalty: '0 / -5 / -10' },
    });
  });

  it('gates shield actions on an equipped and raised shield', async () => {
    const registry = createRegistry();

    const raised = await registry.legalActions(createDocument(createFighter()));
    expect(byId(raised, 'pf2e:raise-a-shield')?.eligibility).toBe('available');
    expect(byId(raised, 'pf2e:shield-block')).toMatchObject({
      kind: 'reaction',
      eligibility: 'available',
      costs: [{ resource: 'reaction', amount: 1 }],
    });

    // No shield: raise is unavailable, block is conditional on having one.
    const shieldless = await registry.legalActions(
      createDocument(createFighter({ equipment: [] }))
    );
    expect(byId(shieldless, 'pf2e:raise-a-shield')?.eligibility).toBe('unavailable');
    expect(byId(shieldless, 'pf2e:shield-block')?.eligibility).toBe('conditional');
  });

  it('marks Ready as a two-action, GM-adjudicated manual boundary', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createFighter()));

    expect(byId(result, 'pf2e:ready')).toMatchObject({
      costs: [{ resource: 'action', amount: 2 }],
      manualBoundary: true,
    });
  });

  it('enumerates known spells as manual-boundary casts without inventing an action cost', async () => {
    const registry = createRegistry();
    const wizard = createFighter({
      classId: 'wizard',
      spellcasting: {
        tradition: 'arcane',
        type: 'prepared',
        proficiency: { tier: 'trained', total: 0 },
        spellSlots: { 1: { max: 2, used: 0 } },
        spellsKnown: ['acid-splash-pf2e', 'burning-hands-pf2e'],
        focusSpells: [],
        focusPoints: { current: 0, max: 0 },
      },
    });

    const result = await registry.legalActions(createDocument(wizard));

    const cast = byId(result, 'pf2e:cast-a-spell:burning-hands-pf2e');
    expect(cast).toMatchObject({
      kind: 'cast-a-spell',
      manualBoundary: true,
      costs: [], // No modeled cost — spell action cost is not in the data model.
      details: { tradition: 'arcane', castingType: 'prepared' },
    });
    // A non-caster fighter enumerates no spell casts.
    const fighter = await registry.legalActions(createDocument(createFighter()));
    expect(fighter.actions.some((action) => action.kind === 'cast-a-spell')).toBe(false);
  });
});
