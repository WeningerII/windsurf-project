import { registerCreator } from './createCharacter';
import { daggerheartCreator } from './creators/daggerheart';

export {
  createCharacterFromPrompt,
  getCreator,
  hasCreator,
  registerCreator,
} from './createCharacter';
export { parseCreationIntent, pickByKeywords, pickByKeywordsOrDefault } from './intent';
export type {
  CreationRequest,
  CreationResult,
  CreationIntent,
  CreationDraft,
  SystemCreator,
} from './types';

// Register the per-system creators. Each system opts in independently; systems
// without a creator simply have no prompt-driven path yet (callers check via
// `hasCreator`). More creators are added here as they come online.
registerCreator(daggerheartCreator);
