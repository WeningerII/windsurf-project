// Mutants & Masterminds 3e Powers - Aggregations and Utilities

import { Power } from '../../../../types/mam/powers';
import { attackPowers } from './core/attack';
import { defensePowers } from './core/defense';
import { movementPowers } from './core/movement';
import { sensoryPowers } from './core/sensory';
import { generalPowers } from './core/general';
import { controlPowers } from './core/control';

// Re-export individual type arrays
export { attackPowers } from './core/attack';
export { defensePowers } from './core/defense';
export { movementPowers } from './core/movement';
export { sensoryPowers } from './core/sensory';
export { generalPowers } from './core/general';
export { controlPowers } from './core/control';

// All powers combined (single source of truth)
export const allPowers: Power[] = [
  ...attackPowers,
  ...defensePowers,
  ...movementPowers,
  ...sensoryPowers,
  ...generalPowers,
  ...controlPowers,
];

// Powers organized by type (mechanical organization)
export const powersByType: Record<string, Power[]> = {
  attack: attackPowers,
  defense: defensePowers,
  movement: movementPowers,
  sensory: sensoryPowers,
  general: generalPowers,
  control: controlPowers,
};

// Powers indexed by ID for quick lookup
export const powerById: Record<string, Power> = allPowers.reduce(
  (acc, power) => {
    if (acc[power.id]) {
      console.warn(`Duplicate power ID detected: ${power.id}`);
    }
    acc[power.id] = power;
    return acc;
  },
  {} as Record<string, Power>
);

// NEW: Descriptor-based filtering (thematic organization)
export const powersByDescriptor = (descriptor: string): Power[] =>
  allPowers.filter(p => p.descriptors?.includes(descriptor) ?? false);

// NEW: Common descriptor groups for easy thematic browsing
export const descriptorGroups = {
  // Elemental
  fire: () => powersByDescriptor('fire'),
  cold: () => powersByDescriptor('cold'),
  electricity: () => powersByDescriptor('electricity'),
  water: () => powersByDescriptor('water'),
  earth: () => powersByDescriptor('earth'),
  air: () => powersByDescriptor('air'),
  
  // Energy types
  energy: () => powersByDescriptor('energy'),
  radiation: () => powersByDescriptor('radiation'),
  light: () => powersByDescriptor('light'),
  force: () => powersByDescriptor('force'),
  
  // Mental/Psychic
  mental: () => powersByDescriptor('mental'),
  psychic: () => powersByDescriptor('psychic'),
  telepathy: () => powersByDescriptor('telepathy'),
  
  // Supernatural
  magic: () => powersByDescriptor('magic'),
  cosmic: () => powersByDescriptor('cosmic'),
  divine: () => powersByDescriptor('divine'),
  
  // Science/Tech
  technology: () => powersByDescriptor('technology'),
  scientific: () => powersByDescriptor('scientific'),
  
  // Physical
  biological: () => powersByDescriptor('biological'),
  physical: () => powersByDescriptor('physical'),
  
  // Reality manipulation
  reality: () => powersByDescriptor('reality'),
  temporal: () => powersByDescriptor('temporal'),
  dimensional: () => powersByDescriptor('dimensional'),
  
  // Combat descriptors
  weapon: () => powersByDescriptor('weapon'),
  armor: () => powersByDescriptor('armor'),
};
