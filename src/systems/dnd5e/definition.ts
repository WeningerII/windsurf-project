import { SystemDefinition } from '../../registry/types';
import { Dnd5eDataModel, createDefaultDnd5eData } from './data-model';
import { Dnd5eEngine } from './engine';
import { Dnd5eSheet } from './components/Dnd5eSheet';

export const Dnd5eSystemDef: SystemDefinition<Dnd5eDataModel> = {
  id: 'dnd-5e-2014',
  label: 'D&D 5e (2014)',
  version: 'SRD 5.1',
  attributes: [
    { id: 'str', name: 'Strength', abbreviation: 'STR', description: 'Physical power and athletic training' },
    { id: 'dex', name: 'Dexterity', abbreviation: 'DEX', description: 'Agility, reflexes, and balance' },
    { id: 'con', name: 'Constitution', abbreviation: 'CON', description: 'Health, stamina, and vital force' },
    { id: 'int', name: 'Intelligence', abbreviation: 'INT', description: 'Reasoning and memory' },
    { id: 'wis', name: 'Wisdom', abbreviation: 'WIS', description: 'Awareness, intuition, and insight' },
    { id: 'cha', name: 'Charisma', abbreviation: 'CHA', description: 'Force of personality and leadership' },
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
  engine: new Dnd5eEngine(),
  SheetComponent: Dnd5eSheet,
};
