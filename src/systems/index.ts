import { systemRegistry } from '../registry';
import { Mam3eSystemDef } from './mam3e/definition';
import { Dnd5eSystemDef } from './dnd5e/definition';
import { Dnd5e2024SystemDef } from './dnd5e-2024/definition';
import { Dnd35eSystemDef } from './dnd35e/definition';
import { Pf1eSystemDef } from './pf1e/definition';
import { Pf2eSystemDef } from './pf2e/definition';
import { DaggerheartSystemDef } from './daggerheart/definition';

// Register all systems
export function registerAllSystems() {
  systemRegistry.register(Dnd5eSystemDef);
  systemRegistry.register(Dnd5e2024SystemDef);
  systemRegistry.register(Dnd35eSystemDef);
  systemRegistry.register(Pf1eSystemDef);
  systemRegistry.register(Pf2eSystemDef);
  systemRegistry.register(Mam3eSystemDef);
  systemRegistry.register(DaggerheartSystemDef);
}
