/**
 * D&D 5e legal-actions provider — shared enumeration, per-edition fixtures.
 *
 * 2014 and 2024 run the same engine and the same action economy, so both
 * definitions lazy-load `createDnd5eLegalActions`. These tests drive the provider
 * through the registry (the real lazy+cache path) for BOTH editions and assert
 * the 5e economy vocabulary — action / bonus-action / reaction / free / movement.
 */
import { SystemRegistry } from '../registry';
import { Dnd5eSystemDef } from '../systems/dnd5e/definition';
import { Dnd5e2024SystemDef } from '../systems/dnd5e-2024/definition';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import {
  createDefaultDnd5e2024Data,
  type Dnd5e2024DataModel,
} from '../systems/dnd5e-2024/data-model';
import type { LegalActionList } from '../registry/types';
import type { GameSystemId } from '../types/game-systems';
import type { EquippedItem } from '../types/core/character';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

type Dnd5eLike = Dnd5eDataModel | Dnd5e2024DataModel;

function byId(result: LegalActionList, id: string) {
  return result.actions.find((action) => action.id === id);
}

const LONGSWORD: EquippedItem = {
  itemId: 'longsword',
  slot: 'mainHand',
  attuned: false,
  customName: 'Longsword',
  weaponDamage: { count: 1, die: 8 },
  weaponVersatileDie: 10,
  weaponProperties: ['versatile'],
};

const SHORTSWORD_MAIN: EquippedItem = {
  itemId: 'shortsword-main',
  slot: 'mainHand',
  attuned: false,
  customName: 'Shortsword',
  weaponDamage: { count: 1, die: 6 },
  weaponProperties: ['light', 'finesse'],
};

const SHORTSWORD_OFF: EquippedItem = {
  itemId: 'shortsword-off',
  slot: 'offHand',
  attuned: false,
  customName: 'Shortsword',
  weaponDamage: { count: 1, die: 6 },
  weaponProperties: ['light', 'finesse'],
};

/**
 * Each edition entry: a registry with only that system, its systemId, and a
 * document factory that seeds the edition's default data plus overrides.
 */
const EDITIONS: Array<{
  label: string;
  systemId: GameSystemId;
  makeRegistry: () => SystemRegistry;
  makeDoc: (overrides: Partial<Dnd5eLike>) => CharacterDocument<Dnd5eLike>;
}> = [
  {
    label: '2014',
    systemId: 'dnd-5e-2014',
    makeRegistry: () => {
      const registry = new SystemRegistry();
      registry.register(Dnd5eSystemDef);
      return registry;
    },
    makeDoc: (overrides) => ({
      id: 'dnd5e-2014-legal-actions',
      name: '2014 Legal-Actions Fixture',
      systemId: 'dnd-5e-2014',
      system: { ...createDefaultDnd5eData(), ...overrides } as Dnd5eDataModel,
      createdAt: TEST_DATE,
      updatedAt: TEST_DATE,
    }),
  },
  {
    label: '2024',
    systemId: 'dnd-5e-2024',
    makeRegistry: () => {
      const registry = new SystemRegistry();
      registry.register(Dnd5e2024SystemDef);
      return registry;
    },
    makeDoc: (overrides) => ({
      id: 'dnd5e-2024-legal-actions',
      name: '2024 Legal-Actions Fixture',
      systemId: 'dnd-5e-2024',
      system: { ...createDefaultDnd5e2024Data(), ...overrides } as Dnd5e2024DataModel,
      createdAt: TEST_DATE,
      updatedAt: TEST_DATE,
    }),
  },
];

