import { SystemDefinition } from '../../registry/types';
import { Dnd5eDataModel, createDefaultDnd5eData } from './data-model';
import { lazyWithPreload } from '../../utils/lazyWithPreload';

export const Dnd5eSystemDef: SystemDefinition<Dnd5eDataModel> = {
  id: 'dnd-5e-2014',
  label: 'D&D 5e (2014)',
  version: 'SRD 5.1',
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
  createDefaultData: createDefaultDnd5eData,
  // Lazy engine: the dynamic import keeps this system's engine — and the shared
  // rules-IR surface it pulls in — out of the eager registry bootstrap chunk,
  // matching how the validator, legal-actions and creation-plan seams already
  // load. The registry resolves it once and caches the instance.
  loadEngine: () => import('./engine').then((m) => new m.Dnd5eEngine()),
  // Shared with the 2024 edition; the lazy loader keeps the (large) 5e
  // validation logic out of the eager bootstrap chunk, matching how the other
  // five systems already wire theirs.
  loadValidator: () =>
    import('./shared/validation').then((m) =>
      m.createDnd5eValidator<Dnd5eDataModel>('dnd-5e-2014')
    ),
  // Shared with the 2024 edition (same engine, same action economy): the lazy
  // provider is code-split out of the eager bootstrap chunk, mirroring how the
  // two editions share `createDnd5eValidator`.
  loadLegalActions: () =>
    import('./shared/legalActions').then((m) =>
      m.createDnd5eLegalActions<Dnd5eDataModel>('dnd-5e-2014')
    ),
  // Guided-creation plan for the system-agnostic wizard shell. Shared factory
  // with the 2024 edition; code-split out of the eager bootstrap chunk.
  loadCreationPlan: () =>
    import('./shared/creationPlan').then((m) =>
      m.createDnd5eCreationPlan<Dnd5eDataModel>('dnd-5e-2014')
    ),
  SheetComponent: lazyWithPreload(() =>
    import('./components/Dnd5eSheet').then((m) => ({ default: m.Dnd5eSheet }))
  ),
};
