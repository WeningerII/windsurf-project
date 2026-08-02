import { useMemo, useState } from 'react';
import { BookMarked, Check, ScanSearch, Sparkles } from 'lucide-react';
import type { SceneState } from '../../types/core/scene';
import { EMPTY_SCENE_RECAP, summarizeSceneForLog } from '../../scene/sceneRecap';
import type { NarrateSceneResult } from '../../ai/sceneNarrationFlow';
import type { CritiqueNarrationResult } from '../../ai/narrationCritiqueFlow';
import type { NarrationCritiqueVerdict } from '../../ai/narrationCritic';
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
  /**
   * Review the prose draft against the scene's facts (Phase 13). Injected as a
   * closure that already holds the fact set, so this panel needs no knowledge
   * of it and testing it needs no gateway — the same seam `onAnalyzeGrid` uses
   * in `MapPanel`. Omit to hide the affordance.
   *
   * `includeModelReview` is the caller's opt-in SECOND pass; the deterministic
   * critic runs either way and owns the verdict.
   */
  critique?: (params: {
    narrative: string;
    includeModelReview: boolean;
  }) => Promise<CritiqueNarrationResult>;
}

/** Presentation for the three deterministic verdicts. */
const VERDICT_LABEL: Record<NarrationCritiqueVerdict, string> = {
  supported: 'Supported by the facts',
  'needs-review': 'Needs review',
  refuted: 'Contradicts the facts',
};

const VERDICT_CLASS: Record<NarrationCritiqueVerdict, string> = {
  supported: 'text-emerald-600 dark:text-emerald-400',
  // amber-700, not -600: the -600 pair measured 3.19:1 against the light
  // surface and the contrast gate rejected it. The dark half was already fine.
  'needs-review': 'text-amber-700 dark:text-amber-400',
  refuted: 'text-destructive',
};

/** Tone presets offered for AI narration (free of provider specifics). */
const NARRATION_TONES = ['cinematic', 'gritty', 'lighthearted', 'classic'] as const;

/**
 * Bridges a scene back to its campaign: previews a factual recap of the scene's
 * events (combat outcomes, checks, oracle answers) and logs it as a campaign
 * session entry. The factual preview is the exact text that will be logged — no
 * hidden behavior. When AI is enabled, the GM can optionally restyle that recap
 * into prose (grounded ONLY in those facts), edit it, and log the prose instead;
 * the model proposes, the GM decides, and nothing is logged automatically.
 *
 * Phase 13 adds the fact-check beside that draft. It is a REVIEW, never a gate:
 * the deterministic critic owns the verdict, the optional model pass can only
 * add advisory notes, and neither can edit the prose or stop it being logged —
 * a critic that could condemn a narration on its own say-so would have moved
 * RFC 002's problem rather than solved it. The verdict is shown only while the
 * textarea still holds the exact text that was reviewed.
 */
export function RecapPanel({ state, campaignName, onLog, narrate, critique }: RecapPanelProps) {
  const recap = useMemo(() => summarizeSceneForLog(state), [state]);
  const hasFacts = recap !== EMPTY_SCENE_RECAP;

  // AI narration state: the editable prose draft (null = none yet), tone, the
  // in-flight flag, and the last error.
  const [tone, setTone] = useState<string>(NARRATION_TONES[0]);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [narrating, setNarrating] = useState(false);
  const [narrationError, setNarrationError] = useState<string | null>(null);

  // Fact-check state. `critiquedText` is the EXACT prose the review judged, kept
  // for the same reason `loggedText` is kept below: the GM edits the draft in
  // place, and a verdict left on screen after an edit would be a claim about
  // text that is no longer there. Same-string comparison, not a dirty flag, so
  // editing back to the reviewed wording restores the verdict truthfully.
  const [critiquedText, setCritiquedText] = useState<string | null>(null);
  const [critiqueResult, setCritiqueResult] = useState<CritiqueNarrationResult | null>(null);
  const [critiquing, setCritiquing] = useState(false);
  const [includeModelReview, setIncludeModelReview] = useState(false);

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
    try {
      const result = await narrate({ facts: recap, tone });
      if (result.ok) {
        setNarrative(result.narrative);
      } else {
        setNarrationError(result.error);
      }
    } finally {
      setNarrating(false);
    }
  };

  const handleCritique = async () => {
    if (!critique || narrative === null || critiquing) return;
    setCritiquing(true);
    // Drop the previous verdict before the new one lands: a review in flight
    // must not leave the old verdict standing beside edited prose.
    setCritiqueResult(null);
    setCritiquedText(null);
    try {
      const reviewed = narrative;
      const result = await critique({ narrative: reviewed, includeModelReview });
      setCritiqueResult(result);
      setCritiquedText(reviewed);
    } finally {
      setCritiquing(false);
    }
  };

  // Only render a verdict that describes the prose currently in the textarea.
  const currentCritique =
    critiquedText !== null && critiquedText === narrative ? critiqueResult : null;

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

              {critique && (
                <div className="space-y-1.5 rounded border border-dashed p-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={includeModelReview}
                        onChange={(event) => setIncludeModelReview(event.target.checked)}
                        disabled={critiquing}
                      />
                      Also ask the model for advisory notes
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCritique}
                      disabled={critiquing}
                      title="Check this prose against the facts above"
                    >
                      <ScanSearch className="mr-1.5 h-4 w-4" />
                      {critiquing ? 'Checking…' : 'Fact-check'}
                    </Button>
                  </div>

                  {currentCritique &&
                    (currentCritique.ok ? (
                      <div className="space-y-1" role="status">
                        <p
                          className={`text-xs font-semibold ${VERDICT_CLASS[currentCritique.critique.verdict]}`}
                        >
                          {VERDICT_LABEL[currentCritique.critique.verdict]}
                        </p>
                        {currentCritique.critique.issues.length > 0 ? (
                          <ul className="space-y-0.5 text-[11px] text-muted-foreground">
                            {currentCritique.critique.issues.map((issue, index) => (
                              <li key={`${issue.code}:${index}`}>
                                {issue.deterministic ? '' : 'Model note: '}
                                {issue.message}
                                {issue.quote ? ` — “${issue.quote}”` : ''}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            Nothing in this prose contradicts or outruns the recap.
                          </p>
                        )}
                        {currentCritique.modelReview.status === 'failed' && (
                          <p className="text-[11px] text-muted-foreground">
                            The optional model review did not run (
                            {currentCritique.modelReview.error}
                            ). The verdict above is the deterministic one and stands.
                          </p>
                        )}
                        {currentCritique.modelReview.discarded > 0 && (
                          <p className="text-[11px] text-muted-foreground">
                            {currentCritique.modelReview.discarded} model note(s) were discarded for
                            not quoting this prose verbatim.
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                          Advisory only — this never edits or blocks your prose. Fix it yourself,
                          then log it.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-destructive" role="status">
                        {currentCritique.error}
                      </p>
                    ))}
                </div>
              )}
            </>
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
