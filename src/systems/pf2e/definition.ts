import { SystemDefinition } from '../../registry/types';
import { Pf2eDataModel, createDefaultPf2eData } from './data-model';
import { Pf2eEngine } from './engine';
import { lazyWithPreload } from '../../utils/lazyWithPreload';

export const Pf2eSystemDef: SystemDefinition<Pf2eDataModel> = {
  id: 'pf2e',
  label: 'Pathfinder 2e',
  version: 'PF2e SRD',
  supportLevel: 'full',
  attributes: [
    { id: 'str', name: 'Strength', abbreviation: 'STR', description: 'Physical power' },
    { id: 'dex', name: 'Dexterity', abbreviation: 'DEX', description: 'Agility and reflexes' },
    { id: 'con', name: 'Constitution', abbreviation: 'CON', description: 'Health and stamina' },
    { id: 'int', name: 'Intelligence', abbreviation: 'INT', description: 'Reasoning and memory' },
    { id: 'wis', name: 'Wisdom', abbreviation: 'WIS', description: 'Awareness and intuition' },
    { id: 'cha', name: 'Charisma', abbreviation: 'CHA', description: 'Force of personality' },
  ],
  skills: [
    { id: 'acrobatics', name: 'Acrobatics', attribute: 'dex' },
    { id: 'arcana', name: 'Arcana', attribute: 'int' },
    { id: 'athletics', name: 'Athletics', attribute: 'str' },
    { id: 'crafting', name: 'Crafting', attribute: 'int' },
    { id: 'deception', name: 'Deception', attribute: 'cha' },
    { id: 'diplomacy', name: 'Diplomacy', attribute: 'cha' },
    { id: 'intimidation', name: 'Intimidation', attribute: 'cha' },
    { id: 'lore', name: 'Lore', attribute: 'int' },
    { id: 'medicine', name: 'Medicine', attribute: 'wis' },
    { id: 'nature', name: 'Nature', attribute: 'wis' },
    { id: 'occultism', name: 'Occultism', attribute: 'int' },
    { id: 'performance', name: 'Performance', attribute: 'cha' },
    { id: 'religion', name: 'Religion', attribute: 'wis' },
    { id: 'society', name: 'Society', attribute: 'int' },
    { id: 'stealth', name: 'Stealth', attribute: 'dex' },
    { id: 'survival', name: 'Survival', attribute: 'wis' },
    { id: 'thievery', name: 'Thievery', attribute: 'dex' },
  ],
  createDefaultData: createDefaultPf2eData,
  engine: new Pf2eEngine(),
  loadValidator: () => import('./validation').then((m) => m.createPf2eValidator()),
  loadLegalActions: () => import('./legalActions').then((m) => m.createPf2eLegalActions()),
  SheetComponent: lazyWithPreload(() =>
    import('./sheet').then((m) => ({ default: m.Pf2eCharacterSheet }))
  ),
};
