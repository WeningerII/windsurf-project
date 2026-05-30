import { SystemDefinition } from '../../registry/types';
import { Dnd5e2024DataModel, createDefaultDnd5e2024Data } from './data-model';
import { Dnd5e2024Engine } from './engine';
import { createDnd5eValidator } from '../dnd5e/shared/validation';
import { lazyWithPreload } from '../../utils/lazyWithPreload';

export const Dnd5e2024SystemDef: SystemDefinition<Dnd5e2024DataModel> = {
  id: 'dnd-5e-2024',
  label: 'D&D 5e (2024)',
  version: 'SRD 5.2',
  supportLevel: 'full',
  attributes: [
    {
      id: 'str',
      name: 'Strength',
      abbreviation: 'STR',
      description: 'Physical power and athletic training',
    },
    {
      id: 'dex',
      name: 'Dexterity',
      abbreviation: 'DEX',
      description: 'Agility, reflexes, and balance',
    },
    {
      id: 'con',
      name: 'Constitution',
      abbreviation: 'CON',
      description: 'Health, stamina, and vital force',
    },
    { id: 'int', name: 'Intelligence', abbreviation: 'INT', description: 'Reasoning and memory' },
    {
      id: 'wis',
      name: 'Wisdom',
      abbreviation: 'WIS',
      description: 'Awareness, intuition, and insight',
    },
    {
      id: 'cha',
      name: 'Charisma',
      abbreviation: 'CHA',
      description: 'Force of personality and leadership',
    },
  ],
  skills: [
    { id: 'acrobatics', name: 'Acrobatics', attribute: 'dex' },
    { id: 'animal-handling', name: 'Animal Handling', attribute: 'wis' },
    { id: 'arcana', name: 'Arcana', attribute: 'int' },
    { id: 'athletics', name: 'Athletics', attribute: 'str' },
    { id: 'deception', name: 'Deception', attribute: 'cha' },
    { id: 'history', name: 'History', attribute: 'int' },
    { id: 'insight', name: 'Insight', attribute: 'wis' },
    { id: 'intimidation', name: 'Intimidation', attribute: 'cha' },
    { id: 'investigation', name: 'Investigation', attribute: 'int' },
    { id: 'medicine', name: 'Medicine', attribute: 'wis' },
    { id: 'nature', name: 'Nature', attribute: 'int' },
    { id: 'perception', name: 'Perception', attribute: 'wis' },
    { id: 'performance', name: 'Performance', attribute: 'cha' },
    { id: 'persuasion', name: 'Persuasion', attribute: 'cha' },
    { id: 'religion', name: 'Religion', attribute: 'int' },
    { id: 'sleight-of-hand', name: 'Sleight of Hand', attribute: 'dex' },
    { id: 'stealth', name: 'Stealth', attribute: 'dex' },
    { id: 'survival', name: 'Survival', attribute: 'wis' },
  ],
  createDefaultData: createDefaultDnd5e2024Data,
  engine: new Dnd5e2024Engine(),
  validator: createDnd5eValidator<Dnd5e2024DataModel>('dnd-5e-2024'),
  SheetComponent: lazyWithPreload(() =>
    import('./components/Dnd5e2024Sheet').then((m) => ({ default: m.Dnd5e2024Sheet }))
  ),
};
