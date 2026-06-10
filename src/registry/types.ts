import { CharacterDocument, SystemDataModel } from '../types/core/document';
export type { SystemDataModel };
import React from 'react';
import type { Attribute, Skill } from '../types/game-systems';

type SheetProps<T extends SystemDataModel> = {
  document: CharacterDocument<T>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
};

export type SystemSheetComponent<T extends SystemDataModel> =
  | React.ComponentType<SheetProps<T>>
  | (React.LazyExoticComponent<React.ComponentType<SheetProps<T>>> & {
      preload?: () => Promise<unknown>;
    });

/**
 * Result of a mechanical roll.
 * Systems can extend this to add their own metadata (e.g., "Critical Success").
 */
export interface RollResult {
  total: number;
  formula: string;
  terms: number[];
  isCritical?: boolean;
  isFumble?: boolean;
  flavor?: string;
  /**
   * System-vocabulary badge for a critical/fumble (e.g. Daggerheart's
   * "Critical!" on matched Duality Dice). Display falls back to the d20
   * "NAT 20!"/"NAT 1!" strings when omitted.
   */
  outcomeLabel?: string;
  /** PF2e degree of success (only set when a DC is provided) */
  degreeOfSuccess?: 'critical-success' | 'success' | 'failure' | 'critical-failure';
}

/**
 * The Logic Engine interface.
 * Each system must implement this to handle its specific rules.
 */
export interface SystemEngine<T extends SystemDataModel> {
  /**
   * Called when data is loaded or changed.
   * Use this to calculate derived stats (e.g., Ability Modifiers, AC).
   * Mutates the data object in place or returns a new one.
   */
  prepareData(document: CharacterDocument<T>): CharacterDocument<T>;

  /**
   * Execute a rules-based check (Skill, Save, Attack).
   */
  rollCheck(
    document: CharacterDocument<T>,
    checkId: string,
    options?: unknown
  ): Promise<RollResult>;

  /**
   * Apply damage/healing to the character.
   */
  applyDamage(document: CharacterDocument<T>, amount: number, type: string): CharacterDocument<T>;
}

export type ValidationSeverity = 'info' | 'warning' | 'error';

export type ValidationReason = 'edit' | 'import' | 'creation' | 'sync' | 'ai-draft';

export interface ValidationIssue {
  code: string;
  message: string;
  severity: ValidationSeverity;
  path?: string;
  source?: string;
  recoverable?: boolean;
  details?: Record<string, unknown>;
}

export interface ValidationContext {
  systemId: string;
  reason?: ValidationReason;
  source?: string;
}

export interface ValidationResult {
  issues: ValidationIssue[];
}

/**
 * Optional per-system validation hook.
 *
 * Validators report structured issues but do not mutate or persist documents.
 * Callers decide how to display or act on the returned issue list.
 */
export interface SystemValidator<T extends SystemDataModel> {
  validateDocument(
    document: CharacterDocument<T>,
    context: ValidationContext
  ): ValidationResult | Promise<ValidationResult>;
}

/**
 * A complete definition of a Game System module.
 */
export interface SystemDefinition<T extends SystemDataModel> {
  // Unique ID (e.g., 'dnd-5e-2024', 'mam3e')
  id: string;

  // Human-readable label
  label: string;

  // Version / SRD label (e.g., 'SRD 5.2')
  version?: string;

  // Current implementation maturity exposed in runtime surfaces.
  supportLevel?: 'full' | 'partial' | 'scaffold';
  supportNotes?: string;

  // Ability scores / attributes for this system
  attributes?: Attribute[];

  // Skills for this system
  skills?: Skill[];

  // The Data Model constructor/factory
  // Returns a default/empty data state for a new character
  createDefaultData: () => T;

  // The Logic Engine implementation
  engine: SystemEngine<T>;

  // Optional validation hook for import, guided creation, and AI draft review.
  validator?: SystemValidator<T>;

  // The Main Character Sheet Component
  SheetComponent: SystemSheetComponent<T>;
}
