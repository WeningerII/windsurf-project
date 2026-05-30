import { SystemRegistry } from '../registry';
import type {
  RollResult,
  SystemDefinition,
  SystemEngine,
  SystemValidator,
} from '../registry/types';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';

interface TestDataModel extends SystemDataModel {
  level: number;
}

const testEngine: SystemEngine<TestDataModel> = {
  prepareData: (document) => document,
  rollCheck: async (): Promise<RollResult> => ({
    total: 10,
    formula: '1d20',
    terms: [10],
  }),
  applyDamage: (document) => document,
};

function createDefinition(
  id: string,
  validator?: SystemValidator<TestDataModel>
): SystemDefinition<TestDataModel> {
  return {
    id,
    label: 'Test System',
    createDefaultData: () => ({ level: 1 }),
    engine: testEngine,
    validator,
    SheetComponent: () => null,
  };
}

function createDocument(systemId: string, system: TestDataModel = { level: 1 }) {
  return {
    id: 'doc-1',
    name: 'Test Character',
    systemId,
    system,
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  } satisfies CharacterDocument<TestDataModel>;
}

describe('SystemRegistry validation', () => {
  it('returns no issues for registered systems without validators', async () => {
    const registry = new SystemRegistry();
    registry.register(createDefinition('test-system'));
    const document = createDocument('test-system');
    const serializedBeforeValidation = JSON.stringify(document);

    const result = await registry.validateDocument(document, { reason: 'creation' });

    expect(result).toEqual({ issues: [] });
    expect(JSON.stringify(document)).toBe(serializedBeforeValidation);
  });

  it('runs opt-in validators with document and context', async () => {
    const validateDocument = vi.fn<SystemValidator<TestDataModel>['validateDocument']>(
      (document, context) => ({
        issues:
          document.system.level > 20
            ? [
                {
                  code: 'level-too-high',
                  severity: 'error',
                  path: 'system.level',
                  message: `Level ${document.system.level} is above the supported range.`,
                  source: context.reason,
                  recoverable: true,
                },
              ]
            : [],
      })
    );
    const registry = new SystemRegistry();
    registry.register(
      createDefinition('validated-system', {
        validateDocument,
      })
    );

    const result = await registry.validateDocument(
      createDocument('validated-system', { level: 21 }),
      {
        reason: 'import',
      }
    );

    expect(validateDocument).toHaveBeenCalledWith(
      expect.objectContaining({ systemId: 'validated-system' }),
      {
        reason: 'import',
        systemId: 'validated-system',
      }
    );
    expect(result.issues).toEqual([
      {
        code: 'level-too-high',
        severity: 'error',
        path: 'system.level',
        message: 'Level 21 is above the supported range.',
        source: 'import',
        recoverable: true,
      },
    ]);
  });

  it('returns a structured issue for unknown systems', async () => {
    const registry = new SystemRegistry();

    const result = await registry.validateDocument(createDocument('missing-system'));

    expect(result.issues).toEqual([
      {
        code: 'unknown-system',
        severity: 'error',
        path: 'systemId',
        message: "No registered system found for 'missing-system'.",
        recoverable: false,
      },
    ]);
  });
});
