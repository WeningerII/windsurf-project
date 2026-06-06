/**
 * Local dev runner for LLM-authored character creation.
 *
 * Exercises the real "AI proposes, rules decide" path end to end against the live
 * Claude API, using YOUR key from the environment — there is no running Netlify
 * function locally, so this script plays the server role and calls Claude
 * directly, then threads the authored BuildSpec through the same deterministic
 * derive-and-validate gate the app uses.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... ANTHROPIC_MODEL=<current-claude-model> \
 *     npx tsx scripts/ai-create.ts <systemId> "<prompt>"
 *
 * Example:
 *   ... npx tsx scripts/ai-create.ts daggerheart "Batman"
 *
 * The model id is read from ANTHROPIC_MODEL (never hardcoded); set it to a
 * current Claude model. With no key/model configured the script explains what to
 * set and exits without calling the network.
 */

import { registerAllSystems } from '../src/systems';
import { createCharacterFromIntent } from '../src/creation/createCharacter';
import { parseCreationIntent } from '../src/creation/intent';
import { buildOptionsManifest } from '../src/creation/optionsManifest';
import { draftBuildWithClaude } from '../src/creation/llmBuild';
import type { GameSystemId } from '../src/types/game-systems';

async function main(): Promise<void> {
  const [systemId, ...promptParts] = process.argv.slice(2);
  const prompt = promptParts.join(' ').trim();

  if (!systemId || !prompt) {
    console.error('Usage: npx tsx scripts/ai-create.ts <systemId> "<prompt>"');
    process.exit(2);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;
  if (!apiKey || !model) {
    console.error(
      'Set ANTHROPIC_API_KEY and ANTHROPIC_MODEL (a current Claude model id) to run the live LLM author.'
    );
    process.exit(1);
  }

  registerAllSystems();

  const manifest = await buildOptionsManifest(systemId as GameSystemId);
  if (!manifest) {
    console.error(`No LLM-author manifest is wired for '${systemId}' yet (deterministic only).`);
    process.exit(1);
  }

  console.log(`\nAuthoring a ${systemId} character for: "${prompt}"\n`);
  const spec = await draftBuildWithClaude({ systemId, prompt, manifest }, { apiKey, model });
  console.log('LLM BuildSpec:', JSON.stringify(spec, null, 2));

  const parsed = parseCreationIntent(prompt, spec.level);
  const intent = spec.name ? { ...parsed, name: spec.name } : parsed;
  const result = await createCharacterFromIntent(
    systemId as GameSystemId,
    intent,
    undefined,
    spec.selections
  );

  const errors = result.issues.filter((issue) => issue.severity === 'error');
  console.log('\n=== Finished sheet ===');
  console.log('name:', result.document.name);
  console.log('system:', JSON.stringify(result.document.system, null, 2));
  console.log(`\nok=${result.ok} errors=${errors.length} issues=${result.issues.length}`);
}

main().catch((error) => {
  console.error('ai-create failed:', error);
  process.exit(1);
});
