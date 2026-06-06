import type { GameSystemId } from '../types/game-systems';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';

/**
 * Prompt-driven character creation (RFC 002: "AI proposes, deterministic rules
 * decide"). A natural-language prompt is parsed into a `CreationIntent`, a
 * per-system `SystemCreator` turns that intent into a complete document via the
 * same data the sheet uses, the engine derives stats, and the system validator
 * judges legality. The creator is deterministic; an LLM can later produce richer
 * intents, but its output always flows through this same derive-and-validate
 * gate so it can never yield an illegal sheet.
 */

/** A request to build a character for one system from a free-text prompt. */
export interface CreationRequest {
  systemId: GameSystemId;
  prompt: string;
  /** Optional explicit level; otherwise parsed from the prompt (default 1). */
  level?: number;
  /** Optional explicit id (e.g., to overwrite an existing document). */
  id?: string;
}

/** A prompt parsed into the deterministic signals creators consume. */
export interface CreationIntent {
  /** The original prompt text. */
  prompt: string;
  /** Lowercased word tokens for keyword matching. */
  tokens: string[];
  /** Desired character level (parsed or defaulted). */
  level: number;
  /** A name parsed from the prompt (e.g., `named Kara`), if any. */
  name?: string;
}

/** A creator's output: the system data plus a suggested character name. */
export interface CreationDraft<T extends SystemDataModel = SystemDataModel> {
  name: string;
  system: T;
  /**
   * Author-supplied picks (spell/feat/skill/power names, etc.) that didn't
   * resolve against the catalog and were skipped. Empty/absent on the
   * deterministic path; the AI-author repair loop re-prompts on these so a
   * hallucinated name is corrected instead of silently dropped.
   */
  unresolved?: string[];
}

/**
 * Already-validated, system-specific selections handed to a creator by the LLM
 * "author" path. Each field is optional and catalog-checked before it gets here;
 * a creator uses what's present and falls back to its deterministic logic for
 * anything missing or unusable. Loosely typed because each system reads its own
 * keys (classId, ancestryId, abilities, spell names, …).
 */
export type ResolvedSelections = Record<string, unknown>;

/**
 * Builds a complete document body from a parsed intent. With no `resolved`, the
 * creator runs fully deterministically (keyword selection + sensible defaults).
 * With `resolved`, it uses the LLM-authored, pre-validated selections where
 * present and falls back to the deterministic logic per field — so the result is
 * always a complete build the engine can derive and the validator accepts.
 */
export interface SystemCreator<T extends SystemDataModel = SystemDataModel> {
  systemId: GameSystemId;
  build(
    intent: CreationIntent,
    resolved?: ResolvedSelections
  ): CreationDraft<T> | Promise<CreationDraft<T>>;
}

/** The finished, derived, validated character plus any residual issues. */
export interface CreationResult {
  document: CharacterDocument<SystemDataModel>;
  /** Validator issues after derivation — errors block a "finished" sheet. */
  issues: ValidationIssue[];
  /** True when no error-severity issues remain. */
  ok: boolean;
  /**
   * Author picks the creator couldn't resolve against the catalog (see
   * `CreationDraft.unresolved`). The AI-author repair loop folds these into its
   * re-prompt; the deterministic path leaves it empty.
   */
  unresolved?: string[];
}
