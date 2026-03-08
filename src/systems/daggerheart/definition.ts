import { SystemDefinition } from '../../registry/types';
import { DaggerheartDataModel, createDefaultDaggerheartData } from './data-model';
import { DaggerheartEngine } from './engine';
import { lazy } from 'react';

export const DaggerheartSystemDef: SystemDefinition<DaggerheartDataModel> = {
  id: 'daggerheart',
  label: 'Daggerheart',
  version: '1.0',
  supportLevel: 'scaffold',
  supportNotes: 'Manual entry only; no local data modules',
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
  SheetComponent: lazy(() => import('./sheet').then((m) => ({ default: m.DaggerheartSheet }))),
};
