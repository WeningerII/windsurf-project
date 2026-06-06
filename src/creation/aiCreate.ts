import type { GameSystemId } from '../types/game-systems';
import { createCharacterFromIntent, createCharacterFromPrompt } from './createCharacter';
import { parseCreationIntent } from './intent';
import { buildOptionsManifest, lintSelections } from './optionsManifest';
import { requestBuild, type BuildSpec, type GatewayBuildDeps } from './llmBuild';
import type { CreationResult } from './types';

/**
 * The AI-authored creation entry point: the LLM proposes a full build, the rules
 * decide — now with a validate-and-repair loop for higher fidelity.
 *
 * It builds the system's options manifest, asks the gateway to author a
 * `BuildSpec`, and runs it through the same `createCharacterFromIntent`
 * derive-and-validate gate the offline path uses. It then collects "repair
 * issues" — validator errors (an illegal sheet) plus discrete name picks that
 * didn't resolve against the catalog (a low-fidelity fallback) — and, while any
 * remain, re-asks the model with its previous selections and those issues so it
 * can correct its own attempt. It keeps the best result and stops when the build
 * is clean or the round budget runs out. If the system has no manifest, the
 * gateway is unconfigured, or the call fails, it degrades to fully deterministic
 * creation — so this is always safe to call and never blocks on the model.
 */

const DEFAULT_MAX_REPAIR_ROUNDS = 2;

export interface AiCreateOptions {
  /** Explicit document id (e.g., to overwrite). */
  id?: string;
  /** Browser gateway deps (endpoint/fetch/timeout) — injectable for tests. */
  gateway?: GatewayBuildDeps;
  /** How many repair rounds to attempt after the first draft (default 2). */
  maxRepairRounds?: number;
}

export async function createCharacterWithAi(
  systemId: GameSystemId,
  prompt: string,
  options: AiCreateOptions = {}
): Promise<CreationResult> {
  const maxRounds = options.maxRepairRounds ?? DEFAULT_MAX_REPAIR_ROUNDS;
  const manifest = await buildOptionsManifest(systemId);

  // No LLM-author manifest, or no gateway/spec → deterministic creation.
  let spec = manifest
    ? await requestBuild({ systemId, prompt, manifest }, options.gateway)
    : undefined;
  if (!spec) {
    return createCharacterFromPrompt({ systemId, prompt, id: options.id });
  }

  let result = await applySpec(systemId, prompt, spec, options.id);
  let issues = collectRepairIssues(systemId, manifest, spec, result);
  let best = { result, spec, count: issues.length };

  for (let round = 0; issues.length > 0 && round < maxRounds; round += 1) {
    const repaired = await requestBuild(
      { systemId, prompt, manifest, repair: { previousSelections: spec.selections, issues } },
      options.gateway
    );
    if (!repaired) break;

    spec = repaired;
    result = await applySpec(systemId, prompt, spec, options.id);
    issues = collectRepairIssues(systemId, manifest, spec, result);
    if (issues.length < best.count) {
      best = { result, spec, count: issues.length };
    }
  }

  // Safety net: if repair never reached a legal sheet (e.g. a free-form M&M
  // build the model couldn't fit under the caps/budget), fall back to a
  // guaranteed-legal deterministic build, preserving the authored name/level.
  if (hasValidatorErrors(best.result)) {
    return applySpec(
      systemId,
      prompt,
      { name: best.spec.name, level: best.spec.level, selections: {} },
      options.id
    );
  }
  return best.result;
}

function hasValidatorErrors(result: CreationResult): boolean {
  return result.issues.some((issue) => issue.severity === 'error');
}

/** Apply a model build through the shared derive-and-validate gate. */
async function applySpec(
  systemId: GameSystemId,
  prompt: string,
  spec: BuildSpec,
  id?: string
): Promise<CreationResult> {
  const parsed = parseCreationIntent(prompt, spec.level);
  const intent = spec.name ? { ...parsed, name: spec.name } : parsed;
  return createCharacterFromIntent(systemId, intent, id, spec.selections);
}

/**
 * The issues a repair round should fix: validator errors (illegal sheet) and
 * name picks that didn't resolve (silently fell back). Both are things the model
 * can correct; warnings and legal-but-default fields are left alone.
 */
function collectRepairIssues(
  systemId: GameSystemId,
  manifest: unknown,
  spec: BuildSpec,
  result: CreationResult
): string[] {
  const validatorErrors = result.issues
    .filter((issue) => issue.severity === 'error')
    .map((issue) => (issue.path ? `${issue.path}: ${issue.message}` : issue.message));
  const unresolved = lintSelections(systemId, manifest, spec.selections);
  return [...validatorErrors, ...unresolved];
}
