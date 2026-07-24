import {
  SystemDefinition,
  SystemDataModel,
  type SystemValidator,
  type ValidationContext,
  type ValidationResult,
  type SystemLegalActionsProvider,
  type LegalActionsContext,
  type LegalActionList,
} from './types';
import type { CharacterDocument } from '../types/core/document';

/**
 * Central Registry for all Game Systems.
 * This singleton manages the mapping between systemId strings and their implementations.
 */
export class SystemRegistry {
  private systems: Map<string, SystemDefinition<SystemDataModel>> = new Map();

  // Caches the promise from each system's lazy `loadValidator`, so a validator
  // chunk is imported at most once regardless of how many documents are checked.
  private validatorCache: Map<string, Promise<SystemValidator<SystemDataModel>>> = new Map();

  // Caches the promise from each system's lazy `loadLegalActions`, so a
  // provider chunk is imported at most once regardless of how often actions are
  // enumerated. Mirrors `validatorCache`.
  private legalActionsCache: Map<string, Promise<SystemLegalActionsProvider<SystemDataModel>>> =
    new Map();

  /**
   * Register a new game system.
   */
  register<T extends SystemDataModel>(def: SystemDefinition<T>) {
    if (this.systems.has(def.id)) {
      if (import.meta.env.DEV) {
        console.warn(`SystemRegistry: Overwriting existing system '${def.id}'`);
      }
    }
    // We cast to SystemDefinition<SystemDataModel> because T extends SystemDataModel
    // This implies that the registry holds generic system definitions.
    this.systems.set(def.id, def as unknown as SystemDefinition<SystemDataModel>);
  }

  /**
   * Retrieve a system definition.
   */
  get<T extends SystemDataModel = SystemDataModel>(id: string): SystemDefinition<T> | undefined {
    return this.systems.get(id) as SystemDefinition<T> | undefined;
  }

  /**
   * Get all registered systems.
   */
  getAll(): SystemDefinition<SystemDataModel>[] {
    return Array.from(this.systems.values());
  }

  /**
   * Run a system validator when the definition exposes one.
   *
   * Systems opt in independently; missing validators are treated as no issues
   * so existing sheets, storage, and sync behavior remain unchanged.
   */
  async validateDocument<T extends SystemDataModel = SystemDataModel>(
    document: CharacterDocument<T>,
    context: Omit<ValidationContext, 'systemId'> = {}
  ): Promise<ValidationResult> {
    const systemDef = this.get<T>(document.systemId);

    if (!systemDef) {
      return {
        issues: [
          {
            code: 'unknown-system',
            severity: 'error',
            path: 'systemId',
            message: `No registered system found for '${document.systemId}'.`,
            recoverable: false,
          },
        ],
      };
    }

    const validator = await this.resolveValidator(systemDef);
    if (!validator) {
      return { issues: [] };
    }

    return validator.validateDocument(document, {
      ...context,
      systemId: systemDef.id,
    });
  }

  /**
   * Resolve a definition's validator, preferring the lazy `loadValidator`
   * dynamic import and caching the resolved instance so the chunk is fetched at
   * most once per system. Falls back to an eagerly-supplied `validator`.
   */
  private async resolveValidator<T extends SystemDataModel>(
    systemDef: SystemDefinition<T>
  ): Promise<SystemValidator<T> | undefined> {
    if (systemDef.validator) {
      return systemDef.validator;
    }
    if (!systemDef.loadValidator) {
      return undefined;
    }
    let pending = this.validatorCache.get(systemDef.id) as Promise<SystemValidator<T>> | undefined;
    if (!pending) {
      pending = systemDef.loadValidator();
      this.validatorCache.set(systemDef.id, pending as Promise<SystemValidator<SystemDataModel>>);
    }
    return pending;
  }

  /**
   * Enumerate the legal actions available to a document when its system exposes
   * a provider (RFC-003 legal-actions seam).
   *
   * Additive and non-throwing by contract: an unknown system, or a system
   * without a provider, yields an empty list — never an error — so surfaces
   * that never ask for legal actions are wholly unaffected. The provider derives
   * actions from the system's OWN rules; the registry only routes and caches.
   */
  async legalActions<T extends SystemDataModel = SystemDataModel>(
    document: CharacterDocument<T>,
    context: Omit<LegalActionsContext, 'systemId'> = {}
  ): Promise<LegalActionList> {
    const systemDef = this.get<T>(document.systemId);

    if (!systemDef) {
      return { systemId: document.systemId, actions: [] };
    }

    const provider = await this.resolveLegalActions(systemDef);
    if (!provider) {
      return { systemId: systemDef.id, actions: [] };
    }

    return provider.legalActions(document, {
      ...context,
      systemId: systemDef.id,
    });
  }

  /**
   * Resolve a definition's lazy `loadLegalActions` provider, caching the
   * resolved instance so the chunk is fetched at most once per system. Missing
   * providers resolve to `undefined` (callers treat that as "no actions").
   */
  private async resolveLegalActions<T extends SystemDataModel>(
    systemDef: SystemDefinition<T>
  ): Promise<SystemLegalActionsProvider<T> | undefined> {
    if (!systemDef.loadLegalActions) {
      return undefined;
    }
    let pending = this.legalActionsCache.get(systemDef.id) as
      | Promise<SystemLegalActionsProvider<T>>
      | undefined;
    if (!pending) {
      pending = systemDef.loadLegalActions();
      this.legalActionsCache.set(
        systemDef.id,
        pending as Promise<SystemLegalActionsProvider<SystemDataModel>>
      );
    }
    return pending;
  }
}

export const systemRegistry = new SystemRegistry();
