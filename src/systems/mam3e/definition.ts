import { SystemDefinition } from '../../registry/types';
import { Mam3eDataModel, createDefaultMam3eData } from './data-model';
import { Mam3eEngine } from './engine';
import { lazyWithPreload } from '../../utils/lazyWithPreload';

export const Mam3eSystemDef: SystemDefinition<Mam3eDataModel> = {
  id: 'mam3e',
  label: 'M&M 3e',
  version: '3e',
  supportLevel: 'full',
  attributes: [
    {
      id: 'str',
      name: 'Strength',
      abbreviation: 'STR',
      description: 'Physical power and brute force',
    },
    { id: 'sta', name: 'Stamina', abbreviation: 'STA', description: 'Resistance and endurance' },
    {
      id: 'agi',
      name: 'Agility',
      abbreviation: 'AGI',
      description: 'Physical coordination and speed',
    },
    {
      id: 'dex',
      name: 'Dexterity',
      abbreviation: 'DEX',
      description: 'Manual dexterity and fine control',
    },
    { id: 'fgt', name: 'Fighting', abbreviation: 'FGT', description: 'Close combat prowess' },
    { id: 'int', name: 'Intellect', abbreviation: 'INT', description: 'Reasoning and memory' },
    { id: 'awe', name: 'Awareness', abbreviation: 'AWE', description: 'Perception and intuition' },
    { id: 'pre', name: 'Presence', abbreviation: 'PRE', description: 'Force of personality' },
  ],
  skills: [
    { id: 'acrobatics', name: 'Acrobatics', attribute: 'agi' },
    { id: 'athletics', name: 'Athletics', attribute: 'str' },
    { id: 'close-combat', name: 'Close Combat', attribute: 'fgt' },
    { id: 'deception', name: 'Deception', attribute: 'pre' },
    { id: 'expertise', name: 'Expertise', attribute: 'int' },
    { id: 'insight', name: 'Insight', attribute: 'awe' },
    { id: 'intimidation', name: 'Intimidation', attribute: 'pre' },
    { id: 'investigation', name: 'Investigation', attribute: 'int' },
    { id: 'perception', name: 'Perception', attribute: 'awe' },
    { id: 'persuasion', name: 'Persuasion', attribute: 'pre' },
    { id: 'ranged-combat', name: 'Ranged Combat', attribute: 'dex' },
    { id: 'sleight-of-hand', name: 'Sleight of Hand', attribute: 'dex' },
    { id: 'stealth', name: 'Stealth', attribute: 'agi' },
    { id: 'technology', name: 'Technology', attribute: 'int' },
    { id: 'treatment', name: 'Treatment', attribute: 'int' },
    { id: 'vehicles', name: 'Vehicles', attribute: 'dex' },
  ],
  createDefaultData: createDefaultMam3eData,
  engine: new Mam3eEngine(),
  SheetComponent: lazyWithPreload(() =>
    import('./sheet').then((m) => ({ default: m.Mam3eCharacterSheet }))
  ),
};
