import { useMemo, useState } from 'react';
import { BookMarked, Check, Sparkles } from 'lucide-react';
import type { SceneState } from '../../types/core/scene';
import { EMPTY_SCENE_RECAP, summarizeSceneForLog } from '../../scene/sceneRecap';
import type { NarrateSceneResult } from '../../ai/sceneNarrationFlow';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface RecapPanelProps {
  state: SceneState;
  /** Name of the campaign this scene is linked to (shown on the button). */
  campaignName: string;
  onLog: (title: string, body: string) => void;
  /**
   * AI narration of the factual recap (model restyles, GM edits). Omit to hide
   * the affordance entirely — the panel is the factual-only experience when off.
   */
  narrate?: (params: { facts: string; tone: string }) => Promise<NarrateSceneResult>;
}

/** Tone presets offered for AI narration (free of provider specifics). */
const NARRATION_TONES = ['cinematic', 'gritty', 'lighthearted', 'classic'] as const;

/**
 * Bridges a scene back to its campaign: previews a factual recap of the scene's
 * events (combat outcomes, checks, oracle answers) and logs it as a campaign
 * session entry. The factual preview is the exact text that will be logged — no
 * hidden behavior. When AI is enabled, the GM can optionally restyle that recap
 * into prose (grounded ONLY in those facts), edit it, and log the prose instead;
 * the model proposes, the GM decides, and nothing is logged automatically.
 */
export function RecapPanel({ state, campaignName, onLog, narrate }: RecapPanelProps) {
  const recap = useMemo(() => summarizeSceneForLog(state), [state]);
  const hasFacts = recap !== EMPTY_SCENE_RECAP;

  // AI narration state: the editable prose draft (null = none yet), tone, the
  // in-flight flag, and the last error.
  const [tone, setTone] = useState<string>(NARRATION_TONES[0]);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [narrating, setNarrating] = useState(false);
  const [narrationError, setNarrationError] = useState<string | null>(null);
  // Surfaced when the faithfulness critic rejected the AI prose and the
  // deterministic recap was used instead — the GM should know the "narration"
  // is the factual recap, not model prose.
  const [narrationNote, setNarrationNote] = useState<string | null>(null);

  // Log the prose draft when present, else the factual recap.
  const textToLog = narrative ?? recap;
  // Track the exact text that was logged rather than a one-way boolean, so the
  // "Logged" confirmation clears once play continues (or the prose is edited) —
  // otherwise it would falsely imply the newer text is already in the log.
  const [loggedText, setLoggedText] = useState<string | null>(null);
  const logged = loggedText === textToLog;

  const handleLog = () => {
    onLog(state.name, textToLog);
    setLoggedText(textToLog);
  };

  const handleNarrate = async () => {
    if (!narrate || !hasFacts) return;
    setNarrating(true);
    setNarrationError(null);
    setNarrationNote(null);
    try {
      const result = await narrate({ facts: recap, tone });
      if (result.ok) {
        setNarrative(result.narrative);
        setNarrationNote(
          result.fallback
            ? 'The AI draft introduced details not in the recap, so the factual recap is shown instead.'
            : null
        );
      } else {
        setNarrationError(result.error);
      }
    } finally {
      setNarrating(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <BookMarked className="h-4 w-4" /> Session Recap
        </h5>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLog}
          title={`Log this recap to ${campaignName}'s session log`}
        >
          {logged ? (
            <Check className="mr-1.5 h-4 w-4" />
          ) : (
            <BookMarked className="mr-1.5 h-4 w-4" />
          )}
          {logged ? 'Logged' : `Log to ${campaignName}`}
        </Button>
      </div>
      <p className="whitespace-pre-wrap rounded-md border bg-muted/40 p-2 text-xs text-muted-foreground">
        {recap}
      </p>

      {narrate && (
        <div className="mt-2 space-y-2 rounded border border-dashed border-primary/40 p-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <Select
              aria-label="Narration tone"
              value={tone}
              onChange={(event) => setTone(event.target.value)}
              disabled={narrating}
            >
              {NARRATION_TONES.map((value) => (
                <option key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNarrate}
              disabled={narrating || !hasFacts}
              title="Restyle the factual recap into prose grounded in these facts"
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              {narrating ? 'Narrating…' : 'Narrate with AI'}
            </Button>
          </div>

          {narrative !== null && (
            <>
              <textarea
                aria-label="AI narration draft"
                value={narrative}
                onChange={(event) => setNarrative(event.target.value)}
                rows={5}
                className="w-full resize-y rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground">
                  Grounded in the facts above. Edit freely; Log saves this prose.
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNarrative(null)}
                  title="Discard the prose and log the factual recap instead"
                >
                  Discard
                </Button>
              </div>
            </>
          )}

          {narrationNote && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400">{narrationNote}</p>
          )}
          {narrationError && <p className="text-xs text-destructive">{narrationError}</p>}
        </div>
      )}

      {logged && (
        <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          Added to {campaignName}.
          {narrative === null ? ' Edit it into prose in the campaign view.' : ''}
        </p>
      )}
    </div>
  );
}
