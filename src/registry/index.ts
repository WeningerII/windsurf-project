import {
  SystemDefinition,
  SystemDataModel,
  type SystemEngine,
  type SystemValidator,
  type ValidationContext,
  type ValidationResult,
  type SystemLegalActionsProvider,
  type LegalActionsContext,
  type LegalActionList,
} from './types';
import type { CharacterDocument } from '../types/core/document';
import type { CreationPlan } from '../creation/types';

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

  // Caches the promise from each system's lazy `loadCreationPlan`, so a plan
  // chunk is imported at most once no matter how often the wizard is opened.
  // Mirrors `validatorCache`.
  private creationPlanCache: Map<string, Promise<CreationPlan<SystemDataModel>>> = new Map();

  // Caches the promise from each system's lazy `loadEngine`, so an engine chunk
  // is imported at most once. Mirrors `validatorCache`.
  private engineCache: Map<string, Promise<SystemEngine<SystemDataModel> | undefined>> = new Map();

  // The RESOLVED engines, readable synchronously. Callers that cannot await —
  // React state updaters, most of all `useDocuments.updateDocument`, whose
  // version derivation has to read `prev` inside the updater — pre-resolve with
  // `loadEngine` and then read the instance back out of here synchronously.
  private resolvedEngines: Map<string, SystemEngine<SystemDataModel>> = new Map();

  /**
   * Register a new game system.
   */
  register<T extends SystemDataModel>(def: SystemDefinition<T>) {
    if (this.systems.has(def.id)) {
      if (import.meta.env.DEV) {
        console.warn(`SystemRegistry: Overwriting existing system '${def.id}'`);
      }
    }
    // A replacement definition brings its own engine, so any instance resolved
    // from the previous one must not survive the swap.
    this.engineCache.delete(def.id);
    this.resolvedEngines.delete(def.id);
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
   * Read a system's engine SYNCHRONOUSLY, or `undefined` when it is not resolved
   * yet. Never triggers a load — pair it with `loadEngine`/`preloadEngines`.
   *
   * This is the seam that lets lazy engines stay a pure code-splitting change:
   * a caller resolves the engine before it needs it, then runs exactly the
   * synchronous code it ran before.
   */
  peekEngine<T extends SystemDataModel = SystemDataModel>(
    systemId: string
  ): SystemEngine<T> | undefined {
    const systemDef = this.systems.get(systemId);
    if (systemDef?.engine) {
      return systemDef.engine as unknown as SystemEngine<T>;
    }
    return this.resolvedEngines.get(systemId) as SystemEngine<T> | undefined;
  }

  /**
   * Resolve a system's engine, preferring the lazy `loadEngine` dynamic import
   * and caching the resolved instance so the chunk is fetched at most once per
   * system. Falls back to an eagerly-supplied `engine`.
   *
   * Unlike the validator/legal-actions/creation-plan seams this NEVER rejects:
   * engine resolution sits on the document load and mutation paths, where a
   * rejected promise would take out the collection rather than one optional
   * feature. A failed import resolves to `undefined` and is evicted from the
   * cache so a later call retries. Callers decide what an absent engine means
   * (`useDocuments` surfaces it rather than silently publishing unprepared math).
   */
  async loadEngine<T extends SystemDataModel = SystemDataModel>(
    systemId: string
  ): Promise<SystemEngine<T> | undefined> {
    const systemDef = this.get<T>(systemId);
    if (!systemDef) {
      return undefined;
    }
    if (systemDef.engine) {
      return systemDef.engine;
    }
    if (!systemDef.loadEngine) {
      return undefined;
    }

    let pending = this.engineCache.get(systemId) as
      | Promise<SystemEngine<T> | undefined>
      | undefined;
    if (!pending) {
      pending = systemDef
        .loadEngine()
        .then((engine) => {
          this.resolvedEngines.set(systemId, engine as unknown as SystemEngine<SystemDataModel>);
          return engine;
        })
        .catch(() => {
          this.engineCache.delete(systemId);
          return undefined;
        });
      this.engineCache.set(systemId, pending as Promise<SystemEngine<SystemDataModel> | undefined>);
    }
    return pending;
  }

  /**
   * Resolve the engines for a set of systems at once. Used before publishing a
   * collection so every document in it can be prepared synchronously.
   */
  async preloadEngines(systemIds: Iterable<string>): Promise<void> {
    const pending = [...new Set(systemIds)]
      .filter((systemId) => !this.peekEngine(systemId))
      .map((systemId) => this.loadEngine(systemId));
    if (pending.length === 0) {
      return;
    }
    await Promise.all(pending);
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
   * Resolve a system's lazy guided-creation plan for the wizard shell, caching
   * the resolved plan so the chunk is fetched at most once per system. Systems
   * without a `loadCreationPlan` resolve to `undefined` (the wizard cannot drive
   * them; callers fall back to default-seeded creation) — never an error.
   */
  async getCreationPlan<T extends SystemDataModel = SystemDataModel>(
    systemId: string
  ): Promise<CreationPlan<T> | undefined> {
    const systemDef = this.get<T>(systemId);
    if (!systemDef || !systemDef.loadCreationPlan) {
      return undefined;
    }
    let pending = this.creationPlanCache.get(systemId) as Promise<CreationPlan<T>> | undefined;
    if (!pending) {
      pending = systemDef.loadCreationPlan();
      this.creationPlanCache.set(
        systemId,
        pending as unknown as Promise<CreationPlan<SystemDataModel>>
      );
    }
    return pending;
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
