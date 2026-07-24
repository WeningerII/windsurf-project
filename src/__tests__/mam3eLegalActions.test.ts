import { SystemRegistry } from '../registry';
import { Mam3eSystemDef } from '../systems/mam3e/definition';
import { createDefaultMam3eData, type Mam3eDataModel } from '../systems/mam3e/data-model';
import type { LegalActionList } from '../registry/types';
import type { CharacterDocument } from '../types/core/document';
import type { Power } from '../types/mam/powers';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(Mam3eSystemDef);
  return registry;
}

function createDocument(system: Mam3eDataModel): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'mam3e-doc',
    name: 'M&M Legal-Actions Fixture',
    systemId: 'mam3e',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function power(overrides: Partial<Power> & Pick<Power, 'id' | 'name'>): Power {
  return {
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    action: 'standard',
    range: 'personal',
    duration: 'instant',
    baseCost: 1,
    perRank: true,
    rank: 1,
    description: '',
    effects: [],
    ...overrides,
  };
}

/**
 * A hero with: a Damage attack (catalog effect, standard action), a Flight power
 * (catalog effect, free action), an always-on Immunity (action 'none'), and a
 * homebrew move-action power not in the catalog.
 */
function createHero(overrides: Partial<Mam3eDataModel> = {}): Mam3eDataModel {
  return {
    ...createDefaultMam3eData(),
    powers: [
      power({ id: 'damage', name: 'Damage', type: 'attack', action: 'standard', range: 'close' }),
      power({ id: 'flight', name: 'Flight', type: 'movement', action: 'free' }),
      power({
        id: 'immunity',
        name: 'Immunity',
        type: 'defense',
        action: 'none',
        duration: 'permanent',
      }),
      power({ id: 'homebrew-blink', name: 'Blink Step', type: 'movement', action: 'move' }),
    ],
    ...overrides,
  };
}

function byId(result: LegalActionList, id: string) {
  return result.actions.find((action) => action.id === id);
}

describe('M&M 3e legal actions', () => {
  it("spends M&M's own standard/move/free economy — not the d20 action economy", async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createHero()), { phase: 'combat' });

    expect(result.systemId).toBe('mam3e');

    const resources = new Set(
      result.actions.flatMap((action) => action.costs.map((cost) => cost.resource))
    );
    // The three M&M action types appear; the d20 generic "action"/"bonus" never do.
    expect(resources).toContain('standard');
    expect(resources).toContain('move');
    expect(resources).toContain('free');
    expect(resources).not.toContain('action');
    expect(resources).not.toContain('bonus');
  });

  it('always offers the universal basic actions across all three action types', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createDefaultMam3eData()));

    // Unarmed attack is mechanically resolved (attack check + resistance DC).
    expect(byId(result, 'mam3e:basic:unarmed-attack')).toMatchObject({
      kind: 'attack',
      costs: [{ resource: 'standard', amount: 1 }],
      manualBoundary: false,
    });
    expect(byId(result, 'mam3e:basic:move')).toMatchObject({
      costs: [{ resource: 'move', amount: 1 }],
      manualBoundary: false,
    });
    expect(byId(result, 'mam3e:basic:drop-prone')).toMatchObject({
      costs: [{ resource: 'free', amount: 1 }],
    });
    // Ready's trigger is GM-adjudicated.
    expect(byId(result, 'mam3e:basic:ready')).toMatchObject({
      costs: [{ resource: 'standard', amount: 1 }],
      manualBoundary: true,
    });
  });

  it('enumerates an attack power as a modeled (non-manual) standard action resolved from the catalog', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createHero()));

    expect(byId(result, 'mam3e:power:0:damage')).toMatchObject({
      kind: 'attack',
      label: 'Attack with Damage',
      eligibility: 'available',
      costs: [{ resource: 'standard', amount: 1 }],
      targets: [{ kind: 'creature', range: 'close', count: 1 }],
      manualBoundary: false,
      source: 'damage',
      details: { powerType: 'attack', action: 'standard', resolvedFromCatalog: true },
    });
  });

  it('marks a non-attack power as a GM-adjudicated manual boundary, costed by its action type', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createHero()));

    expect(byId(result, 'mam3e:power:1:flight')).toMatchObject({
      kind: 'power',
      label: 'Activate Flight',
      costs: [{ resource: 'free', amount: 1 }],
      targets: [{ kind: 'self' }],
      manualBoundary: true,
      details: { powerType: 'movement', action: 'free', resolvedFromCatalog: true },
    });
  });

  it("excludes continuous/permanent powers (action 'none') as passive, not actions", async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createHero()));

    expect(byId(result, 'mam3e:power:2:immunity')).toBeUndefined();
  });

  it('enumerates a homebrew power not in the catalog from its own action field', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createHero()));

    expect(byId(result, 'mam3e:power:3:homebrew-blink')).toMatchObject({
      kind: 'power',
      costs: [{ resource: 'move', amount: 1 }],
      manualBoundary: true,
      details: { action: 'move', resolvedFromCatalog: false },
    });
  });

  it('offers only the universal basic actions for a fresh sheet with no powers', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createDefaultMam3eData()));

    expect(result.actions.map((action) => action.id)).toEqual([
      'mam3e:basic:unarmed-attack',
      'mam3e:basic:move',
      'mam3e:basic:ready',
      'mam3e:basic:drop-prone',
    ]);
  });
});
