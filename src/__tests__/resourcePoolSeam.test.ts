/**
 * The RFC 005 resource-pool seam, driven through the REAL registry (lazy load +
 * cache + the shared resolver) for every system that ships a provider.
 *
 * The point of the seam is that one intent shape means the same thing whatever
 * the system's counter direction is, so the systems are exercised with the SAME
 * verbs: 5e slots count used-of-total, PF2e focus counts remaining-of-max,
 * Daggerheart Stress counts marked (UP) and Hope counts held (DOWN). If the
 * abstraction were 5e-shaped, Daggerheart is where it would break.
 */
import { SystemRegistry } from '../registry';
import type {
  ResourceIntent,
  ResourcePoolList,
  RollResult,
  SystemDefinition,
  SystemEngine,
  SystemResourcePoolsProvider,
} from '../registry/types';
import { Dnd5eSystemDef } from '../systems/dnd5e/definition';
import { Dnd5e2024SystemDef } from '../systems/dnd5e-2024/definition';
import { Dnd35eSystemDef } from '../systems/dnd35e/definition';
import { Pf1eSystemDef } from '../systems/pf1e/definition';
import { Pf2eSystemDef } from '../systems/pf2e/definition';
import { Mam3eSystemDef } from '../systems/mam3e/definition';
import { DaggerheartSystemDef } from '../systems/daggerheart/definition';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { createDefaultPf1eData } from '../systems/pf1e/data-model';
import { createDefaultMam3eData } from '../systems/mam3e/data-model';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import {
  createDefaultDnd5e2024Data,
  type Dnd5e2024DataModel,
} from '../systems/dnd5e-2024/data-model';
import { createDefaultPf2eData, type Pf2eDataModel } from '../systems/pf2e/data-model';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../systems/daggerheart/data-model';
import { PF2E_HERO_POINTS_MAX } from '../systems/pf2e/derivedMath';
import { DAGGERHEART_MAX_HOPE } from '../rules/daggerheartDerived';
import type { SystemDataModel } from '../types/core/document';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

