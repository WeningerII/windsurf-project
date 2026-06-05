import { registerCreator } from './createCharacter';
import { daggerheartCreator } from './creators/daggerheart';
import { pf2eCreator } from './creators/pf2e';
import { dnd5e2014Creator, dnd5e2024Creator } from './creators/dnd5e';
import { pf1eCreator, dnd35eCreator } from './creators/d20Legacy';
import { mam3eCreator } from './creators/mam3e';

export {
  createCharacterFromPrompt,
  createCharacterFromIntent,
  getCreator,
  hasCreator,
  registerCreator,
} from './createCharacter';
export { parseCreationIntent, pickByKeywords, pickByKeywordsOrDefault } from './intent';
export {
  requestCreationHints,
  applyHintsToIntent,
  DRAFT_ENDPOINT,
  type CreationHints,
  type CreationPromptInput,
} from './llmIntent';
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
registerCreator(pf2eCreator);
registerCreator(dnd5e2014Creator);
registerCreator(dnd5e2024Creator);
registerCreator(pf1eCreator);
registerCreator(dnd35eCreator);
registerCreator(mam3eCreator);
