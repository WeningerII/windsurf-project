import { SystemDefinition, SystemDataModel } from './types';

/**
 * Central Registry for all Game Systems.
 * This singleton manages the mapping between systemId strings and their implementations.
 */
class SystemRegistry {
  private systems: Map<string, SystemDefinition<SystemDataModel>> = new Map();

  /**
   * Register a new game system.
   */
  register<T extends SystemDataModel>(def: SystemDefinition<T>) {
    if (this.systems.has(def.id)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`SystemRegistry: Overwriting existing system '${def.id}'`);
      }
    }
    // We cast to SystemDefinition<SystemDataModel> because T extends SystemDataModel
    // This implies that the registry holds generic system definitions.
    this.systems.set(def.id, def as unknown as SystemDefinition<SystemDataModel>);
    if (process.env.NODE_ENV === 'development') {
      console.log(`SystemRegistry: Registered '${def.id}'`);
    }
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
}

export const systemRegistry = new SystemRegistry();
