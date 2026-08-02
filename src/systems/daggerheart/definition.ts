import { SystemDefinition } from '../../registry/types';
import { DaggerheartDataModel, createDefaultDaggerheartData } from './data-model';
import { lazyWithPreload } from '../../utils/lazyWithPreload';
import { SYSTEM_SUPPORT_NOTES } from '../../utils/documentationCopy';

export const DaggerheartSystemDef: SystemDefinition<DaggerheartDataModel> = {
  id: 'daggerheart',
  label: 'Daggerheart',
  version: '1.0',
  supportLevel: 'full',
  supportNotes: SYSTEM_SUPPORT_NOTES.daggerheart,
  attributes: [
    {
      id: 'agility',
      name: 'Agility',
      abbreviation: 'AGI',
      description: 'Speed, reflexes, and physical coordination',
    },
    {
      id: 'strength',
      name: 'Strength',
      abbreviation: 'STR',
      description: 'Raw physical power and endurance',
    },
    {
      id: 'finesse',
      name: 'Finesse',
      abbreviation: 'FIN',
      description: 'Precision, deft hands, and subtlety',
    },
    {
      id: 'instinct',
      name: 'Instinct',
      abbreviation: 'INS',
      description: 'Gut feelings and awareness',
    },
    {
      id: 'presence',
      name: 'Presence',
      abbreviation: 'PRE',
      description: 'Force of personality and social influence',
    },
    {
      id: 'knowledge',
      name: 'Knowledge',
      abbreviation: 'KNO',
      description: 'Learning, memory, and reasoning',
    },
  ],
  skills: [],
  createDefaultData: createDefaultDaggerheartData,
  // Lazy engine: the dynamic import keeps this system's engine — and the shared
  // rules-IR surface it pulls in — out of the eager registry bootstrap chunk,
  // matching how the validator, legal-actions and creation-plan seams already
  // load. The registry resolves it once and caches the instance.
  loadEngine: () => import('./engine').then((m) => new m.DaggerheartEngine()),
  loadValidator: () => import('./validation').then((m) => m.createDaggerheartValidator()),
  loadLegalActions: () => import('./legalActions').then((m) => m.createDaggerheartLegalActions()),
  loadResourcePools: () =>
    import('./daggerheartResourcePools').then((m) => m.createDaggerheartResourcePools()),
  loadCreationPlan: () => import('./creationPlan').then((m) => m.createDaggerheartCreationPlan()),
  SheetComponent: lazyWithPreload(() =>
    import('./sheet').then((m) => ({ default: m.DaggerheartSheet }))
  ),
};
