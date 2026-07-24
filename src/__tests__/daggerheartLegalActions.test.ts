import { SystemRegistry } from '../registry';
import { DaggerheartSystemDef } from '../systems/daggerheart/definition';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../systems/daggerheart/data-model';
import type { LegalActionList } from '../registry/types';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(DaggerheartSystemDef);
  return registry;
}

function createDocument(system: DaggerheartDataModel): CharacterDocument<DaggerheartDataModel> {
  return {
    id: 'daggerheart-doc',
    name: 'Daggerheart Legal-Actions Fixture',
    systemId: 'daggerheart',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

/** Level-1 SRD Warrior (domains: blade, bone): broadsword + shortsword, two
 * in-domain loadout cards, one Experience, the default 2 Hope. */
function createWarrior(overrides: Partial<DaggerheartDataModel> = {}): DaggerheartDataModel {
  return {
    ...createDefaultDaggerheartData(),
    level: 1,
    class: 'daggerheart-warrior',
    subclass: 'warrior-call-of-the-brave',
    heritage: 'clank',
    community: 'highborne',
    hope: 2,
    experiences: ['Sailor'],
    weapons: {
      primaryId: 'daggerheart-weapon-primary-broadsword-tier-1',
      secondaryId: 'daggerheart-weapon-secondary-shortsword-tier-1',
      inventoryIds: [],
    },
    domainCards: [
      {
        id: 'blade-get-back-up',
        cardId: 'blade-get-back-up',
        name: 'Get Back Up',
        domain: 'blade',
        level: 1,
        location: 'loadout',
        description: '',
      },
      {
        id: 'blade-whirlwind',
        cardId: 'blade-whirlwind',
        name: 'Whirlwind',
        domain: 'blade',
        level: 1,
        location: 'loadout',
        description: '',
      },
    ],
    ...overrides,
  };
}

function byId(result: LegalActionList, id: string) {
  return result.actions.find((action) => action.id === id);
}

describe('Daggerheart legal actions', () => {
  it('enumerates spotlight/Hope actions — a non-d20 action model', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createWarrior()), {
      phase: 'combat',
    });

    expect(result.systemId).toBe('daggerheart');

    // The model spends Daggerheart's OWN resources; never a d20 "action".
    const resources = new Set(
      result.actions.flatMap((action) => action.costs.map((cost) => cost.resource))
    );
    expect(resources).toContain('spotlight');
    expect(resources).toContain('hope');
    expect(resources).not.toContain('action');
  });

  it('derives weapon strikes from the loader catalog with real trait/range/damage', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createWarrior()));

    const primary = byId(
      result,
      'daggerheart:strike:primary:daggerheart-weapon-primary-broadsword-tier-1'
    );
    expect(primary).toMatchObject({
      kind: 'action-roll',
      eligibility: 'available',
      manualBoundary: false,
      costs: [{ resource: 'spotlight', amount: 1 }],
      targets: [{ kind: 'creature', range: 'Melee', count: 1 }],
      details: { trait: 'agility', damage: 'd8', damageType: 'physical' },
    });

    const secondary = byId(
      result,
      'daggerheart:strike:secondary:daggerheart-weapon-secondary-shortsword-tier-1'
    );
    expect(secondary?.eligibility).toBe('available');
  });

  it('gates Hope-fueled moves on the current Hope pool', async () => {
    const registry = createRegistry();

    // 2 Hope: Help an Ally (1) available; No Mercy hope feature (3) not yet.
    const funded = await registry.legalActions(createDocument(createWarrior({ hope: 2 })));
    expect(byId(funded, 'daggerheart:help-an-ally')).toMatchObject({
      eligibility: 'available',
      manualBoundary: false,
      costs: [{ resource: 'hope', amount: 1 }],
    });
    const feature = byId(funded, 'daggerheart:hope-feature:warrior-no-mercy');
    expect(feature).toMatchObject({
      eligibility: 'unavailable',
      manualBoundary: true,
      costs: [{ resource: 'hope', amount: 3 }],
    });
    expect(feature?.label).toBe('No Mercy');

    // 3 Hope unlocks the class hope feature.
    const rich = await registry.legalActions(createDocument(createWarrior({ hope: 3 })));
    expect(byId(rich, 'daggerheart:hope-feature:warrior-no-mercy')?.eligibility).toBe('available');

    // 0 Hope: Help an Ally becomes unavailable.
    const broke = await registry.legalActions(createDocument(createWarrior({ hope: 0 })));
    expect(byId(broke, 'daggerheart:help-an-ally')?.eligibility).toBe('unavailable');
  });

  it('marks Utilize Experience as a GM-adjudicated manual boundary', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createWarrior()));

    const experience = byId(result, 'daggerheart:utilize-experience:0');
    expect(experience).toMatchObject({
      label: 'Utilize Experience: Sailor',
      manualBoundary: true,
      costs: [{ resource: 'hope', amount: 1 }],
      details: { experience: 'Sailor' },
    });
  });

  it('surfaces loadout domain cards as manual-boundary plays and ignores vaulted cards', async () => {
    const registry = createRegistry();
    const warrior = createWarrior();
    warrior.domainCards[1].location = 'vault';

    const result = await registry.legalActions(createDocument(warrior));

    const played = byId(result, 'daggerheart:domain-card:0:blade-get-back-up');
    expect(played).toMatchObject({
      kind: 'domain-card',
      manualBoundary: true,
      costs: [],
    });
    // The vaulted whirlwind is inert — no action for it.
    expect(byId(result, 'daggerheart:domain-card:1:blade-whirlwind')).toBeUndefined();
  });

  it('enumerates nothing weapon/class-specific for an empty default sheet', async () => {
    const registry = createRegistry();

    const result = await registry.legalActions(createDocument(createDefaultDaggerheartData()));

    // No class, no equipped weapons, no cards, no experiences: only the two
    // always-present universal moves (Help an Ally is Hope-gated).
    expect(result.actions.map((action) => action.id)).toEqual(['daggerheart:help-an-ally']);
  });
});
