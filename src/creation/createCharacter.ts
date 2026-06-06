import { systemRegistry } from '../registry';
import type { SystemDataModel } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';
import { generateUUID } from '../utils/browserCompat';
import { parseCreationIntent } from './intent';
import type {
  CreationIntent,
  CreationRequest,
  CreationResult,
  ResolvedSelections,
  SystemCreator,
} from './types';

/**
 * The prompt → draft → derive → validate pipeline. This is the single entry
 * point the prompt box (and any future LLM layer) calls. It is system-agnostic:
 * each system registers a deterministic `SystemCreator`, and the orchestrator
 * always runs the engine derivation and the system validator afterward, so the
 * returned sheet is fully computed and its legality is known.
 */

const creators = new Map<GameSystemId, SystemCreator>();

export function registerCreator<T extends SystemDataModel>(creator: SystemCreator<T>): void {
  creators.set(creator.systemId, creator as unknown as SystemCreator);
}

export function getCreator(systemId: GameSystemId): SystemCreator | undefined {
  return creators.get(systemId);
}

export function hasCreator(systemId: GameSystemId): boolean {
  return creators.has(systemId);
}

/**
 * Build a finished character from an already-parsed {@link CreationIntent} and
 * optional LLM-authored, pre-validated {@link ResolvedSelections}. This is the
 * shared core: the deterministic offline path passes no `resolved` and the
 * creator picks by keyword; the AI path passes `resolved` and the creator uses
 * those selections (falling back per field). Both land here, so the
 * derive-and-validate gate is identical regardless of how the build was chosen.
 */
export async function createCharacterFromIntent(
  systemId: GameSystemId,
  intent: CreationIntent,
  id?: string,
  resolved?: ResolvedSelections
): Promise<CreationResult> {
  const systemDef = systemRegistry.get(systemId);
  if (!systemDef) {
    throw new Error(`No registered system found for '${systemId}'.`);
  }

  const creator = creators.get(systemId);
  if (!creator) {
    throw new Error(`No character creator is registered for '${systemId}'.`);
  }

  const draft = await creator.build(intent, resolved);

  const now = new Date();
  const rawDocument = {
    id: id ?? generateUUID(),
    name: draft.name || 'New Character',
    systemId,
    system: draft.system,
    createdAt: now,
    updatedAt: now,
  };

  // Derive stats, then judge legality through the same gate the sheet uses.
  const document = systemDef.engine.prepareData(rawDocument);
  const { issues } = await systemRegistry.validateDocument(document, { reason: 'creation' });
  const ok = !issues.some((issue) => issue.severity === 'error');

  return { document, issues, ok };
}

export async function createCharacterFromPrompt(request: CreationRequest): Promise<CreationResult> {
  const intent = parseCreationIntent(request.prompt, request.level);
  return createCharacterFromIntent(request.systemId, intent, request.id);
}
