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
 * Props a system's optional guided creator receives. The creator gathers the
 * draft and calls `onCreate` with the raw system data + character name; the app
 * builds and persists the `CharacterDocument` (running it through the engine's
 * `prepareData` at add time), so the creator never touches storage or the
 * document envelope.
 */
export type SystemCreatorProps<T extends SystemDataModel> = {
  onCreate: (data: T, name: string) => void;
};

export type SystemCreatorComponent<T extends SystemDataModel> =
  | React.ComponentType<SystemCreatorProps<T>>
  | (React.LazyExoticComponent<React.ComponentType<SystemCreatorProps<T>>> & {
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
 * Legal-actions seam (RFC-003 substrate).
 *
 * Given a character (or scene-combatant) document plus resolver-derived state, a
 * system can enumerate the actions that are LEGAL for that build, right now,
 * deterministically, from its OWN loaders and rules. This is the substrate a
 * future AI draft / AI-DM layer proposes over: the model suggests from this
 * enumerated set; deterministic validators (and the resolver) decide.
 *
 * The contract is deliberately system-agnostic and does NOT privilege the d20
 * action economy. Costs are expressed in each system's own resource vocabulary
 * (PF2e spends `action`/`reaction`; Daggerheart spends `spotlight`/`hope`/
 * `stress`), and `kind` is each system's own taxonomy string, not a fixed enum.
 */

/** A cost paid in one of the producing system's own resources. */
export interface LegalActionCost {
  /** Resource id in the system's vocabulary (e.g. 'action'/'reaction' for PF2e;
   * 'spotlight'/'hope'/'stress' for Daggerheart). */
  resource: string;
  /** Amount of that resource spent (e.g. 2 for a PF2e two-action activity). */
  amount: number;
}

/** What an action can affect, in the system's own range/targeting vocabulary. */
export interface LegalActionTarget {
  /** Coarse target category, e.g. 'self', 'creature', 'ally', 'object', 'area',
   * 'none'. */
  kind: string;
  /** Verbatim system range/reach label when known (e.g. 'Melee', 'Close',
   * 'reach'); omitted when the system does not pin one down. */
  range?: string;
  /** Number of targets; omitted when the system leaves it open. */
  count?: number;
}

/** Whether an enumerated action can actually be taken from the current state. */
export type LegalActionEligibility = 'available' | 'conditional' | 'unavailable';

/**
 * One legal action available to a build. Descriptors are data, not behavior:
 * the seam names and costs an action but never resolves it — resolution is the
 * engine/resolver's job (or the GM's, for `manualBoundary` actions).
 */
export interface LegalActionDescriptor {
  /** Stable id, unique within a LegalActionList (e.g. 'pf2e:strike:longsword'). */
  id: string;
  /** The system's own action-taxonomy bucket — NOT a cross-system enum. */
  kind: string;
  /** Human-readable name for display. */
  label: string;
  /** Can it be taken right now, given derived state. */
  eligibility: LegalActionEligibility;
  /** Why, when eligibility is 'conditional' or 'unavailable'. */
  eligibilityReason?: string;
  /** Costs in the system's own economy; empty = free / no tracked cost. */
  costs: LegalActionCost[];
  /** Targets; empty = untargeted. */
  targets: LegalActionTarget[];
  /**
   * TRUE when the action's RESOLUTION stays GM-adjudicated: the seam can name
   * and cost it, but its effect is not deterministically modeled (triggered
   * card text, readied triggers, free-form spell effects). The AI layer MUST
   * present these as suggestions for a human to resolve — never auto-resolve
   * them. Marking honestly here is what keeps the seam free of fake automation.
   */
  manualBoundary: boolean;
  /** Provenance: the loader/data id this action was derived from, when any. */
  source?: string;
  /** System-specific extras (weapon dice, trait, multiple-attack note, ...). */
  details?: Record<string, unknown>;
}

/** The enumerated legal actions for one document. */
export interface LegalActionList {
  /** systemId that produced this list. */
  systemId: string;
  actions: LegalActionDescriptor[];
}

/**
 * Framing passed to a provider; all optional so out-of-combat enumeration
 * (character builder, AI draft) works with no scene context.
 */
export interface LegalActionsContext {
  systemId: string;
  /** Scene phase when enumerating for an active encounter. */
  phase?: 'exploration' | 'combat' | 'downtime';
  source?: string;
}

/**
 * Optional per-system legal-actions hook. Providers are pure: they read the
 * document + loaders and return descriptors; they never mutate or persist.
 */
export interface SystemLegalActionsProvider<T extends SystemDataModel> {
  legalActions(
    document: CharacterDocument<T>,
    context: LegalActionsContext
  ): LegalActionList | Promise<LegalActionList>;
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

  // Lazy variant of `validator`: a dynamic import that resolves the validator on
  // first use. Preferred over `validator` so a system's (often large) validation
  // logic is code-split into its own chunk instead of riding the eager registry
  // bootstrap chunk. The registry caches the resolved instance per system.
  loadValidator?: () => Promise<SystemValidator<T>>;

  // Lazy legal-actions provider (RFC-003 substrate for the AI draft / AI-DM
  // layer). Same lazy+cached pattern as `loadValidator`: a system's own (often
  // large) enumeration logic is code-split into its own chunk, resolved on
  // first use, and cached per system by the registry — keeping it out of the
  // eager bootstrap chunk. Systems without one enumerate no actions (an empty
  // list, never an error), so their behavior is unchanged.
  loadLegalActions?: () => Promise<SystemLegalActionsProvider<T>>;

  // The Main Character Sheet Component
  SheetComponent: SystemSheetComponent<T>;

  // Optional guided character creator, shown in a modal before the sheet when a
  // new character of this system is created. Systems without one fall straight
  // through to a default-seeded sheet.
  CreatorComponent?: SystemCreatorComponent<T>;
}
