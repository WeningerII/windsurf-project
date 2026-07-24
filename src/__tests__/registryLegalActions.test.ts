import { SystemRegistry } from '../registry';
import type {
  LegalActionList,
  RollResult,
  SystemDefinition,
  SystemEngine,
  SystemLegalActionsProvider,
} from '../registry/types';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';

interface TestDataModel extends SystemDataModel {
  level: number;
}

const testEngine: SystemEngine<TestDataModel> = {
  prepareData: (document) => document,
  rollCheck: async (): Promise<RollResult> => ({ total: 10, formula: '1d20', terms: [10] }),
  applyDamage: (document) => document,
};

function createDefinition(
  id: string,
  loadLegalActions?: () => Promise<SystemLegalActionsProvider<TestDataModel>>
): SystemDefinition<TestDataModel> {
  return {
    id,
    label: 'Test System',
    createDefaultData: () => ({ level: 1 }),
    engine: testEngine,
    loadLegalActions,
    SheetComponent: () => null,
  };
}

function createDocument(systemId: string, system: TestDataModel = { level: 1 }) {
  return {
    id: 'doc-1',
    name: 'Test Character',
    systemId,
    system,
    createdAt: new Date('2026-07-01T00:00:00.000Z'),
    updatedAt: new Date('2026-07-01T00:00:00.000Z'),
  } satisfies CharacterDocument<TestDataModel>;
}

describe('SystemRegistry legal actions', () => {
  it('returns an empty list for a registered system without a provider', async () => {
    const registry = new SystemRegistry();
    registry.register(createDefinition('test-system'));
    const document = createDocument('test-system');
    const serializedBefore = JSON.stringify(document);

    const result = await registry.legalActions(document, { phase: 'combat' });

    expect(result).toEqual({ systemId: 'test-system', actions: [] });
    // Additive contract: enumeration never mutates the document.
    expect(JSON.stringify(document)).toBe(serializedBefore);
  });

  it('returns an empty list (never throws) for an unknown system', async () => {
    const registry = new SystemRegistry();

    const result = await registry.legalActions(createDocument('missing-system'));

    expect(result).toEqual({ systemId: 'missing-system', actions: [] });
  });

  it('invokes an opt-in provider with the document and system-stamped context', async () => {
    const legalActions = vi.fn<SystemLegalActionsProvider<TestDataModel>['legalActions']>(
      (document, context): LegalActionList => ({
        systemId: context.systemId,
        actions: [
          {
            id: 'test:wait',
            kind: 'basic',
            label: 'Wait',
            eligibility: 'available',
            costs: [{ resource: 'turn', amount: 1 }],
            targets: [{ kind: 'self' }],
            manualBoundary: document.system.level > 1,
          },
        ],
      })
    );
    const loadLegalActions = vi.fn(async () => ({ legalActions }));
    const registry = new SystemRegistry();
    registry.register(createDefinition('provider-system', loadLegalActions));

    const document = createDocument('provider-system', { level: 3 });
    const result = await registry.legalActions(document, { phase: 'combat', source: 'scene' });

    expect(legalActions).toHaveBeenCalledWith(
      expect.objectContaining({ systemId: 'provider-system' }),
      { phase: 'combat', source: 'scene', systemId: 'provider-system' }
    );
    expect(result.systemId).toBe('provider-system');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toMatchObject({ id: 'test:wait', manualBoundary: true });
  });

  it('resolves the lazy provider chunk at most once across calls', async () => {
    const legalActions = vi.fn(
      (_document, context): LegalActionList => ({ systemId: context.systemId, actions: [] })
    );
    const loadLegalActions = vi.fn(async () => ({ legalActions }));
    const registry = new SystemRegistry();
    registry.register(createDefinition('cached-system', loadLegalActions));

    await registry.legalActions(createDocument('cached-system'));
    await registry.legalActions(createDocument('cached-system'));

    expect(loadLegalActions).toHaveBeenCalledTimes(1);
    expect(legalActions).toHaveBeenCalledTimes(2);
  });
});
