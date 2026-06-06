import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { createCharacterWithAi } from '../creation';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';

interface Props {
  systemId: GameSystemId;
  onCreated: (document: CharacterDocument<SystemDataModel>) => void;
  onNotify?: (message: string, kind: 'success' | 'error' | 'info') => void;
}

const EXAMPLE_PROMPTS: Partial<Record<GameSystemId, string>> = {
  'dnd-5e-2014': 'a stealthy halfling rogue named Pip',
  'dnd-5e-2024': 'a wise dwarf cleric of the mountain',
  'dnd-3.5e': 'a clever elf wizard',
  pf1e: 'a tough dwarf fighter',
  pf2e: 'a charming elf bard scholar',
  mam3e: 'a powerful brawler at PL 10',
  daggerheart: 'a sneaky rogue named Vell',
};

/**
 * The prompt box: type a description, get a finished character. Submitting runs
 * the AI-authored creation path — the LLM proposes a full build against the
 * system's machine-readable options, then the deterministic rules validate,
 * apply, and derive it. With no gateway (or any failure) it degrades to
 * deterministic creation. The finished document is handed up to be saved and
 * opened; residual validator issues surface as a notification so nothing is hidden.
 */
export const PromptCreateCharacter: React.FC<Props> = ({ systemId, onCreated, onNotify }) => {
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);

  const placeholder = `Describe your character — e.g. "${EXAMPLE_PROMPTS[systemId] ?? 'a brave hero named Aria'}"`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || busy) return;

    setBusy(true);
    try {
      // AI proposes a full build; the deterministic rules decide. Falls back to
      // deterministic creation when the gateway is unconfigured or fails.
      const result = await createCharacterWithAi(systemId, trimmed);
      onCreated(result.document);

      const errors = result.issues.filter((issue) => issue.severity === 'error');
      const warnings = result.issues.filter((issue) => issue.severity === 'warning');
      if (errors.length > 0) {
        onNotify?.(
          `Created "${result.document.name}" with ${errors.length} issue${errors.length === 1 ? '' : 's'} to review.`,
          'info'
        );
      } else if (warnings.length > 0) {
        onNotify?.(
          `Created "${result.document.name}" — ${warnings.length} optional choice${warnings.length === 1 ? '' : 's'} left to refine.`,
          'success'
        );
      } else {
        onNotify?.(`Created "${result.document.name}".`, 'success');
      }
      setPrompt('');
    } catch (error) {
      onNotify?.(
        error instanceof Error ? error.message : 'Could not generate a character from that prompt.',
        'error'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-card border rounded-xl p-4 shadow-sm space-y-3"
      aria-label="Generate a character from a prompt"
    >
      <label htmlFor="character-prompt" className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="w-4 h-4 text-primary" />
        Generate from a prompt
      </label>
      <textarea
        id="character-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          // Cmd/Ctrl+Enter submits; plain Enter inserts a newline.
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            void handleSubmit(event);
          }
        }}
        placeholder={placeholder}
        rows={2}
        disabled={busy}
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={busy || prompt.trim().length === 0}>
          {busy ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {busy ? 'Generating…' : 'Generate Character'}
        </Button>
      </div>
    </form>
  );
};