describe.each(EDITIONS)('D&D 5e ($label) legal actions', ({ systemId, makeRegistry, makeDoc }) => {
  it('stamps the producing systemId and spends the 5e action-economy vocabulary', async () => {
    const registry = makeRegistry();
    const result = await registry.legalActions(makeDoc({ equipment: [LONGSWORD] }), {
      phase: 'combat',
    });

    expect(result.systemId).toBe(systemId);

    const resources = new Set(
      result.actions.flatMap((action) => action.costs.map((cost) => cost.resource))
    );
    // 5e's OWN economy — never PF2e action-counts or Daggerheart spotlight/Hope.
    expect(resources).toEqual(new Set(['action', 'reaction', 'free', 'movement']));
  });

  it('derives weapon attacks from equipped weapons with real loader damage, plus an unarmed strike', async () => {
    const registry = makeRegistry();
    const result = await registry.legalActions(makeDoc({ equipment: [LONGSWORD] }));

    expect(byId(result, `${systemId}:attack:unarmed`)).toMatchObject({
      kind: 'attack',
      costs: [{ resource: 'action', amount: 1 }],
      manualBoundary: false,
    });
    expect(byId(result, `${systemId}:attack:longsword`)).toMatchObject({
      eligibility: 'available',
      manualBoundary: false,
      costs: [{ resource: 'action', amount: 1 }],
      details: { weaponDamage: { count: 1, die: 8 }, versatileDie: 10 },
    });
  });

  it('enumerates a bonus-action off-hand attack only with two Light weapons', async () => {
    const registry = makeRegistry();

    const dualWield = await registry.legalActions(
      makeDoc({ equipment: [SHORTSWORD_MAIN, SHORTSWORD_OFF] })
    );
    expect(byId(dualWield, `${systemId}:bonus-attack:shortsword-off`)).toMatchObject({
      kind: 'attack',
      costs: [{ resource: 'bonus-action', amount: 1 }],
      manualBoundary: false,
      details: { twoWeaponFighting: true },
    });

    // A single weapon grants no off-hand bonus attack.
    const single = await registry.legalActions(makeDoc({ equipment: [LONGSWORD] }));
    expect(single.actions.some((a) => a.costs.some((c) => c.resource === 'bonus-action'))).toBe(
      false
    );
  });

  it('marks Dash/Disengage/Dodge deterministic and Help/Hide/Search/Ready as GM-adjudicated', async () => {
    const registry = makeRegistry();
    const result = await registry.legalActions(makeDoc({}));

    for (const id of ['dash', 'disengage', 'dodge']) {
      expect(byId(result, `${systemId}:${id}`)).toMatchObject({
        costs: [{ resource: 'action', amount: 1 }],
        manualBoundary: false,
      });
    }
    for (const id of ['help', 'hide', 'search', 'ready']) {
      const action = byId(result, `${systemId}:${id}`);
      expect(action).toMatchObject({
        costs: [{ resource: 'action', amount: 1 }],
        manualBoundary: true,
      });
      expect(action?.eligibilityReason).toBeTruthy();
    }
  });

  it('models Move (movement up to speed), one free object interaction, and a reaction', async () => {
    const registry = makeRegistry();
    const result = await registry.legalActions(makeDoc({ speed: 30 }));

    expect(byId(result, `${systemId}:move`)).toMatchObject({
      kind: 'movement',
      costs: [{ resource: 'movement', amount: 30 }],
      manualBoundary: false,
    });
    expect(byId(result, `${systemId}:interact-object`)).toMatchObject({
      costs: [{ resource: 'free', amount: 1 }],
      manualBoundary: false,
    });
    expect(byId(result, `${systemId}:opportunity-attack`)).toMatchObject({
      kind: 'reaction',
      eligibility: 'conditional',
      costs: [{ resource: 'reaction', amount: 1 }],
      manualBoundary: true,
    });
  });

  it('enumerates prepared + always-prepared + known spells as manual-boundary casts', async () => {
    const registry = makeRegistry();
    const caster = makeDoc({
      spellcasting: {
        classes: [{ classId: 'wizard', ability: 'int', spellcastingLevel: 1 }],
        spellsKnown: ['magic-missile'],
        spellsPrepared: ['fireball'],
        alwaysPreparedSpellIds: ['detect-magic'],
        spellSlots: {
          1: { max: 2, used: 0 },
          2: { max: 0, used: 0 },
          3: { max: 0, used: 0 },
          4: { max: 0, used: 0 },
          5: { max: 0, used: 0 },
          6: { max: 0, used: 0 },
          7: { max: 0, used: 0 },
          8: { max: 0, used: 0 },
          9: { max: 0, used: 0 },
        },
      },
    });

    const result = await registry.legalActions(caster);

    for (const spellId of ['fireball', 'detect-magic', 'magic-missile']) {
      expect(byId(result, `${systemId}:cast-a-spell:${spellId}`)).toMatchObject({
        kind: 'cast-a-spell',
        manualBoundary: true,
        costs: [{ resource: 'action', amount: 1 }],
      });
    }

    // A non-caster enumerates no spell casts.
    const mundane = await registry.legalActions(makeDoc({}));
    expect(mundane.actions.some((action) => action.kind === 'cast-a-spell')).toBe(false);
  });

  it('never mutates the document during enumeration', async () => {
    const registry = makeRegistry();
    const document = makeDoc({ equipment: [LONGSWORD] });
    const before = JSON.stringify(document);

    await registry.legalActions(document, { phase: 'combat' });

    expect(JSON.stringify(document)).toBe(before);
  });
});
