import { SystemDefinition } from '../../registry/types';
import { Pf1eDataModel, createDefaultPf1eData } from './data-model';
import { Pf1eEngine } from './engine';
import { makeD20LegacySheet } from '../d20-legacy/wrapper';
import { SYSTEM_SUPPORT_NOTES } from '../../utils/documentationCopy';

export const Pf1eSystemDef: SystemDefinition<Pf1eDataModel> = {
  id: 'pf1e',
  label: 'Pathfinder 1e',
  version: 'PF1e SRD',
  supportLevel: 'full',
  supportNotes: SYSTEM_SUPPORT_NOTES.pf1e,
  attributes: [
    { id: 'str', name: 'Strength', abbreviation: 'STR', description: 'Physical power' },
    { id: 'dex', name: 'Dexterity', abbreviation: 'DEX', description: 'Agility and reflexes' },
    { id: 'con', name: 'Constitution', abbreviation: 'CON', description: 'Health and stamina' },
    { id: 'int', name: 'Intelligence', abbreviation: 'INT', description: 'Reasoning and memory' },
    { id: 'wis', name: 'Wisdom', abbreviation: 'WIS', description: 'Willpower and perception' },
    { id: 'cha', name: 'Charisma', abbreviation: 'CHA', description: 'Force of personality' },
  ],
  skills: [
    { id: 'acrobatics', name: 'Acrobatics', attribute: 'dex' },
    { id: 'appraise', name: 'Appraise', attribute: 'int' },
    { id: 'bluff', name: 'Bluff', attribute: 'cha' },
    { id: 'climb', name: 'Climb', attribute: 'str' },
    { id: 'diplomacy', name: 'Diplomacy', attribute: 'cha' },
    { id: 'disable-device', name: 'Disable Device', attribute: 'dex' },
    { id: 'disguise', name: 'Disguise', attribute: 'cha' },
    { id: 'escape-artist', name: 'Escape Artist', attribute: 'dex' },
    { id: 'fly', name: 'Fly', attribute: 'dex' },
    { id: 'handle-animal', name: 'Handle Animal', attribute: 'cha' },
    { id: 'heal', name: 'Heal', attribute: 'wis' },
    { id: 'intimidate', name: 'Intimidate', attribute: 'cha' },
    { id: 'knowledge', name: 'Knowledge', attribute: 'int' },
    { id: 'linguistics', name: 'Linguistics', attribute: 'int' },
    { id: 'perception', name: 'Perception', attribute: 'wis' },
    { id: 'ride', name: 'Ride', attribute: 'dex' },
    { id: 'sense-motive', name: 'Sense Motive', attribute: 'wis' },
    { id: 'sleight-of-hand', name: 'Sleight of Hand', attribute: 'dex' },
    { id: 'spellcraft', name: 'Spellcraft', attribute: 'int' },
    { id: 'stealth', name: 'Stealth', attribute: 'dex' },
    { id: 'survival', name: 'Survival', attribute: 'wis' },
    { id: 'swim', name: 'Swim', attribute: 'str' },
    { id: 'use-magic', name: 'Use Magic Device', attribute: 'cha' },
  ],
  createDefaultData: createDefaultPf1eData,
  engine: new Pf1eEngine(),
  loadValidator: () => import('./validation').then((m) => m.pf1eValidator),
  loadLegalActions: () =>
    import('../d20-legacy/legalActions').then((m) =>
      m.createD20LegacyLegalActions<Pf1eDataModel>('pf1e')
    ),
  SheetComponent: makeD20LegacySheet<Pf1eDataModel>(),
};
