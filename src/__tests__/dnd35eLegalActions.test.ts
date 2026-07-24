import { SystemRegistry } from '../registry';
import { Dnd35eSystemDef } from '../systems/dnd35e/definition';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { iterativeAttackBonuses } from '../utils/derivedCombatMath';
import type { LegalActionList } from '../registry/types';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(Dnd35eSystemDef);
  return registry;
}

function createDocument(system: Dnd35eDataModel): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'dnd35e-doc',
    name: '3.5e Legal-Actions Fixture',
    systemId: 'dnd-3.5e',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

/** An 11th-level fighter (BAB 11 -> iteratives 11/6/1) wielding a longsword. */
function createFighter(overrides: Partial<Dnd35eDataModel> = {}): Dnd35eDataModel {
  return {
    ...createDefaultDnd35eData(),
    level: 11,
    baseAttackBonus: 11,
    speed: 30,
    equipment: [
      {
        itemId: 'longsword',
        name: 'Longsword',
        equipped: true,
        slot: 'mainHand',
        weaponDamage: { count: 1, die: 8 },
      },
    ],
    ...overrides,
  };
}

function byId(result: LegalActionList, id: string) {
  return result.actions.find((action) => action.id === id);
}

describe('D&D 3.5e legal actions', () => {
  it('stamps the systemId and enumerates the OGL action economy vocabulary', async () => {
    const result = await createRegistry().legalActions(createDocument(createFighter()), {
      phase: 'combat',
    });

    expect(result.systemId).toBe('dnd-3.5e');
    const resources = new Set(
      result.actions.flatMap((action) => action.costs.map((cost) => cost.resource))
    );
    // Costs are in the systems' OWN vocabulary, not a cross-system enum.
    expect(resources).toContain('standard');
    expect(resources).toContain('move');
    expect(resources).toContain('full-round');
    expect(resources).toContain('attack-of-opportunity');
  });

  it('offers a single Attack (standard) per weapon plus unarmed, and a full-round Full Attack', async () => {
    const result = await createRegistry().legalActions(createDocument(createFighter()), {});

    const unarmed = byId(result, 'dnd-3.5e:attack:unarmed');
    const sword = byId(result, 'dnd-3.5e:attack:longsword');
    expect(unarmed?.costs).toEqual([{ resource: 'standard', amount: 1 }]);
    expect(unarmed?.manualBoundary).toBe(false);
    expect(sword?.costs).toEqual([{ resource: 'standard', amount: 1 }]);
    expect(sword?.source).toBe('longsword');

    const fullAttack = byId(result, 'dnd-3.5e:full-attack');
    expect(fullAttack?.costs).toEqual([{ resource: 'full-round', amount: 1 }]);
    expect(fullAttack?.manualBoundary).toBe(false);
    // Iterative attacks from the shared helper: BAB 11 -> [11, 6, 1].
    expect(fullAttack?.details?.iterativeBonuses).toEqual(iterativeAttackBonuses(11));
    expect(fullAttack?.details?.attackCount).toBe(3);
  });

  it('enumerates the standard combat actions with honest manual boundaries', async () => {
    const result = await createRegistry().legalActions(createDocument(createFighter()), {});

    // Charge / Withdraw depend on the map -> GM-adjudicated.
    expect(byId(result, 'dnd-3.5e:charge')).toMatchObject({
      costs: [{ resource: 'full-round', amount: 1 }],
      manualBoundary: true,
    });
    expect(byId(result, 'dnd-3.5e:withdraw')).toMatchObject({
      costs: [{ resource: 'full-round', amount: 1 }],
      manualBoundary: true,
    });
    // Total Defense: +4 dodge AC not auto-applied -> manual boundary.
    expect(byId(result, 'dnd-3.5e:total-defense')).toMatchObject({
      costs: [{ resource: 'standard', amount: 1 }],
      manualBoundary: true,
    });
    // Move + the no-action 5-foot step.
    expect(byId(result, 'dnd-3.5e:move')?.costs).toEqual([{ resource: 'move', amount: 1 }]);
    expect(byId(result, 'dnd-3.5e:five-foot-step')?.costs).toEqual([]);
    // Attack of Opportunity: situational trigger -> conditional + manual.
    expect(byId(result, 'dnd-3.5e:attack-of-opportunity')).toMatchObject({
      kind: 'attack-of-opportunity',
      eligibility: 'conditional',
      manualBoundary: true,
    });
  });

  it('enumerates one Cast a Spell per known/prepared spell as a manual boundary', async () => {
    const caster = createFighter({
      spellsKnown: ['magic-missile'],
      preparedSpellsByLevel: { 1: ['shield'], 2: ['scorching-ray'] },
    });
    const result = await createRegistry().legalActions(createDocument(caster), {});

    const spells = result.actions.filter((action) => action.kind === 'cast-a-spell');
    expect(spells.map((action) => action.source).sort()).toEqual([
      'magic-missile',
      'scorching-ray',
      'shield',
    ]);
    for (const spell of spells) {
      // Casting time/components/targets are spell-specific -> no modeled cost.
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
