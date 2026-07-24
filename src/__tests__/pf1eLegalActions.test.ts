import { SystemRegistry } from '../registry';
import { Pf1eSystemDef } from '../systems/pf1e/definition';
import { createDefaultPf1eData, type Pf1eDataModel } from '../systems/pf1e/data-model';
import { iterativeAttackBonuses } from '../utils/derivedCombatMath';
import type { LegalActionList } from '../registry/types';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(Pf1eSystemDef);
  return registry;
}

function createDocument(system: Pf1eDataModel): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'pf1e-doc',
    name: 'PF1e Legal-Actions Fixture',
    systemId: 'pf1e',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

/** A 6th-level fighter (BAB 6 -> iteratives 6/1) wielding a greatsword. */
function createFighter(overrides: Partial<Pf1eDataModel> = {}): Pf1eDataModel {
  return {
    ...createDefaultPf1eData(),
    level: 6,
    baseAttackBonus: 6,
    speed: 30,
    equipment: [
      {
        itemId: 'greatsword',
        name: 'Greatsword',
        equipped: true,
        slot: 'mainHand',
        weaponDamage: { count: 2, die: 6 },
      },
    ],
    ...overrides,
  };
}

function byId(result: LegalActionList, id: string) {
  return result.actions.find((action) => action.id === id);
}

describe('Pathfinder 1e legal actions', () => {
  it('stamps the systemId and shares the 3.5e OGL action-economy vocabulary', async () => {
    const result = await createRegistry().legalActions(createDocument(createFighter()), {
      phase: 'combat',
    });

    expect(result.systemId).toBe('pf1e');
    const resources = new Set(
      result.actions.flatMap((action) => action.costs.map((cost) => cost.resource))
    );
    expect(resources).toContain('standard');
    expect(resources).toContain('move');
    expect(resources).toContain('full-round');
    expect(resources).toContain('attack-of-opportunity');
    // The pf1e ids are stamped with the caller's systemId.
    expect(result.actions.every((action) => action.id.startsWith('pf1e:'))).toBe(true);
  });

  it('offers a single Attack (standard) per weapon plus unarmed, and a full-round Full Attack', async () => {
    const result = await createRegistry().legalActions(createDocument(createFighter()), {});

    const unarmed = byId(result, 'pf1e:attack:unarmed');
    const sword = byId(result, 'pf1e:attack:greatsword');
    expect(unarmed?.costs).toEqual([{ resource: 'standard', amount: 1 }]);
    expect(sword?.costs).toEqual([{ resource: 'standard', amount: 1 }]);
    expect(sword?.details?.weaponDamage).toEqual({ count: 2, die: 6 });

    const fullAttack = byId(result, 'pf1e:full-attack');
    expect(fullAttack?.costs).toEqual([{ resource: 'full-round', amount: 1 }]);
    expect(fullAttack?.manualBoundary).toBe(false);
    // BAB 6 -> [6, 1].
    expect(fullAttack?.details?.iterativeBonuses).toEqual(iterativeAttackBonuses(6));
    expect(fullAttack?.details?.attackCount).toBe(2);
  });

  it('enumerates the standard combat actions with honest manual boundaries', async () => {
    const result = await createRegistry().legalActions(createDocument(createFighter()), {});

    expect(byId(result, 'pf1e:charge')).toMatchObject({
      costs: [{ resource: 'full-round', amount: 1 }],
      manualBoundary: true,
    });
    expect(byId(result, 'pf1e:withdraw')).toMatchObject({
      costs: [{ resource: 'full-round', amount: 1 }],
      manualBoundary: true,
    });
    expect(byId(result, 'pf1e:total-defense')).toMatchObject({
      costs: [{ resource: 'standard', amount: 1 }],
      manualBoundary: true,
    });
    expect(byId(result, 'pf1e:move')?.costs).toEqual([{ resource: 'move', amount: 1 }]);
    expect(byId(result, 'pf1e:five-foot-step')?.costs).toEqual([]);
    expect(byId(result, 'pf1e:attack-of-opportunity')).toMatchObject({
      eligibility: 'conditional',
      manualBoundary: true,
    });
  });

  it('enumerates Cast a Spell from prepared and known lists as a manual boundary', async () => {
    const caster = createFighter({
      spellsKnown: ['ray-of-frost'],
      preparedSpellsByLevel: { 1: ['mage-armor'] },
    });
    const result = await createRegistry().legalActions(createDocument(caster), {});

    const spells = result.actions.filter((action) => action.kind === 'cast-a-spell');
    expect(spells.map((action) => action.source).sort()).toEqual(['mage-armor', 'ray-of-frost']);
    for (const spell of spells) {
      expect(spell.costs).toEqual([]);
      expect(spell.manualBoundary).toBe(true);
    }
  });

  it('offers no Cast a Spell for a non-caster and never mutates the document', async () => {
    const document = createDocument(createFighter());
    const serializedBefore = JSON.stringify(document);

    const result = await createRegistry().legalActions(document, {});

    expect(result.actions.some((action) => action.kind === 'cast-a-spell')).toBe(false);
    expect(JSON.stringify(document)).toBe(serializedBefore);
  });
});
