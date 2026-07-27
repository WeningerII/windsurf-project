import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type {
  CharacterDraftChoice,
  CharacterDraftOutcome,
  CharacterDraftProposal,
} from '../ai/characterDraftSession';
import type { GameSystemId } from '../types/game-systems';
import type { SystemDataModel } from '../types/core/document';
import { Button } from './ui/Button';

/** Human labels for the candidate-pool categories a draft can draw from. */
const CATEGORY_LABELS: Record<CharacterDraftChoice['category'], string> = {
  classes: 'Class',
  ancestries: 'Ancestry',
  backgrounds: 'Background',
  feats: 'Feat',
  spells: 'Spell',
};

interface AiCharacterDraftPanelProps {
  /** The system the draft targets; null disables drafting until one is picked. */
  systemId: GameSystemId | null;
  /**
   * Ask the model for a draft. Injected so the panel is testable and so the
   * drafting modules stay out of the eager bundle until AI is actually used.
   */
  draft: (params: { systemId: GameSystemId; prompt: string }) => Promise<CharacterDraftOutcome>;
  /**
   * Accept the reviewed proposal. The host persists it through the SAME create
   * path a manual character takes — this panel never writes character state.
   */
  onAccept: (systemId: GameSystemId, system: SystemDataModel, name: string) => void;
}

/**
 * AI character drafting (RFC 002 task 5): a free-text concept becomes a
 * PROPOSAL the user reads before anything is created.
 *
 * The model only ever picks ids from loader-derived candidate pools; the built
 * document is gated by the target system's own `registry.validateDocument`
 * before it reaches this panel, and accepting routes the validated system data
 * back through the host's normal create path. A draft can therefore never write
 * character state, and a rejected draft leaves the manual creation surface
 * exactly as it was.
 *
 * Rendered only when AI is enabled; with no provider key the draft call returns
 * a typed failure and this shows the message plus the manual fallback.
 */
export function AiCharacterDraftPanel({ systemId, draft, onAccept }: AiCharacterDraftPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<CharacterDraftProposal | null>(null);

  const handleDraft = async () => {
    if (!systemId || !prompt.trim() || busy) return;
    setBusy(true);
    setError(null);
    setProposal(null);
    try {
      const result = await draft({ systemId, prompt: prompt.trim() });
      if (result.ok) setProposal(result.proposal);
      else setError(result.error);
    } catch {
      // Belt-and-braces: the seam normalizes its own failures, but a surface
      // that can hang or crash the creation dialog is not an acceptable AI
      // affordance under RFC 002's local-first baseline.
      setError('The AI draft could not be completed. Build this character manually instead.');
    } finally {
      setBusy(false);
    }
  };

  const unapplied = proposal?.choices.filter((choice) => !choice.applied) ?? [];

  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold">
        <Sparkles className="h-4 w-4" /> Draft with AI
      </h3>
      <p className="text-[11px] text-muted-foreground">
        Describe the character you want. The model picks only from this system’s SRD options; the
        system’s own validator decides what is legal, and nothing is created until you accept it.
      </p>

      <textarea
        aria-label="Character concept"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="A cautious dwarf healer who used to be a soldier…"
        rows={2}
        disabled={busy}
        className="w-full resize-none rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none disabled:opacity-50"
      />

      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          {systemId ? null : 'Pick a game system above first.'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDraft}
          disabled={busy || !systemId || !prompt.trim()}
          title="Ask the AI for a character draft to review"
        >
          <Sparkles className="mr-1.5 h-4 w-4" />
          {busy ? 'Drafting…' : 'Draft'}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive" role="status">
          {error}
        </p>
      )}

      {proposal && (
        <div className="rounded-md border bg-card p-3 space-y-2">
          <div>
            <p className="text-sm font-semibold">{proposal.document.name}</p>
            {proposal.rationale && (
              <p className="text-xs text-muted-foreground">{proposal.rationale}</p>
            )}
          </div>

          {proposal.choices.length > 0 && (
            <ul className="space-y-0.5 text-xs">
              {proposal.choices.map((choice) => (
                <li key={`${choice.category}:${choice.id}`}>
                  <span className="text-muted-foreground">
                    {CATEGORY_LABELS[choice.category]}:{' '}
                  </span>
                  {choice.name}
                </li>
              ))}
            </ul>
          )}

          {unapplied.length > 0 && (
            <p className="text-[11px] text-muted-foreground">
              This system’s creation steps had nowhere to apply{' '}
              {unapplied.map((choice) => choice.name).join(', ')}; add those on the sheet.
            </p>
          )}

          <p className="text-[11px] text-muted-foreground">
            Passed the {proposal.document.systemId} validator. Review it, then create — you can edit
            everything on the sheet afterwards.
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                if (!systemId) return;
                onAccept(systemId, proposal.document.system, proposal.document.name);
              }}
            >
              Create character
            </Button>
            <Button variant="outline" size="sm" onClick={() => setProposal(null)}>
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
