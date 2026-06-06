import type { GameSystemId } from '../types/game-systems';
import { createCharacterFromIntent } from './createCharacter';
import { parseCreationIntent } from './intent';
import { buildOptionsManifest } from './optionsManifest';
import { requestBuild, type BuildSpec, type GatewayBuildDeps } from './llmBuild';
import type { CreationResult } from './types';

/**
 * The AI-authored creation entry point: the LLM proposes a full build, the rules
 * decide. It builds the system's options manifest, asks the gateway to author a
 * `BuildSpec` against it, and threads the spec's name/level/selections into the
 * same `createCharacterFromIntent` derive-and-validate gate the offline path
 * uses. If the system has no manifest, the gateway is unconfigured, or the call
 * fails/ times out, it degrades to fully deterministic creation — so this is
 * always safe to call and never blocks on the model.
 */

export interface AiCreateOptions {
  /** Explicit document id (e.g., to overwrite). */
  id?: string;
  /** Browser gateway deps (endpoint/fetch/timeout) — injectable for tests. */
  gateway?: GatewayBuildDeps;
}

export async function createCharacterWithAi(
  systemId: GameSystemId,
  prompt: string,
  options: AiCreateOptions = {}
): Promise<CreationResult> {
  const manifest = await buildOptionsManifest(systemId);
  const spec: BuildSpec | undefined = manifest
    ? await requestBuild({ systemId, prompt, manifest }, options.gateway)
    : undefined;

  const parsed = parseCreationIntent(prompt, spec?.level);
  const intent = spec?.name ? { ...parsed, name: spec.name } : parsed;

  return createCharacterFromIntent(systemId, intent, options.id, spec?.selections);
}
