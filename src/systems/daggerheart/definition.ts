import { SystemDefinition } from '../../registry/types';
import { DaggerheartDataModel, createDefaultDaggerheartData } from './data-model';
import { DaggerheartEngine } from './engine';
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
  engine: new DaggerheartEngine(),
  SheetComponent: lazyWithPreload(() =>
    import('./sheet').then((m) => ({ default: m.DaggerheartSheet }))
  ),
};