function documentOf<T extends SystemDataModel>(systemId: string, system: T): CharacterDocument<T> {
  return {
    id: 'doc-1',
    name: 'Test Character',
    systemId,
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function byId(list: ResourcePoolList, id: string) {
  return list.pools.find((pool) => pool.id === id);
}

function registryWith(...defs: SystemDefinition<never>[]): SystemRegistry {
  const registry = new SystemRegistry();
  for (const def of defs) {
    registry.register(def as unknown as SystemDefinition<SystemDataModel>);
  }
  return registry;
}

function dnd5eCaster(): Dnd5eDataModel {
  const data = createDefaultDnd5eData();
  return {
    ...data,
    hitDice: [{ classId: 'wizard', die: 'd6', total: 5, remaining: 2 }],
    features: [
      {
        id: 'arcane-recovery',
        name: 'Arcane Recovery',
        source: 'Wizard 1',
        description: '',
        uses: { current: 1, max: 1, recoveryType: 'long-rest' },
      },
    ],
    spellcasting: {
      classes: [],
      spellsKnown: [],
      spellsPrepared: [],
      spellSlots: {
        1: { max: 4, used: 1 },
        2: { max: 3, used: 0 },
        3: { max: 2, used: 2 },
        4: { max: 0, used: 0 },
        5: { max: 0, used: 0 },
        6: { max: 0, used: 0 },
        7: { max: 0, used: 0 },
        8: { max: 0, used: 0 },
        9: { max: 0, used: 0 },
      },
    },
  };
}

describe('RFC 005 resource-pool seam — 5e (both editions)', () => {
  it('enumerates only the slot levels the caster actually has', async () => {
    const registry = registryWith(Dnd5eSystemDef as never);
    const list = await registry.resourcePools(documentOf('dnd-5e-2014', dnd5eCaster()));

    expect(list.systemId).toBe('dnd-5e-2014');
    expect(list.pools.filter((pool) => pool.kind === 'spell-slot').map((pool) => pool.id)).toEqual([
      'dnd5e:spell-slot:1',
      'dnd5e:spell-slot:2',
      'dnd5e:spell-slot:3',
    ]);
    expect(byId(list, 'dnd5e:spell-slot:1')).toMatchObject({
      label: 'Level 1 Spell Slots',
      pool: { max: 4, spent: 1 },
    });
  });

  it('maps hit dice and limited-use features through the REMAINING shape', async () => {
    const registry = registryWith(Dnd5eSystemDef as never);
    const list = await registry.resourcePools(documentOf('dnd-5e-2014', dnd5eCaster()));

    // 2 of 5 hit dice left is 3 spent, not 2.
    expect(byId(list, 'dnd5e:hit-die:0')).toMatchObject({
      kind: 'hit-dice',
      label: 'Hit Dice (wizard d6)',
      pool: { max: 5, spent: 3 },
    });
    expect(byId(list, 'dnd5e:feature-use:arcane-recovery')).toMatchObject({
      kind: 'feature-use',
      label: 'Arcane Recovery',
      pool: { max: 1, spent: 0 },
    });
  });

  it('does not enumerate hit points, death saves or exhaustion', async () => {
    // RFC 005 Boundaries: HP has its own stateful verb (applyDamage) and the
    // status tracks are bounded but are not resources you spend and restore.
    const registry = registryWith(Dnd5eSystemDef as never);
    const list = await registry.resourcePools(documentOf('dnd-5e-2014', dnd5eCaster()));

    expect(list.pools.map((pool) => pool.kind)).not.toContain('hit-points');
    expect(list.pools.map((pool) => pool.id)).not.toContain('dnd5e:exhaustion');
  });

  it('spends a slot through the shared path and writes it back as `used`', async () => {
    const registry = registryWith(Dnd5eSystemDef as never);
    const document = documentOf('dnd-5e-2014', dnd5eCaster());

    const { outcome, document: next } = await registry.applyResourceIntent(document, {
      poolId: 'dnd5e:spell-slot:1',
      verb: 'spend',
    });

    expect(outcome).toMatchObject({ ok: true, delta: 1 });
    expect((next.system as Dnd5eDataModel).spellcasting?.spellSlots[1]).toEqual({
      max: 4,
      used: 2,
    });
    // Immutable patch flow: the caller's document is untouched.
    expect((document.system as Dnd5eDataModel).spellcasting?.spellSlots[1].used).toBe(1);
  });

  it('refuses a slot the caster has exhausted and leaves the document identical', async () => {
    const registry = registryWith(Dnd5eSystemDef as never);
    const document = documentOf('dnd-5e-2014', dnd5eCaster());

    const { outcome, document: next } = await registry.applyResourceIntent(document, {
      poolId: 'dnd5e:spell-slot:3',
      verb: 'spend',
    });

    expect(outcome).toMatchObject({ ok: false, code: 'insufficient' });
    // A refusal is observably a no-op, not a silent re-write.
    expect(next).toBe(document);
  });

  it('restores hit dice back through the remaining shape', async () => {
    const registry = registryWith(Dnd5eSystemDef as never);
    const document = documentOf('dnd-5e-2014', dnd5eCaster());

    const { outcome, document: next } = await registry.applyResourceIntent(document, {
      poolId: 'dnd5e:hit-die:0',
      verb: 'restore',
      amount: 2,
    });

    expect(outcome).toMatchObject({ ok: true, delta: 2 });
    expect((next.system as Dnd5eDataModel).hitDice[0].remaining).toBe(4);
  });

  it('runs the same provider for the 2024 edition, stamped with its own id', async () => {
    const registry = registryWith(Dnd5e2024SystemDef as never);
    const data: Dnd5e2024DataModel = {
      ...createDefaultDnd5e2024Data(),
      spellcasting: {
        ...dnd5eCaster().spellcasting!,
      },
    };
    const document = documentOf('dnd-5e-2024', data);

    const list = await registry.resourcePools(document);
    const { document: next } = await registry.applyResourceIntent(document, {
      poolId: 'dnd5e:spell-slot:2',
      verb: 'spend',
    });

    expect(list.systemId).toBe('dnd-5e-2024');
    expect((next.system as Dnd5e2024DataModel).spellcasting?.spellSlots[2].used).toBe(1);
  });
});

describe('RFC 005 resource-pool seam — legacy d20 (3.5e and PF1e)', () => {
  // A THIRD data shape for the same pool: the cap is `total`, and `manualBonus`
  // is a capacity input that must survive a spend untouched.
  const SPELLS_PER_DAY = { 1: { total: 4, used: 1, manualBonus: 1 }, 2: { total: 0, used: 0 } };

  it.each([
    ['dnd-3.5e', Dnd35eSystemDef, createDefaultDnd35eData],
    ['pf1e', Pf1eSystemDef, createDefaultPf1eData],
  ])('spends a %s slot without disturbing its manual bonus', async (systemId, def, createData) => {
    const registry = registryWith(def as never);
    const document = documentOf(systemId, { ...createData(), spellsPerDay: SPELLS_PER_DAY });

    const list = await registry.resourcePools(document);
    const { outcome, document: next } = await registry.applyResourceIntent(document, {
      poolId: 'd20:spell-slot:1',
      verb: 'spend',
      amount: 2,
    });

    // A level with no slots is not a pool the caster has.
    expect(list.pools.map((pool) => pool.id)).toEqual(['d20:spell-slot:1']);
    expect(outcome).toMatchObject({ ok: true, delta: 2 });
    expect((next.system as Dnd35eDataModel).spellsPerDay?.[1]).toEqual({
      total: 4,
      used: 3,
      manualBonus: 1,
    });
  });
});

describe('RFC 005 resource-pool seam — coverage across the seven systems', () => {
  it('ships a provider for every system with a depletable pool, and only those', async () => {
    const registry = registryWith(
      Dnd5eSystemDef as never,
      Dnd5e2024SystemDef as never,
      Dnd35eSystemDef as never,
      Pf1eSystemDef as never,
      Pf2eSystemDef as never,
      Mam3eSystemDef as never,
      DaggerheartSystemDef as never
    );

    const withProvider = registry
      .getAll()
      .filter((def) => Boolean(def.loadResourcePools))
      .map((def) => def.id)
      .sort();

    // M&M 3e is the one absence, and it is RFC 005's recorded boundary rather
    // than a gap: power points are a computed BUDGET, not a depletable
    // spend-pool, and the system has no equipment/charge model either.
    expect(withProvider).toEqual([
      'daggerheart',
      'dnd-3.5e',
      'dnd-5e-2014',
      'dnd-5e-2024',
      'pf1e',
      'pf2e',
    ]);
    expect(await registry.resourcePools(documentOf('mam3e', createDefaultMam3eData()))).toEqual({
      systemId: 'mam3e',
      pools: [],
    });
  });
});

describe('RFC 005 resource-pool seam — PF2e', () => {
  function pf2eCaster(): Pf2eDataModel {
    return {
      ...createDefaultPf2eData(),
      heroPoints: 2,
      spellcasting: {
        tradition: 'arcane',
        type: 'prepared',
        proficiency: { tier: 'trained', total: 3 },
        spellSlots: { 1: { max: 3, used: 1 } },
        spellsKnown: [],
        focusSpells: [],
        focusPoints: { current: 1, max: 2 },
      },
    };
  }

  it('reads focus points and hero points as remaining-of-max pools', async () => {
    const registry = registryWith(Pf2eSystemDef as never);
    const list = await registry.resourcePools(documentOf('pf2e', pf2eCaster()));

    expect(byId(list, 'pf2e:focus')).toMatchObject({ pool: { max: 2, spent: 1 } });
    expect(byId(list, 'pf2e:hero-point')).toMatchObject({
      pool: { max: PF2E_HERO_POINTS_MAX, spent: 1 },
    });
  });

  it('spends a hero point down and refocuses a single focus point back up', async () => {
    const registry = registryWith(Pf2eSystemDef as never);
    const document = documentOf('pf2e', pf2eCaster());

    const spent = await registry.applyResourceIntent(document, {
      poolId: 'pf2e:hero-point',
      verb: 'spend',
    });
    // Refocus recovers exactly 1 (CRB) — the same `restore` verb Daggerheart
    // clears Stress with.
    const refocused = await registry.applyResourceIntent(document, {
      poolId: 'pf2e:focus',
      verb: 'restore',
    });

    expect((spent.document.system as Pf2eDataModel).heroPoints).toBe(1);
    expect((refocused.document.system as Pf2eDataModel).spellcasting?.focusPoints.current).toBe(2);
  });

  it('refuses to spend a fourth hero point past the cap of three', async () => {
    const registry = registryWith(Pf2eSystemDef as never);
    const document = documentOf('pf2e', { ...pf2eCaster(), heroPoints: 0 });

    const { outcome } = await registry.applyResourceIntent(document, {
      poolId: 'pf2e:hero-point',
      verb: 'spend',
    });

    expect(outcome).toMatchObject({ ok: false, code: 'insufficient' });
  });
});

describe('RFC 005 resource-pool seam — Daggerheart counts the other way', () => {
  function daggerheartHero(): DaggerheartDataModel {
    return {
      ...createDefaultDaggerheartData(),
      stress: { current: 2, max: 6 },
      armor: { current: 1, max: 3 },
      hope: 4,
    };
  }

  it('reads a MARKED track as spent and a HELD counter as remaining', async () => {
    const registry = registryWith(DaggerheartSystemDef as never);
    const list = await registry.resourcePools(documentOf('daggerheart', daggerheartHero()));

    // Stress `current` counts what is USED UP …
    expect(byId(list, 'daggerheart:stress')).toMatchObject({ pool: { max: 6, spent: 2 } });
    expect(byId(list, 'daggerheart:armor-slot')).toMatchObject({ pool: { max: 3, spent: 1 } });
    // … while Hope counts what is STILL HELD, so 4 of 6 held is 2 spent.
    expect(byId(list, 'daggerheart:hope')).toMatchObject({
      pool: { max: DAGGERHEART_MAX_HOPE, spent: 2 },
    });
  });

  it('marks stress UPWARD and spends hope DOWNWARD from the same verb', async () => {
    const registry = registryWith(DaggerheartSystemDef as never);
    const document = documentOf('daggerheart', daggerheartHero());

    const stressed = await registry.applyResourceIntent(document, {
      poolId: 'daggerheart:stress',
      verb: 'spend',
    });
    const spentHope = await registry.applyResourceIntent(document, {
      poolId: 'daggerheart:hope',
      verb: 'spend',
      amount: 3,
    });

    expect((stressed.document.system as DaggerheartDataModel).stress.current).toBe(3);
    expect((spentHope.document.system as DaggerheartDataModel).hope).toBe(1);
  });

  it('refuses to mark stress past the track and to spend hope the hero lacks', async () => {
    const registry = registryWith(DaggerheartSystemDef as never);
    const document = documentOf('daggerheart', daggerheartHero());

    const overStressed = await registry.applyResourceIntent(document, {
      poolId: 'daggerheart:stress',
      verb: 'spend',
      amount: 5,
    });
    const overSpent = await registry.applyResourceIntent(document, {
      poolId: 'daggerheart:hope',
      verb: 'spend',
      amount: 5,
    });

    expect(overStressed.outcome).toMatchObject({ ok: false, code: 'insufficient' });
    expect(overSpent.outcome).toMatchObject({ ok: false, code: 'insufficient' });
  });

  it('clears an armor slot with `restore` and the whole track with `reset`', async () => {
    const registry = registryWith(DaggerheartSystemDef as never);
    const document = documentOf('daggerheart', {
      ...daggerheartHero(),
      armor: { current: 3, max: 3 },
    });

    const repaired = await registry.applyResourceIntent(document, {
      poolId: 'daggerheart:armor-slot',
      verb: 'restore',
    });
    const allRepaired = await registry.applyResourceIntent(document, {
      poolId: 'daggerheart:armor-slot',
      verb: 'reset',
    });

    expect((repaired.document.system as DaggerheartDataModel).armor.current).toBe(2);
    expect((allRepaired.document.system as DaggerheartDataModel).armor.current).toBe(0);
  });
});

describe('RFC 005 resource-pool seam — registry contract', () => {
  const testEngine: SystemEngine<SystemDataModel> = {
    prepareData: (document) => document,
    rollCheck: async (): Promise<RollResult> => ({ total: 10, formula: '1d20', terms: [10] }),
    applyDamage: (document) => document,
  };

  function bareDefinition(
    id: string,
    loadResourcePools?: () => Promise<SystemResourcePoolsProvider<SystemDataModel>>
  ): SystemDefinition<SystemDataModel> {
    return {
      id,
      label: 'Test System',
      createDefaultData: () => ({}),
      engine: testEngine,
      loadResourcePools,
      SheetComponent: () => null,
    };
  }

  it('yields an empty list for an unknown system and for one without a provider', async () => {
    const registry = new SystemRegistry();
    registry.register(bareDefinition('no-provider'));

    expect(await registry.resourcePools(documentOf('missing', {}))).toEqual({
      systemId: 'missing',
      pools: [],
    });
    expect(await registry.resourcePools(documentOf('no-provider', {}))).toEqual({
      systemId: 'no-provider',
      pools: [],
    });
  });

  it('resolves the lazy provider chunk at most once across calls', async () => {
    const resourcePools = vi.fn<SystemResourcePoolsProvider<SystemDataModel>['resourcePools']>(
      (_document, context): ResourcePoolList => ({ systemId: context.systemId, pools: [] })
    );
    const loadResourcePools = vi.fn(async () => ({
      resourcePools,
      applyResourcePool: () => undefined,
    }));
    const registry = new SystemRegistry();
    registry.register(bareDefinition('cached', loadResourcePools));

    await registry.resourcePools(documentOf('cached', {}));
    await registry.resourcePools(documentOf('cached', {}));

    expect(loadResourcePools).toHaveBeenCalledTimes(1);
    expect(resourcePools).toHaveBeenCalledTimes(2);
  });

  it('refuses an unrecognized verb rather than throwing on the way back', async () => {
    // The registry is the frame that reads `outcome.ok`. If the resolver falls
    // off its switch this is a TypeError, not a refusal — a crash at the one
    // gate whose job is to survive untrusted, model-generated input.
    const registry = registryWith(Dnd5eSystemDef as never);
    const document = documentOf('dnd-5e-2014', dnd5eCaster());

    const { outcome, document: next } = await registry.applyResourceIntent(document, {
      poolId: 'dnd5e:spell-slot:1',
      verb: 'heal',
    } as unknown as ResourceIntent);

    expect(outcome).toMatchObject({ ok: false, code: 'unsupported-verb' });
    expect(next).toBe(document);
  });

  it('reports a provider that cannot persist an id it minted as a refusal, not a success', async () => {
    // A provider whose enumeration and write-back disagree is a defect. It must
    // surface as a rejection rather than as an `ok` that changed nothing.
    const orphanProvider: SystemResourcePoolsProvider<SystemDataModel> = {
      resourcePools: (_document, context) => ({
        systemId: context.systemId,
        pools: [{ id: 'orphan', kind: 'test', label: 'Orphan', pool: { max: 2, spent: 0 } }],
      }),
      applyResourcePool: () => undefined,
    };
    const loadResourcePools = vi.fn(async () => orphanProvider);
    const registry = new SystemRegistry();
    registry.register(bareDefinition('orphan-system', loadResourcePools));
    const document = documentOf('orphan-system', {});

    const { outcome, document: next } = await registry.applyResourceIntent(document, {
      poolId: 'orphan',
      verb: 'spend',
    });

    expect(outcome).toMatchObject({ ok: false, code: 'unknown-pool' });
    expect(next).toBe(document);
  });
});
